"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useForgeStore } from "@/lib/forge-store"
import { ForgeNav } from "@/components/forge-nav"
import { OnboardingView } from "@/components/views/onboarding"
import { BlueprintScreen } from "@/components/screens/blueprint"
import { TodayScreen } from "@/components/screens/today"
import { ReflectionScreen } from "@/components/screens/reflection"
import { MetricsScreen } from "@/components/screens/metrics"
import { ProfileScreen } from "@/components/screens/profile"
import { FocusView } from "@/components/views/focus"
import { cn } from "@/lib/utils"

export function ForgeApp() {
  const { loading, user } = useAuth()
  const { currentState, currentScreen, hydrate, onboardingComplete } = useForgeStore()
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
          <div className="os-label animate-pulse font-bold">Authenticating...</div>
        </div>
      </div>
    )
  }

  if (!user) return null

  // Mandatory Onboarding Flow
  if (!onboardingComplete) {
    return <OnboardingView />
  }

  // Focus Mode silences everything
  if (currentState === "focus") {
    return <FocusView />
  }

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/10">
      <main className="pb-32 md:pb-40">
        {currentScreen === "today" && <TodayScreen />}
        {currentScreen === "blueprint" && <BlueprintScreen />}
        {currentScreen === "focus" && <FocusView />}
        {currentScreen === "metrics" && <MetricsScreen />}
        {currentScreen === "profile" && <ProfileScreen />}
        {currentScreen === "reflection" && <ReflectionScreen />}
      </main>
      <ForgeNav />
    </div>
  )
}
