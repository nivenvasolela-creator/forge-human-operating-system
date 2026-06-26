"use client"

import { useState } from "react"
import { useForgeStore } from "@/lib/forge-store"

export function BlueprintScreen() {
  const {
    mindDump,
    destination,
    currentReality,
    gap,
    milestones,
    setBlueprint,
    toggleMilestone,
    setScreen,
    totalDeepWorkHours,
    streakDays,
    reflections,
  } = useForgeStore()

  const [editing, setEditing] = useState(!destination)
  const [dest, setDest] = useState(destination)
  const [reality, setReality] = useState(currentReality)
  const [gapText, setGapText] = useState(gap)

  const hasBlueprint = destination || currentReality || gap
  const doneMilestones = milestones.filter((m) => m.done).length
  const progress = milestones.length
    ? Math.round((doneMilestones / milestones.length) * 100)
    : 0

  const save = () => {
    setBlueprint(dest, reality, gapText)
    setEditing(false)
  }

  return (
    <div className="max-w-2xl mx-auto py-6 md:py-12 px-6 space-y-10 md:space-y-14">

      {/* Header */}
      <div className="space-y-1 text-center md:text-left">
        <p className="text-[10px] md:text-xs font-mono text-muted-foreground uppercase tracking-[0.2em]">Blueprint</p>
        <h1 className="text-xl md:text-2xl font-semibold text-foreground">Your living roadmap</h1>
        <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
          This document updates as you grow. It is never finished.
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-px bg-border rounded-lg overflow-hidden shrink-0">
        {[
          { label: "Streak", value: streakDays, unit: "days" },
          { label: "Deep work", value: totalDeepWorkHours, unit: "hrs total" },
          { label: "Reflections", value: reflections.length, unit: "logged" },
        ].map((m) => (
          <div key={m.label} className="bg-card px-3 md:px-5 py-3 md:py-4 flex flex-col items-center md:items-start text-center md:text-left">
            <p className="text-[9px] md:text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1">{m.label}</p>
            <p className="text-lg md:text-2xl font-semibold text-foreground leading-none">{m.value}</p>
            <p className="text-[9px] md:text-xs text-muted-foreground mt-0.5">{m.unit}</p>
          </div>
        ))}
      </div>

      {/* Blueprint sections */}
      {!editing && hasBlueprint ? (
        <div className="space-y-8">
          <Section
            label="Destination"
            sublabel="Who do you want to become?"
            content={destination}
            empty="Define who you are becoming."
          />
          <Section
            label="Current reality"
            sublabel="Where are you now?"
            content={currentReality}
            empty="Be honest about where you stand today."
          />
          <Section
            label="The gap"
            sublabel="What must change?"
            content={gap}
            empty="Name the specific things that need to change."
          />
          <button
            onClick={() => {
              setDest(destination)
              setReality(currentReality)
              setGapText(gap)
              setEditing(true)
            }}
            className="text-[10px] md:text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
          >
            Edit &rarr;
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {!hasBlueprint && mindDump && (
            <div className="rounded-md border border-border bg-card/40 p-4">
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                From your mind dump:
              </p>
              <p className="text-[10px] text-muted-foreground/50 italic mt-1 line-clamp-3">
                &ldquo;{mindDump.slice(0, 200)}&hellip;&rdquo;
              </p>
            </div>
          )}
          <Field
            label="Destination"
            sublabel="Who do you want to become?"
            value={dest}
            onChange={setDest}
            placeholder="In 5 years I am a founder who has built a product used by 1M people..."
          />
          <Field
            label="Current reality"
            sublabel="Where are you now?"
            value={reality}
            onChange={setReality}
            placeholder="I am 22, studying CS, building side projects but inconsistent..."
          />
          <Field
            label="The gap"
            sublabel="What must change?"
            value={gapText}
            onChange={setGapText}
            placeholder="I need to ship weekly, learn distribution..."
          />
          <div className="flex gap-6">
            <button
              onClick={save}
              disabled={!dest.trim()}
              className="text-xs md:text-sm font-mono text-primary disabled:text-muted-foreground/30 transition-colors hover:text-foreground"
            >
              Save &rarr;
            </button>
            {hasBlueprint && (
              <button
                onClick={() => setEditing(false)}
                className="text-xs md:text-sm font-mono text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      )}

      {/* Roadmap */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <p className="text-[10px] md:text-xs font-mono text-muted-foreground uppercase tracking-[0.2em]">Roadmap</p>
          <p className="text-[10px] md:text-xs font-mono text-muted-foreground">{doneMilestones}/{milestones.length} &nbsp;·&nbsp; {progress}%</p>
        </div>

        {/* Progress bar */}
        <div className="h-px bg-border w-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="divide-y divide-border">
          {milestones.map((m, i) => (
            <button
              key={m.id}
              onClick={() => toggleMilestone(m.id)}
              className="w-full flex items-center gap-3 md:gap-4 py-3.5 md:py-4 group text-left"
            >
              <span className="text-[10px] md:text-xs font-mono text-muted-foreground/30 w-4 shrink-0 select-none">{i + 1}</span>
              <span
                className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors ${
                  m.done
                    ? "bg-primary"
                    : "bg-border group-hover:bg-muted-foreground/50"
                }`}
              />
              <span
                className={`text-xs md:text-sm flex-1 leading-relaxed transition-colors ${
                  m.done ? "line-through text-muted-foreground/40" : "text-foreground"
                }`}
              >
                {m.label}
              </span>
              <span className="text-[9px] md:text-xs font-mono text-muted-foreground/40 shrink-0">{m.timeframe}</span>
            </button>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="pt-2 border-t border-border flex justify-center md:justify-start">
        <button
          onClick={() => setScreen("today")}
          className="text-xs md:text-sm font-mono text-primary hover:text-foreground transition-colors"
        >
          Go to today &rarr;
        </button>
      </div>

    </div>
  )
}

function Section({
  label, sublabel, content, empty
}: {
  label: string
  sublabel: string
  content: string
  empty: string
}) {
  return (
    <div className="space-y-1.5">
      <p className="text-[10px] md:text-xs font-mono text-muted-foreground uppercase tracking-[0.15em]">{label}</p>
      <p className="text-[10px] md:text-[11px] text-muted-foreground/60">{sublabel}</p>
      <p className={`text-xs md:text-sm leading-relaxed ${content ? "text-foreground" : "text-muted-foreground/40 italic"}`}>
        {content || empty}
      </p>
    </div>
  )
}

function Field({
  label, sublabel, value, onChange, placeholder
}: {
  label: string
  sublabel: string
  value: string
  onChange: (v: string) => void
  placeholder: string
}) {
  return (
    <div className="space-y-1.5">
      <p className="text-[10px] md:text-xs font-mono text-muted-foreground uppercase tracking-[0.15em]">{label}</p>
      <p className="text-[10px] md:text-[11px] text-muted-foreground/60">{sublabel}</p>
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
