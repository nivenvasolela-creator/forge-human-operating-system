"use client"

import { useState } from "react"
import { useForgeStore } from "@/lib/forge-store"
import { cn } from "@/lib/utils"

export function ReflectionScreen() {
  const {
    addReflection,
    streakDays,
    totalDeepWorkHours,
    setScreen,
  } = useForgeStore()

  const [did, setDid] = useState("")
  const [blocked, setBlocked] = useState("")
  const [tomorrow, setTomorrow] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const canSubmit = did.trim().length > 0

  const handleSubmit = () => {
    if (!canSubmit) return
    addReflection({ did, blocked, tomorrow })
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto py-12 md:py-24 px-8 md:px-0 space-y-16 animate-in fade-in duration-700">
        <div className="space-y-6">
          <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.3em] font-bold">
            Reflection Logged
          </p>
          <h1 className="text-3xl md:text-4xl text-foreground font-medium tracking-tight leading-tight">
            The day is forged.
          </h1>
          <p className="text-lg text-muted-foreground font-light leading-relaxed">
            Your system has been adjusted. Rest is now the priority.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-y-12 gap-x-8">
          <Stat label="Current Streak" value={`${streakDays} days`} />
          <Stat label="Total Focus" value={`${totalDeepWorkHours.toFixed(1)}h`} />
        </div>

        <div className="pt-12 flex flex-col items-center gap-8">
          <button
            onClick={() => setScreen("today")}
            className="text-[10px] font-mono bg-foreground text-background px-12 py-4 rounded-full uppercase tracking-[0.3em] font-bold hover:opacity-90 transition-all shadow-xl active:scale-95"
          >
            Start Tomorrow
          </button>
          <button
            onClick={() => setScreen("blueprint")}
            className="text-[10px] font-mono text-muted-foreground hover:text-foreground uppercase tracking-[0.3em] font-bold transition-colors"
          >
            Review Blueprint
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto py-12 md:py-24 px-8 md:px-0 space-y-24 animate-in fade-in duration-700">

      {/* 01. Reflection Header */}
      <div className="space-y-6">
        <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.3em] font-bold">
          End of Day
        </p>
        <h1 className="text-3xl md:text-4xl text-foreground font-medium tracking-tight leading-tight">
          Review the mission.
        </h1>
        <p className="text-lg text-muted-foreground font-light leading-relaxed">
          Three questions. No distractions. Close the slate.
        </p>
      </div>

      {/* 02. Questions */}
      <div className="space-y-16">
        <Question
          number="01"
          label="What did you build today?"
          value={did}
          onChange={setDid}
          placeholder="Actions taken toward the mission..."
          required
        />
        <Question
          number="02"
          label="What blocked your focus?"
          value={blocked}
          onChange={setBlocked}
          placeholder="Identify the friction..."
        />
        <Question
          number="03"
          label="What changes tomorrow?"
          value={tomorrow}
          onChange={setTomorrow}
          placeholder="System adjustments..."
        />
      </div>

      {/* 03. Action */}
      <div className="pt-12 flex justify-center">
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="text-[10px] font-mono bg-primary text-primary-foreground px-12 py-4 rounded-full uppercase tracking-[0.3em] font-bold disabled:opacity-20 hover:opacity-90 transition-all shadow-lg shadow-primary/20 active:scale-95"
        >
          Close the Day
        </button>
      </div>

    </div>
  )
}

function Question({
  number, label, value, onChange, placeholder, required,
}: {
  number: string
  label: string
  value: string
  onChange: (v: string) => void
  placeholder: string
  required?: boolean
}) {
  return (
    <div className="space-y-6 group">
      <div className="flex items-baseline gap-4">
        <span className="text-[10px] font-mono text-muted-foreground/30 font-bold">{number}</span>
        <label className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
          {label}
        </label>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={2}
        className="w-full bg-transparent text-xl md:text-2xl text-foreground font-light placeholder:text-muted-foreground/20 outline-none resize-none leading-relaxed transition-colors focus:text-primary/80"
      />
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">{label}</p>
      <p className="text-2xl font-light text-foreground">{value}</p>
    </div>
  )
}
