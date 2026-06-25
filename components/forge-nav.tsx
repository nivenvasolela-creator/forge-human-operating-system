"use client"

import { useForgeStore, type Screen } from "@/lib/forge-store"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"
import { LogOut } from "lucide-react"

const navItems: { id: Screen; label: string }[] = [
  { id: "minddump", label: "Dump" },
  { id: "blueprint", label: "Blueprint" },
  { id: "today", label: "Today" },
  { id: "reflection", label: "Reflect" },
  { id: "metrics", label: "Metrics" },
]

export function ForgeNav() {
  const { currentScreen, setScreen, userName, onboardingComplete } = useForgeStore()
  const { signOut } = useAuth()

  if (!onboardingComplete) return null

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-2xl mx-auto px-6 h-12 flex items-center justify-between">
        {/* Wordmark */}
        <span className="text-xs font-mono text-muted-foreground/60 uppercase tracking-[0.25em]">
          {userName || "Alera"}
        </span>

        {/* Nav links */}
        <div className="flex items-center gap-6">
          {navItems.map((item) => {
            const active = currentScreen === item.id
            return (
              <button
                key={item.id}
                onClick={() => setScreen(item.id)}
                className={cn(
                  "text-xs font-mono uppercase tracking-[0.15em] transition-colors",
                  active
                    ? "text-foreground"
                    : "text-muted-foreground/50 hover:text-muted-foreground"
                )}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </button>
            )
          })}

          {/* Sign out button */}
          <button
            onClick={signOut}
            className="text-muted-foreground/40 hover:text-muted-foreground transition-colors"
            aria-label="Sign out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </nav>
  )
}
