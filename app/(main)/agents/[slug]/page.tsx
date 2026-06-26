import { notFound } from "next/navigation"
import type { Metadata } from "next"
import AgentDetailClient from "./agent-detail-client"
import type { User } from "@/types/user"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4001/api/v1"

type Props = {
  params: Promise<{ slug: string }>
}

async function fetchAgent(slug: string): Promise<User | null> {
  try {
    // Try slug-based lookup first
    let res = await fetch(`${API_URL}/users/agents/by-slug/${slug}`, {
      next: { revalidate: 60 },
    })

    // If slug lookup fails, try UUID-based lookup for backward compatibility
    if (!res.ok) {
      res = await fetch(`${API_URL}/users/agents/${slug}`, {
        next: { revalidate: 60 },
      })
    }

    if (!res.ok) return null

    const data = await res.json()
    return data.data ?? null
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const agent = await fetchAgent(slug)

  if (!agent) {
    return { title: "Agent Not Found - CytyFlix" }
  }

  const fullName =
    agent.profile?.firstName && agent.profile?.lastName
      ? `${agent.profile.firstName} ${agent.profile.lastName}`
      : "Agent"

  const description =
    agent.profile?.bio || `View ${fullName}'s agent profile on CytyFlix.`

  return {
    title: `${fullName} - Agent on CytyFlix`,
    description,
    openGraph: {
      title: `${fullName} - Verified Agent on CytyFlix`,
      description,
      type: "profile",
      ...(agent.profile?.profileImage && {
        images: [{ url: agent.profile.profileImage, alt: fullName }],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: `${fullName} - Agent on CytyFlix`,
      description,
      ...(agent.profile?.profileImage && {
        images: [agent.profile.profileImage],
      }),
    },
  }
}

export default async function AgentDetailPage({ params }: Props) {
  const { slug } = await params
  const agent = await fetchAgent(slug)

  if (!agent) {
    notFound()
  }

  return <AgentDetailClient agent={agent} />
}
