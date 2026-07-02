import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Providers } from "@/contexts/providers"
import "./globals.css"
import { GoogleTagManager } from '@next/third-parties/google'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  metadataBase: process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? new URL(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`)
    : new URL('http://localhost:3000'),
  title: {
    default: "CytyFlix - Find Your Perfect Home",
    template: "%s | CytyFlix",
  },
  description:
    "Modern housing discovery platform connecting renters with property owners across Nigeria. Browse apartments, houses, studios, and more.",
  openGraph: {
      title: `CytyFlix - Find Your Perfect Home`,
      description: "Modern housing discovery platform connecting renters with property owners across Nigeria. Browse apartments, houses, studios, and more.",
      type: "website",
      siteName: "CytyFlix",
      images: [{ url: 'https://www.cytyflix.com/applogo.png', alt: 'CytyFlix' }],
    },
    twitter: {
      card: "summary_large_image",
      title: `CytyFlix - Find Your Perfect Home`,
      description: "Modern housing discovery platform connecting renters with property owners across Nigeria. Browse apartments, houses, studios, and more.",
      images: ['https://www.cytyflix.com/applogo.png'],
    },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
      <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID || "GTM-NHJ2GCM7"} />
    </html>
  )
}
