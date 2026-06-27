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
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-12 text-center space-y-16">
        <ForgeLogo className="w-24 h-24 animate-pulse opacity-50" />
        <div className="space-y-6">
          <p className="title-section">Initializing OS</p>
          <h1 className="title-huge font-light text-foreground">
            Forging your blueprint.
          </h1>
          <p className="text-xl text-muted-foreground font-light max-w-sm mx-auto leading-relaxed">
            The system is aligning your mission with your intentions.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="workspace-container min-h-screen flex flex-col justify-center">

      <div className="flex justify-center mb-32">
        <ForgeLogo className="w-12 h-12 opacity-10" />
      </div>

      {step === "name" ? (
        <div className="space-y-24">
          <div className="space-y-6 text-center">
            <p className="title-section">Identity</p>
            <h1 className="title-huge font-light text-foreground">
              Who is building?
            </h1>
          </div>

          <div className="space-y-16">
            <input
              autoFocus
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && name.trim() && setStep("dump")}
              placeholder="Your name"
              className="w-full bg-transparent border-b border-foreground/5 text-4xl md:text-5xl text-foreground font-light placeholder:text-muted-foreground/5 outline-none py-8 text-center focus:border-primary/20 transition-all"
            />

            <div className="flex justify-center">
              <button
                onClick={() => name.trim() && setStep("dump")}
                disabled={!name.trim()}
                className="bg-foreground text-background px-16 py-5 rounded-full text-xs font-mono uppercase tracking-[0.4em] font-bold shadow-2xl shadow-foreground/10 hover:scale-[1.02] active:scale-95 disabled:opacity-10 transition-all"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-24">
          <div className="space-y-6 text-center">
            <p className="title-section">Mission</p>
            <h1 className="title-huge font-light text-foreground">
              What do you want?
            </h1>
            <p className="text-xl text-muted-foreground font-light max-w-md mx-auto leading-relaxed">
              Write freely. Dreams, fears, ambitions. No structure required.
            </p>
          </div>

          <div className="space-y-16">
            <textarea
              autoFocus
              value={dump}
              onChange={(e) => setDump(e.target.value)}
              placeholder="Start typing..."
              rows={6}
              className="w-full bg-card/50 border border-foreground/5 rounded-[3rem] text-2xl text-foreground font-light placeholder:text-muted-foreground/10 outline-none p-12 resize-none leading-relaxed focus:bg-card focus:shadow-2xl transition-all"
            />

            <div className="flex flex-col items-center gap-12">
              <button
                onClick={handleBuild}
                disabled={dump.trim().length <= 20}
                className="bg-primary text-primary-foreground px-16 py-5 rounded-full text-xs font-mono uppercase tracking-[0.4em] font-bold shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 disabled:opacity-10 transition-all"
              >
                Forge System
              </button>

              <button
                onClick={() => setStep("name")}
                className="text-[10px] font-mono text-muted-foreground hover:text-foreground uppercase tracking-widest transition-colors"
              >
                &larr; IDENTITY
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
