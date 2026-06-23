"use client"

import { useState, useCallback } from "react"
import { useFetch } from "./use-fetch"
import { useMutationAction } from "./use-mutation"
import { propertyService } from "@/services/property.service"
import type { PropertyFilters, CreatePropertyRequest, UpdatePropertyRequest } from "@/types/property"

export function useProperties(initialFilters?: PropertyFilters) {
  const [filters, setFilters] = useState<PropertyFilters>({
    page: 1,
    limit: 12,
    sortBy: "createdAt",
    sortOrder: "DESC",
    ...initialFilters,
  })

  const query = useFetch({
    queryKey: ["properties", JSON.stringify(filters)],
    queryFn: () => propertyService.getProperties(filters)
  })

  const updateFilters = useCallback((newFilters: Partial<PropertyFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: newFilters.page ?? 1 }))
  }, [])

  const resetFilters = useCallback(() => {
    setFilters({ page: 1, limit: 12, sortBy: "createdAt", sortOrder: "DESC" })
  }, [])

  return { ...query, filters, updateFilters, resetFilters }
}

export function useProperty(id: string) {
  return useFetch({
    queryKey: ["property", id],
    queryFn: () => propertyService.getProperty(id),
    options: { enabled: !!id }
  })
}

export function useMyProperties(page = 1, limit = 20) {
  return useFetch({
    queryKey: ["my-properties", page, limit],
    queryFn: () => propertyService.getMyProperties(page, limit)
  })
}

export function useCreateProperty() {
  return useMutationAction(
    (data: CreatePropertyRequest) => propertyService.createProperty(data),
    {
      successMessage: "Property created successfully",
      invalidateKeys: [["my-properties"], ["properties"]],
    }
  )
}

export function useUpdateProperty(id: string) {
  return useMutationAction(
    (data: UpdatePropertyRequest) => propertyService.updateProperty(id, data),
    {
      successMessage: "Property updated successfully",
      invalidateKeys: [["my-properties"], ["properties"], ["property", id]],
    }
  )
}

export function useDeleteProperty() {
  return useMutationAction(
    (id: string) => propertyService.deleteProperty(id),
    {
      successMessage: "Property deleted successfully",
      invalidateKeys: [["my-properties"], ["properties"]],
    }
  )
}
