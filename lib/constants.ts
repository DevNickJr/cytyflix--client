export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4001/api/v1"

export const ROUTES = {
  HOME: "/",
  PROPERTIES: "/properties",
  PROPERTY_DETAIL: (id: string) => `/properties/${id}`,
  ABOUT: "/about",
  CONTACT: "/contact",
  FAQ: "/faq",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  DASHBOARD_PROFILE: "/dashboard/profile",
  DASHBOARD_MY_PROPERTIES: "/dashboard/my-properties",
  DASHBOARD_NEW_PROPERTY: "/dashboard/my-properties/new",
  DASHBOARD_EDIT_PROPERTY: (id: string) => `/dashboard/my-properties/${id}/edit`,
  DASHBOARD_SAVED: "/dashboard/saved",
  DASHBOARD_INQUIRIES: "/dashboard/inquiries",
  DASHBOARD_NOTIFICATIONS: "/dashboard/notifications",
  DASHBOARD_BECOME_AGENT: "/dashboard/become-agent",
  DASHBOARD_BOOKINGS: "/dashboard/bookings",
  DASHBOARD_BOOKING_DETAIL: (id: string) => `/dashboard/bookings/${id}`,
  DASHBOARD_ADMIN_VERIFICATIONS: "/dashboard/admin/verifications",
  DASHBOARD_ADMIN_REPORTS: "/dashboard/admin/reports",
  AGENTS: "/agents",
  AGENT_DETAIL: (id: string) => `/agents/${id}`,
} as const

export enum PropertyType {
  APARTMENT = "apartment",
  HOUSE = "house",
  STUDIO = "studio",
  DUPLEX = "duplex",
  SELF_CONTAIN = "self_contain",
  SHARED = "shared",
}

export enum ListingType {
  RENT = "rent",
  SHORTLET = "shortlet",
}

export enum RolesEnum {
  RENT_SEEKER = "rent_seeker",
  PROPERTY_OWNER = "property_owner",
  AGENT = "agent",
  ADMIN = "admin",
}

export enum InquiryStatus {
  PENDING = "pending",
  RESPONDED = "responded",
  CLOSED = "closed",
}

export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  [PropertyType.APARTMENT]: "Apartment",
  [PropertyType.HOUSE]: "House",
  [PropertyType.STUDIO]: "Studio",
  [PropertyType.DUPLEX]: "Duplex",
  [PropertyType.SELF_CONTAIN]: "Self Contain",
  [PropertyType.SHARED]: "Shared",
}

export const LISTING_TYPE_LABELS: Record<ListingType, string> = {
  [ListingType.RENT]: "Rent",
  [ListingType.SHORTLET]: "Shortlet",
}

export const ROLE_LABELS: Record<RolesEnum, string> = {
  [RolesEnum.RENT_SEEKER]: "Rent Seeker",
  [RolesEnum.PROPERTY_OWNER]: "Property Owner",
  [RolesEnum.AGENT]: "Agent",
  [RolesEnum.ADMIN]: "Admin",
}

export const OWNER_ROLES = [RolesEnum.PROPERTY_OWNER, RolesEnum.AGENT, RolesEnum.ADMIN]

export enum VerificationStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export enum ReportReason {
  MISLEADING = "misleading",
  SCAM = "scam",
  INAPPROPRIATE = "inappropriate",
  DUPLICATE = "duplicate",
  OTHER = "other",
}

export enum ReportStatus {
  PENDING = "pending",
  REVIEWED = "reviewed",
  DISMISSED = "dismissed",
}

export enum BookingStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  COMPLETED = "completed",
  DISPUTED = "disputed",
  CANCELLED = "cancelled",
}

export enum PaymentStatus {
  PENDING = "pending",
  PAID = "paid",
  FAILED = "failed",
}

export const REPORT_REASON_LABELS: Record<ReportReason, string> = {
  [ReportReason.MISLEADING]: "Misleading Information",
  [ReportReason.SCAM]: "Potential Scam",
  [ReportReason.INAPPROPRIATE]: "Inappropriate Content",
  [ReportReason.DUPLICATE]: "Duplicate Listing",
  [ReportReason.OTHER]: "Other",
}


