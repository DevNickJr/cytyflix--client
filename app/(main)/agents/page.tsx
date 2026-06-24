"use client"

import { useState } from "react"
import Link from "next/link"
import { useAgents } from "@/hooks/use-agents"
import { ROUTES } from "@/lib/constants"
import { PageLoader } from "@/components/shared/loading-spinner"
import { EmptyState } from "@/components/shared/empty-state"
import { Pagination } from "@/components/shared/pagination"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Users } from "lucide-react"
import { getInitials } from "@/lib/utils"

export default function AgentsPage() {
  const [page, setPage] = useState(1)
  const { data, isLoading } = useAgents(page, 12)

  if (isLoading) return <PageLoader />

  const agents = data?.data || []
  const totalPages = data?.totalPages || 1

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Browse Agents</h1>
        <p className="text-muted-foreground">Find verified agents to help with your property search.</p>
      </div>

      {agents.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No agents yet"
          description="There are no verified agents available at the moment."
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {agents.map((agent) => (
              <Link key={agent.id} href={ROUTES.AGENT_DETAIL(agent.id)}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <Avatar className="h-16 w-16 mx-auto mb-3">
                      <AvatarImage src={agent.profile?.profileImage} />
                      <AvatarFallback>
                        {getInitials(agent.profile?.firstName, agent.profile?.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="font-semibold">
                      {agent.profile?.firstName && agent.profile?.lastName
                        ? `${agent.profile.firstName} ${agent.profile.lastName}`
                        : "Agent"}
                    </h3>
                    <Badge variant="secondary" className="mt-2">Verified Agent</Badge>
                    {agent.profile?.bio && (
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{agent.profile.bio}</p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-8">
              <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            </div>
          )}
        </>
      )}
    </div>
  )
}
