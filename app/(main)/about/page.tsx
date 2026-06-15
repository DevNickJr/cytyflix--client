"use client"

import { Building2, Users, Shield, Globe } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

const values = [
  {
    icon: Building2,
    title: "Quality Listings",
    description:
      "Every property on CytyFlix is verified to ensure you get accurate information and a seamless experience.",
  },
  {
    icon: Users,
    title: "Trusted Community",
    description:
      "We connect verified property owners and agents with genuine renters, building trust on both sides.",
  },
  {
    icon: Shield,
    title: "Secure Platform",
    description:
      "Your data and communications are protected. We prioritize safety in every interaction on our platform.",
  },
  {
    icon: Globe,
    title: "Nationwide Coverage",
    description:
      "From Lagos to Abuja, Kano to Port Harcourt — find properties across all 36 states and the FCT.",
  },
]

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">About CytyFlix</h1>
        <p className="text-lg text-muted-foreground">
          CytyFlix is Nigeria&apos;s modern property discovery platform, making it easy to find,
          list, and inquire about rental properties and shortlets across the country.
        </p>
      </div>

      <Separator className="mb-16" />

      <div className="max-w-4xl mx-auto mb-16">
        <h2 className="text-2xl font-bold mb-4 text-center">Our Mission</h2>
        <p className="text-muted-foreground text-center max-w-2xl mx-auto">
          We believe finding a home should be straightforward, transparent, and stress-free.
          CytyFlix bridges the gap between property owners and renters with a clean, intuitive
          platform that puts the right information at your fingertips.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-16">
        {values.map((item) => (
          <Card key={item.title}>
            <CardContent className="p-6">
              <item.icon className="h-8 w-8 text-primary mb-3" />
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Separator className="mb-16" />

      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          <div>
            <div className="text-3xl font-bold text-primary mb-2">1</div>
            <h3 className="font-semibold mb-1">Browse</h3>
            <p className="text-sm text-muted-foreground">
              Search and filter properties by location, type, price, and amenities.
            </p>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary mb-2">2</div>
            <h3 className="font-semibold mb-1">Inquire</h3>
            <p className="text-sm text-muted-foreground">
              Send a message directly to the property owner or agent to learn more.
            </p>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary mb-2">3</div>
            <h3 className="font-semibold mb-1">Move In</h3>
            <p className="text-sm text-muted-foreground">
              Finalize your arrangement and move into your new home.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
