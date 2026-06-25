"use client"

import { useForgeStore } from "@/lib/forge-store"
import { BookOpen, Heart, Shield, Zap, Users, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

const ICON_MAP: Record<string, React.ElementType> = {
  BookOpen,
  Heart,
  Shield,
  Zap,
  Users,
  TrendingUp,
}

const SCORE_COLORS = [
  "bg-rose-500",
  "bg-orange-500",
  "bg-amber-500",
  "bg-yellow-400",
  "bg-lime-400",
  "bg-green-400",
  "bg-emerald-400",
  "bg-teal-400",
  "bg-cyan-400",
  "bg-primary",
]

export function ScoreboardScreen() {
  const { scores, updateScore } = useForgeStore()

  const overallScore = scores.length
    ? Math.round(scores.reduce((a, s) => a + s.score, 0) / scores.length)
    : 0

  const getScoreLabel = (score: number) => {
    if (score <= 2) return { label: "CRITICAL", color: "text-rose-400" }
    if (score <= 4) return { label: "WEAK", color: "text-orange-400" }
    if (score <= 6) return { label: "AVERAGE", color: "text-yellow-400" }
    if (score <= 8) return { label: "STRONG", color: "text-emerald-400" }
    return { label: "ELITE", color: "text-primary" }
  }

  const overall = getScoreLabel(overallScore)

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <p className="text-xs font-mono text-primary tracking-[0.2em] uppercase mb-2">Scoreboard — Layer 5</p>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">Life Score</h1>
        <p className="text-muted-foreground mt-2">Rate every dimension of your life. The truth will set you free.</p>
      </div>

      {/* Overall score */}
      <div className="bg-[var(--surface)] border border-border rounded-sm p-8 flex flex-col md:flex-row items-center gap-8">
        <div className="relative w-32 h-32 flex-shrink-0">
          <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="50" fill="none" stroke="oklch(0.22 0 0)" strokeWidth="10" />
            <circle
              cx="60" cy="60" r="50" fill="none"
              stroke="oklch(0.78 0.16 75)"
              strokeWidth="10"
              strokeDasharray={2 * Math.PI * 50}
              strokeDashoffset={2 * Math.PI * 50 - (2 * Math.PI * 50 * overallScore) / 10}
              strokeLinecap="round"
              className="transition-all duration-700"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-foreground">{overallScore}</span>
            <span className="text-[10px] text-muted-foreground font-mono">/10</span>
          </div>
        </div>

        <div className="flex-1 text-center md:text-left">
          <p className={cn("text-2xl font-bold tracking-wider", overall.color)}>{overall.label}</p>
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
            Your overall life score. The top 1% don&apos;t wait for a perfect score — they raise it by 0.1 every week.
            Identify your lowest scores. They are your highest leverage points.
          </p>
          {overallScore < 7 && (
            <p className="text-xs font-mono text-primary/70 mt-3 uppercase tracking-wider">
              Focus: bring your weakest category above 5 first.
            </p>
          )}
        </div>
      </div>

      {/* Score cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {scores.map((score) => {
          const Icon = ICON_MAP[score.icon] ?? TrendingUp
          const pct = (score.score / score.maxScore) * 100
          const barColor = SCORE_COLORS[Math.min(9, score.score)] || "bg-primary"
          const label = getScoreLabel(score.score)

          return (
            <div key={score.category} className="bg-[var(--surface)] border border-border rounded-sm p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-[var(--surface-raised)] rounded-sm flex items-center justify-center">
                    <Icon className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-foreground">{score.category}</p>
                    <p className={cn("text-[10px] font-mono uppercase tracking-wider", label.color)}>{label.label}</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-foreground">{score.score}</span>
              </div>

              {/* Bar */}
              <div className="h-2 bg-[var(--surface-raised)] rounded-full overflow-hidden">
                <div
                  className={cn("h-full rounded-full transition-all duration-500", barColor)}
                  style={{ width: `${pct}%` }}
                />
              </div>

              {/* Score slider */}
              <div className="flex gap-1">
                {Array.from({ length: 11 }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => updateScore(score.category, i)}
                    className={cn(
                      "flex-1 h-6 rounded-sm text-[10px] font-mono transition-all",
                      i === score.score
                        ? "bg-primary text-primary-foreground font-bold"
                        : i < score.score
                        ? "bg-primary/20 text-primary/70 hover:bg-primary/30"
                        : "bg-[var(--surface-raised)] text-muted-foreground/50 hover:bg-[var(--surface-overlay)]"
                    )}
                    aria-label={`Set ${score.category} score to ${i}`}
                  >
                    {i}
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Insight */}
      <div className="bg-[var(--forge-muted)] border border-primary/20 rounded-sm p-5">
        <p className="text-[11px] font-mono text-primary/70 uppercase tracking-widest mb-2">System Insight</p>
        {(() => {
          const weakest = [...scores].sort((a, b) => a.score - b.score)[0]
          const strongest = [...scores].sort((a, b) => b.score - a.score)[0]
          return (
            <p className="text-sm text-foreground leading-relaxed">
              Your weakest area is{" "}
              <span className="text-rose-400 font-semibold">{weakest?.category} ({weakest?.score}/10)</span>.{" "}
              Your strongest is{" "}
              <span className="text-primary font-semibold">{strongest?.category} ({strongest?.score}/10)</span>.{" "}
              Raising your floor — not your ceiling — is what separates the top 1%.
            </p>
          )
        })()}
      </div>
    </div>
  )
}
