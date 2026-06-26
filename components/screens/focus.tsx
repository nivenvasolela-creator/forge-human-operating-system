"use client"

import { useState, useEffect, useRef } from "react"
import { useForgeStore } from "@/lib/forge-store"
import { Play, Square, Timer } from "lucide-react"

export function FocusScreen() {
  const { logDeepWork, deepWorkGoal, deepWorkMinutes } = useForgeStore()
  const [timerRunning, setTimerRunning] = useState(false)
  const [timerSeconds, setTimerSeconds] = useState(0)
  const [sessionLabel, setSessionLabel] = useState("")
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

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

  const handleStop = () => {
    setTimerRunning(false)
    if (timerSeconds >= 60) {
      logDeepWork(Math.floor(timerSeconds / 60), sessionLabel)
    }
    setTimerSeconds(0)
    setSessionLabel("")
  }

  const deepWorkPercent = Math.min(
    100,
    deepWorkGoal > 0 ? Math.round((deepWorkMinutes / deepWorkGoal) * 100) : 0
  )

  return (
    <div className="max-w-xl mx-auto py-12 md:py-24 px-8 md:px-0 space-y-24 animate-in fade-in duration-700">

      {/* Header */}
      <div className="space-y-6 text-center">
        <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.3em] font-bold">
          Deep Focus
        </p>
        <h1 className="text-3xl md:text-4xl text-foreground font-medium tracking-tight">
          Silence the world.
        </h1>
      </div>

      {/* Timer Display */}
      <div className="flex flex-col items-center gap-12">
        <div className="relative group">
          <div className="absolute inset-0 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all duration-1000" />
          <div className="relative text-7xl md:text-8xl font-mono font-extralight tracking-tighter text-foreground tabular-nums">
            {formatTime(timerSeconds)}
          </div>
        </div>

        {timerRunning && (
          <input
            value={sessionLabel}
            onChange={(e) => setSessionLabel(e.target.value)}
            placeholder="Focusing on..."
            className="w-full max-w-sm bg-transparent border-b border-foreground/5 text-center py-2 text-foreground font-light placeholder:text-muted-foreground/20 outline-none focus:border-primary/20 transition-colors"
          />
        )}

        <div className="flex items-center gap-12">
          {!timerRunning ? (
            <button
              onClick={() => setTimerRunning(true)}
              className="w-20 h-20 rounded-full bg-primary text-white flex items-center justify-center shadow-2xl shadow-primary/20 hover:scale-110 transition-all active:scale-95"
            >
              <Play className="w-8 h-8 fill-current ml-1" />
            </button>
          ) : (
            <button
              onClick={handleStop}
              className="w-20 h-20 rounded-full bg-foreground text-background flex items-center justify-center shadow-xl hover:scale-110 transition-all active:scale-95"
            >
              <Square className="w-6 h-6 fill-current" />
            </button>
          )}
        </div>
      </div>

      {/* Daily Progress */}
      <div className="space-y-6">
        <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
          <span>Daily Momentum</span>
          <span>{deepWorkPercent}%</span>
        </div>
        <div className="h-1 bg-foreground/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-1000 ease-out"
            style={{ width: `${deepWorkPercent}%` }}
          />
        </div>
        <p className="text-[10px] text-center text-muted-foreground/40 font-mono uppercase tracking-widest">
          {(deepWorkMinutes / 60).toFixed(1)}H / {(deepWorkGoal / 60).toFixed(0)}H Target
        </p>
      </div>

    </div>
  )
}
