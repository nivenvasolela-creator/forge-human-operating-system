"use client"

import { useForgeStore } from "@/lib/forge-store"
import { Timer, BookOpen, Cpu, Flame, Zap, Plus, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

const ICON_MAP: Record<string, React.ElementType> = {
  Timer,
  BookOpen,
  Cpu,
  Flame,
  Zap,
}

const COMPOUND_MILESTONES = [10, 50, 100, 500, 1000, 5000, 10000]

export function CompounderScreen() {
  const { compounds, incrementCompound } = useForgeStore()

  const getNextMilestone = (value: number, milestones: number[]) => {
    return milestones.find((m) => m > value) ?? milestones[milestones.length - 1]
  }

  const years = Math.floor(
    ((compounds.find((c) => c.label === "Deep Work Hours")?.value ?? 0) +
      (compounds.find((c) => c.label === "Days Disciplined")?.value ?? 0) * 24) /
      8760
  )

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <p className="text-xs font-mono text-primary tracking-[0.2em] uppercase mb-2">The Compounder</p>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">What Compounds</h1>
        <p className="text-muted-foreground mt-2 leading-relaxed">
          Every hour. Every book. Every project. Every disciplined day.
          This is your life&apos;s ledger — the assets that pay dividends forever.
        </p>
      </div>

      {/* Compound cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {compounds.map((compound) => {
          const Icon = ICON_MAP[compound.icon] ?? Flame
          const nextMilestone = getNextMilestone(compound.value, COMPOUND_MILESTONES)
          const prevMilestone = [...COMPOUND_MILESTONES].reverse().find((m) => m <= compound.value) ?? 0
          const progress = ((compound.value - prevMilestone) / (nextMilestone - prevMilestone)) * 100
          const reachedMilestones = COMPOUND_MILESTONES.filter((m) => m <= compound.value)

          return (
            <div key={compound.label} className="bg-[var(--surface)] border border-border rounded-sm p-5 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 bg-[var(--forge-muted)] border border-primary/20 rounded-sm flex items-center justify-center">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground leading-none">{compound.label}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5 font-mono">{compound.unit}</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-primary">{compound.value}</p>
              </div>

              {/* Progress to next milestone */}
              <div>
                <div className="flex justify-between text-[10px] font-mono text-muted-foreground mb-1.5">
                  <span>{prevMilestone}</span>
                  <span className="text-primary">Next: {nextMilestone}</span>
                </div>
                <div className="h-1.5 bg-[var(--surface-raised)] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, progress)}%` }}
                  />
                </div>
              </div>

              {/* Milestone badges */}
              {reachedMilestones.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {reachedMilestones.map((m) => (
                    <span key={m} className="text-[10px] font-mono px-1.5 py-0.5 bg-primary/15 border border-primary/30 text-primary rounded-sm">
                      {m}+
                    </span>
                  ))}
                </div>
              )}

              {/* Increment/Decrement */}
              <div className="flex items-center gap-2 pt-1 border-t border-border">
                <button
                  onClick={() => incrementCompound(compound.label, -1)}
                  className="flex-1 flex items-center justify-center py-1.5 bg-[var(--surface-raised)] border border-border hover:border-primary/30 transition-colors rounded-sm text-muted-foreground hover:text-foreground"
                  aria-label="Decrease"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => incrementCompound(compound.label, 1)}
                  className="flex-[2] flex items-center justify-center gap-1.5 py-1.5 bg-primary/10 border border-primary/30 hover:bg-primary/20 transition-colors rounded-sm text-primary font-bold text-xs"
                  aria-label="Increase"
                >
                  <Plus className="w-3.5 h-3.5" />
                  +1
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* The Compound Effect */}
      <div className="bg-[var(--surface)] border border-border rounded-sm p-6">
        <p className="text-[11px] font-mono text-muted-foreground uppercase tracking-widest mb-4">
          The Compound Effect
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "1% better daily", result: "37x better in 1 year", highlight: false },
            { label: "4h deep work / day", result: "1,460h / year", highlight: true },
            { label: "1 book / month", result: "120 books in 10 years", highlight: false },
            { label: "10,000 hours", result: "World-class mastery", highlight: true },
          ].map((item) => (
            <div
              key={item.label}
              className={cn(
                "p-4 rounded-sm border",
                item.highlight ? "bg-[var(--forge-muted)] border-primary/20" : "bg-[var(--surface-raised)] border-border"
              )}
            >
              <p className="text-xs text-muted-foreground leading-relaxed">{item.label}</p>
              <p className={cn("text-sm font-bold mt-2", item.highlight ? "text-primary" : "text-foreground")}>
                {item.result}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline projection */}
      <div className="bg-[var(--forge-muted)] border border-primary/20 rounded-sm p-5">
        <p className="text-[11px] font-mono text-primary/70 uppercase tracking-widest mb-3">
          Projection
        </p>
        <p className="text-sm text-foreground leading-relaxed">
          If you log{" "}
          <span className="text-primary font-semibold">4 hours of deep work every day</span>, you will accumulate{" "}
          <span className="text-primary font-semibold">10,000 hours in 6.8 years</span>. That is world-class mastery.
          The only question is whether you will show up.
        </p>
      </div>
    </div>
  )
}
