"use client"

import { useState } from "react"
import { useForgeStore } from "@/lib/forge-store"
import { cn } from "@/lib/utils"

export function EveningView() {
  const { logShipment, submitReflection, metaTaxRatio, shipRate } = useForgeStore()
  const [shippedStatus, setShippedStatus] = useState<boolean | null>(null)
  const [reflection, setReflection] = useState("")
  const [step, setStep] = useState<"ship" | "reflect">("ship")

  const handleShip = (status: boolean) => {
    logShipment(status)
    setShippedStatus(status)
    setStep("reflect")
  }

  const handleFinish = async () => {
    if (reflection.trim().length > 20) {
      await submitReflection(reflection)
    }
  }

  return (
    <div className="py-24 space-y-24 animate-in fade-in duration-1000">

      <div className="space-y-6 text-center">
        <p className="os-label tracking-[0.4em]">The Mirror</p>
        <h1 className="os-title">Close the day.</h1>
      </div>

      <hr className="border-foreground/5" />

      {step === "ship" ? (
        <div className="space-y-12 text-center">
          <p className="text-xl md:text-2xl font-light text-foreground/80">
            Did you ship something real for <span className="text-primary font-medium tracking-tight">ALERA</span> today?
          </p>
          <div className="flex justify-center gap-12 pt-4">
            <button
              onClick={() => handleShip(true)}
              className="os-label bg-foreground text-background px-12 py-5 rounded-full hover:scale-110 transition-all font-bold"
            >
              Yes. I Shipped.
            </button>
            <button
              onClick={() => handleShip(false)}
              className="os-label text-muted-foreground/40 hover:text-foreground transition-colors"
            >
              No Shipment.
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-24">
          <div className="space-y-8">
            <p className="os-label">Truthful Reflection</p>
            <textarea
              autoFocus
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="What did the system learn today? What blocked the mission?"
              className="w-full bg-transparent text-xl md:text-2xl text-foreground font-light placeholder:text-muted-foreground/10 outline-none resize-none leading-relaxed focus:text-primary transition-colors"
              rows={4}
            />
          </div>

          <div className="flex flex-col items-center gap-16 pt-8">
            <button
              onClick={handleFinish}
              disabled={reflection.trim().length < 20}
              className="bg-primary text-primary-foreground px-16 py-6 rounded-full text-xs font-mono uppercase tracking-[0.4em] font-bold shadow-2xl shadow-primary/20 hover:scale-[1.05] active:scale-95 disabled:opacity-20 transition-all"
            >
              Commit & Rest
            </button>

            <div className="grid grid-cols-2 gap-24 text-center opacity-40">
              <div className="space-y-1">
                <p className="os-label !text-[8px]">Ship Rate</p>
                <p className="text-3xl font-mono tracking-tighter">{Math.round(shipRate * 100)}%</p>
              </div>
              <div className="space-y-1">
                <p className="os-label !text-[8px]">Meta Tax</p>
                <p className="text-3xl font-mono tracking-tighter">{Math.round(metaTaxRatio * 100)}%</p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
