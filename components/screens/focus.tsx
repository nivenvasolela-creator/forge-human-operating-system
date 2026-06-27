"use client"

import { useState, useEffect, useRef } from "react"
import { useForgeStore } from "@/lib/forge-store"
import { Play, Square, X } from "lucide-react"
import { cn } from "@/lib/utils"

export function FocusScreen() {
  const { logDeepWork, setScreen, dailyMission } = useForgeStore()
  const [timerRunning, setTimerRunning] = useState(true)
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
    setScreen("today")
  }

  return (
    <div className="fixed inset-0 bg-background z-[100] flex flex-col items-center justify-center p-8 animate-in fade-in duration-1000">

      {/* Exit Button */}
      <button
        onClick={handleStop}
        className="absolute top-12 right-12 text-muted-foreground/20 hover:text-foreground transition-colors p-4"
      >
        <X className="w-8 h-8" />
      </button>

      <div className="max-w-xl w-full space-y-24 text-center">

        <div className="space-y-6">
          <p className="title-section text-primary animate-pulse">Focus Active</p>
          <h2 className="text-2xl md:text-3xl text-foreground font-light leading-relaxed">
            {dailyMission || "Your mission is execution."}
          </h2>
        </div>

        <div className="relative group">
          <div className="absolute inset-0 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all duration-1000" />
          <div className="relative text-8xl md:text-9xl font-mono font-extralight tracking-tighter text-foreground tabular-nums">
            {formatTime(timerSeconds)}
          </div>
        </div>

        <div className="space-y-12">
          <input
            value={sessionLabel}
            onChange={(e) => setSessionLabel(e.target.value)}
            placeholder="What specific action are you taking?"
            className="w-full bg-transparent border-b border-foreground/5 text-center py-4 text-xl text-foreground font-light placeholder:text-muted-foreground/10 outline-none focus:border-primary/20 transition-colors"
          />

          <div className="flex justify-center">
            <button
              onClick={handleStop}
              className="bg-foreground text-background px-16 py-6 rounded-full text-xs font-mono uppercase tracking-[0.4em] font-bold shadow-2xl shadow-foreground/10 hover:scale-[1.02] active:scale-95 transition-all"
            >
              End Session
            </button>
          </div>
        </div>

      </div>

      <div className="absolute bottom-12 text-[10px] font-mono text-muted-foreground/20 uppercase tracking-[0.5em] font-bold">
        Silence the world. Build the future.
      </div>
    </div>
  )
}
