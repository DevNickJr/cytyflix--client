"use client"

import { useState } from "react"
import { useSavedListings } from "@/hooks/use-saved-listings"
import { PropertyGrid } from "@/components/properties/property-grid"
import { Pagination } from "@/components/shared/pagination"
import { PageLoader } from "@/components/shared/loading-spinner"
import { EmptyState } from "@/components/shared/empty-state"
import { Heart } from "lucide-react"
import { useRouter } from "next/navigation"
import { ROUTES } from "@/lib/constants"

export default function SavedListingsPage() {
  const [page, setPage] = useState(1)
  const { data, isLoading } = useSavedListings(page)
  const router = useRouter()

  if (isLoading) return <PageLoader />

  const properties = data?.data?.map((sl) => sl.property).filter(Boolean) ?? []

  return (
    <div>
      <h1 className="text-3xl font-bold mb-1">Saved Listings</h1>
      <p className="text-muted-foreground mb-8">{data?.total ?? 0} saved properties</p>

      {properties.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="No saved listings"
          description="Save properties you like to find them easily later."
          action={{ label: "Browse Properties", onClick: () => router.push(ROUTES.PROPERTIES) }}
        />
      ) : (
        <>
          <PropertyGrid properties={properties as any} />
          {data && data.totalPages > 1 && (
            <div className="mt-8">
              <Pagination page={page} totalPages={data.totalPages} onPageChange={setPage} />
            </div>
          )}
        </>
      )}
    </div>
  )
}
