"use client"

import { useState } from "react"
import { useForgeStore } from "@/lib/forge-store"
import { ArrowRight, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

const QUESTIONS = [
  { id: "dream", prompt: "What do you want from life?", placeholder: "Describe your ultimate dream without limits..." },
  { id: "become", prompt: "Who do you want to become?", placeholder: "The person you're building toward. Be specific..." },
  { id: "fear", prompt: "What are you afraid of?", placeholder: "What holds you back? What keeps you up at night?" },
  { id: "admire", prompt: "Who do you admire and why?", placeholder: "Name them. What qualities do they have that you want?" },
  { id: "success", prompt: "What does success look like at 30?", placeholder: "Paint the picture. Where are you? What do you have? Who are you?" },
  { id: "failure", prompt: "What does failure look like?", placeholder: "Describe the version of you that gave up..." },
]

type Step = "welcome" | "dump" | "questions" | "name"

export function OnboardingScreen() {
  const setOnboardingComplete = useForgeStore((s) => s.setOnboardingComplete)
  const [step, setStep] = useState<Step>("welcome")
  const [name, setName] = useState("")
  const [dump, setDump] = useState("")
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [currentAnswer, setCurrentAnswer] = useState("")
  const [animating, setAnimating] = useState(false)

  const advance = (nextStep: Step) => {
    setAnimating(true)
    setTimeout(() => {
      setStep(nextStep)
      setAnimating(false)
    }, 200)
  }

  const handleNextQuestion = () => {
    const q = QUESTIONS[currentQ]
    setAnswers((prev) => ({ ...prev, [q.id]: currentAnswer }))
    setCurrentAnswer("")
    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ((c) => c + 1)
    } else {
      advance("name")
    }
  }

  const handleFinish = () => {
    if (!name.trim()) return
    setOnboardingComplete(name.trim(), dump, answers)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      {/* Subtle grid bg */}
      <div
        className="fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(to right, oklch(0.78 0.16 75) 1px, transparent 1px), linear-gradient(to bottom, oklch(0.78 0.16 75) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div
        className={cn(
          "w-full max-w-2xl transition-all duration-300",
          animating ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
        )}
      >
        {step === "welcome" && (
          <div className="text-center space-y-10">
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center forge-glow">
                  <Zap className="w-8 h-8 text-primary-foreground" strokeWidth={2.5} />
                </div>
              </div>
              <div>
                <p className="text-xs font-mono text-primary tracking-[0.3em] uppercase mb-3">
                  Initializing Human OS
                </p>
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground">
                  FORGE
                </h1>
                <p className="text-muted-foreground mt-3 text-lg leading-relaxed max-w-md mx-auto">
                  Your life, engineered into a relentless system.
                  <br />
                  Most people have dreams. Few have a machine to reach them.
                </p>
              </div>
            </div>

            <div className="space-y-3 text-sm text-muted-foreground max-w-sm mx-auto">
              <p className="font-mono text-[11px] uppercase tracking-widest text-primary/60">
                What FORGE does
              </p>
              {[
                "Extracts your identity from your ambitions",
                "Converts dreams into a life blueprint",
                "Builds your daily operating system",
                "Tracks your compounding growth over years",
              ].map((line) => (
                <div key={line} className="flex items-center gap-2 text-left">
                  <span className="w-1 h-1 rounded-full bg-primary flex-shrink-0" />
                  <span>{line}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => advance("dump")}
              className="group inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 font-bold text-base hover:bg-primary/90 transition-all duration-150 tracking-wide forge-glow"
            >
              BEGIN INITIALIZATION
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <p className="text-xs text-muted-foreground/50 font-mono">
              NO FILTERS. NO JUDGMENT. JUST YOU AND YOUR FUTURE.
            </p>
          </div>
        )}

        {step === "dump" && (
          <div className="space-y-8">
            <div className="space-y-2">
              <p className="text-xs font-mono text-primary tracking-[0.2em] uppercase">
                Layer 1 — Mind Dump
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground text-balance">
                Tell me everything.
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Your dreams. Your fears. What burns inside you. What frustrates you.
                What you want to build, become, and leave behind.
                <br />
                <span className="text-primary/80">No filters. No structure. Just unload your mind completely.</span>
              </p>
            </div>

            <textarea
              value={dump}
              onChange={(e) => setDump(e.target.value)}
              placeholder="I want to... I dream about... I'm afraid of... I admire... I will become..."
              className="w-full h-64 bg-[var(--surface)] border border-border rounded-sm p-5 text-foreground placeholder:text-muted-foreground/50 resize-none font-sans text-[15px] leading-relaxed focus:outline-none focus:border-primary/50 transition-colors"
              autoFocus
            />

            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground/50 font-mono">
                {dump.length} characters
              </p>
              <button
                onClick={() => dump.trim() && advance("questions")}
                disabled={!dump.trim()}
                className="group inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 font-bold text-sm hover:bg-primary/90 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                CONTINUE
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        )}

        {step === "questions" && (
          <div className="space-y-8">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-mono text-primary tracking-[0.2em] uppercase">
                  Question {currentQ + 1} / {QUESTIONS.length}
                </p>
                <div className="flex gap-1">
                  {QUESTIONS.map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        "h-0.5 w-8 rounded-full transition-all",
                        i < currentQ ? "bg-primary" : i === currentQ ? "bg-primary/60" : "bg-border"
                      )}
                    />
                  ))}
                </div>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground text-balance">
                {QUESTIONS[currentQ].prompt}
              </h2>
            </div>

            <textarea
              key={currentQ}
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              placeholder={QUESTIONS[currentQ].placeholder}
              className="w-full h-48 bg-[var(--surface)] border border-border rounded-sm p-5 text-foreground placeholder:text-muted-foreground/50 resize-none font-sans text-[15px] leading-relaxed focus:outline-none focus:border-primary/50 transition-colors"
              autoFocus
            />

            <div className="flex items-center justify-between">
              <button
                onClick={() => currentQ > 0 && setCurrentQ((c) => c - 1)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors font-mono"
              >
                {currentQ > 0 ? "BACK" : ""}
              </button>
              <button
                onClick={handleNextQuestion}
                className="group inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 font-bold text-sm hover:bg-primary/90 transition-all"
              >
                {currentQ === QUESTIONS.length - 1 ? "COMPLETE" : "NEXT"}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        )}

        {step === "name" && (
          <div className="space-y-8">
            <div className="space-y-2">
              <p className="text-xs font-mono text-primary tracking-[0.2em] uppercase">
                Final Step
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                What do they call you, Operative?
              </h2>
              <p className="text-muted-foreground">
                This is who you are becoming. Own the name.
              </p>
            </div>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && name.trim() && handleFinish()}
              placeholder="Your name..."
              className="w-full bg-[var(--surface)] border border-border rounded-sm px-5 py-4 text-foreground placeholder:text-muted-foreground/50 font-sans text-xl focus:outline-none focus:border-primary/50 transition-colors"
              autoFocus
            />

            <button
              onClick={handleFinish}
              disabled={!name.trim()}
              className="group w-full inline-flex items-center justify-center gap-3 bg-primary text-primary-foreground py-4 font-bold text-base hover:bg-primary/90 transition-all disabled:opacity-30 disabled:cursor-not-allowed forge-glow"
            >
              INITIALIZE MY OPERATING SYSTEM
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
