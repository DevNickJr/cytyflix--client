"use client"

import { useRouter } from "next/navigation"
import { useCreateProperty } from "@/hooks/use-properties"
import { ROUTES } from "@/lib/constants"
import { PropertyForm } from "@/components/properties/property-form"

export default function NewPropertyPage() {
  const router = useRouter()
  const createProperty = useCreateProperty()

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold mb-1">Create Property</h1>
      <p className="text-muted-foreground mb-8">List a new property for rent or shortlet</p>

      <PropertyForm
        onSubmit={(data) =>
          createProperty.mutate(data, {
            onSuccess: () => router.push(ROUTES.DASHBOARD_MY_PROPERTIES),
          })
        }
        isLoading={createProperty.isPending}
        submitLabel="Create Property"
      />
    </div>
  )
}
