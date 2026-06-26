"use client"

import { useState } from "react"
import { useForgeStore } from "@/lib/forge-store"
import { ForgeLogo } from "@/components/forge-logo"

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
  }

  if (step === "processing") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-8 text-center">
        <div className="space-y-12 max-w-sm">
          <div className="flex justify-center">
            <ForgeLogo className="w-24 h-24 animate-pulse opacity-80" />
          </div>
          <div className="space-y-4">
            <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.4em] font-bold">
              Forging Blueprint
            </p>
            <p className="text-lg text-foreground font-light leading-relaxed">
              Extracting identity and mission from your mind dump.
              The system is aligning...
            </p>
          </div>
          <div className="flex justify-center gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1 h-1 rounded-full bg-primary/40 animate-pulse"
                style={{ animationDelay: `${i * 200}ms` }}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-8 md:px-0">
      <div className="w-full max-w-xl space-y-24 animate-in fade-in duration-1000">

        <div className="flex justify-center">
          <ForgeLogo className="w-12 h-12 opacity-20" />
        </div>

        {step === "name" ? (
          <div className="space-y-16">
            <div className="space-y-4 text-center">
              <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.3em] font-bold">Step 01</p>
              <h1 className="text-3xl md:text-4xl text-foreground font-medium tracking-tight">
                What do we call you?
              </h1>
            </div>

            <div className="space-y-12">
              <input
                autoFocus
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && name.trim() && setStep("dump")}
                placeholder="Identity name"
                className="w-full bg-transparent border-b border-foreground/5 text-2xl md:text-3xl text-foreground font-light placeholder:text-muted-foreground/10 outline-none py-4 text-center transition-colors focus:border-primary/20"
              />

              <div className="flex justify-center">
                <button
                  onClick={() => name.trim() && setStep("dump")}
                  disabled={!name.trim()}
                  className="text-[10px] font-mono bg-foreground text-background px-12 py-4 rounded-full uppercase tracking-[0.3em] font-bold hover:opacity-90 disabled:opacity-10 transition-all"
                >
                  Continue &rarr;
                </button>
              </div>
            </div>
          </div>

        ) : (
          <div className="space-y-16">
            <div className="space-y-4 text-center">
              <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.3em] font-bold">Step 02</p>
              <h1 className="text-3xl md:text-4xl text-foreground font-medium tracking-tight leading-tight">
                {name ? `${name}, what do you want?` : "What do you want?"}
              </h1>
              <p className="text-base text-muted-foreground font-light max-w-sm mx-auto">
                Write freely. Dreams, fears, ambitions. No structure required.
              </p>
            </div>

            <div className="space-y-12">
              <div className="relative group">
                <textarea
                  autoFocus
                  value={dump}
                  onChange={(e) => setDump(e.target.value)}
                  placeholder="I want to build..."
                  rows={8}
                  className="w-full bg-card/30 border border-foreground/5 rounded-[2rem] text-lg text-foreground font-light placeholder:text-muted-foreground/10 outline-none p-8 resize-none transition-all focus:bg-card focus:shadow-2xl focus:shadow-foreground/5"
                />
                <span className="absolute bottom-6 right-8 text-[10px] font-mono text-muted-foreground/20 font-bold tracking-widest">
                  {wordCount} WORDS
                </span>
              </div>

              <div className="flex flex-col items-center gap-8">
                <button
                  onClick={handleBuild}
                  disabled={dump.trim().length <= 20}
                  className="text-[10px] font-mono bg-primary text-primary-foreground px-12 py-4 rounded-full uppercase tracking-[0.3em] font-bold hover:opacity-90 disabled:opacity-10 transition-all shadow-lg shadow-primary/20"
                >
                  Forging System &rarr;
                </button>

                <button
                  onClick={() => setStep("name")}
                  className="text-[10px] font-mono text-muted-foreground hover:text-foreground uppercase tracking-[0.2em] transition-colors"
                >
                  &larr; Back
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
