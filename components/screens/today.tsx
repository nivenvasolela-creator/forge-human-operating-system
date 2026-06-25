"use client"

import { useState, useEffect, useRef } from "react"
import { useForgeStore } from "@/lib/forge-store"

export function TodayScreen() {
  const {
    userName,
    tasks,
    destination,
    addTask,
    toggleTask,
    removeTask,
    deepWorkMinutes,
    deepWorkGoal,
    logDeepWork,
    setScreen,
    totalDeepWorkHours,
    streakDays,
    completedToday,
  } = useForgeStore()

  const [input, setInput] = useState("")
  const [timerRunning, setTimerRunning] = useState(false)
  const [timerSeconds, setTimerSeconds] = useState(0)
  const [sessionLabel, setSessionLabel] = useState("")
  const [showTimerInput, setShowTimerInput] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const activeTasks = tasks.filter((t) => !t.done)
  const doneTasks = tasks.filter((t) => t.done)
  const canAddMore = activeTasks.length < 3

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  })

  // Timer logic
  useEffect(() => {
    if (timerRunning) {
      intervalRef.current = setInterval(() => {
        setTimerSeconds((s) => s + 1)
      }, 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [timerRunning])

  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600)
    const m = Math.floor((secs % 3600) / 60)
    const s = secs % 60
    return h > 0
      ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
      : `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
  }

  const stopTimer = () => {
    setTimerRunning(false)
    if (timerSeconds >= 60) {
      logDeepWork(Math.floor(timerSeconds / 60))
    }
    setTimerSeconds(0)
    setSessionLabel("")
    setShowTimerInput(false)
  }

  const startTimer = () => {
    setTimerRunning(true)
    setShowTimerInput(false)
  }

  const deepWorkPercent = Math.min(
    100,
    deepWorkGoal > 0 ? Math.round((deepWorkMinutes / deepWorkGoal) * 100) : 0
  )
  const deepWorkHoursToday = (deepWorkMinutes / 60).toFixed(1)

  const handleAdd = () => {
    if (!input.trim() || !canAddMore) return
    addTask(input.trim())
    setInput("")
  }

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return "Good morning"
    if (h < 17) return "Good afternoon"
    return "Good evening"
  }

  return (
    <div className="max-w-xl mx-auto py-12 px-6 space-y-12">

      {/* Header */}
      <div className="space-y-1">
        <p className="text-xs font-mono text-muted-foreground uppercase tracking-[0.2em]">Today</p>
        <h1 className="text-2xl font-semibold text-foreground">
          {greeting()}{userName ? `, ${userName}` : ""}.
        </h1>
        <p className="text-sm text-muted-foreground">{today}</p>
      </div>

      {/* Metrics strip */}
      <div className="flex gap-8">
        <Metric label="Streak" value={String(streakDays)} unit="days" />
        <Metric label="Deep work" value={String(totalDeepWorkHours)} unit="hrs total" />
        <Metric label="Done today" value={String(completedToday)} unit={`of ${tasks.length}`} />
      </div>

      {/* Three tasks */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-[0.2em]">
            What matters today
          </p>
          <p className="text-xs font-mono text-muted-foreground/50">
            {activeTasks.length}/3
          </p>
        </div>

        {destination && activeTasks.length === 0 && (
          <p className="text-xs text-muted-foreground/50 italic leading-relaxed">
            Pick 3 tasks that move you toward: &ldquo;{destination.slice(0, 80)}{destination.length > 80 ? "…" : ""}&rdquo;
          </p>
        )}

        <div className="space-y-1">
          {activeTasks.map((t) => (
            <div key={t.id} className="flex items-center gap-3 py-2 group">
              <button
                onClick={() => toggleTask(t.id)}
                className="w-4 h-4 rounded-full border border-border flex items-center justify-center shrink-0 transition-colors hover:border-primary"
                aria-label="Complete task"
              />
              <span className="text-sm text-foreground flex-1 leading-relaxed">{t.text}</span>
              <button
                onClick={() => removeTask(t.id)}
                className="text-muted-foreground/0 group-hover:text-muted-foreground/40 hover:text-muted-foreground transition-colors text-xs font-mono"
                aria-label="Remove task"
              >
                &times;
              </button>
            </div>
          ))}

          {doneTasks.map((t) => (
            <div key={t.id} className="flex items-center gap-3 py-2 group">
              <button
                onClick={() => toggleTask(t.id)}
                className="w-4 h-4 rounded-full border border-primary/50 bg-primary/10 flex items-center justify-center shrink-0"
                aria-label="Mark incomplete"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-primary block" />
              </button>
              <span className="text-sm text-muted-foreground/40 line-through flex-1 leading-relaxed">{t.text}</span>
            </div>
          ))}
        </div>

        {canAddMore && (
          <div className="flex items-center gap-3 pt-1">
            <div className="w-4 h-4 rounded-full border border-dashed border-border shrink-0" />
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              placeholder="Add a task..."
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/30 outline-none border-none"
            />
            {input.trim() && (
              <button
                onClick={handleAdd}
                className="text-xs font-mono text-primary hover:text-foreground transition-colors"
              >
                Add
              </button>
            )}
          </div>
        )}
      </div>

      {/* Deep work timer */}
      <div className="space-y-4">
        <p className="text-xs font-mono text-muted-foreground uppercase tracking-[0.2em]">Deep work</p>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-mono text-muted-foreground">
            <span>{deepWorkHoursToday}h today</span>
            <span>{deepWorkPercent}%</span>
          </div>
          <div className="h-px bg-border w-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${deepWorkPercent}%` }}
            />
          </div>
          <p className="text-[11px] text-muted-foreground/50">
            Goal: {(deepWorkGoal / 60).toFixed(0)}h per day
          </p>
        </div>

        {/* Timer */}
        {timerRunning ? (
          <div className="flex items-center gap-5">
            <span className="text-3xl font-mono font-light text-foreground tabular-nums">
              {formatTime(timerSeconds)}
            </span>
            {sessionLabel && (
              <span className="text-xs text-muted-foreground italic truncate">{sessionLabel}</span>
            )}
            <button
              onClick={stopTimer}
              className="text-xs font-mono text-muted-foreground hover:text-foreground transition-colors ml-auto"
            >
              Stop &amp; log
            </button>
          </div>
        ) : showTimerInput ? (
          <div className="space-y-3">
            <input
              autoFocus
              value={sessionLabel}
              onChange={(e) => setSessionLabel(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && startTimer()}
              placeholder="What are you working on? (optional)"
              className="w-full bg-transparent border-b border-border text-sm text-foreground placeholder:text-muted-foreground/30 outline-none py-1.5 transition-colors focus:border-primary/50"
            />
            <div className="flex gap-5">
              <button
                onClick={startTimer}
                className="text-sm font-mono text-primary hover:text-foreground transition-colors"
              >
                Start &rarr;
              </button>
              <button
                onClick={() => setShowTimerInput(false)}
                className="text-sm font-mono text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowTimerInput(true)}
            className="text-sm font-mono text-muted-foreground hover:text-foreground transition-colors"
          >
            Start a session &rarr;
          </button>
        )}
      </div>

      {/* Reflection CTA */}
      <div className="pt-4 border-t border-border">
        <button
          onClick={() => setScreen("reflection")}
          className="text-sm font-mono text-primary hover:text-foreground transition-colors"
        >
          End the day — reflect &rarr;
        </button>
      </div>

    </div>
  )
}

function Metric({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div>
      <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-xl font-semibold text-foreground leading-none">{value}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{unit}</p>
    </div>
  )
}
