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
import { Users, X } from "lucide-react"
import { getInitials } from "@/lib/utils"
import { usePlaces } from "@/hooks/usePlaces"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export default function AgentsPage() {
  const [page, setPage] = useState(1)
  const { data, isLoading, filters, updateFilters, resetFilters } = useAgents({ page, limit: 12 })

  const hasActiveFilters = filters.city || filters.state || filters.lga

  const { cities, lgas, states } = usePlaces({
    city: filters.city,
    lga: filters.lga,
    state: filters.state,
    resetLga: () => updateFilters({ lga: undefined }),
    resetCity: () => updateFilters({ city: undefined }),
  })

  if (isLoading) return <PageLoader />

  const agents = data?.data || []
  const totalPages = data?.totalPages || 1
  

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Browse Agents</h1>
        <p className="text-muted-foreground">Find verified agents to help with your property search.</p>
      </div>
      <Card className={'overflow-y-auto h-full mb-6'}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Filters</h3>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={resetFilters} className="gap-1 text-xs">
                <X className="h-3 w-3" />
                Clear All
              </Button>
            )}
          </div>
  
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">State</Label>
              <Select
                value={filters.state || ""}
                onValueChange={(val) => updateFilters({ state: val || undefined })}
              >
              <SelectTrigger className={'w-full'}><SelectValue placeholder="All States" /></SelectTrigger>
                <SelectContent>
                  <SelectItem key="" value="">All</SelectItem>
                  {states.map((state) => (
                    <SelectItem key={state?.state} value={state?.state}>{state?.state}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">LGA</Label>
              <Select
                value={filters.lga || ""}
                onValueChange={(val) => updateFilters({ lga: val || undefined })}
                disabled={!filters.state}
              >
                <SelectTrigger className={'w-full'}><SelectValue placeholder={filters.state ? "Enter LGA" : "Select a state"} /></SelectTrigger>
                <SelectContent>
                  {lgas.map((lga) => (
                    <SelectItem key={lga?.name} value={lga?.name}>{lga?.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">City/Ward</Label>
              <Select
                value={filters.city || ""}
                onValueChange={(val) => updateFilters({ city: val || undefined })}
                disabled={!filters.state || !filters.lga}
              >
                <SelectTrigger className={'w-full'}><SelectValue placeholder={filters.state ? "Enter City" : "Select an LGA"} /></SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city?.name} value={city?.name}>{city?.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Sort by</Label>
              <Select
                value={`${filters.sortBy}-${filters.sortOrder}`}
                onValueChange={(val) => {
                  if (!val) return
                  const [sortBy, sortOrder] = val.split("-") as ["createdAt" | "price", "ASC" | "DESC"]
                  updateFilters({ sortBy, sortOrder })
                }}
              >
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt-DESC">Newest First</SelectItem>
                  <SelectItem value="createdAt-ASC">Oldest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
  
        </CardContent>
      </Card>
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
              <Link key={agent.id} href={ROUTES.AGENT_DETAIL(agent.profile?.slug || agent.id)}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
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
