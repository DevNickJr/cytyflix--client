"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { ROUTES, OWNER_ROLES, RolesEnum } from "@/lib/constants"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  User,
  Building2,
  Heart,
  MessageSquare,
  Bell,
  Plus,
  ShieldCheck,
  CalendarCheck,
  ShieldAlert,
  Flag,
  ExternalLink,
  Wallet,
} from "lucide-react"
import { buttonVariants } from "@/components/ui/button"

type SidebarLink = {
  href: string
  label: string
  icon: typeof LayoutDashboard
  exact?: boolean
  ownerOnly?: boolean
  showFor?: (role: RolesEnum) => boolean
}

const SIDEBAR_LINKS: SidebarLink[] = [
  { href: ROUTES.DASHBOARD, label: "Overview", icon: LayoutDashboard, exact: true },
  { href: ROUTES.DASHBOARD_PROFILE, label: "Profile", icon: User },
  { href: ROUTES.DASHBOARD_MY_PROPERTIES, label: "My Properties", icon: Building2, ownerOnly: true },
  { href: ROUTES.DASHBOARD_SAVED, label: "Saved Listings", icon: Heart },
  { href: ROUTES.DASHBOARD_INQUIRIES, label: "Inquiries", icon: MessageSquare },
  { href: ROUTES.DASHBOARD_BOOKINGS, label: "Bookings", icon: CalendarCheck },
  {
    href: ROUTES.DASHBOARD_WALLET,
    label: "Wallet",
    icon: Wallet,
    showFor: (role) => role === RolesEnum.AGENT,
  },
  { href: ROUTES.DASHBOARD_NOTIFICATIONS, label: "Notifications", icon: Bell },
  {
    href: ROUTES.DASHBOARD_BECOME_AGENT,
    label: "Become Agent",
    icon: ShieldCheck,
    showFor: (role) => role === RolesEnum.RENT_SEEKER || role === RolesEnum.PROPERTY_OWNER,
  },
  {
    href: ROUTES.DASHBOARD_ADMIN_VERIFICATIONS,
    label: "Verifications",
    icon: ShieldAlert,
    showFor: (role) => role === RolesEnum.ADMIN,
  },
  {
    href: ROUTES.DASHBOARD_ADMIN_REPORTS,
    label: "Reports",
    icon: Flag,
    showFor: (role) => role === RolesEnum.ADMIN,
  },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const { user } = useAuth()

  const isOwner = user && OWNER_ROLES.includes(user.role)

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  const shouldShow = (link: SidebarLink) => {
    if (link.ownerOnly && !isOwner) return false
    if (link.showFor && user) return link.showFor(user.role)
    if (link.showFor && !user) return false
    return true
  }

  return (
    <aside className="w-64 shrink-0 border-r bg-muted/30 hidden lg:block">
      <div className="flex flex-col h-full p-4">
        <div className="space-y-1">
          {SIDEBAR_LINKS.map((link) => {
            if (!shouldShow(link)) return null
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                  isActive(link.href, link.exact)
                    ? "bg-accent text-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            )
          })}
        </div>

        <div className="mt-auto pt-4 border-t space-y-2">
          {user?.role === RolesEnum.AGENT && (
            <Link
              href={ROUTES.AGENT_DETAIL(user.profile?.slug || user.id)}
              target="_blank"
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <ExternalLink className="h-4 w-4" />
              My Agent Page
            </Link>
          )}
          {isOwner && (
            <Link href={ROUTES.DASHBOARD_NEW_PROPERTY} className={cn(buttonVariants(), "w-full")}>
              <Plus className="h-4 w-4 mr-2" />
              List Property
            </Link>
          )}
        </div>
      </div>
    </aside>
  )
}

export function DashboardMobileNav() {
  const pathname = usePathname()
  const { user } = useAuth()
  const isOwner = user && OWNER_ROLES.includes(user.role)

  const shouldShow = (link: SidebarLink) => {
    if (link.ownerOnly && !isOwner) return false
    if (link.showFor && user) return link.showFor(user.role)
    if (link.showFor && !user) return false
    return true
  }

  return (
    <nav className="lg:hidden border-b overflow-x-auto">
      <div className="flex items-center gap-1 p-2 min-w-max">
        {SIDEBAR_LINKS.map((link) => {
          if (!shouldShow(link)) return null
          const active = link.exact
            ? pathname === link.href
            : pathname.startsWith(link.href)
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-md text-sm whitespace-nowrap transition-colors",
                active
                  ? "bg-accent text-foreground font-medium"
                  : "text-muted-foreground hover:bg-accent"
              )}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          )
        })}
        {user?.role === RolesEnum.AGENT && (
          <Link
            href={ROUTES.AGENT_DETAIL(user.profile?.slug || user.id)}
            target="_blank"
            className="flex items-center gap-2 px-3 py-2 rounded-md text-sm whitespace-nowrap transition-colors text-muted-foreground hover:bg-accent"
          >
            <ExternalLink className="h-4 w-4" />
            My Agent Page
          </Link>
        )}
      </div>
    </nav>
  )
}
