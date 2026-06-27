"use client"

import { useState } from "react"
import { useForgeStore } from "@/lib/forge-store"
import { cn } from "@/lib/utils"

export function BlueprintScreen() {
  const {
    destination,
    currentReality,
    gap,
    milestones,
    principles,
    standards,
    setBlueprint,
    toggleMilestone,
    setScreen,
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
    <div className="workspace-container">

      {/* 01. Vision Header */}
      <div className="space-y-6">
        <p className="title-section">The Living Roadmap</p>
        <h1 className="title-huge font-light text-foreground">
          Your path is being forged.
        </h1>
        <p className="text-xl text-muted-foreground font-light leading-relaxed">
          The blueprint is a document of intent. It evolves as you do.
        </p>
      </div>

      <hr className="workspace-divider" />

      {/* 02. Core Identity */}
      <div className="space-y-16">
        {!editing && hasBlueprint ? (
          <div className="space-y-16">
            <Section
              label="Destination"
              content={destination}
              empty="Define who you are becoming."
            />
            <Section
              label="Current Reality"
              content={currentReality}
              empty="Be honest about where you stand today."
            />
            <Section
              label="The Gap"
              content={gap}
              empty="Name the specific things that need to change."
            />

            {/* Principles & Standards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <ListSection label="Principles" items={principles} />
              <ListSection label="Standards" items={standards} />
            </div>

            <button
              onClick={() => {
                setDest(destination)
                setReality(currentReality)
                setGapText(gap)
                setEditing(true)
              }}
              className="text-[10px] font-mono text-muted-foreground hover:text-foreground uppercase tracking-widest transition-colors"
            >
              Adjust Identity &rarr;
            </button>
          </div>
        ) : (
          <div className="space-y-12 bg-card p-8 md:p-12 rounded-[2.5rem] border border-foreground/5 shadow-2xl shadow-foreground/5">
            <Field
              label="Destination"
              value={dest}
              onChange={setDest}
              placeholder="Who are you becoming?"
            />
            <Field
              label="Current Reality"
              value={reality}
              onChange={setReality}
              placeholder="Where are you now?"
            />
            <Field
              label="The Gap"
              value={gapText}
              onChange={setGapText}
              placeholder="What must change?"
            />
            <div className="flex gap-8 pt-4">
              <button
                onClick={save}
                disabled={!dest.trim()}
                className="text-[10px] font-mono bg-primary text-primary-foreground px-8 py-3 rounded-full uppercase tracking-[0.2em] font-bold disabled:opacity-20 hover:opacity-90 transition-all"
              >
                Save
              </button>
              {hasBlueprint && (
                <button
                  onClick={() => setEditing(false)}
                  className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.2em] font-bold hover:text-foreground transition-colors px-4"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <hr className="workspace-divider" />

      {/* 03. Roadmap */}
      <div className="space-y-12">
        <div className="flex items-end justify-between">
          <p className="title-section">Milestones</p>
          <p className="text-[10px] font-mono text-muted-foreground/40 uppercase tracking-widest">
            {doneMilestones}/{milestones.length} milestones &bull; {progress}%
          </p>
        </div>

        <div className="space-y-2">
          {milestones.map((m, i) => (
            <button
              key={m.id}
              onClick={() => toggleMilestone(m.id)}
              className="w-full flex items-start gap-8 py-6 group text-left transition-all hover:translate-x-1"
            >
              <span className="text-[10px] font-mono text-muted-foreground/20 w-4 shrink-0 font-bold pt-1">{String(i + 1).padStart(2, '0')}</span>
              <div className="flex-1 space-y-2">
                <span
                  className={cn(
                    "text-lg transition-colors block leading-snug",
                    m.done ? "line-through text-muted-foreground/40 font-light" : "text-foreground/90 font-light"
                  )}
                >
                  {m.label}
                </span>
                <span className="text-[10px] font-mono text-muted-foreground/40 uppercase tracking-[0.2em] block">{m.timeframe}</span>
              </div>
              <div className={cn(
                "w-5 h-5 rounded-full border border-foreground/5 mt-1 flex items-center justify-center shrink-0 transition-all",
                m.done ? "bg-primary border-primary" : "group-hover:border-primary/20"
              )}>
                {m.done && <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground" />}
              </div>
            </button>
          ))}
        </div>
      </div>

    </div>
  )
}

function Section({ label, content, empty }: { label: string; content: string; empty: string }) {
  return (
    <div className="space-y-4">
      <p className="title-section">{label}</p>
      <p className={cn(
        "text-xl md:text-2xl leading-relaxed font-light",
        content ? "text-foreground/90" : "text-muted-foreground/30 italic"
      )}>
        {content || empty}
      </p>
    </div>
  )
}

function ListSection({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="space-y-6">
      <p className="title-section">{label}</p>
      <ul className="space-y-4">
        {items.length > 0 ? items.map((item, i) => (
          <li key={i} className="text-base text-foreground/80 font-light flex gap-4">
            <span className="text-primary/40 text-xs font-mono pt-1">&bull;</span>
            <span>{item}</span>
          </li>
        )) : (
          <li className="text-sm text-muted-foreground/30 italic">Calibrating...</li>
        )}
      </ul>
    </div>
  )
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div className="space-y-4">
      <p className="title-section">{label}</p>
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
