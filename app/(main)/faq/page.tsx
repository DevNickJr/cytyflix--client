"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "What is CytyFlix?",
    answer:
      "CytyFlix is a modern property discovery platform focused on the Nigerian market. It connects renters with property owners and agents, making it easy to browse, inquire about, and secure rental properties and shortlets across the country.",
  },
  {
    question: "How do I search for properties?",
    answer:
      "Visit the Properties page and use the filters to narrow down by state, city, property type (apartment, house, studio, etc.), listing type (rent or shortlet), price range, number of bedrooms, and bathrooms. You can also sort results by newest, oldest, or price.",
  },
  {
    question: "Do I need an account to browse properties?",
    answer:
      "No, you can browse all properties without an account. However, you'll need to sign up to save properties, send inquiries, or list your own properties.",
  },
  {
    question: "How do I list a property?",
    answer:
      "Sign up as a property owner or agent, then go to your Dashboard and click 'Create Property'. Fill in the property details including title, description, location, price, images, and amenities. Your listing will be published immediately.",
  },
  {
    question: "How do inquiries work?",
    answer:
      "When you find a property you're interested in, you can send an inquiry directly from the property detail page. The property owner or agent will receive a notification and can respond to your message. You can track all your inquiries from the Dashboard.",
  },
  {
    question: "Can I save properties for later?",
    answer:
      "Yes! Click the heart icon on any property card or the 'Save Property' button on the detail page. All your saved listings are accessible from the Saved section in your Dashboard.",
  },
  {
    question: "Is CytyFlix free to use?",
    answer:
      "Yes, CytyFlix is completely free for renters. Property owners and agents can list properties at no cost. We may introduce premium listing features in the future.",
  },
  {
    question: "What areas does CytyFlix cover?",
    answer:
      "CytyFlix covers all 36 states of Nigeria plus the Federal Capital Territory (FCT). Whether you're looking in Lagos, Abuja, Port Harcourt, Kano, or anywhere else, you can find properties on our platform.",
  },
  {
    question: "How do I update my profile?",
    answer:
      "Go to Dashboard > Profile to update your personal information, profile picture, phone number, bio, and preferences like preferred location and budget range.",
  },
  {
    question: "How do I contact support?",
    answer:
      "Visit our Contact page to send us a message, or email us directly at support@cytyflix.com. We typically respond within 24 hours.",
  },
]

export default function FAQPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-muted-foreground">
            Find answers to common questions about CytyFlix.
          </p>
        </div>

        <Accordion className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  )
}
