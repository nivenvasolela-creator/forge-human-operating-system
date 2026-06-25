"use client"

import { useForgeStore } from "@/lib/forge-store"
import { ForgeNav } from "@/components/forge-nav"
import { MindDumpScreen } from "@/components/screens/minddump"
import { BlueprintScreen } from "@/components/screens/blueprint"
import { TodayScreen } from "@/components/screens/today"
import { ReflectionScreen } from "@/components/screens/reflection"

export function ForgeApp() {
  const { onboardingComplete, currentScreen } = useForgeStore()

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
        {currentScreen === "minddump" && <MindDumpScreen />}
      </main>
    </div>
  )
}
