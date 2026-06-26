"use client"

import { useState, useEffect } from "react"
import { useForgeStore } from "@/lib/forge-store"
import { cn } from "@/lib/utils"
import { Target, Book, Code, Dumbbell, ChevronRight, TrendingUp, Sun, Play } from "lucide-react"
import { ForgeLogo } from "@/components/forge-logo"

export function TodayScreen() {
  const {
    userName,
    tasks,
    destination,
    optimalTaskCount,
    toggleTask,
    insights,
    patterns,
  } = useForgeStore()

  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const greeting = () => {
    const h = currentTime.getHours()
    if (h < 12) return "Good Morning"
    if (h < 17) return "Good Afternoon"
    return "Good Evening"
  }

  // Find the most relevant insight
  const activeInsight = insights.find(i => !i.is_dismissed) || {
    insight_text: "You consistently perform your best between 07:00 and 10:00.",
    category: "Your most productive hours"
  }

  return (
    <div className="max-w-xl mx-auto pt-6 pb-32 px-6 space-y-8 animate-in fade-in duration-700">

      {/* Top Header */}
      <div className="flex items-center justify-between">
        <ForgeLogo className="w-8 h-8 opacity-90" />
        <button className="p-2 rounded-full hover:bg-foreground/5 transition-colors">
          <Sun className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {/* Greeting */}
      <div className="space-y-1">
        <h1 className="text-[32px] leading-tight text-muted-foreground font-medium">
          {greeting()},<br />
          <span className="text-foreground font-bold">{userName || "Niven"}<span className="text-primary">.</span></span>
        </h1>
        <p className="text-sm text-muted-foreground/60 font-medium">
          Discipline today. Freedom tomorrow.
        </p>
      </div>

      {/* Mission Section */}
      <div className="space-y-3">
        <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.2em] font-bold">
          Your Mission
        </p>
        <div className="bg-card p-5 rounded-3xl border border-border/40 shadow-sm flex items-center gap-4 group cursor-pointer hover:border-primary/20 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center shrink-0">
            <Target className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-bold text-foreground truncate">
              {destination || "Become an AI Founder"}<span className="text-primary">.</span>
            </h2>
            <p className="text-[11px] text-muted-foreground font-medium line-clamp-1">
              Build valuable. Solve hard problems. Create freedom.
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary transition-colors" />
        </div>
      </div>

      {/* Today Section */}
      <div className="space-y-3">
        <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.2em] font-bold">
          Today
        </p>
        <div className="bg-card rounded-[2.5rem] border border-border/40 shadow-sm overflow-hidden">
          <div className="divide-y divide-border/20">
            {tasks.length > 0 ? (
              tasks.slice(0, 3).map((t, i) => (
                <div key={t.id} onClick={() => toggleTask(t.id)} className="p-4 flex items-center gap-4 group cursor-pointer hover:bg-muted/5 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-foreground/[0.03] flex items-center justify-center shrink-0">
                    {i === 0 ? <Book className="w-5 h-5 text-muted-foreground/60" /> :
                     i === 1 ? <Code className="w-5 h-5 text-muted-foreground/60" /> :
                     <Dumbbell className="w-5 h-5 text-muted-foreground/60" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <div className={cn("w-1.5 h-1.5 rounded-full", t.done ? "bg-muted-foreground/20" : "bg-primary")} />
                      <h3 className={cn("text-[13px] font-bold truncate", t.done ? "text-muted-foreground line-through" : "text-foreground")}>
                        {t.text}
                      </h3>
                    </div>
                    <p className="text-[10px] text-muted-foreground font-medium ml-3.5">
                      {i === 0 ? "Strategic Work" : i === 1 ? "Technical Debt" : "Health & Vitality"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono text-muted-foreground/30">
                      {i === 0 ? "07:00 - 09:00" : i === 1 ? "09:30 - 12:30" : "18:00 - 18:45"}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/20" />
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <p className="text-xs font-mono text-muted-foreground/40 uppercase tracking-widest">No tasks defined for today</p>
              </div>
            )}
          </div>

          <div className="p-4 bg-muted/5">
            <button className="w-full bg-primary text-white p-4 rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                <Play className="w-3 h-3 fill-current ml-0.5" />
              </div>
              <span className="text-xs font-bold uppercase tracking-[0.15em]">Begin Focus Session</span>
            </button>
            <p className="text-[9px] text-muted-foreground/40 font-mono text-center mt-3 uppercase tracking-widest">
              Eliminate distractions. Build the future.
            </p>
          </div>
        </div>
      </div>

      {/* Insight Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.2em] font-bold">
            Insight
          </p>
          <span className="text-[9px] font-mono text-muted-foreground/30 uppercase tracking-widest">
            Updated {currentTime.getHours()}:00
          </span>
        </div>
        <div className="bg-card p-5 rounded-3xl border border-border/40 shadow-sm flex items-center gap-4 group cursor-pointer hover:border-primary/20 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-foreground flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6 text-background" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-[13px] font-bold text-foreground">
              {activeInsight.category || "Behavior Pattern"}
            </h2>
            <p className="text-[11px] text-muted-foreground font-medium line-clamp-2">
              {activeInsight.insight_text}
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground/40" />
        </div>
      </div>

    </div>
  )
}
