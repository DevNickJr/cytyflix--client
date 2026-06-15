import { HeroSection } from "@/components/home/hero-section"
import { FeaturedProperties } from "@/components/home/featured-properties"
import { HowItWorks } from "@/components/home/how-it-works"
import { CtaSection } from "@/components/home/cta-section"

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedProperties />
      <HowItWorks />
      <CtaSection />
    </>
  )
}
