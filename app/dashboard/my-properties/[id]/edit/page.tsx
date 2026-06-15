"use client"

import { use } from "react"
import { useRouter } from "next/navigation"
import { useProperty, useUpdateProperty } from "@/hooks/use-properties"
import { ROUTES } from "@/lib/constants"
import { PropertyForm } from "@/components/properties/property-form"
import { PageLoader } from "@/components/shared/loading-spinner"

export default function EditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const { data, isLoading } = useProperty(id)
  const updateProperty = useUpdateProperty(id)

  if (isLoading) return <PageLoader />
  if (!data?.data) return <p>Property not found</p>

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold mb-1">Edit Property</h1>
      <p className="text-muted-foreground mb-8">Update your property listing</p>

      <PropertyForm
        initialData={data.data}
        onSubmit={(formData) =>
          updateProperty.mutate(formData, {
            onSuccess: () => router.push(ROUTES.DASHBOARD_MY_PROPERTIES),
          })
        }
        isLoading={updateProperty.isPending}
        submitLabel="Save Changes"
      />
    </div>
  )
}
