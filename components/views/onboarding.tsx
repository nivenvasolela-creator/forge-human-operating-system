"use client"

import { useState } from "react"
import { useForgeStore } from "@/lib/forge-store"
import { ForgeLogo } from "@/components/forge-logo"

export function OnboardingView() {
  const { setName, completeOnboarding, userName } = useForgeStore()
  const [step, setStep] = useState<"name" | "dump" | "processing">("name")
  const [dump, setDump] = useState("")

  const handleComplete = async () => {
    if (dump.length > 20) {
      setStep("processing")
      await completeOnboarding(dump)
    }
  }

  if (step === "processing") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-12 text-center px-12">
        <ForgeLogo className="w-24 h-24 animate-pulse opacity-80" />
        <div className="space-y-6">
          <p className="os-label tracking-[0.8em]">Forging System</p>
          <h1 className="os-title">Calibrating Identity.</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="py-24 space-y-32 animate-in fade-in duration-1000 min-h-screen flex flex-col justify-center px-4">

      <div className="flex justify-center">
        <ForgeLogo className="w-12 h-12 opacity-20" />
      </div>

      {step === "name" ? (
        <div className="space-y-24">
          <div className="space-y-6 text-center">
            <p className="os-label">Identity</p>
            <h1 className="os-title">Who is building?</h1>
          </div>
          <div className="space-y-12">
            <input
              autoFocus
              type="text"
              value={userName}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && userName.trim() && setStep("dump")}
              placeholder="Full name or alias"
              className="w-full bg-transparent border-b border-foreground/5 text-4xl md:text-5xl text-foreground font-light placeholder:text-muted-foreground/10 outline-none py-8 text-center focus:border-primary/20 transition-all"
            />
            <div className="flex justify-center">
              <button
                onClick={() => setStep("dump")}
                disabled={!userName.trim()}
                className="os-label bg-foreground text-background px-16 py-6 rounded-full hover:scale-105 active:scale-95 disabled:opacity-10 transition-all font-bold"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-24">
          <div className="space-y-6 text-center">
            <p className="os-label">The Mission: ALERA</p>
            <h1 className="os-title">What is the vision?</h1>
            <p className="text-xl text-muted-foreground font-light max-w-sm mx-auto leading-relaxed px-4">
              Write freely about the credit scoring infrastructure you are building. The dreams, the fears, the truth.
            </p>
          </div>
          <div className="space-y-12">
            <textarea
              autoFocus
              value={dump}
              onChange={(e) => setDump(e.target.value)}
              placeholder="I want to build Africa's credit layer because..."
              className="w-full bg-card/50 border border-foreground/5 rounded-[3rem] text-xl md:text-2xl text-foreground font-light placeholder:text-muted-foreground/10 outline-none p-12 resize-none leading-relaxed focus:bg-card focus:shadow-2xl transition-all"
              rows={6}
            />
            <div className="flex flex-col items-center gap-12">
              <button
                onClick={handleComplete}
                disabled={dump.length < 20}
                className="bg-primary text-primary-foreground px-16 py-6 rounded-full text-xs font-mono uppercase tracking-[0.4em] font-bold shadow-2xl shadow-primary/20 hover:scale-[1.05] active:scale-95 disabled:opacity-10 transition-all"
              >
                Forge Identity
              </button>
              <button onClick={() => setStep("name")} className="os-label text-muted-foreground/40 hover:text-foreground">
                &larr; BACK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
