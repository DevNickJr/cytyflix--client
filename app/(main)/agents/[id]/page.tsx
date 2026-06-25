"use client"

import { use, useState } from "react"
import { useRouter } from "next/navigation"
import { useAgent, useAgentProperties, useAgentStats } from "@/hooks/use-agents"
import { useAuth } from "@/hooks/use-auth"
import { useTrackPageView } from "@/hooks/use-analytics"
import { EventType } from "@/types/analytics"
import { ROUTES } from "@/lib/constants"
import { PageLoader } from "@/components/shared/loading-spinner"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  CalendarCheck,
  Home,
  Star,
  MessageSquare,
  Eye,
} from "lucide-react"
import { formatDate, getInitials } from "@/lib/utils"
import { BookAgentDialog } from "@/components/bookings/book-agent-dialog"
import { PropertyCard } from "@/components/properties/property-card"
import { Pagination } from "@/components/shared/pagination"
import { EmptyState } from "@/components/shared/empty-state"
import { ShareButtons } from "@/components/shared/share-buttons"
import { toast } from "sonner"

export default function AgentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const { data, isLoading } = useAgent(id)
  const { data: statsData } = useAgentStats(id)
  const [bookDialogOpen, setBookDialogOpen] = useState(false)
  const [page, setPage] = useState(1)
  const { data: propertiesData } = useAgentProperties(id, page, 12)

  useTrackPageView(EventType.AGENT_PROFILE_VIEW, id)

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

  const stats = statsData?.data
  const properties = propertiesData?.data ?? []

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button variant="ghost" className="mb-4 gap-2" onClick={() => router.back()}>
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      {/* Hero / Header */}
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
        </CardContent>
      </Card>

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="rounded-full bg-muted p-2">
                <Home className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalProperties}</p>
                <p className="text-xs text-muted-foreground">Properties</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="rounded-full bg-muted p-2">
                <Star className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.averageRating.toFixed(1)}</p>
                <p className="text-xs text-muted-foreground">Avg Rating</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="rounded-full bg-muted p-2">
                <MessageSquare className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalReviews}</p>
                <p className="text-xs text-muted-foreground">Reviews</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="rounded-full bg-muted p-2">
                <Eye className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.profileViews}</p>
                <p className="text-xs text-muted-foreground">Profile Views</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* About Section */}
      {agent.profile?.bio && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">About</h3>
          <p className="text-muted-foreground">{agent.profile.bio}</p>
        </div>
      )}
      {/* Contact Section */}
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

      {/* Share Buttons */}
      <div className="mt-6">
        <ShareButtons
          url={typeof window !== "undefined" ? window.location.href : ""}
          title={`${fullName} — Agent on CytyFlix`}
          description={agent.profile?.bio}
        />
      </div>
           <div className="grid md:grid-cols-3 gap-6 mt-6">
        {
          agent?.profile?.operatingStates && agent?.profile?.operatingStates.length > 0 && (
            <div className="">
              <h3 className="text-lg font-semibold mb-2">Operational States</h3>
              <div className="flex flex-wrap gap-2">
                {agent.profile.operatingStates.map((state) => (
                  <Badge key={state} variant="outline">{state}</Badge>
                ))}
              </div>
            </div>
          )
        }
        {
          agent?.profile?.operatingLgas && agent?.profile?.operatingLgas.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Operational LGAs</h3>
              <div className="flex flex-wrap gap-2">
                {agent.profile.operatingLgas.map((lga) => (
                  <Badge key={lga} variant="outline">{lga}</Badge>
                ))}
              </div>
            </div>
          )
        }
        {
          agent?.profile?.operatingCities && agent?.profile?.operatingCities.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Operational Cities/Wards</h3>
              <div className="flex flex-wrap gap-2">
                {agent.profile.operatingCities.map((city) => (
                  <Badge key={city} variant="outline">{city}</Badge>
                ))}
              </div>
            </div>
          )
        }
      </div>

      {/* Book Agent Button */}
      {(
        <div className="mt-6">
          <Button size="lg" className="w-full sm:w-auto gap-2" onClick={() => isAuthenticated ? setBookDialogOpen(true) : toast.info("Please log in to book an agent") && router.push(`${ROUTES.LOGIN}?path=${encodeURIComponent(window.location.pathname)}`)}>
            <CalendarCheck className="h-4 w-4" />
            Book This Agent
          </Button>
        </div>
      )}

      <Separator className="my-8" />

      {/* Properties Section */}
      <div>
        {
          properties.length > 0 && ( 
            <h2 className="text-xl font-semibold mb-6">Properties by {fullName}</h2>
          )
        }
        {properties.length === 0 ? (
          <EmptyState
            icon={Home}
            title="No properties yet"
            description="This agent hasn't listed any properties yet."
          />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
            {propertiesData && propertiesData.totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  page={propertiesData.page}
                  totalPages={propertiesData.totalPages}
                  onPageChange={setPage}
                />
              </div>
            )}
          </>
        )}
      </div>

      <BookAgentDialog
        agentId={id}
        open={bookDialogOpen}
        onOpenChange={setBookDialogOpen}
        properties={properties}
      />
    </div>
  )
}
