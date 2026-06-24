"use client"

import { useFetch } from "./use-fetch"
import { agentService } from "@/services/agent.service"

export function useAgents(page = 1, limit = 20) {
  return useFetch({
    queryKey: ["agents", page, limit],
    queryFn: () => agentService.getAgents(page, limit),
  })
}

export function useAgent(id: string) {
  return useFetch({
    queryKey: ["agent", id],
    queryFn: () => agentService.getAgent(id),
    options: { enabled: !!id },
  })
}
