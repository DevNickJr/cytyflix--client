"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useUnreadCount } from "@/hooks/use-notifications"
import { ROUTES, OWNER_ROLES } from "@/lib/constants"
import { cn, getInitials } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Bell,
  Building2,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  User,
  HelpCircle,
  Info,
  Phone,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

const NAV_LINKS = [
  { href: ROUTES.HOME, label: "Home", icon: Home },
  { href: ROUTES.PROPERTIES, label: "Properties", icon: Search },
  { href: ROUTES.ABOUT, label: "About", icon: Info },
  { href: ROUTES.CONTACT, label: "Contact", icon: Phone },
  { href: ROUTES.FAQ, label: "FAQ", icon: HelpCircle },
]

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, isAuthenticated, logout } = useAuth()
  const { data: unreadData } = useUnreadCount()
  const [mobileOpen, setMobileOpen] = useState(false)

  const unreadCount = unreadData?.data?.unreadCount ?? 0

  const handleLogout = () => {
    logout()
    router.push(ROUTES.HOME)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href={ROUTES.HOME} className="flex items-center gap-2">
            <Image src={'/applogo.png'} alt="Logo" width={300} height={300} className="h-12 w-24 text-primary" />
            {/* <Building2 className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">CytyFlix</span> */}
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-accent",
                  pathname === link.href
                    ? "text-foreground bg-accent"
                    : "text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => router.push(ROUTES.DASHBOARD_NOTIFICATIONS)}
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px]"
                  >
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </Badge>
                )}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger
                  render={<Button variant="ghost" className="relative h-9 w-9 rounded-full" />}
                >
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user?.profile?.profileImage} />
                    <AvatarFallback>
                      {getInitials(user?.profile?.firstName, user?.profile?.lastName)}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">
                      {user?.profile?.firstName
                        ? `${user.profile.firstName} ${user.profile.lastName ?? ""}`
                        : user?.email}
                    </p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push(ROUTES.DASHBOARD)}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push(ROUTES.DASHBOARD_PROFILE)}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  {user && OWNER_ROLES.includes(user.role) && (
                    <DropdownMenuItem onClick={() => router.push(ROUTES.DASHBOARD_NEW_PROPERTY)}>
                      <Building2 className="mr-2 h-4 w-4" />
                      List a Property
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link href={ROUTES.LOGIN} className={cn(buttonVariants({ variant: "ghost" }))}>
                Sign In
              </Link>
              <Link href={ROUTES.REGISTER} className={cn(buttonVariants())}>
                Get Started
              </Link>
            </div>
          )}

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              render={<Button variant="ghost" size="icon" />}
              className="md:hidden"
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <nav className="flex flex-col gap-1 mt-8">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                      pathname === link.href
                        ? "bg-accent text-foreground"
                        : "text-muted-foreground hover:bg-accent"
                    )}
                  >
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                ))}
                {!isAuthenticated && (
                  <>
                    <div className="my-2 border-t" />
                    <Link
                      href={ROUTES.LOGIN}
                      onClick={() => setMobileOpen(false)}
                      className="px-3 py-2.5 text-sm font-medium"
                    >
                      Sign In
                    </Link>
                    <Link
                      href={ROUTES.REGISTER}
                      onClick={() => setMobileOpen(false)}
                    >
                      <Button className="w-full">Get Started</Button>
                    </Link>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
