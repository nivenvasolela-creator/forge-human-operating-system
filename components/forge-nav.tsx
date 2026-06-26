"use client"

import { useForgeStore, type Screen } from "@/lib/forge-store"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"
import { LogOut, LayoutGrid, Zap, Target, LineChart, MessageSquare } from "lucide-react"
import { ForgeLogo } from "@/components/forge-logo"

const navItems: { id: Screen; label: string; icon: any }[] = [
  { id: "minddump", label: "Dump", icon: MessageSquare },
  { id: "blueprint", label: "Blueprint", icon: Target },
  { id: "today", label: "Today", icon: Zap },
  { id: "reflection", label: "Reflect", icon: LayoutGrid },
  { id: "metrics", label: "Metrics", icon: LineChart },
]

export function ForgeNav() {
  const { currentScreen, setScreen, userName, onboardingComplete } = useForgeStore()
  const { signOut } = useAuth()

  if (!onboardingComplete) return null

  return (
    <>
      {/* Desktop Top Nav */}
      <nav className="hidden md:block fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-screen-xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ForgeLogo className="w-6 h-6" />
            <span className="text-xs font-mono text-muted-foreground/60 uppercase tracking-[0.25em]">
              {userName || "Alera"}
            </span>
          </div>

          <div className="flex items-center gap-8">
            {navItems.map((item) => {
              const active = currentScreen === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => setScreen(item.id)}
                  className={cn(
                    "text-[10px] font-mono uppercase tracking-[0.2em] transition-all hover:text-foreground",
                    active ? "text-primary forge-text-glow" : "text-muted-foreground/50"
                  )}
                >
                  {item.label}
                </button>
              )
            })}
            <button
              onClick={signOut}
              className="text-muted-foreground/30 hover:text-destructive transition-colors ml-4"
              aria-label="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-xl border-t border-border pb-safe">
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.map((item) => {
            const active = currentScreen === item.id
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => setScreen(item.id)}
                className="flex flex-col items-center justify-center w-full gap-1 transition-all"
              >
                <div className={cn(
                  "p-1.5 rounded-full transition-all",
                  active ? "text-primary bg-primary/10" : "text-muted-foreground/50"
                )}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={cn(
                  "text-[9px] font-mono uppercase tracking-widest",
                  active ? "text-primary" : "text-muted-foreground/40"
                )}>
                  {item.label}
                </span>
              </button>
            )
          })}
        </div>
      </nav>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border px-6 h-12 flex items-center justify-between">
        <ForgeLogo className="w-5 h-5" />
        <span className="text-[10px] font-mono text-muted-foreground/40 uppercase tracking-[0.2em]">
          {currentScreen}
        </span>
        <button onClick={signOut} className="text-muted-foreground/30">
          <LogOut className="w-3.5 h-3.5" />
        </button>
      </div>
    </>
  )
}
