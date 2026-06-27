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
import { cn } from "@/lib/utils"

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
          <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.2em] animate-pulse font-bold">
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
          <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.2em] font-bold">
            Secure session not found.
          </div>
          <button
            onClick={() => router.push("/login")}
            className="text-xs font-mono text-primary border border-primary/40 px-8 py-4 rounded-full hover:bg-primary/5 transition-all font-bold tracking-widest"
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
          <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.2em] animate-pulse font-bold">
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
      {currentScreen !== "focus" && <ForgeNav />}
      <main className={cn("pb-40", currentScreen === "focus" && "pb-0 pt-0")}>
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
