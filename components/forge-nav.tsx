"use client"

import { useForgeStore, type Screen } from "@/lib/forge-store"
import { cn } from "@/lib/utils"
import { Home, Map, RefreshCw, BarChart2, User } from "lucide-react"

const navItems: { id: Screen; label: string; icon: any }[] = [
  { id: "today", label: "Today", icon: Home },
  { id: "blueprint", label: "Blueprint", icon: Map },
  { id: "focus", label: "Focus", icon: RefreshCw },
  { id: "metrics", label: "Progress", icon: BarChart2 },
  { id: "profile", label: "Profile", icon: User },
]

export function ForgeNav() {
  const { currentScreen, setScreen, onboardingComplete } = useForgeStore()

  if (!onboardingComplete) return null

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-8 md:pb-12 pointer-events-none">
      <div className="bg-card/80 backdrop-blur-2xl border border-border/40 px-2 py-2 rounded-[2.5rem] flex items-center justify-around w-[90%] max-w-md pointer-events-auto shadow-2xl shadow-foreground/5">
        {navItems.map((item) => {
          const active = currentScreen === item.id
          const Icon = item.icon
          return (
            <button
              key={item.id}
              onClick={() => setScreen(item.id)}
              className="flex flex-col items-center justify-center py-2 px-3 gap-1 group transition-all"
            >
              <div className={cn(
                "p-2 rounded-2xl transition-all",
                active ? "text-primary bg-primary/5 shadow-inner" : "text-muted-foreground/30 group-hover:text-muted-foreground/60"
              )}>
                <Icon className="w-5 h-5" strokeWidth={active ? 2.5 : 2} />
              </div>
              <span className={cn(
                "text-[8px] font-bold uppercase tracking-[0.2em] transition-all",
                active ? "text-foreground" : "text-muted-foreground/30 group-hover:text-muted-foreground/50"
              )}>
                {item.label}
              </span>
              {active && (
                <div className="w-4 h-0.5 bg-primary rounded-full mt-0.5 animate-in fade-in zoom-in duration-500" />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
