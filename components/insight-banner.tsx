"use client"

import { X } from "lucide-react"
import { useForgeStore } from "@/lib/forge-store"

export function InsightBanner() {
  const { insights, dismissInsight } = useForgeStore()

  // Get the first non-dismissed, non-expired insight
  const activeInsight = insights.find((i) => {
    if (i.is_dismissed) return false
    if (i.expires_at && new Date(i.expires_at) < new Date()) return false
    return true
  })

  if (!activeInsight) return null

  return (
    <div className="relative bg-primary/5 border border-primary/20 rounded-2xl px-5 py-4 mb-8 forge-card-shadow animate-in fade-in slide-in-from-top-4 duration-500">
      <button
        onClick={() => dismissInsight(activeInsight.id)}
        className="absolute top-3 right-3 text-primary/40 hover:text-primary transition-colors p-1"
        aria-label="Dismiss insight"
      >
        <X className="w-4 h-4" />
      </button>
      <div className="flex gap-3">
        <div className="shrink-0 w-1.5 h-1.5 rounded-full bg-primary mt-1.5 animate-pulse" />
        <p className="text-sm text-foreground leading-relaxed pr-8 font-medium">
          {activeInsight.insight_text}
        </p>
      </div>
    </div>
  )
}
