"use client"

import { useForgeStore } from "@/lib/forge-store"

export function MetricsScreen() {
  const { shipRate, metaTaxRatio, dailyLogs } = useForgeStore()

  const totalDays = Object.keys(dailyLogs).length
  const totalSessions = Object.values(dailyLogs).flatMap(l => l.sessions).length

  return (
    <div className="py-24 space-y-24 animate-in fade-in duration-1000">

      <div className="space-y-6">
        <p className="os-label tracking-[0.4em]">Review Engine</p>
        <h1 className="os-title">System Analysis.</h1>
        <p className="text-xl text-muted-foreground font-light leading-relaxed">
          The truth of your execution, visualized without the noise.
        </p>
      </div>

      <hr className="border-foreground/5" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
        <div className="space-y-4">
          <p className="os-label">Execution (30d)</p>
          <p className="text-6xl font-mono tracking-tighter text-primary font-bold">
            {Math.round(shipRate * 100)}%
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The percentage of days where you shipped real output for ALERA.
          </p>
        </div>

        <div className="space-y-4">
          <p className="os-label">Cognitive Tax</p>
          <p className="text-6xl font-mono tracking-tighter text-foreground/80">
            {Math.round(metaTaxRatio * 100)}%
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The ratio of planning and design sessions vs. actual building.
          </p>
        </div>
      </div>

      <hr className="border-foreground/5" />

      <div className="space-y-12">
        <p className="os-label">Execution Volume</p>
        <div className="grid grid-cols-2 gap-12">
          <div className="space-y-2">
            <p className="text-3xl font-light">{totalDays}</p>
            <p className="os-label !text-[8px] opacity-50 uppercase tracking-widest">Days Active</p>
          </div>
          <div className="space-y-2">
            <p className="text-3xl font-light">{totalSessions}</p>
            <p className="os-label !text-[8px] opacity-50 uppercase tracking-widest">Total Sessions</p>
          </div>
        </div>
      </div>

    </div>
  )
}
