"use client"

import { useState, useEffect } from "react"
import { useForgeStore } from "@/lib/forge-store"
import { Play, Square, Clock, Cpu, Flame } from "lucide-react"
import { cn } from "@/lib/utils"

const WORK_TYPES = [
  "Coding / Building",
  "Learning / Study",
  "Writing / Creating",
  "Planning / Strategy",
  "Design",
  "Research",
  "Other",
]

export function DeepWorkScreen() {
  const { sessions, activeSession, startSession, stopSession, compounds } = useForgeStore()
  const [sessionLabel, setSessionLabel] = useState("Coding / Building")
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    if (!activeSession?.running) { setElapsed(0); return }
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - activeSession.startTime) / 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [activeSession])

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
  }

  const totalHours = compounds.find((c) => c.label === "Deep Work Hours")?.value ?? 0

  // Group sessions by date
  const grouped = sessions.reduce<Record<string, typeof sessions>>((acc, s) => {
    if (!acc[s.date]) acc[s.date] = []
    acc[s.date].push(s)
    return acc
  }, {})

  const todaySessions = grouped[new Date().toLocaleDateString()] ?? []
  const todayMinutes = todaySessions.reduce((a, s) => a + s.minutes, 0)

  // Calculate today's ring percentage (goal: 4 hours = 240 mins)
  const GOAL_MINUTES = 240
  const ringPct = Math.min(100, (todayMinutes / GOAL_MINUTES) * 100)
  const circumference = 2 * Math.PI * 54

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <p className="text-xs font-mono text-primary tracking-[0.2em] uppercase mb-2">Deep Work Engine — Layer 5</p>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">Focused Execution</h1>
        <p className="text-muted-foreground mt-2">No distractions. Pure output. Track every focused hour.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Timer */}
        <div className="bg-[var(--surface)] border border-border rounded-sm p-8 flex flex-col items-center gap-6">
          {/* Ring */}
          <div className="relative w-36 h-36">
            <svg className="w-36 h-36 -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="54" fill="none" stroke="oklch(0.22 0 0)" strokeWidth="8" />
              <circle
                cx="60" cy="60" r="54" fill="none"
                stroke="oklch(0.78 0.16 75)"
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={circumference - (circumference * ringPct) / 100}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {activeSession?.running ? (
                <>
                  <p className="text-2xl font-bold font-mono text-foreground tabular-nums">{formatTime(elapsed)}</p>
                  <p className="text-[10px] text-primary font-mono uppercase tracking-wider mt-0.5 animate-pulse">ACTIVE</p>
                </>
              ) : (
                <>
                  <p className="text-xl font-bold text-foreground">{Math.round(todayMinutes / 60 * 10) / 10}h</p>
                  <p className="text-[10px] text-muted-foreground font-mono uppercase mt-0.5">today</p>
                </>
              )}
            </div>
          </div>

          <p className="text-xs font-mono text-muted-foreground text-center">
            Daily Goal: {Math.round(todayMinutes)}/{GOAL_MINUTES} min ({Math.round(ringPct)}%)
          </p>

          {/* Session type */}
          <div className="w-full">
            <select
              value={sessionLabel}
              onChange={(e) => setSessionLabel(e.target.value)}
              disabled={!!activeSession?.running}
              className="w-full bg-[var(--surface-raised)] border border-border rounded-sm px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/50 disabled:opacity-50"
            >
              {WORK_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Start/Stop */}
          {activeSession?.running ? (
            <button
              onClick={stopSession}
              className="w-full flex items-center justify-center gap-2 bg-rose-500/20 border border-rose-500/40 text-rose-400 py-3 font-bold text-sm hover:bg-rose-500/30 transition-all"
            >
              <Square className="w-4 h-4 fill-current" />
              STOP SESSION
            </button>
          ) : (
            <button
              onClick={() => startSession(sessionLabel)}
              className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 font-bold text-sm hover:bg-primary/90 transition-all forge-glow"
            >
              <Play className="w-4 h-4 fill-current" />
              START DEEP WORK
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="space-y-4">
          {/* Total hours */}
          <div className="bg-[var(--surface)] border border-border rounded-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <Flame className="w-4 h-4 text-primary" />
              <p className="text-[11px] font-mono text-muted-foreground uppercase tracking-widest">Lifetime Deep Work</p>
            </div>
            <p className="text-4xl font-bold text-primary">{totalHours}<span className="text-lg text-muted-foreground ml-1">hrs</span></p>
            <p className="text-xs text-muted-foreground mt-2">
              {totalHours >= 10000 ? "MASTERY ACHIEVED" : `${(10000 - totalHours).toFixed(0)} hrs to 10,000-hour mastery`}
            </p>
            <div className="mt-3 h-1 bg-[var(--surface-raised)] rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full"
                style={{ width: `${Math.min(100, (totalHours / 10000) * 100)}%` }}
              />
            </div>
          </div>

          {/* Today sessions */}
          <div className="bg-[var(--surface)] border border-border rounded-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <p className="text-[11px] font-mono text-muted-foreground uppercase tracking-widest">Today&apos;s Sessions</p>
            </div>
            {todaySessions.length === 0 ? (
              <p className="text-sm text-muted-foreground/50 italic">No sessions yet today.</p>
            ) : (
              <div className="space-y-2">
                {todaySessions.map((s) => (
                  <div key={s.id} className="flex items-center justify-between text-sm">
                    <span className="text-foreground">{s.label}</span>
                    <span className="font-mono text-primary">{s.minutes}m</span>
                  </div>
                ))}
                <div className="border-t border-border pt-2 flex items-center justify-between text-sm font-bold">
                  <span className="text-muted-foreground">Total</span>
                  <span className="text-primary font-mono">{todayMinutes}m</span>
                </div>
              </div>
            )}
          </div>

          {/* Law of the session */}
          <div className="bg-[var(--forge-muted)] border border-primary/20 rounded-sm p-4">
            <p className="text-[11px] font-mono text-primary/70 uppercase tracking-widest mb-2">
              The Law
            </p>
            <p className="text-sm text-foreground leading-relaxed">
              &ldquo;The person who works most deeply, most consistently, over the longest period of time — wins.&rdquo;
            </p>
          </div>
        </div>
      </div>

      {/* Session history */}
      {Object.keys(grouped).length > 0 && (
        <div className="bg-[var(--surface)] border border-border rounded-sm p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-muted-foreground" />
            <p className="text-sm font-semibold text-foreground uppercase tracking-wider">Session History</p>
          </div>
          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            {Object.entries(grouped)
              .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
              .map(([date, daySessions]) => {
                const total = daySessions.reduce((a, s) => a + s.minutes, 0)
                return (
                  <div key={date}>
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-[11px] font-mono text-muted-foreground uppercase tracking-wide">{date}</p>
                      <p className="text-[11px] font-mono text-primary">{Math.round(total / 60 * 10) / 10}h</p>
                    </div>
                    <div className="flex gap-1 flex-wrap">
                      {daySessions.map((s) => (
                        <span
                          key={s.id}
                          className="text-[11px] font-mono px-2 py-0.5 bg-[var(--surface-raised)] border border-border text-muted-foreground rounded-sm"
                        >
                          {s.label} · {s.minutes}m
                        </span>
                      ))}
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      )}
    </div>
  )
}
