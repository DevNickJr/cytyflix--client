"use client"

import { useMutation as useReactQueryMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query"
import { toast } from "sonner"
import type { ApiError } from "@/types/api"

interface UseMutationConfig<TData, TVariables> extends Omit<UseMutationOptions<TData, ApiError, TVariables>, "mutationFn"> {
  successMessage?: string
  errorMessage?: string
  invalidateKeys?: string[][]
}

export function useMutationAction<TData = unknown, TVariables = void>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  config?: UseMutationConfig<TData, TVariables>
) {
  const queryClient = useQueryClient()
  const { successMessage, errorMessage, invalidateKeys, ...options } = config || {}

  return useReactQueryMutation<TData, ApiError, TVariables>({
    mutationFn,
    onSuccess: (...args) => {
      if (successMessage) toast.success(successMessage)
      if (invalidateKeys) {
        invalidateKeys.forEach((key) => queryClient.invalidateQueries({ queryKey: key }))
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(options?.onSuccess as any)?.(...args)
    },
    onError: (...args) => {
      toast.error(errorMessage || args[0]?.message || "Something went wrong")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(options?.onError as any)?.(...args)
    },
    ...options,
  })
}
