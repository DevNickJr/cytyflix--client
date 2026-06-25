export enum EventType {
  PROPERTY_VIEW = "property_view",
  AGENT_PROFILE_VIEW = "agent_profile_view",
  PROPERTY_SEARCH = "property_search",
  PROPERTY_SAVE = "property_save",
  INQUIRY_SENT = "inquiry_sent",
  BOOKING_CREATED = "booking_created",
}

export interface TrackEventRequest {
  eventType: EventType
  targetId: string
  metadata?: Record<string, unknown>
}

export interface PropertyViewCount {
  views: number
}

export interface PopularProperty {
  targetId: string
  count: number
}
