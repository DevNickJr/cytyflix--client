"use client"

import { AgentFilters } from "@/types/agent"
import { useCallback, useState } from "react"
import { useFetch } from "./use-fetch"
import { agentService } from "@/services/agent.service"

export function useAgents(initialFilters?: AgentFilters) {
   const [filters, setFilters] = useState<AgentFilters>({
      page: 1,
      limit: 12,
      sortBy: "createdAt",
      sortOrder: "DESC",
      ...initialFilters,
    })

    const updateFilters = useCallback((newFilters: Partial<AgentFilters>) => {
      setFilters((prev) => ({ ...prev, ...newFilters, page: newFilters.page ?? 1 }))
    }, [])
  
    const resetFilters = useCallback(() => {
      setFilters({ page: 1, limit: 12, sortBy: "createdAt", sortOrder: "DESC" })
    }, [])
  
    const query = useFetch({
      queryKey: ["agents", filters],
      queryFn: () => agentService.getAgents(filters),
    })

  return { ...query, filters, updateFilters, resetFilters }
}

export function useAgent(id: string) {
  return useFetch({
    queryKey: ["agent", id],
    queryFn: () => agentService.getAgent(id),
    options: { enabled: !!id },
  })
}

export function useAgentBySlug(slug: string) {
  return useFetch({
    queryKey: ["agent-by-slug", slug],
    queryFn: () => agentService.getAgentBySlug(slug),
    options: { enabled: !!slug },
  })
}

export function useAgentProperties(id: string, page = 1, limit = 12) {
  return useFetch({
    queryKey: ["agent-properties", id, page, limit],
    queryFn: () => agentService.getAgentProperties(id, page, limit),
    options: { enabled: !!id },
  })
}

export function useAgentStats(id: string) {
  return useFetch({
    queryKey: ["agent-stats", id],
    queryFn: () => agentService.getAgentStats(id),
    options: { enabled: !!id },
  })
}
