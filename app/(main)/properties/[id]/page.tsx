export const dynamic = 'force-dynamic'; 

import { notFound } from "next/navigation"
import type { Metadata } from "next"
import PropertyDetailClient from "./property-details";
import { Property } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4001/api/v1"

type Props = {
  params: Promise<{ id: string }>
}

async function fetchProperty(id: string): Promise<Property | null> {
  try {
    // Try id-based lookup first
    let res = await fetch(`${API_URL}/properties/${id}`, {
      next: { revalidate: 60 },
    })

    if (!res.ok) return null

    const data = await res.json()
    return data.data ?? null
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const property = await fetchProperty(id)

  if (!property) {
    return { title: "property Not Found - CytyFlix" }
  }

  const title = property.title || "Property"

  const description = property.description || title

  return {
    title: `${title} - CytyFlix`,
    description,
    openGraph: {
      title: `${title} - CytyFlix`,
      description,
      type: "website",
      siteName: "CytyFlix",
      images: [{ url: property?.interiorImages?.[0], alt: title }, { url: property?.exteriorImages?.[0], alt: title }]
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} - property on CytyFlix`,
      description,
      images: [property?.interiorImages?.[0], property?.exteriorImages?.[0]],
    },
  }
}

export default async function PropertyDetailPage({ params }: Props) {
  const { id } = await params
  const property = await fetchProperty(id)

  if (!property) {
    notFound()
  }

  return <PropertyDetailClient property={property} />
}
