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
    logDeepWork,
    optimalTaskCount,
  } = useForgeStore()

  const [input, setInput] = useState("")
  const [timerRunning, setTimerRunning] = useState(false)
  const [timerSeconds, setTimerSeconds] = useState(0)
  const [sessionLabel, setSessionLabel] = useState("")
  const [showTimerInput, setShowTimerInput] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())

  const activeTasks = tasks.filter((t) => !t.done)
  const doneTasks = tasks.filter((t) => t.done)
  const canAddMore = activeTasks.length < optimalTaskCount

  // Update clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

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

  const handleAdd = () => {
    if (!input.trim() || !canAddMore) return
    addTask(input.trim())
    setInput("")
  }

  const greeting = () => {
    const h = currentTime.getHours()
    if (h < 12) return "Good morning"
    if (h < 17) return "Good afternoon"
    return "Good evening"
  }

  return (
    <div className="max-w-xl mx-auto py-12 md:py-24 px-8 md:px-0 space-y-16 animate-in fade-in duration-700">

      {/* 01. Time & Greeting */}
      <div className="space-y-4">
        <p className="text-4xl md:text-5xl font-mono tracking-tighter text-foreground font-light">
          {currentTime.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit', hour12: false })}
        </p>
        <h1 className="text-xl md:text-2xl text-muted-foreground font-light tracking-tight">
          {greeting()}{userName ? `, ${userName}` : ""}. <span className="text-foreground/80">Today matters.</span>
        </h1>
      </div>

      <hr className="border-foreground/5" />

      {/* 02. Your Mission */}
      <div className="space-y-6">
        <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.3em] font-bold">
          Your Mission
        </p>
        <p className="text-lg md:text-xl text-foreground font-medium leading-relaxed">
          {destination || "Define your becoming in the Blueprint."}
        </p>
      </div>

      <hr className="border-foreground/5" />

      {/* 03. Today's Tasks */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.3em] font-bold">
            Next Steps
          </p>
          <p className="text-[10px] font-mono text-muted-foreground/40 uppercase tracking-widest">
            {activeTasks.length}/{optimalTaskCount}
          </p>
        </div>

        <div className="space-y-4">
          {activeTasks.map((t) => (
            <div key={t.id} className="flex items-center gap-6 group">
              <button
                onClick={() => toggleTask(t.id)}
                className="w-6 h-6 rounded-full border border-foreground/10 flex items-center justify-center shrink-0 transition-all hover:border-primary/50 hover:bg-primary/5 active:scale-90"
              />
              <span className="text-lg text-foreground/90 font-light leading-snug flex-1">{t.text}</span>
              <button
                onClick={() => removeTask(t.id)}
                className="opacity-0 group-hover:opacity-40 hover:opacity-100 transition-opacity text-xs font-mono p-2"
              >
                &times;
              </button>
            </div>
          ))}

          {doneTasks.map((t) => (
            <div key={t.id} className="flex items-center gap-6 opacity-30">
              <button
                onClick={() => toggleTask(t.id)}
                className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0"
              >
                <div className="w-2 h-2 rounded-full bg-primary" />
              </button>
              <span className="text-lg text-foreground line-through font-light leading-snug">{t.text}</span>
            </div>
          ))}

          {canAddMore && (
            <div className="flex items-center gap-6">
              <div className="w-6 h-6 rounded-full border border-dashed border-foreground/10 shrink-0" />
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                placeholder="What is the next step?"
                className="flex-1 bg-transparent text-lg text-foreground font-light placeholder:text-muted-foreground/20 outline-none border-none py-1"
              />
            </div>
          )}
        </div>
      </div>

      <hr className="border-foreground/5" />

      {/* 04. Focus Action */}
      <div className="pt-4 flex justify-center">
        {timerRunning ? (
          <div className="flex flex-col items-center gap-8 w-full">
            <div className="text-6xl md:text-7xl font-mono font-extralight tracking-tighter text-foreground tabular-nums">
              {formatTime(timerSeconds)}
            </div>
            {sessionLabel && (
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest animate-pulse">
                FOCUSING ON: {sessionLabel}
              </p>
            )}
            <button
              onClick={stopTimer}
              className="text-[10px] font-mono bg-foreground text-background px-12 py-4 rounded-full uppercase tracking-[0.3em] font-bold hover:opacity-90 transition-all shadow-xl active:scale-95"
            >
              Log Session
            </button>
          </div>
        ) : showTimerInput ? (
          <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <input
              autoFocus
              value={sessionLabel}
              onChange={(e) => setSessionLabel(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && startTimer()}
              placeholder="What are you building now?"
              className="w-full bg-transparent border-b border-foreground/5 text-xl md:text-2xl text-foreground font-light placeholder:text-muted-foreground/20 outline-none py-4 text-center transition-colors focus:border-primary/20"
            />
            <div className="flex justify-center gap-8">
              <button
                onClick={startTimer}
                className="text-[10px] font-mono bg-primary text-primary-foreground px-12 py-4 rounded-full uppercase tracking-[0.3em] font-bold hover:opacity-90 transition-all shadow-lg shadow-primary/20 active:scale-95"
              >
                Begin Focus
              </button>
              <button
                onClick={() => setShowTimerInput(false)}
                className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.3em] font-bold hover:text-foreground px-4 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowTimerInput(true)}
            className="group flex flex-col items-center gap-4 transition-all hover:scale-105 active:scale-95"
          >
            <div className="w-20 h-20 rounded-full border border-foreground/5 flex items-center justify-center transition-all group-hover:border-primary/30 group-hover:bg-primary/5">
              <div className="w-3 h-3 rounded-full bg-primary/40 group-hover:bg-primary animate-pulse" />
            </div>
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.4em] font-bold group-hover:text-primary transition-colors">
              Begin Focus
            </span>
          </button>
        )}
      </div>

    </div>
  )
}
