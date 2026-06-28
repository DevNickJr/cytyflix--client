"use client"

import { useRouter } from "next/navigation"
import { ROUTES } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { Building2 } from "lucide-react"
import { useEffect } from "react"
import { sendGTMEvent } from "@next/third-parties/google"

export function CtaSection() {
  const router = useRouter()
  useEffect(() => {
    sendGTMEvent({ event: 'view', value: 'view_home_page' })
  }, [])

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="relative rounded-2xl bg-primary px-6 py-16 md:px-16 text-center text-primary-foreground overflow-hidden">
          <div className="relative z-10">
            <Building2 className="h-12 w-12 mx-auto mb-4 opacity-80" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Own a Property? List It Today
            </h2>
            <p className="text-lg opacity-90 mb-8 max-w-xl mx-auto">
              Reach thousands of potential tenants looking for their next home.
              Create your listing in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                size="lg"
                variant="secondary"
                onClick={() => router.push(ROUTES.REGISTER)}
              >
                Get Started Free
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                onClick={() => router.push(ROUTES.ABOUT)}
              >
                Learn More
              </Button>
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/10" />
        </div>
      </div>
    </section>
  )
}
