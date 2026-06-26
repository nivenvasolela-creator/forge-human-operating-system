"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useForgeStore } from "@/lib/forge-store"
import { ForgeNav } from "@/components/forge-nav"
import { MindDumpScreen } from "@/components/screens/minddump"
import { BlueprintScreen } from "@/components/screens/blueprint"
import { TodayScreen } from "@/components/screens/today"
import { ReflectionScreen } from "@/components/screens/reflection"
import { MetricsScreen } from "@/components/screens/metrics"
import { ProfileScreen } from "@/components/screens/profile"
import { FocusScreen } from "@/components/screens/focus"

export function ForgeApp() {
  const { loading, user } = useAuth()
  const { onboardingComplete, currentScreen, isHydrated, hydrateFromServer } = useForgeStore()
  const router = useRouter()

  // Hydrate from server when user is authenticated
  useEffect(() => {
    if (user && !isHydrated) {
      hydrateFromServer(user.id)
    }
  }, [user, isHydrated, hydrateFromServer])

  // Fallback redirect if middleware fails
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
          <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.2em] animate-pulse">
            Authenticating...
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <div className="space-y-6">
          <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.2em]">
            Secure session not found.
          </div>
          <button
            onClick={() => router.push("/login")}
            className="text-xs font-mono text-primary border border-primary/20 px-6 py-3 rounded-lg hover:bg-primary/5 transition-all"
          >
            Sign in to Forge &rarr;
          </button>
        </div>
      </div>
    )
  }

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
          <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.2em] animate-pulse">
            Syncing your system...
          </div>
        </div>
      </div>
    )
  }

  if (!onboardingComplete) {
    return <MindDumpScreen />
  }

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/10">
      <ForgeNav />
      <main className="pb-32 md:pb-40">
        {currentScreen === "today" && <TodayScreen />}
        {currentScreen === "blueprint" && <BlueprintScreen />}
        {currentScreen === "focus" && <FocusScreen />}
        {currentScreen === "metrics" && <MetricsScreen />}
        {currentScreen === "profile" && <ProfileScreen />}
        {currentScreen === "minddump" && <MindDumpScreen />}
        {currentScreen === "reflection" && <ReflectionScreen />}
      </main>
    </div>
  )
}
