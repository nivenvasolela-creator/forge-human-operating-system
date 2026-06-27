"use client"

import { useState } from "react"
import { useForgeStore } from "@/lib/forge-store"
import { ForgeLogo } from "@/components/forge-logo"

export function MorningView() {
  const { userName, mission, startSession } = useForgeStore()
  const [goal, setGoal] = useState("")

  const handleBegin = (type: "building" | "meta") => {
    if (goal.trim()) {
      startSession(goal.trim(), type)
    }
  }

  const hour = new Date().getHours()
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening"

  return (
    <div className="py-24 space-y-24 animate-in fade-in duration-1000">

      {/* 01. Identity & Context */}
      <div className="space-y-6">
        <ForgeLogo className="w-10 h-10 opacity-80" />
        <h1 className="os-title text-muted-foreground font-light">
          {greeting},<br />
          <span className="text-foreground font-semibold tracking-tight">{userName || "Niven"}</span>.
        </h1>
        <p className="os-label tracking-[0.5em] text-primary/60">Today Matters</p>
      </div>

      <hr className="border-foreground/5" />

      {/* 02. The Single Focus: ALERA */}
      <div className="space-y-8">
        <p className="os-label">North Star</p>
        <p className="text-2xl md:text-3xl text-foreground font-light leading-relaxed">
          {mission}
        </p>
      </div>

      <hr className="border-foreground/5" />

      {/* 03. The Decision: One Session */}
      <div className="space-y-12">
        <div className="space-y-6">
          <p className="os-label">Current Session Outcome</p>
          <textarea
            autoFocus
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="What will you ship in the next 90 minutes?"
            className="w-full bg-transparent text-2xl md:text-3xl text-foreground font-light placeholder:text-muted-foreground/10 outline-none resize-none leading-relaxed focus:text-primary transition-colors"
            rows={2}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-8 pt-4">
          <button
            onClick={() => handleBegin("building")}
            disabled={!goal.trim()}
            className="bg-primary text-primary-foreground px-16 py-6 rounded-full text-xs font-mono uppercase tracking-[0.4em] font-bold shadow-2xl shadow-primary/20 hover:scale-[1.05] active:scale-95 disabled:opacity-20 transition-all"
          >
            Begin Building
          </button>
          <button
            onClick={() => handleBegin("meta")}
            disabled={!goal.trim()}
            className="os-label border border-foreground/10 px-10 py-6 rounded-full hover:bg-foreground/5 transition-all text-center tracking-[0.3em]"
          >
            Meta / Strategy
          </button>
        </div>
      </div>

    </div>
  )
}
