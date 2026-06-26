import { Navbar } from "@/components/layout/navbar"
import { Building2 } from "lucide-react"
import Link from "next/link"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center bg-muted/30 px-4">
        <Link href="/" className="flex items-center gap-2 mb-8">
          <Building2 className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold">CytyFlix</span>
        </Link>
        <div className="w-full max-w-md">{children}</div>
      </div>
    </>
  )
}
