"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useMyProperties, useDeleteProperty } from "@/hooks/use-properties"
import { ROUTES, PROPERTY_TYPE_LABELS } from "@/lib/constants"
import { formatPrice, formatDate } from "@/lib/utils"
import { PageLoader } from "@/components/shared/loading-spinner"
import { EmptyState } from "@/components/shared/empty-state"
import { Pagination } from "@/components/shared/pagination"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Building2, Plus, Pencil, Trash2, MapPin } from "lucide-react"

export default function MyPropertiesPage() {
  const [page, setPage] = useState(1)
  const { data, isLoading } = useMyProperties(page)
  const deleteProperty = useDeleteProperty()
  const router = useRouter()
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const handleDelete = () => {
    if (deleteId) {
      deleteProperty.mutate(deleteId, { onSuccess: () => setDeleteId(null) })
    }
  }

  if (isLoading) return <PageLoader />

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">My Properties</h1>
          <p className="text-muted-foreground">{data?.total ?? 0} listings</p>
        </div>
        <Link href={ROUTES.DASHBOARD_NEW_PROPERTY} className={cn(buttonVariants(), "gap-2")}>
          <Plus className="h-4 w-4" />
          Add Property
        </Link>
      </div>

      {!data?.data?.length ? (
        <EmptyState
          icon={Building2}
          title="No properties yet"
          description="Start listing properties to reach potential tenants."
          action={{ label: "Create Listing", onClick: () => router.push(ROUTES.DASHBOARD_NEW_PROPERTY) }}
        />
      ) : (
        <div className="space-y-4">
          {data.data.map((property) => (
            <Card key={property.id}>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="w-full sm:w-40 h-28 rounded-lg overflow-hidden bg-muted shrink-0">
                    {property.images.length > 0 ? (
                      <img src={property.images[0]} alt={property.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Building2 className="h-8 w-8 text-muted-foreground/40" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold line-clamp-1">{property.title}</h3>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-0.5">
                          <MapPin className="h-3.5 w-3.5" />
                          {property.city}, {property.state}
                        </div>
                      </div>
                      <p className="font-bold shrink-0">{formatPrice(property.price)}</p>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline">{PROPERTY_TYPE_LABELS[property.propertyType]}</Badge>
                      <Badge variant={property.isAvailable ? "default" : "destructive"}>
                        {property.isAvailable ? "Available" : "Unavailable"}
                      </Badge>
                      <span className="text-xs text-muted-foreground ml-auto">{formatDate(property.createdAt)}</span>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="outline" onClick={() => router.push(ROUTES.DASHBOARD_EDIT_PROPERTY(property.id))}>
                        <Pencil className="h-3.5 w-3.5 mr-1" /> Edit
                      </Button>
                      <Button size="sm" variant="outline" className="text-destructive" onClick={() => setDeleteId(property.id)}>
                        <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {data.totalPages > 1 && (
            <Pagination page={page} totalPages={data.totalPages} onPageChange={setPage} />
          )}
        </div>
      )}

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Property</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this property? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteProperty.isPending}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
