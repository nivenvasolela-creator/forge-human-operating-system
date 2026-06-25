"use client"

import { useForgeStore, type Screen } from "@/lib/forge-store"
import {
  BookOpen,
  Cpu,
  Flame,
  LayoutDashboard,
  Map,
  RefreshCw,
  Shield,
  TrendingUp,
  User,
  Zap,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems: { id: Screen; label: string; icon: React.ElementType; shortLabel: string }[] = [
  { id: "command", label: "Command Center", shortLabel: "Command", icon: LayoutDashboard },
  { id: "identity", label: "Identity", shortLabel: "Identity", icon: User },
  { id: "blueprint", label: "Blueprint", shortLabel: "Blueprint", icon: Map },
  { id: "deepwork", label: "Deep Work", shortLabel: "Deep Work", icon: Cpu },
  { id: "scoreboard", label: "Scoreboard", shortLabel: "Score", icon: TrendingUp },
  { id: "mirror", label: "AI Mirror", shortLabel: "Mirror", icon: Shield },
  { id: "compounder", label: "Compounder", shortLabel: "Compound", icon: Flame },
  { id: "review", label: "CEO Review", shortLabel: "Review", icon: BookOpen },
  { id: "recovery", label: "Recovery", shortLabel: "Recovery", icon: RefreshCw },
]

export function ForgeNav() {
  const { currentScreen, setScreen, userName } = useForgeStore()

  return (
    <nav className="fixed left-0 top-0 h-full w-16 md:w-56 bg-[var(--surface)] border-r border-border flex flex-col z-50">
      {/* Logo */}
      <div className="px-3 md:px-4 py-5 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-primary rounded flex items-center justify-center flex-shrink-0">
            <Zap className="w-4 h-4 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-bold tracking-[0.15em] text-foreground">FORGE</p>
            <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">Human OS</p>
          </div>
        </div>
      </div>

      {/* User */}
      {userName && (
        <div className="px-3 md:px-4 py-3 border-b border-border">
          <p className="hidden md:block text-xs text-muted-foreground font-mono truncate">
            OPERATIVE: <span className="text-primary">{userName.toUpperCase()}</span>
          </p>
          <div className="md:hidden w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-xs font-bold text-primary">{userName[0]?.toUpperCase()}</span>
          </div>
        </div>
      )}

      {/* Nav items */}
      <div className="flex-1 py-3 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = currentScreen === item.id
          return (
            <button
              key={item.id}
              onClick={() => setScreen(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 md:px-4 py-2.5 text-sm transition-all duration-150 relative group",
                active
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/[0.03]"
              )}
              aria-current={active ? "page" : undefined}
            >
              {active && (
                <span className="absolute left-0 top-1 bottom-1 w-0.5 bg-primary rounded-r" />
              )}
              <Icon className={cn("w-4 h-4 flex-shrink-0", active && "forge-text-glow")} strokeWidth={active ? 2.5 : 1.8} />
              <span className="hidden md:block font-medium text-[13px]">{item.label}</span>
            </button>
          )
        })}
      </div>

      {/* Footer */}
      <div className="px-3 md:px-4 py-3 border-t border-border">
        <p className="hidden md:block text-[10px] font-mono text-muted-foreground/50 uppercase tracking-widest">
          System Online
        </p>
        <div className="md:hidden w-2 h-2 rounded-full bg-primary animate-pulse" />
      </div>
    </nav>
  )
}
