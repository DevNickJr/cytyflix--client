"use client"

import { QueryKey, useQuery, type UseQueryOptions } from "@tanstack/react-query"

export function useFetch<T>({
  queryKey,
  queryFn,
  options
}: {
  queryKey: QueryKey,
  queryFn: () => Promise<T>,
  options?: Omit<UseQueryOptions<T, Error>, "queryKey" | "queryFn">
}) {
  return useQuery<T, Error>({
    queryKey,
    queryFn,
    ...options,
  })
}
