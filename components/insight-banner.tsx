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
    <div className="relative bg-card border border-border rounded-lg px-4 py-3 mb-8">
      <button
        onClick={() => dismissInsight(activeInsight.id)}
        className="absolute top-2 right-2 text-muted-foreground/40 hover:text-muted-foreground transition-colors"
        aria-label="Dismiss insight"
      >
        <X className="w-3.5 h-3.5" />
      </button>
      <p className="text-sm text-foreground leading-relaxed pr-6">
        {activeInsight.insight_text}
      </p>
    </div>
  )
}
