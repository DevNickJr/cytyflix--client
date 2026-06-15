"use client"

import { useProperties } from "@/hooks/use-properties"
import { PropertyGrid } from "@/components/properties/property-grid"
import { PropertyFilters } from "@/components/properties/property-filters"
import { Pagination } from "@/components/shared/pagination"
import { PageLoader } from "@/components/shared/loading-spinner"
import { Search } from "lucide-react"

export default function PropertiesPage() {
  const { data, isLoading, filters, updateFilters, resetFilters } = useProperties()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Search className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Browse Properties</h1>
        </div>
        <p className="text-muted-foreground">
          {data?.total
            ? `${data.total} properties found`
            : "Find your next home across Nigeria"}
        </p>
      </div>

      <div className="space-y-6">
        <PropertyFilters
          filters={filters}
          onFilterChange={updateFilters}
          onReset={resetFilters}
        />

        {isLoading ? (
          <PageLoader />
        ) : (
          <>
            <PropertyGrid properties={data?.data ?? []} />
            {data && data.totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  page={data.page}
                  totalPages={data.totalPages}
                  onPageChange={(page) => updateFilters({ page })}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
