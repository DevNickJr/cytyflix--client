"use client"

import { useProperties } from "@/hooks/use-properties"
import { PropertyGrid } from "@/components/properties/property-grid"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { ROUTES } from "@/lib/constants"
import { ArrowRight } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export function FeaturedProperties() {
  const router = useRouter()
  const { data, isLoading } = useProperties({ limit: 6, sortBy: "createdAt", sortOrder: "DESC" })

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Featured Properties</h2>
            <p className="text-muted-foreground">Explore our latest listings across Nigeria</p>
          </div>
          <Button variant="ghost" className="hidden md:flex gap-2" onClick={() => router.push(ROUTES.PROPERTIES)}>
            View All
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-48 w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <PropertyGrid properties={data?.data ?? []} />
        )}

        <div className="mt-8 text-center md:hidden">
          <Button variant="outline" className="gap-2" onClick={() => router.push(ROUTES.PROPERTIES)}>
            View All Properties
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}
