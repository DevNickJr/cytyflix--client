import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number, currency = "NGN") {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(price)
}

export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
  }).format(new Date(date))
}

export function formatRelativeTime(date: string | Date) {
  const now = new Date()
  const then = new Date(date)
  const diff = now.getTime() - then.getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 7) return formatDate(date)
  if (days > 0) return `${days}d ago`
  if (hours > 0) return `${hours}h ago`
  if (minutes > 0) return `${minutes}m ago`
  return "just now"
}

export function getInitials(firstName?: string, lastName?: string) {
  const first = firstName?.charAt(0)?.toUpperCase() ?? ""
  const last = lastName?.charAt(0)?.toUpperCase() ?? ""
  return first + last || "U"
}

export const getRootUrl = (path: string) => {
  const baseDomain = process.env.NEXT_PUBLIC_DOMAIN_NAME || 'cytyflix.com'; 
  
  // In local development
  if (typeof window !== 'undefined' && window.location.hostname.includes('localhost')) {
    return `http://localhost:3000${path}`;
  }
  
  // In production
  return `https://${baseDomain}${path}`;
};