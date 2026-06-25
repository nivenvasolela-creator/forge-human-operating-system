"use client"

import { useForgeStore } from "@/lib/forge-store"
import { Shield, AlertTriangle, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

export function AIMirrorScreen() {
  const { userName, tasks, sessions, scores, milestones, dailyMission, futureIdentity, coreValues } = useForgeStore()

  const completedTasks = tasks.filter((t) => t.done).length
  const totalTasks = tasks.length
  const taskRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  const totalSessions = sessions.length
  const totalMinutes = sessions.reduce((a, s) => a + s.minutes, 0)

  const avgScore = scores.length
    ? Math.round(scores.reduce((a, s) => a + s.score, 0) / scores.length * 10) / 10
    : 0

  const completedMilestones = milestones.filter((m) => m.done).length

  // Generate mirror observations
  const observations: { type: "gap" | "aligned" | "warning"; text: string }[] = []

  if (!dailyMission) {
    observations.push({ type: "gap", text: "No mission set for today. You are operating without direction." })
  } else {
    observations.push({ type: "aligned", text: "Mission set. You have a purpose for today." })
  }

  if (taskRate < 50 && totalTasks > 0) {
    observations.push({ type: "warning", text: `Only ${taskRate}% of tasks completed. Claims vs. actions are diverging.` })
  } else if (taskRate >= 80) {
    observations.push({ type: "aligned", text: `${taskRate}% task completion rate. Actions are matching your claims.` })
  }

  if (totalMinutes === 0) {
    observations.push({ type: "gap", text: "Zero deep work sessions logged. Ambition without execution is fantasy." })
  } else if (totalMinutes < 120) {
    observations.push({ type: "warning", text: `Only ${totalMinutes} minutes of deep work logged total. Elite operators log 4+ hours daily.` })
  } else {
    observations.push({ type: "aligned", text: `${Math.round(totalMinutes / 60 * 10) / 10} hours of deep work logged. The hours are compounding.` })
  }

  if (avgScore < 5) {
    observations.push({ type: "gap", text: `Average life score is ${avgScore}/10. You are below the midpoint in your own assessment.` })
  } else if (avgScore >= 7) {
    observations.push({ type: "aligned", text: `Life score of ${avgScore}/10 is above average. Keep raising the floor.` })
  }

  if (completedMilestones === 0 && milestones.length > 0) {
    observations.push({ type: "warning", text: "No milestones completed yet. The blueprint exists only in theory." })
  } else if (completedMilestones > 0) {
    observations.push({ type: "aligned", text: `${completedMilestones} milestones completed. The blueprint is becoming reality.` })
  }

  const gapCount = observations.filter((o) => o.type === "gap" || o.type === "warning").length
  const alignedCount = observations.filter((o) => o.type === "aligned").length

  const overallAlignment = Math.round((alignedCount / observations.length) * 100) || 0

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <p className="text-xs font-mono text-primary tracking-[0.2em] uppercase mb-2">AI Mirror</p>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">Claims vs. Actions</h1>
        <p className="text-muted-foreground mt-2">
          The Mirror does not flatter. It shows the gap between who you say you are and what the data says.
        </p>
      </div>

      {/* Alignment score */}
      <div className="bg-[var(--surface)] border border-border rounded-sm p-6">
        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20 flex-shrink-0">
            <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="34" fill="none" stroke="oklch(0.22 0 0)" strokeWidth="7" />
              <circle
                cx="40" cy="40" r="34" fill="none"
                stroke={overallAlignment >= 70 ? "oklch(0.78 0.16 75)" : overallAlignment >= 40 ? "oklch(0.78 0.16 75 / 60%)" : "oklch(0.65 0.22 25)"}
                strokeWidth="7"
                strokeDasharray={2 * Math.PI * 34}
                strokeDashoffset={2 * Math.PI * 34 - (2 * Math.PI * 34 * overallAlignment) / 100}
                strokeLinecap="round"
                className="transition-all duration-700"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-foreground">{overallAlignment}%</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-mono text-muted-foreground uppercase tracking-widest">Alignment Score</p>
            <p className={cn(
              "text-xl font-bold mt-1",
              overallAlignment >= 70 ? "text-primary" : overallAlignment >= 40 ? "text-yellow-400" : "text-rose-400"
            )}>
              {overallAlignment >= 70 ? "ALIGNED" : overallAlignment >= 40 ? "DRIFTING" : "MISALIGNED"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {alignedCount} aligned · {gapCount} gaps detected
            </p>
          </div>
        </div>
      </div>

      {/* Observations */}
      <div className="space-y-3">
        <p className="text-[11px] font-mono text-muted-foreground uppercase tracking-widest">Mirror Observations</p>
        {observations.map((obs, i) => (
          <div
            key={i}
            className={cn(
              "flex items-start gap-3 p-4 rounded-sm border",
              obs.type === "aligned" && "bg-primary/5 border-primary/20",
              obs.type === "warning" && "bg-yellow-400/5 border-yellow-400/20",
              obs.type === "gap" && "bg-rose-500/5 border-rose-500/20"
            )}
          >
            {obs.type === "aligned" ? (
              <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
            ) : obs.type === "warning" ? (
              <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
            ) : (
              <Shield className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
            )}
            <p className={cn(
              "text-sm leading-relaxed",
              obs.type === "aligned" && "text-foreground",
              obs.type === "warning" && "text-yellow-100",
              obs.type === "gap" && "text-rose-100"
            )}>
              {obs.text}
            </p>
          </div>
        ))}
      </div>

      {/* Identity alignment */}
      <div className="bg-[var(--surface)] border border-border rounded-sm p-6 space-y-4">
        <p className="text-[11px] font-mono text-muted-foreground uppercase tracking-widest">Identity Alignment Check</p>
        <p className="text-sm text-muted-foreground">
          You claim to be building toward:{" "}
          <span className="text-primary font-semibold">{futureIdentity.slice(0, 3).join(", ")}</span>
        </p>
        <p className="text-sm text-muted-foreground">
          Your core values:{" "}
          <span className="text-foreground font-medium">{coreValues.slice(0, 3).join(" · ")}</span>
        </p>
        <div className="border-t border-border pt-4">
          <p className="text-sm text-foreground leading-relaxed">
            {gapCount === 0
              ? `${userName}, the mirror shows full alignment. Your actions match your identity. Keep executing.`
              : `${userName}, there are ${gapCount} gap${gapCount > 1 ? "s" : ""} between your claims and your actions. The mirror does not lie. Close the gap today.`
            }
          </p>
        </div>
      </div>

      {/* Raw data */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Task Rate", value: `${taskRate}%`, note: "completion" },
          { label: "Deep Work", value: `${Math.round(totalMinutes / 60 * 10) / 10}h`, note: "total" },
          { label: "Life Score", value: `${avgScore}/10`, note: "average" },
          { label: "Milestones", value: `${completedMilestones}`, note: "completed" },
        ].map((stat) => (
          <div key={stat.label} className="bg-[var(--surface)] border border-border rounded-sm p-4">
            <p className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider">{stat.label}</p>
            <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
            <p className="text-[11px] text-muted-foreground">{stat.note}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
