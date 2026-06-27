"use client"

import { useForgeStore } from "@/lib/forge-store"
import { cn } from "@/lib/utils"

export function BetweenView() {
  const { setState, dailyLogs } = useForgeStore()

  const today = new Date().toISOString().split("T")[0]
  const sessions = dailyLogs[today]?.sessions || []

  return (
    <div className="py-24 space-y-24 animate-in fade-in duration-1000">

      <div className="space-y-6">
        <p className="os-label tracking-[0.4em]">Intermission</p>
        <h1 className="os-title">Session Complete.</h1>
        <p className="text-xl text-muted-foreground font-light leading-relaxed">
          The output has been recorded. Breath. Recover.
        </p>
      </div>

      <hr className="border-foreground/5" />

      <div className="space-y-12">
        <p className="os-label">Today&apos;s Trail</p>
        <div className="space-y-12">
          {sessions.map((s, i) => (
            <div key={s.id} className="flex items-start gap-10 opacity-70">
              <span className="text-xs font-mono pt-1.5 text-muted-foreground font-bold">{String(i + 1).padStart(2, '0')}</span>
              <div className="flex-1 space-y-2">
                <p className={cn(
                  "text-2xl font-light",
                  s.outcome === "blocked" ? "text-destructive/60" : "text-foreground"
                )}>{s.goal}</p>
                <div className="flex gap-4">
                  <p className="os-label !text-[8px] opacity-40 uppercase tracking-widest">{s.type}</p>
                  <p className={cn(
                    "os-label !text-[8px] uppercase tracking-widest font-bold",
                    s.outcome === "done" ? "text-primary" : "text-destructive/40"
                  )}>{s.outcome}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-8 pt-12">
        <button
          onClick={() => setState("morning")}
          className="bg-foreground text-background px-16 py-6 rounded-full text-xs font-mono uppercase tracking-[0.4em] font-bold hover:scale-105 active:scale-95 transition-all shadow-xl shadow-foreground/5"
        >
          Next Session
        </button>
        <button
          onClick={() => setState("evening")}
          className="os-label text-muted-foreground/40 hover:text-foreground transition-colors py-6 px-8 tracking-[0.3em]"
        >
          Close the Day
        </button>
      </div>

    </div>
  )
}
