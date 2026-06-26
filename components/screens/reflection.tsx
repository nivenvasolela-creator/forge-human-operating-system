"use client"

import { useState } from "react"
import { useForgeStore } from "@/lib/forge-store"

export function ReflectionScreen() {
  const {
    addReflection,
    reflections,
    streakDays,
    totalDeepWorkHours,
    tasks,
    deepWorkMinutes,
    setScreen,
  } = useForgeStore()

  const [did, setDid] = useState("")
  const [blocked, setBlocked] = useState("")
  const [tomorrow, setTomorrow] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const completedToday = tasks.filter((t) => t.done).length
  const totalTasks = tasks.length

  const canSubmit = did.trim().length > 0

  const handleSubmit = () => {
    if (!canSubmit) return
    addReflection({ did, blocked, tomorrow })
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto py-6 md:py-12 px-6 space-y-8 md:space-y-10">
        <div className="space-y-1 text-center md:text-left">
          <p className="text-[10px] md:text-xs font-mono text-muted-foreground uppercase tracking-[0.2em]">Reflection logged</p>
          <h1 className="text-xl md:text-2xl font-semibold text-foreground">Day complete.</h1>
          <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
            Blueprint updated. Tomorrow&apos;s slate is clear.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-px bg-border rounded-lg overflow-hidden shrink-0">
          {[
            { label: "Streak", value: streakDays, unit: "days" },
            { label: "Deep work", value: totalDeepWorkHours, unit: "hrs total" },
          ].map((m) => (
            <div key={m.label} className="bg-card px-5 py-4 flex flex-col items-center md:items-start text-center md:text-left">
              <p className="text-[10px] md:text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1">{m.label}</p>
              <p className="text-xl md:text-2xl font-semibold text-foreground leading-none">{m.value}</p>
              <p className="text-[10px] md:text-xs text-muted-foreground mt-0.5">{m.unit}</p>
            </div>
          ))}
        </div>

        <div className="space-y-3 flex flex-col items-center md:items-start">
          <button
            onClick={() => setScreen("today")}
            className="text-xs md:text-sm font-mono text-primary hover:text-foreground transition-colors"
          >
            Start tomorrow &rarr;
          </button>
          <button
            onClick={() => setScreen("blueprint")}
            className="text-xs md:text-sm font-mono text-muted-foreground hover:text-foreground transition-colors"
          >
            Review blueprint &rarr;
          </button>
        </div>

        {/* Past reflections */}
        {reflections.length > 0 && (
          <div className="space-y-5 pt-4 border-t border-border">
            <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.2em]">
              Past reflections
            </p>
            <div className="space-y-6">
              {reflections.slice(0, 5).map((r) => (
                <div key={r.id} className="space-y-3">
                  <p className="text-[10px] font-mono text-muted-foreground">{r.date}</p>
                  <ReflectionRow label="Did" content={r.did} />
                  {r.blocked && <ReflectionRow label="Blocked" content={r.blocked} />}
                  {r.tomorrow && <ReflectionRow label="Tomorrow" content={r.tomorrow} />}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto py-6 md:py-12 px-6 space-y-10 md:space-y-12">

      {/* Header */}
      <div className="space-y-1 text-center md:text-left">
        <p className="text-[10px] md:text-xs font-mono text-muted-foreground uppercase tracking-[0.2em]">Reflection</p>
        <h1 className="text-xl md:text-2xl font-semibold text-foreground">End of day.</h1>
        <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
          Three questions. Two minutes. Then sleep.
        </p>
      </div>

      {/* Day summary metrics */}
      <div className="flex gap-6 md:gap-8 overflow-x-auto pb-2 no-scrollbar">
        <Metric
          label="Tasks done"
          value={`${completedToday}/${totalTasks}`}
          subtext={totalTasks === 0 ? "no tasks set" : completedToday === totalTasks ? "all done" : "incomplete"}
        />
        <Metric
          label="Deep work"
          value={`${(deepWorkMinutes / 60).toFixed(1)}h`}
          subtext="today"
        />
        <Metric
          label="Streak"
          value={String(streakDays)}
          subtext="days"
        />
      </div>

      {/* Three questions */}
      <div className="space-y-8">
        <Question
          number="01"
          label="What did you do?"
          value={did}
          onChange={setDid}
          placeholder="I finished the product spec, worked out..."
          required
        />
        <Question
          number="02"
          label="What blocked you?"
          value={blocked}
          onChange={setBlocked}
          placeholder="I got distracted by email for 2 hours..."
        />
        <Question
          number="03"
          label="What changes tomorrow?"
          value={tomorrow}
          onChange={setTomorrow}
          placeholder="Phone goes in another room before 10am..."
        />
      </div>

      <div className="pt-2 flex justify-center md:justify-start">
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="text-xs md:text-sm font-mono text-primary disabled:text-muted-foreground/30 transition-colors hover:text-foreground"
        >
          Log &amp; close the day &rarr;
        </button>
      </div>

      {/* Past reflections */}
      {reflections.length > 0 && (
        <div className="space-y-5 pt-8 border-t border-border">
          <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.2em]">
            Past reflections
          </p>
          <div className="space-y-6">
            {reflections.slice(0, 3).map((r) => (
              <div key={r.id} className="space-y-2.5">
                <p className="text-[10px] font-mono text-muted-foreground">{r.date}</p>
                <ReflectionRow label="Did" content={r.did} />
                {r.blocked && <ReflectionRow label="Blocked" content={r.blocked} />}
                {r.tomorrow && <ReflectionRow label="Tomorrow" content={r.tomorrow} />}
              </div>
            ))}
          </div>
        </div>
      )}

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
    <div className="space-y-2">
      <div className="flex items-baseline gap-3">
        <span className="text-[10px] font-mono text-muted-foreground/40">{number}</span>
        <label className="text-xs md:text-sm font-medium text-foreground">
          {label}
          {required && <span className="text-primary ml-1 text-xs">*</span>}
        </label>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full bg-card border border-border rounded-md text-xs md:text-sm text-foreground placeholder:text-muted-foreground/25 outline-none p-3 resize-none leading-relaxed transition-colors focus:border-primary/50"
      />
    </div>
  )
}

function Metric({ label, value, subtext }: { label: string; value: string; subtext: string }) {
  return (
    <div className="shrink-0">
      <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-lg md:text-xl font-semibold text-foreground leading-none">{value}</p>
      <p className="text-[9px] md:text-[10px] text-muted-foreground mt-0.5">{subtext}</p>
    </div>
  )
}

function ReflectionRow({ label, content }: { label: string; content: string }) {
  return (
    <div className="flex gap-3">
      <span className="text-[10px] font-mono text-muted-foreground/40 shrink-0 mt-0.5 w-14">{label}</span>
      <p className="text-xs md:text-sm text-muted-foreground/70 leading-relaxed flex-1">{content}</p>
    </div>
  )
}
