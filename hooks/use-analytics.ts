"use client"

import { useEffect, useRef } from "react"
import { useMutation } from "@tanstack/react-query"
import { useFetch } from "./use-fetch"
import { analyticsService } from "@/services/analytics.service"
import type { EventType, TrackEventRequest } from "@/types/analytics"

export function useTrackEvent() {
  return useMutation({
    mutationFn: (data: TrackEventRequest) => analyticsService.trackEvent(data),
  })
}

export function useTrackPageView(eventType: EventType, targetId: string) {
  const tracked = useRef(false)
  const { mutate } = useTrackEvent()

  useEffect(() => {
    if (tracked.current || !targetId) return
    tracked.current = true
    mutate({ eventType, targetId })
  }, [eventType, targetId, mutate])
}

export function usePropertyViews(propertyId: string) {
  return useFetch({
    queryKey: ["property-views", propertyId],
    queryFn: () => analyticsService.getPropertyViews(propertyId),
    options: { enabled: !!propertyId },
  })
}

export function usePopularProperties(limit = 10, days = 30) {
  return useFetch({
    queryKey: ["popular-properties", limit, days],
    queryFn: () => analyticsService.getPopularProperties(limit, days),
  })
}
