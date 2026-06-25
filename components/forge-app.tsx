"use client"

import { useForgeStore } from "@/lib/forge-store"
import { ForgeNav } from "@/components/forge-nav"
import { OnboardingScreen } from "@/components/screens/onboarding"
import { IdentityScreen } from "@/components/screens/identity"
import { BlueprintScreen } from "@/components/screens/blueprint"
import { CommandCenterScreen } from "@/components/screens/command-center"
import { DeepWorkScreen } from "@/components/screens/deep-work"
import { ScoreboardScreen } from "@/components/screens/scoreboard"
import { AIMirrorScreen } from "@/components/screens/ai-mirror"
import { CompounderScreen } from "@/components/screens/compounder"
import { CEOReviewScreen } from "@/components/screens/ceo-review"
import { RecoveryModeScreen } from "@/components/screens/recovery-mode"

const SCREEN_COMPONENTS = {
  identity: IdentityScreen,
  blueprint: BlueprintScreen,
  command: CommandCenterScreen,
  deepwork: DeepWorkScreen,
  scoreboard: ScoreboardScreen,
  mirror: AIMirrorScreen,
  compounder: CompounderScreen,
  review: CEOReviewScreen,
  recovery: RecoveryModeScreen,
}

export function ForgeApp() {
  const { onboardingComplete, currentScreen } = useForgeStore()

  if (!onboardingComplete) {
    return <OnboardingScreen />
  }

  const ScreenComponent = SCREEN_COMPONENTS[currentScreen as keyof typeof SCREEN_COMPONENTS]

  return (
    <div className="flex min-h-screen bg-background">
      <ForgeNav />

      {/* Main content area */}
      <main className="flex-1 ml-16 md:ml-56 min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-40 h-12 bg-background/90 backdrop-blur-sm border-b border-border flex items-center px-6">
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-widest">
              System Active
            </span>
          </div>
        </header>

        {/* Screen content */}
        <div className="px-4 md:px-8 py-8">
          {ScreenComponent ? (
            <ScreenComponent />
          ) : (
            <CommandCenterScreen />
          )}
        </div>
      </main>
    </div>
  )
}
