"use client"

import { useForgeStore, type Screen } from "@/lib/forge-store"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"
import { LogOut } from "lucide-react"

const navItems: { id: Screen; label: string }[] = [
  { id: "blueprint", label: "Blueprint" },
  { id: "today", label: "Workspace" },
  { id: "metrics", label: "Review" },
  { id: "reflection", label: "Reflect" },
]

export function ForgeNav() {
  const { currentScreen, setScreen, onboardingComplete } = useForgeStore()
  const { signOut } = useAuth()

  if (!onboardingComplete) return null

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-8 md:pb-12 pointer-events-none">
      <div className="bg-background/20 backdrop-blur-xl border border-foreground/5 px-6 py-3 rounded-full flex items-center gap-8 md:gap-12 pointer-events-auto shadow-2xl shadow-foreground/5">
        {navItems.map((item) => {
          const active = currentScreen === item.id
          return (
            <button
              key={item.id}
              onClick={() => setScreen(item.id)}
              className={cn(
                "text-[9px] font-mono uppercase tracking-[0.3em] transition-all py-1 relative",
                active
                  ? "text-foreground font-bold"
                  : "text-muted-foreground/40 hover:text-muted-foreground"
              )}
            >
              {item.label}
              {active && (
                <div className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          )
        })}

        <div className="w-px h-3 bg-foreground/10 mx-2" />

        <button
          onClick={signOut}
          className="text-muted-foreground/20 hover:text-destructive transition-colors p-1"
          aria-label="Sign out"
        >
          <LogOut className="w-3.5 h-3.5" />
        </button>
      </div>
    </nav>
  )
}
