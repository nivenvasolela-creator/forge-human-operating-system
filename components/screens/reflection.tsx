"use client"

import { useState } from "react"
import { useForgeStore } from "@/lib/forge-store"
import { cn } from "@/lib/utils"

export function ReflectionScreen() {
  const {
    addReflection,
    streakDays,
    setScreen,
    tasks,
    dailyMission,
    completedToday,
  } = useForgeStore()

  const [did, setDid] = useState("")
  const [blocked, setBlocked] = useState("")
  const [tomorrow, setTomorrow] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const canSubmit = did.trim().length > 0
  const plannedCount = tasks.length
  const executionRate = plannedCount > 0 ? Math.round((completedToday / plannedCount) * 100) : 0

  const handleSubmit = () => {
    if (!canSubmit) return
    addReflection({ did, blocked, tomorrow })
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="workspace-container">
        <div className="space-y-6">
          <p className="title-section">Reflection Logged</p>
          <h1 className="title-huge font-light text-foreground">
            The day is forged.
          </h1>
          <p className="text-xl text-muted-foreground font-light leading-relaxed">
            Your system has been updated. Rest is now the priority.
          </p>
        </div>

        <div className="pt-24 flex flex-col items-center gap-12">
          <button
            onClick={() => setScreen("today")}
            className="bg-foreground text-background px-16 py-5 rounded-full text-xs font-mono uppercase tracking-[0.4em] font-bold shadow-2xl shadow-foreground/10 hover:scale-[1.02] active:scale-95 transition-all"
          >
            Start Tomorrow
          </button>
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
            {streakDays} DAY MOMENTUM
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="workspace-container">

      {/* 01. The Mirror */}
      <div className="space-y-12">
        <div className="space-y-6">
          <p className="title-section">The Mirror</p>
          <h1 className="title-huge font-light text-foreground">
            Confront the reality.
          </h1>
        </div>

        <div className="space-y-8 p-12 bg-card rounded-[3rem] border border-border shadow-2xl shadow-foreground/5 animate-in zoom-in duration-500">
          <div className="space-y-2">
            <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest font-bold">Today&apos;s Mission</p>
            <p className="text-xl text-foreground font-medium">{dailyMission || "No mission defined."}</p>
          </div>

          <div className="flex justify-between items-end">
            <div className="space-y-2">
              <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest font-bold">Execution</p>
              <p className="text-4xl font-mono text-primary font-bold tracking-tighter">{executionRate}%</p>
            </div>
            <div className="text-right space-y-1">
              <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest font-bold">Gap</p>
              <p className="text-sm text-foreground/80 font-medium">{completedToday} of {plannedCount} actions completed</p>
            </div>
          </div>
        </div>
      </div>

      <hr className="workspace-divider" />

      {/* 02. The Deep Review */}
      <div className="space-y-32">
        <Question
          number="01"
          label="What did you actually build?"
          value={did}
          onChange={setDid}
          placeholder="Truthful account of the day..."
        />
        <Question
          number="02"
          label="What blocked your focus?"
          value={blocked}
          onChange={setBlocked}
          placeholder="Identify the escape doors..."
        />
        <Question
          number="03"
          label="What changes tomorrow?"
          value={tomorrow}
          onChange={setTomorrow}
          placeholder="Systemic adjustment..."
        />
      </div>

      {/* Action */}
      <div className="pt-24 flex justify-center">
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="bg-primary text-primary-foreground px-16 py-6 rounded-full text-xs font-mono uppercase tracking-[0.4em] font-bold shadow-2xl shadow-primary/30 hover:scale-[1.05] active:scale-95 disabled:opacity-20 transition-all duration-500"
        >
          Close the Day
        </button>
      </div>

    </div>
  )
}

function Question({
  number, label, value, onChange, placeholder,
}: {
  number: string
  label: string
  value: string
  onChange: (v: string) => void
  placeholder: string
}) {
  return (
    <div className="space-y-12">
      <div className="flex items-baseline gap-6">
        <span className="text-xs font-mono text-muted-foreground/30 font-bold">{number}</span>
        <label className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
          {label}
        </label>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={2}
        className="w-full bg-transparent text-3xl md:text-4xl text-foreground font-light placeholder:text-muted-foreground/10 outline-none resize-none leading-tight focus:text-primary transition-colors"
      />
    </div>
  )
}
