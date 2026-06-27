"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useForgeStore } from "@/lib/forge-store"
import { MorningView } from "@/components/views/morning"
import { FocusView } from "@/components/views/focus"
import { EveningView } from "@/components/views/evening"
import { BetweenView } from "@/components/views/between"
import { OnboardingView } from "@/components/views/onboarding"

export function ForgeApp() {
  const { loading, user } = useAuth()
  const { currentState, hydrate, onboardingComplete } = useForgeStore()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      hydrate(user.id)
    }
  }, [user, hydrate])

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [loading, user, router])

  if (loading || (user && currentState === "onboarding" && onboardingComplete)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="os-label animate-pulse">Initializing FORGE...</div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/10">
      <main className="max-w-xl mx-auto px-8 md:px-0">
        {currentState === "onboarding" && <OnboardingView />}
        {currentState === "morning" && <MorningView />}
        {currentState === "focus" && <FocusView />}
        {currentState === "between" && <BetweenView />}
        {currentState === "evening" && <EveningView />}
      </main>
    </div>
  )
}
