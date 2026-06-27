"use client"

import { useForgeStore } from "@/lib/forge-store"
import { ForgeLogo } from "@/components/forge-logo"

export function BlueprintScreen() {
  const { mission, userName, dailyLogs } = useForgeStore()

  const allSessions = Object.values(dailyLogs).flatMap(l => l.sessions)
  const buildingCount = allSessions.filter(s => s.type === "building").length
  const metaCount = allSessions.filter(s => s.type === "meta").length

  return (
    <div className="py-24 space-y-24 animate-in fade-in duration-1000">

      <div className="space-y-6">
        <p className="os-label tracking-[0.4em]">Identity Engine</p>
        <h1 className="os-title">System Blueprint.</h1>
        <p className="text-xl text-muted-foreground font-light leading-relaxed">
          The constitution of your mission.
        </p>
      </div>

      <hr className="border-foreground/5" />

      <div className="space-y-16">
        <div className="space-y-4">
          <p className="os-label">North Star</p>
          <p className="text-2xl md:text-3xl text-foreground font-light leading-relaxed">
            {mission}
          </p>
        </div>

        <div className="space-y-4">
          <p className="os-label">Builder</p>
          <p className="text-2xl md:text-3xl text-foreground font-light">
            {userName}
          </p>
        </div>
      </div>

      <hr className="border-foreground/5" />

      <div className="space-y-12">
        <p className="os-label">System Performance</p>
        <div className="grid grid-cols-2 gap-12">
          <div className="space-y-2">
            <p className="text-3xl font-mono tracking-tighter">{buildingCount}</p>
            <p className="os-label !text-[8px] opacity-50 uppercase tracking-widest">Building Sessions</p>
          </div>
          <div className="space-y-2">
            <p className="text-3xl font-mono tracking-tighter">{metaCount}</p>
            <p className="os-label !text-[8px] opacity-50 uppercase tracking-widest">Meta Sessions</p>
          </div>
        </div>
      </div>

      <div className="pt-24 flex justify-center">
        <ForgeLogo className="w-12 h-12 opacity-10" />
      </div>

    </div>
  )
}
