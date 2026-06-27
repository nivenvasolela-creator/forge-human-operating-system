"use client"

import { useState, useEffect, useRef } from "react"
import { useForgeStore } from "@/lib/forge-store"
import { X } from "lucide-react"

export function FocusView() {
  const { activeSession, endSession } = useForgeStore()
  const [seconds, setSeconds] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    timerRef.current = setInterval(() => setSeconds(s => s + 1), 1000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [])

  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600)
    const m = Math.floor((secs % 3600) / 60)
    const s = secs % 60
    return h > 0
      ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
      : `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
  }

  if (!activeSession) return null

  return (
    <div className="fixed inset-0 bg-background z-[100] flex flex-col items-center justify-center p-12 animate-in fade-in duration-1000">

      <div className="max-w-xl w-full space-y-32 text-center">

        {/* Session Identity */}
        <div className="space-y-8">
          <p className="os-label text-primary animate-pulse tracking-[0.6em]">Focus Active</p>
          <h2 className="text-2xl md:text-3xl text-foreground font-light leading-relaxed">
            {activeSession.goal}
          </h2>
        </div>

        {/* The Clock */}
        <div className="relative group">
          <div className="absolute inset-0 bg-primary/5 rounded-full blur-3xl" />
          <div className="relative text-[84px] md:text-[120px] font-mono font-extralight tracking-tighter text-foreground tabular-nums">
            {formatTime(seconds)}
          </div>
        </div>

        {/* Action Gap */}
        <div className="flex flex-col sm:flex-row justify-center gap-12 pt-12">
          <button
            onClick={() => endSession("done")}
            className="os-label bg-primary text-primary-foreground px-12 py-5 rounded-full shadow-2xl shadow-primary/20 hover:scale-110 active:scale-95 transition-all"
          >
            Session Done
          </button>
          <button
            onClick={() => endSession("blocked")}
            className="os-label text-muted-foreground/40 hover:text-destructive transition-colors"
          >
            Mark Blocked
          </button>
        </div>

      </div>

      <div className="absolute bottom-16 os-label opacity-10 tracking-[0.8em]">
        Silence the World
      </div>
    </div>
  )
}
