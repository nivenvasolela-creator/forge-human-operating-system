"use client"

import { useState, useEffect } from "react"
import { useForgeStore } from "@/lib/forge-store"
import { cn } from "@/lib/utils"

export function TodayScreen() {
  const {
    userName,
    tasks,
    dailyMission,
    setDailyMission,
    optimalTaskCount,
    toggleTask,
    setScreen,
  } = useForgeStore()

  const [currentTime, setCurrentTime] = useState(new Date())
  const [missionInput, setMissionInput] = useState(dailyMission)
  const [isEditingMission, setIsEditingMission] = useState(!dailyMission)

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const activeTasks = tasks.filter((t) => !t.done).slice(0, optimalTaskCount)

  const handleMissionSave = () => {
    if (missionInput.trim()) {
      setDailyMission(missionInput.trim())
      setIsEditingMission(false)
    }
  }

  const greeting = () => {
    const h = currentTime.getHours()
    if (h < 12) return "Good Morning"
    if (h < 17) return "Good Afternoon"
    return "Good Evening"
  }

  return (
    <div className="workspace-container">

      {/* 01. Context */}
      <div className="space-y-4">
        <p className="text-sm font-mono text-muted-foreground tracking-widest font-medium uppercase">
          {currentTime.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit', hour12: false })}
        </p>
        <h1 className="title-huge font-light text-muted-foreground">
          {greeting()},<br />
          <span className="text-foreground font-semibold tracking-tight">{userName || "Builder"}</span>.
        </h1>
      </div>

      <hr className="workspace-divider" />

      {/* 02. The Mission */}
      <div className="workspace-section">
        <p className="title-section">Primary Mission</p>
        {isEditingMission ? (
          <div className="space-y-8">
            <textarea
              autoFocus
              value={missionInput}
              onChange={(e) => setMissionInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleMissionSave()}
              placeholder="What is the singular win condition for today?"
              className="w-full bg-transparent text-2xl md:text-3xl text-foreground font-light placeholder:text-muted-foreground/20 outline-none resize-none leading-relaxed focus:text-primary transition-colors"
              rows={2}
            />
            <button
              onClick={handleMissionSave}
              className="text-[10px] font-mono text-primary uppercase tracking-[0.3em] font-bold border-b border-primary/20 pb-1 hover:border-primary transition-all"
            >
              Commit to Mission &rarr;
            </button>
          </div>
        ) : (
          <div className="group cursor-pointer" onClick={() => setIsEditingMission(true)}>
            <p className="text-2xl md:text-3xl text-foreground font-light leading-relaxed group-hover:text-primary transition-all duration-500">
              {dailyMission}
            </p>
          </div>
        )}
      </div>

      <hr className="workspace-divider" />

      {/* 03. Next Actions */}
      <div className="workspace-section">
        <div className="flex items-center justify-between">
          <p className="title-section">Execution Steps</p>
          <p className="text-[10px] font-mono text-muted-foreground/60 uppercase tracking-widest">Max {optimalTaskCount}</p>
        </div>
        <div className="space-y-12">
          {activeTasks.length > 0 ? (
            activeTasks.map((t) => (
              <button
                key={t.id}
                onClick={() => toggleTask(t.id)}
                className="w-full text-left group flex items-start gap-8"
              >
                <div className="w-6 h-6 rounded-full border border-border mt-2 shrink-0 group-hover:border-primary/50 group-hover:bg-primary/5 transition-all duration-300" />
                <span className="text-xl md:text-2xl text-foreground/90 font-light group-hover:text-foreground transition-all duration-300 leading-relaxed">
                  {t.text}
                </span>
              </button>
            ))
          ) : (
            <p className="text-xl text-muted-foreground/60 font-light italic">
              No actions defined. Focus on the mission.
            </p>
          )}
        </div>
      </div>

      <hr className="workspace-divider" />

      {/* 04. Singular Action */}
      <div className="pt-12 flex justify-center">
        <button
          onClick={() => setScreen("focus")}
          className="bg-primary text-primary-foreground px-16 py-6 rounded-full text-xs font-mono uppercase tracking-[0.4em] font-bold shadow-2xl shadow-primary/30 hover:scale-[1.05] active:scale-95 transition-all duration-500"
        >
          Begin Focus
        </button>
      </div>

    </div>
  )
}
