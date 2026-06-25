"use client"

import { useState } from "react"
import { useForgeStore } from "@/lib/forge-store"
import { CheckCircle2, Circle, Plus, ArrowRight, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

const TIMEFRAME_COLORS: Record<string, string> = {
  "Today": "text-primary border-primary/40 bg-primary/10",
  "30 days": "text-amber-400 border-amber-400/30 bg-amber-400/10",
  "90 days": "text-yellow-400 border-yellow-400/30 bg-yellow-400/10",
  "6 months": "text-emerald-400 border-emerald-400/30 bg-emerald-400/10",
  "1 year": "text-cyan-400 border-cyan-400/30 bg-cyan-400/10",
  "3 years": "text-blue-400 border-blue-400/30 bg-blue-400/10",
  "5 years": "text-violet-400 border-violet-400/30 bg-violet-400/10",
  "10 years": "text-rose-400 border-rose-400/30 bg-rose-400/10",
}

const TIMEFRAMES = Object.keys(TIMEFRAME_COLORS)

export function BlueprintScreen() {
  const {
    tenYearVision,
    milestones,
    setTenYearVision,
    setMilestones,
    toggleMilestone,
    setScreen,
    userName,
    futureIdentity,
  } = useForgeStore()

  const [newLabel, setNewLabel] = useState("")
  const [newTimeframe, setNewTimeframe] = useState("90 days")
  const [editingVision, setEditingVision] = useState(!tenYearVision)

  const addMilestone = () => {
    if (!newLabel.trim()) return
    setMilestones([
      ...milestones,
      {
        id: Date.now().toString(),
        label: newLabel.trim(),
        timeframe: newTimeframe,
        done: false,
      },
    ])
    setNewLabel("")
  }

  const removeMilestone = (id: string) => {
    setMilestones(milestones.filter((m) => m.id !== id))
  }

  const sortedMilestones = [...milestones].sort(
    (a, b) => TIMEFRAMES.indexOf(a.timeframe) - TIMEFRAMES.indexOf(b.timeframe)
  )

  const completedCount = milestones.filter((m) => m.done).length
  const progress = milestones.length ? Math.round((completedCount / milestones.length) * 100) : 0

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <p className="text-xs font-mono text-primary tracking-[0.2em] uppercase mb-2">Layer 4 — Life Blueprint</p>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">Your Life Roadmap</h1>
        <p className="text-muted-foreground mt-2 leading-relaxed">
          Dreams reverse-engineered into a timeline. Every milestone connects back to your identity.
        </p>
      </div>

      {/* Progress bar */}
      <div className="bg-[var(--surface)] border border-border rounded-sm p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Blueprint Progress</span>
          <span className="text-sm font-bold text-primary">{progress}%</span>
        </div>
        <div className="h-1.5 bg-[var(--surface-raised)] rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          {completedCount} of {milestones.length} milestones complete
        </p>
      </div>

      {/* 10-Year Vision */}
      <div className="bg-[var(--surface)] border border-border rounded-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-mono text-primary/70 uppercase tracking-widest">10-Year Vision</p>
            <h3 className="font-semibold text-foreground mt-1">The Destination</h3>
          </div>
          {!editingVision && (
            <button
              onClick={() => setEditingVision(true)}
              className="text-xs text-muted-foreground hover:text-primary transition-colors font-mono uppercase tracking-wide"
            >
              Edit
            </button>
          )}
        </div>

        {editingVision ? (
          <div className="space-y-3">
            <textarea
              value={tenYearVision}
              onChange={(e) => setTenYearVision(e.target.value)}
              placeholder={`In 10 years, ${userName || "I"} will have... I will be... I will have built... I will have earned...`}
              className="w-full h-32 bg-[var(--surface-raised)] border border-border rounded-sm p-4 text-foreground placeholder:text-muted-foreground/50 resize-none text-sm leading-relaxed focus:outline-none focus:border-primary/50 transition-colors"
              autoFocus
            />
            <button
              onClick={() => setEditingVision(false)}
              className="text-xs bg-primary text-primary-foreground px-4 py-2 font-bold hover:bg-primary/90 transition-all"
            >
              SAVE VISION
            </button>
          </div>
        ) : (
          <p className="text-foreground leading-relaxed text-sm">
            {tenYearVision || (
              <span className="text-muted-foreground/50 italic">
                Click Edit to define your 10-year destination...
              </span>
            )}
          </p>
        )}
      </div>

      {/* Milestones timeline */}
      <div className="space-y-4">
        <h3 className="font-semibold text-foreground text-sm uppercase tracking-widest font-mono text-muted-foreground">
          Milestone Timeline
        </h3>

        <div className="space-y-2">
          {sortedMilestones.map((milestone) => {
            const colorClass = TIMEFRAME_COLORS[milestone.timeframe] || "text-muted-foreground border-border bg-transparent"
            return (
              <div
                key={milestone.id}
                className={cn(
                  "flex items-center gap-4 p-4 bg-[var(--surface)] border rounded-sm transition-all group",
                  milestone.done ? "border-border opacity-50" : "border-border hover:border-primary/20"
                )}
              >
                <button
                  onClick={() => toggleMilestone(milestone.id)}
                  className="flex-shrink-0 transition-colors"
                  aria-label={milestone.done ? "Mark incomplete" : "Mark complete"}
                >
                  {milestone.done ? (
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  ) : (
                    <Circle className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
                  )}
                </button>
                <p className={cn("flex-1 text-sm font-medium", milestone.done && "line-through text-muted-foreground")}>
                  {milestone.label}
                </p>
                <span className={cn("text-[11px] font-mono px-2 py-0.5 border rounded-sm flex-shrink-0", colorClass)}>
                  {milestone.timeframe}
                </span>
                <button
                  onClick={() => removeMilestone(milestone.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                  aria-label="Remove milestone"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )
          })}
        </div>

        {/* Add milestone */}
        <div className="flex gap-2">
          <input
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addMilestone()}
            placeholder="Add a milestone..."
            className="flex-1 bg-[var(--surface)] border border-border rounded-sm px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 transition-colors"
          />
          <select
            value={newTimeframe}
            onChange={(e) => setNewTimeframe(e.target.value)}
            className="bg-[var(--surface)] border border-border rounded-sm px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors"
          >
            {TIMEFRAMES.map((tf) => (
              <option key={tf} value={tf}>{tf}</option>
            ))}
          </select>
          <button
            onClick={addMilestone}
            className="px-4 py-2.5 bg-primary/20 border border-primary/30 hover:bg-primary/30 transition-colors rounded-sm"
            aria-label="Add milestone"
          >
            <Plus className="w-4 h-4 text-primary" />
          </button>
        </div>
      </div>

      {/* Identity → Blueprint connection */}
      <div className="bg-[var(--forge-muted)] border border-primary/20 rounded-sm p-5">
        <p className="text-[11px] font-mono text-primary/70 uppercase tracking-widest mb-2">
          Blueprint → Identity Connection
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Every milestone you complete closes the gap between{" "}
          <span className="text-foreground">who you are</span> and{" "}
          <span className="text-primary">
            {futureIdentity.slice(0, 2).join(" · ")}
          </span>
          . This is not a to-do list. This is your transformation roadmap.
        </p>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => setScreen("command")}
          className="group inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 font-bold text-sm hover:bg-primary/90 transition-all"
        >
          ENTER COMMAND CENTER
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  )
}
