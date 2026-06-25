"use client"

import { useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { useForgeStore } from "@/lib/forge-store"
import { ForgeNav } from "@/components/forge-nav"
import { MindDumpScreen } from "@/components/screens/minddump"
import { BlueprintScreen } from "@/components/screens/blueprint"
import { TodayScreen } from "@/components/screens/today"
import { ReflectionScreen } from "@/components/screens/reflection"
import { MetricsScreen } from "@/components/screens/metrics"

export function ForgeApp() {
  const { loading, user } = useAuth()
  const { onboardingComplete, currentScreen, isHydrated, hydrateFromServer } = useForgeStore()

  // Hydrate from server when user is authenticated
  useEffect(() => {
    if (user && !isHydrated) {
      hydrateFromServer(user.id)
    }
  }, [user, isHydrated, hydrateFromServer])

  if (loading || (user && !isHydrated)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-xs font-mono text-muted-foreground/40 uppercase tracking-[0.2em]">
          Loading...
        </div>
      </div>
    )
  }

  if (!user) {
    // This shouldn't happen because middleware redirects to login
    // but TypeScript needs this check
    return null
  }

  if (!onboardingComplete) {
    return <MindDumpScreen />
  }

  return (
    <div className="min-h-screen bg-background">
      <ForgeNav />
      <main className="pt-12">
        {currentScreen === "blueprint" && <BlueprintScreen />}
        {currentScreen === "today" && <TodayScreen />}
        {currentScreen === "reflection" && <ReflectionScreen />}
        {currentScreen === "metrics" && <MetricsScreen />}
        {currentScreen === "minddump" && <MindDumpScreen />}
      </main>
    </div>
  )
}
