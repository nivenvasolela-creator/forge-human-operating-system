"use client"

import { useState } from "react"
import { useForgeStore } from "@/lib/forge-store"
import { BookOpen, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

type ReviewType = "daily" | "weekly" | "monthly" | "quarterly"

const REVIEW_QUESTIONS: Record<ReviewType, { prompt: string; placeholder: string }[]> = {
  daily: [
    { prompt: "What was my biggest win today?", placeholder: "The most important thing I accomplished..." },
    { prompt: "What did I fail at or avoid?", placeholder: "Be honest. What slipped through?" },
    { prompt: "What will I do differently tomorrow?", placeholder: "One concrete change for tomorrow..." },
    { prompt: "Did my actions align with my identity?", placeholder: "Evidence of alignment or misalignment..." },
  ],
  weekly: [
    { prompt: "What moved the needle this week?", placeholder: "The most high-leverage work I did..." },
    { prompt: "What patterns are holding me back?", placeholder: "Recurring obstacles I need to address..." },
    { prompt: "What is my top priority for next week?", placeholder: "The one thing that matters most..." },
    { prompt: "Am I on track with my blueprint?", placeholder: "Current position vs. planned position..." },
  ],
  monthly: [
    { prompt: "What did I build this month?", placeholder: "Tangible outputs, skills, progress..." },
    { prompt: "What needs to change in my system?", placeholder: "What's broken or inefficient?" },
    { prompt: "How has my identity evolved?", placeholder: "Am I becoming who I intend to be?" },
    { prompt: "What is my focus for next month?", placeholder: "Top 3 priorities for the month ahead..." },
  ],
  quarterly: [
    { prompt: "What were my 3 biggest wins this quarter?", placeholder: "The evidence that I showed up..." },
    { prompt: "What is the gap between where I am and where I planned to be?", placeholder: "Honest assessment of progress vs. plan..." },
    { prompt: "What needs to be rebuilt or eliminated?", placeholder: "Strategies, habits, or commitments to kill..." },
    { prompt: "What is my 90-day war plan?", placeholder: "Specific, measurable targets for next quarter..." },
  ],
}

const REVIEW_LABELS: Record<ReviewType, { title: string; cadence: string; color: string }> = {
  daily: { title: "Daily Review", cadence: "Every evening", color: "text-primary border-primary/30 bg-primary/10" },
  weekly: { title: "Weekly Review", cadence: "Every Sunday", color: "text-cyan-400 border-cyan-400/30 bg-cyan-400/10" },
  monthly: { title: "Monthly Review", cadence: "Last day of month", color: "text-violet-400 border-violet-400/30 bg-violet-400/10" },
  quarterly: { title: "Quarterly Review", cadence: "Every 90 days", color: "text-rose-400 border-rose-400/30 bg-rose-400/10" },
}

export function CEOReviewScreen() {
  const { userName, scores, tasks, sessions, milestones } = useForgeStore()
  const [activeReview, setActiveReview] = useState<ReviewType>("weekly")
  const [answers, setAnswers] = useState<Record<string, Record<string, string>>>({})

  const updateAnswer = (type: ReviewType, prompt: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [type]: { ...(prev[type] ?? {}), [prompt]: value },
    }))
  }

  const questions = REVIEW_QUESTIONS[activeReview]
  const currentAnswers = answers[activeReview] ?? {}
  const answeredCount = Object.values(currentAnswers).filter(Boolean).length

  // Summary stats
  const weekTasks = tasks.filter((t) => t.done).length
  const avgScore = scores.length ? (scores.reduce((a, s) => a + s.score, 0) / scores.length).toFixed(1) : "0"
  const totalHours = (sessions.reduce((a, s) => a + s.minutes, 0) / 60).toFixed(1)
  const completedMilestones = milestones.filter((m) => m.done).length

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <p className="text-xs font-mono text-primary tracking-[0.2em] uppercase mb-2">CEO Review — Strategic Layer</p>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">Executive Review</h1>
        <p className="text-muted-foreground mt-2">
          The CEO of your life does not react — they review, assess, and direct. This is your boardroom.
        </p>
      </div>

      {/* Review type selector */}
      <div className="flex flex-wrap gap-2">
        {(Object.keys(REVIEW_LABELS) as ReviewType[]).map((type) => {
          const meta = REVIEW_LABELS[type]
          const active = activeReview === type
          return (
            <button
              key={type}
              onClick={() => setActiveReview(type)}
              className={cn(
                "px-4 py-2 text-sm font-medium border rounded-sm transition-all",
                active ? meta.color : "bg-transparent border-border text-muted-foreground hover:text-foreground hover:border-foreground/20"
              )}
            >
              {meta.title}
            </button>
          )
        })}
      </div>

      {/* Stats snapshot */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Tasks Done", value: weekTasks },
          { label: "Avg Score", value: `${avgScore}/10` },
          { label: "Deep Work", value: `${totalHours}h` },
          { label: "Milestones", value: completedMilestones },
        ].map((stat) => (
          <div key={stat.label} className="bg-[var(--surface)] border border-border rounded-sm p-4">
            <p className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider">{stat.label}</p>
            <p className="text-xl font-bold text-foreground mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Review questions */}
      <div className="bg-[var(--surface)] border border-border rounded-sm p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-foreground">{REVIEW_LABELS[activeReview].title}</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-muted-foreground">{answeredCount}/{questions.length} answered</span>
            <div className="w-16 h-1 bg-[var(--surface-raised)] rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${(answeredCount / questions.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {questions.map((q, i) => (
          <div key={q.prompt} className="space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-[11px] font-mono text-primary/60 mt-0.5 flex-shrink-0">0{i + 1}</span>
              <p className="text-sm font-semibold text-foreground">{q.prompt}</p>
            </div>
            <textarea
              value={currentAnswers[q.prompt] ?? ""}
              onChange={(e) => updateAnswer(activeReview, q.prompt, e.target.value)}
              placeholder={q.placeholder}
              rows={3}
              className="w-full bg-[var(--surface-raised)] border border-border rounded-sm p-4 text-foreground placeholder:text-muted-foreground/40 resize-none text-sm leading-relaxed focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
        ))}

        {answeredCount === questions.length && (
          <div className="bg-[var(--forge-muted)] border border-primary/20 rounded-sm p-4">
            <p className="text-sm text-primary font-semibold">Review complete, {userName}.</p>
            <p className="text-xs text-muted-foreground mt-1">
              {REVIEW_LABELS[activeReview].cadence}. Keep this cadence sacred.
            </p>
          </div>
        )}
      </div>

      {/* The CEO Principle */}
      <div className="grid md:grid-cols-2 gap-4">
        {[
          {
            title: "What CEOs Know",
            body: "The system compounds. Daily reviews build weekly reviews. Weekly reviews build monthly reviews. Monthly reviews build the year. The year builds the decade.",
          },
          {
            title: "The Obligation",
            body: "You are the CEO of your life. No one else will review your performance. No one else will course-correct. This boardroom is yours alone.",
          },
        ].map((item) => (
          <div key={item.title} className="bg-[var(--surface)] border border-border rounded-sm p-5">
            <p className="text-[11px] font-mono text-primary/70 uppercase tracking-widest mb-2">{item.title}</p>
            <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
