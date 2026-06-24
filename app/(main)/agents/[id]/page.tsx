"use client"

import { use, useState } from "react"
import { useRouter } from "next/navigation"
import { useAgent } from "@/hooks/use-agents"
import { useAuth } from "@/hooks/use-auth"
import { ROUTES } from "@/lib/constants"
import { PageLoader } from "@/components/shared/loading-spinner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Mail, Phone, MapPin, CalendarCheck } from "lucide-react"
import { formatDate, getInitials } from "@/lib/utils"
import { BookAgentDialog } from "@/components/bookings/book-agent-dialog"

export default function AgentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const { data, isLoading } = useAgent(id)
  const [bookDialogOpen, setBookDialogOpen] = useState(false)

  if (isLoading) return <PageLoader />

  const agent = data?.data
  if (!agent) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-2">Agent Not Found</h1>
        <p className="text-muted-foreground mb-4">This agent profile does not exist.</p>
        <Button onClick={() => router.push(ROUTES.AGENTS)}>Browse Agents</Button>
      </div>
    )
  }

  const fullName = agent.profile?.firstName && agent.profile?.lastName
    ? `${agent.profile.firstName} ${agent.profile.lastName}`
    : "Agent"

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Button variant="ghost" className="mb-4 gap-2" onClick={() => router.back()}>
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      <Card>
        <CardContent className="p-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={agent.profile?.profileImage} />
              <AvatarFallback className="text-2xl">
                {getInitials(agent.profile?.firstName, agent.profile?.lastName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-bold">{fullName}</h1>
              <Badge variant="secondary" className="mt-1">Verified Agent</Badge>
              <p className="text-sm text-muted-foreground mt-2">
                Member since {formatDate(agent.createdAt)}
              </p>
            </div>
          </div>

          {agent.profile?.bio && (
            <div className="mt-6">
              <h3 className="font-semibold mb-2">About</h3>
              <p className="text-muted-foreground">{agent.profile.bio}</p>
            </div>
          )}

          <div className="mt-6 space-y-2">
            {agent.email && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                {agent.email}
              </div>
            )}
            {agent.profile?.phoneNumber && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                {agent.profile.phoneNumber}
              </div>
            )}
            {agent.profile?.preferredLocation && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {agent.profile.preferredLocation}
              </div>
            )}
          </div>

          {isAuthenticated && (
            <div className="mt-8">
              <Button size="lg" className="w-full sm:w-auto gap-2" onClick={() => setBookDialogOpen(true)}>
                <CalendarCheck className="h-4 w-4" />
                Book This Agent
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <BookAgentDialog
        agentId={id}
        open={bookDialogOpen}
        onOpenChange={setBookDialogOpen}
      />
    </div>
  )
}
