"use client"

import { useState } from "react"
import { useForgeStore } from "@/lib/forge-store"
import { Plus, X, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

function TagInput({
  items,
  onChange,
  placeholder,
  colorClass = "bg-primary/10 text-primary border-primary/20",
}: {
  items: string[]
  onChange: (items: string[]) => void
  placeholder: string
  colorClass?: string
}) {
  const [input, setInput] = useState("")

  const add = () => {
    const val = input.trim()
    if (val && !items.includes(val)) {
      onChange([...items, val])
    }
    setInput("")
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className={cn("flex items-center gap-1.5 px-3 py-1 text-sm font-medium border rounded-sm", colorClass)}
          >
            {item}
            <button
              onClick={() => onChange(items.filter((i) => i !== item))}
              className="hover:opacity-70 transition-opacity"
              aria-label={`Remove ${item}`}
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder={placeholder}
          className="flex-1 bg-[var(--surface)] border border-border rounded-sm px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 transition-colors"
        />
        <button
          onClick={add}
          className="px-3 py-2.5 bg-[var(--surface-raised)] border border-border hover:border-primary/50 transition-colors rounded-sm"
          aria-label="Add item"
        >
          <Plus className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>
    </div>
  )
}

export function IdentityScreen() {
  const {
    userName,
    futureIdentity,
    currentIdentity,
    coreValues,
    setFutureIdentity,
    setCurrentIdentity,
    setCoreValues,
    setScreen,
  } = useForgeStore()

  const gapCount = futureIdentity.length - currentIdentity.length

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <p className="text-xs font-mono text-primary tracking-[0.2em] uppercase mb-2">Layer 2 — Identity Engine</p>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">Who are you becoming?</h1>
        <p className="text-muted-foreground mt-2 leading-relaxed">
          Before strategy, before tasks — define the person you&apos;re building.
          Everything else serves this identity.
        </p>
      </div>

      {/* Identity Gap Visual */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-[var(--surface)] border border-border rounded-sm p-5 space-y-2">
          <p className="text-[11px] font-mono text-muted-foreground uppercase tracking-widest">Current Self</p>
          <div className="flex flex-wrap gap-1.5">
            {currentIdentity.map((item) => (
              <span key={item} className="px-2 py-0.5 text-xs bg-[var(--surface-raised)] border border-border text-muted-foreground rounded-sm">
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-[var(--forge-muted)] border border-primary/20 rounded-sm p-5 flex flex-col items-center justify-center text-center">
          <p className="text-[11px] font-mono text-primary/70 uppercase tracking-widest mb-2">The Gap</p>
          <p className="text-4xl font-bold text-primary">{Math.abs(gapCount) + currentIdentity.length}</p>
          <p className="text-xs text-muted-foreground mt-1">traits to build</p>
          <div className="mt-3 text-xs text-muted-foreground font-mono">
            Current → Desired
          </div>
        </div>

        <div className="bg-[var(--surface)] border border-primary/20 rounded-sm p-5 space-y-2">
          <p className="text-[11px] font-mono text-primary uppercase tracking-widest">Future Self</p>
          <div className="flex flex-wrap gap-1.5">
            {futureIdentity.map((item) => (
              <span key={item} className="px-2 py-0.5 text-xs bg-primary/10 border border-primary/20 text-primary rounded-sm">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Edit sections */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-[var(--surface)] border border-border rounded-sm p-6 space-y-4">
          <div>
            <h3 className="font-semibold text-foreground">Future Identity</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Who do you intend to become?</p>
          </div>
          <TagInput
            items={futureIdentity}
            onChange={setFutureIdentity}
            placeholder="Add a future identity (e.g. Founder)..."
            colorClass="bg-primary/10 text-primary border-primary/20"
          />
        </div>

        <div className="bg-[var(--surface)] border border-border rounded-sm p-6 space-y-4">
          <div>
            <h3 className="font-semibold text-foreground">Current Identity</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Be honest about where you are today.</p>
          </div>
          <TagInput
            items={currentIdentity}
            onChange={setCurrentIdentity}
            placeholder="Add current reality (e.g. Beginner)..."
            colorClass="bg-[var(--surface-raised)] text-muted-foreground border-border"
          />
        </div>
      </div>

      <div className="bg-[var(--surface)] border border-border rounded-sm p-6 space-y-4">
        <div>
          <h3 className="font-semibold text-foreground">Core Values</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            The non-negotiables that govern every decision you make.
          </p>
        </div>
        <TagInput
          items={coreValues}
          onChange={setCoreValues}
          placeholder="Add a core value (e.g. Excellence)..."
          colorClass="bg-[var(--surface-raised)] text-foreground border-border"
        />
      </div>

      {/* Standards block */}
      <div className="bg-[var(--forge-muted)] border border-primary/20 rounded-sm p-6">
        <p className="text-[11px] font-mono text-primary/70 uppercase tracking-widest mb-3">Identity Statement</p>
        <p className="text-foreground leading-relaxed">
          I am <span className="text-primary font-semibold">{userName}</span>.{" "}
          I am building toward becoming a{" "}
          <span className="text-primary font-semibold">
            {futureIdentity.slice(0, 2).join(" and ")}
          </span>
          {futureIdentity.length > 2 && ` and ${futureIdentity.length - 2} more`}.{" "}
          My core values are{" "}
          <span className="text-primary font-semibold">
            {coreValues.slice(0, 3).join(", ")}
          </span>
          . Every action I take must reflect the person I am becoming.
        </p>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => setScreen("blueprint")}
          className="group inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 font-bold text-sm hover:bg-primary/90 transition-all"
        >
          BUILD MY BLUEPRINT
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  )
}
