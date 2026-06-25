"use client"

import { useState } from "react"
import { useForgeStore } from "@/lib/forge-store"
import { RefreshCw, ArrowRight, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

const RESET_PROTOCOL = [
  {
    step: "01",
    title: "Acknowledge the Break",
    instruction: "Do not spiral. Every operator loses momentum. The elite ones recognize it faster.",
    action: "Say out loud: 'I lost momentum. I am resetting now.'",
  },
  {
    step: "02",
    title: "Identify the Cause",
    instruction: "Was it burnout, distraction, fear, or environment? Name it precisely.",
    action: "Write down the exact cause below.",
  },
  {
    step: "03",
    title: "Reconnect to Identity",
    instruction: "You are not someone who stays down. Read your future identity and blueprint.",
    action: "Navigate to Identity → Blueprint and remind yourself who you are.",
  },
  {
    step: "04",
    title: "One Small Win",
    instruction: "Do not try to recover everything at once. Win today. Just today.",
    action: "Complete one task. Finish one session. Write one sentence.",
  },
  {
    step: "05",
    title: "Return to the System",
    instruction: "The system is the solution. Not motivation. Not inspiration. The system.",
    action: "Open Command Center and set your mission for today.",
  },
]

const EMERGENCY_TRUTHS = [
  "Motivation is a feeling. Discipline is a decision.",
  "You do not need to feel ready. You need to move.",
  "The gap between who you are and who you want to be is closed by action, not intention.",
  "Every day you don't execute, your future self pays the price.",
  "The top 1% don't feel better than you. They execute anyway.",
  "Compound interest works in both directions. Every lost day is a debt.",
  "You are not tired of working. You are tired of not becoming.",
]

export function RecoveryModeScreen() {
  const { userName, setScreen, futureIdentity } = useForgeStore()
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set())
  const [cause, setCause] = useState("")
  const [currentTruth] = useState(() =>
    EMERGENCY_TRUTHS[Math.floor(Math.random() * EMERGENCY_TRUTHS.length)]
  )

  const toggleStep = (step: string) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev)
      if (next.has(step)) next.delete(step)
      else next.add(step)
      return next
    })
  }

  const allComplete = completedSteps.size >= RESET_PROTOCOL.length

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header — red tint for urgency */}
      <div className="bg-rose-500/5 border border-rose-500/20 rounded-sm p-6">
        <div className="flex items-center gap-3 mb-3">
          <RefreshCw className="w-5 h-5 text-rose-400" />
          <p className="text-xs font-mono text-rose-400 uppercase tracking-[0.2em]">Recovery Mode — ACTIVATED</p>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">Reset Protocol</h1>
        <p className="text-muted-foreground mt-2">
          {userName}, momentum is broken. That is allowed. What is not allowed is staying broken.
          Execute this protocol now.
        </p>
      </div>

      {/* Emergency truth */}
      <div className="bg-[var(--forge-muted)] border border-primary/20 rounded-sm p-5">
        <p className="text-[11px] font-mono text-primary/70 uppercase tracking-widest mb-2">Truth Injection</p>
        <p className="text-lg text-foreground font-semibold leading-relaxed forge-text-glow">
          &ldquo;{currentTruth}&rdquo;
        </p>
      </div>

      {/* Reset steps */}
      <div className="space-y-3">
        {RESET_PROTOCOL.map((item) => {
          const done = completedSteps.has(item.step)
          return (
            <div
              key={item.step}
              className={cn(
                "bg-[var(--surface)] border rounded-sm p-5 transition-all",
                done ? "border-primary/30 bg-primary/5" : "border-border"
              )}
            >
              <div className="flex items-start gap-4">
                <button
                  onClick={() => toggleStep(item.step)}
                  className="flex-shrink-0 mt-0.5"
                  aria-label={done ? "Mark incomplete" : "Mark complete"}
                >
                  {done ? (
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-muted-foreground hover:border-primary transition-colors" />
                  )}
                </button>
                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-primary/60">{item.step}</span>
                    <h3 className={cn("font-semibold text-sm", done ? "text-primary" : "text-foreground")}>
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.instruction}</p>
                  <p className={cn(
                    "text-xs font-mono uppercase tracking-wider",
                    done ? "text-primary/60" : "text-muted-foreground/60"
                  )}>
                    → {item.action}
                  </p>

                  {/* Cause input for step 02 */}
                  {item.step === "02" && (
                    <textarea
                      value={cause}
                      onChange={(e) => setCause(e.target.value)}
                      placeholder="The exact cause of my momentum break was..."
                      rows={2}
                      className="w-full mt-2 bg-[var(--surface-raised)] border border-border rounded-sm p-3 text-foreground placeholder:text-muted-foreground/40 resize-none text-sm leading-relaxed focus:outline-none focus:border-primary/50 transition-colors"
                    />
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Completion state */}
      {allComplete && (
        <div className="bg-[var(--forge-muted)] border border-primary/30 rounded-sm p-6 space-y-4">
          <p className="text-primary font-bold text-lg">Protocol complete, {userName}.</p>
          <p className="text-sm text-foreground leading-relaxed">
            You have done the work of resetting. Now build momentum.
            You are becoming{" "}
            <span className="text-primary">{futureIdentity[0] ?? "your future self"}</span>.
            That person does not stay down.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setScreen("command")}
              className="group inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 font-bold text-sm hover:bg-primary/90 transition-all"
            >
              RETURN TO COMMAND CENTER
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={() => setScreen("deepwork")}
              className="inline-flex items-center gap-2 border border-primary/40 text-primary px-5 py-2.5 font-bold text-sm hover:bg-primary/10 transition-all"
            >
              START DEEP WORK SESSION
            </button>
          </div>
        </div>
      )}

      {/* Quick links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {[
          { label: "Identity", screen: "identity" as const },
          { label: "Blueprint", screen: "blueprint" as const },
          { label: "Command", screen: "command" as const },
          { label: "Deep Work", screen: "deepwork" as const },
        ].map((link) => (
          <button
            key={link.label}
            onClick={() => setScreen(link.screen)}
            className="py-2.5 text-sm font-medium text-muted-foreground border border-border hover:border-primary/30 hover:text-primary transition-all rounded-sm"
          >
            {link.label}
          </button>
        ))}
      </div>
    </div>
  )
}
