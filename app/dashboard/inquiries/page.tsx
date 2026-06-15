"use client"

import { useState } from "react"
import { useSentInquiries, useReceivedInquiries } from "@/hooks/use-inquiries"
import { useAuth } from "@/hooks/use-auth"
import { OWNER_ROLES, InquiryStatus } from "@/lib/constants"
import { formatRelativeTime } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Pagination } from "@/components/shared/pagination"
import { PageLoader } from "@/components/shared/loading-spinner"
import { EmptyState } from "@/components/shared/empty-state"
import { inquiryService } from "@/services/inquiry.service"
import { useMutationAction } from "@/hooks/use-mutation"
import { MessageSquare, Send, Inbox, CheckCircle, XCircle } from "lucide-react"
import type { UpdateInquiryStatusRequest } from "@/types/inquiry"

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  responded: "bg-blue-100 text-blue-800",
  closed: "bg-gray-100 text-gray-800",
}

export default function InquiriesPage() {
  const { user } = useAuth()
  const isOwner = user && OWNER_ROLES.includes(user.role)
  const [sentPage, setSentPage] = useState(1)
  const [receivedPage, setReceivedPage] = useState(1)
  const { data: sentData, isLoading: sentLoading } = useSentInquiries(sentPage)
  const { data: receivedData, isLoading: receivedLoading } = useReceivedInquiries(receivedPage)

  return (
    <div>
      <h1 className="text-3xl font-bold mb-1">Inquiries</h1>
      <p className="text-muted-foreground mb-8">Manage your property inquiries</p>

      <Tabs defaultValue="sent">
        <TabsList>
          <TabsTrigger value="sent" className="gap-2">
            <Send className="h-4 w-4" />
            Sent ({sentData?.total ?? 0})
          </TabsTrigger>
          {isOwner && (
            <TabsTrigger value="received" className="gap-2">
              <Inbox className="h-4 w-4" />
              Received ({receivedData?.total ?? 0})
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="sent" className="mt-6">
          {sentLoading ? <PageLoader /> : (
            sentData?.data?.length ? (
              <div className="space-y-3">
                {sentData.data.map((inq) => (
                  <Card key={inq.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <p className="text-sm font-medium">Property: {inq.property?.title ?? inq.propertyId}</p>
                        <Badge className={STATUS_COLORS[inq.status]}>{inq.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{inq.message}</p>
                      <p className="text-xs text-muted-foreground mt-2">{formatRelativeTime(inq.createdAt)}</p>
                    </CardContent>
                  </Card>
                ))}
                {sentData.totalPages > 1 && (
                  <Pagination page={sentPage} totalPages={sentData.totalPages} onPageChange={setSentPage} />
                )}
              </div>
            ) : (
              <EmptyState icon={MessageSquare} title="No sent inquiries" description="Browse properties and send inquiries to learn more." />
            )
          )}
        </TabsContent>

        {isOwner && (
          <TabsContent value="received" className="mt-6">
            {receivedLoading ? <PageLoader /> : (
              receivedData?.data?.length ? (
                <div className="space-y-3">
                  {receivedData.data.map((inq) => (
                    <ReceivedInquiryCard key={inq.id} inquiry={inq} />
                  ))}
                  {receivedData.totalPages > 1 && (
                    <Pagination page={receivedPage} totalPages={receivedData.totalPages} onPageChange={setReceivedPage} />
                  )}
                </div>
              ) : (
                <EmptyState icon={Inbox} title="No received inquiries" description="Inquiries from interested renters will appear here." />
              )
            )}
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}

function ReceivedInquiryCard({ inquiry }: { inquiry: any }) {
  const updateStatus = useMutationAction(
    (data: UpdateInquiryStatusRequest) => inquiryService.updateInquiryStatus(inquiry.id, data),
    {
      successMessage: "Status updated",
      invalidateKeys: [["inquiries-received"]],
    }
  )

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <p className="text-sm font-medium">Property: {inquiry.property?.title ?? inquiry.propertyId}</p>
            <p className="text-xs text-muted-foreground">From: {inquiry.sender?.email ?? inquiry.senderId}</p>
          </div>
          <Badge className={STATUS_COLORS[inquiry.status]}>{inquiry.status}</Badge>
        </div>
        <p className="text-sm text-muted-foreground mb-3">{inquiry.message}</p>
        <div className="flex items-center gap-2">
          <p className="text-xs text-muted-foreground">{formatRelativeTime(inquiry.createdAt)}</p>
          {inquiry.status === InquiryStatus.PENDING && (
            <div className="flex gap-1 ml-auto">
              <Button size="sm" variant="outline" onClick={() => updateStatus.mutate({ status: InquiryStatus.RESPONDED })}>
                <CheckCircle className="h-3.5 w-3.5 mr-1" /> Respond
              </Button>
              <Button size="sm" variant="outline" onClick={() => updateStatus.mutate({ status: InquiryStatus.CLOSED })}>
                <XCircle className="h-3.5 w-3.5 mr-1" /> Close
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
