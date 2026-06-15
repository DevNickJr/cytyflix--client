import { Search, MessageSquare, Home } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const STEPS = [
  {
    icon: Search,
    title: "Search",
    description: "Browse properties by location, type, and budget. Use filters to find exactly what you need.",
  },
  {
    icon: MessageSquare,
    title: "Inquire",
    description: "Send inquiries directly to property owners. Ask questions and schedule viewings.",
  },
  {
    icon: Home,
    title: "Move In",
    description: "Found the one? Finalize your rental agreement and move into your new home.",
  },
]

export function HowItWorks() {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">How It Works</h2>
          <p className="text-muted-foreground">Finding your next home is easy with CytyFlix</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {STEPS.map((step, index) => (
            <Card key={step.title} className="text-center border-none bg-background shadow-sm">
              <CardContent className="pt-8 pb-6">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
                  <step.icon className="h-7 w-7 text-primary" />
                </div>
                <div className="text-xs font-semibold text-muted-foreground mb-2">
                  STEP {index + 1}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
