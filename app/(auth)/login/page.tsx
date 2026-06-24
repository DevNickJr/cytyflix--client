import { LoginForm } from "@/components/auth/login-form"
import { PageLoader } from "@/components/shared/loading-spinner"
import type { Metadata } from "next"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Sign In",
}

export default function LoginPage() {
  
  return (
    <Suspense fallback={<PageLoader />}>
      <LoginForm />
    </Suspense>
  )
}
