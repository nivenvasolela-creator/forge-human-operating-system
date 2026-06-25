"use client"

import { useState } from "react"
import { useForgeStore } from "@/lib/forge-store"

export function MindDumpScreen() {
  const { completeMindDump, userName, mindDump: savedDump } = useForgeStore()
  const [name, setName] = useState(userName || "")
  const [dump, setDump] = useState(savedDump || "")
  const [step, setStep] = useState<"name" | "dump" | "processing">(userName ? "dump" : "name")

  const wordCount = dump.trim().split(/\s+/).filter(Boolean).length

  const handleBuild = async () => {
    if (dump.trim().length <= 20) return
    setStep("processing")
    await completeMindDump(name.trim(), dump.trim())
    // Navigation happens inside completeMindDump via setScreen
  }

  if (step === "processing") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-xl space-y-6 text-center">
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-[0.2em]">
            Building your blueprint
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Reading your mind dump. Extracting your goals and identity.
          </p>
          <div className="flex justify-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-pulse"
                style={{ animationDelay: `${i * 200}ms` }}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-xl">

        {step === "name" ? (
          <div className="space-y-10">
            <div className="space-y-2">
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-[0.2em]">
                Step 1 of 2
              </p>
              <h1 className="text-3xl font-semibold text-foreground leading-tight">
                What do we call you?
              </h1>
            </div>

            <input
              autoFocus
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && name.trim() && setStep("dump")}
              placeholder="Your name"
              className="w-full bg-transparent border-b border-border text-2xl text-foreground placeholder:text-muted-foreground/40 outline-none py-3 transition-colors focus:border-primary"
            />

            <button
              onClick={() => name.trim() && setStep("dump")}
              disabled={!name.trim()}
              className="text-sm font-mono text-primary disabled:text-muted-foreground/30 transition-colors hover:text-foreground"
            >
              Continue &rarr;
            </button>
          </div>

        ) : (
          <div className="space-y-10">
            <div className="space-y-2">
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-[0.2em]">
                Step 2 of 2
              </p>
              <h1 className="text-3xl font-semibold text-foreground leading-tight">
                {name ? `${name}, what do you want?` : "What do you want?"}
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Write everything. Dreams, fears, goals, frustrations, ambitions.
                No structure required. The more you write, the better your blueprint.
              </p>
            </div>

            <div className="relative">
              <textarea
                autoFocus
                value={dump}
                onChange={(e) => setDump(e.target.value)}
                placeholder="I want to build something that matters. I'm frustrated by how little progress I make each day. My dream is..."
                rows={10}
                className="w-full bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground/30 text-sm leading-relaxed outline-none p-4 resize-none transition-colors focus:border-primary/60"
              />
              <span className="absolute bottom-3 right-4 text-xs font-mono text-muted-foreground/40">
                {wordCount} words
              </span>
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={() => setStep("name")}
                className="text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
              >
                &larr; Back
              </button>

              <button
                onClick={handleBuild}
                disabled={dump.trim().length <= 20}
                className="text-sm font-mono text-primary disabled:text-muted-foreground/30 transition-colors hover:text-foreground"
              >
                Build my blueprint &rarr;
              </button>
            </div>

            {dump.trim().length > 0 && dump.trim().length <= 20 && (
              <p className="text-xs text-muted-foreground/50">
                Write a little more — give the system something to work with.
              </p>
            )}
          </div>
        )}

      </div>
    </div>
  )
}
