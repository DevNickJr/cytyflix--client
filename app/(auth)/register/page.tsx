import { RegisterForm } from "@/components/auth/register-form"
import { PageLoader } from "@/components/shared/loading-spinner"
import type { Metadata } from "next"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Create Account",
}

export default function RegisterPage() {
  return (
      <Suspense fallback={<PageLoader />}>
        <RegisterForm />
      </Suspense>
    )
}
