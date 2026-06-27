"use client"

import { useForgeStore } from "@/lib/forge-store"
import { cn } from "@/lib/utils"

export function MetricsScreen() {
  const {
    streakDays,
    totalDeepWorkHours,
    reflections,
    patterns,
  } = useForgeStore()

  const taskRate = patterns.find(p => p.type === 'task_completion_rate')?.data?.rate || 0
  const dwConsistency = patterns.find(p => p.type === 'deep_work_consistency')?.data?.rate || 0
  const optimalHours = patterns.find(p => p.type === 'optimal_hours')?.data || []

  return (
    <div className="workspace-container">

      {/* Review Header */}
      <div className="space-y-6">
        <p className="title-section text-primary">System Review</p>
        <h1 className="title-huge font-light text-foreground">
          The algorithm is observing.
        </h1>
        <p className="text-xl text-muted-foreground font-light leading-relaxed font-medium">
          Patterns emerge from action. Silence reveals the truth of your execution.
        </p>
      </div>

      <hr className="workspace-divider" />

      {/* Primary Insights */}
      <div className="workspace-section">
        <p className="title-section">Execution Insight</p>
        <div className="space-y-24">
          <div className="space-y-4">
            <p className="text-3xl md:text-4xl font-light text-foreground leading-tight">
              You have maintained a <span className="text-primary font-bold">{streakDays} day</span> momentum.
            </p>
            <p className="text-xl text-muted-foreground font-medium">
              {totalDeepWorkHours.toFixed(1)} hours of deep focus have been forged in total.
            </p>
          </div>

          <div className="space-y-16">
            <ReviewItem
              title="Peak Performance"
              content={optimalHours.length > 0
                ? `You consistently work best between ${Math.min(...optimalHours)}:00 and ${Math.max(...optimalHours) + 1}:00.`
                : "The system is still calibrating your peak performance window."
              }
            />
            <ReviewItem
              title="Focus Consistency"
              content={`You reach your deep work targets ${Math.round(dwConsistency * 100)}% of the time. The system adapts to your current capacity.`}
            />
            <ReviewItem
              title="Task Load"
              content={`With a completion rate of ${Math.round(taskRate * 100)}%, your daily system has been adjusted for optimal execution.`}
            />
          </div>
        </div>
      </div>

      <hr className="workspace-divider" />

      {/* Subtle Data */}
      <div className="grid grid-cols-2 gap-y-16">
        <Stat label="Total Reflections" value={reflections.length} />
        <Stat label="Avg. Focus" value={`${(totalDeepWorkHours / (reflections.length || 1)).toFixed(1)}h/d`} />
      </div>

    </div>
  )
}

function ReviewItem({ title, content }: { title: string; content: string }) {
  return (
    <div className="space-y-4 max-w-lg">
      <p className="title-section opacity-50">{title}</p>
      <p className="text-2xl font-light text-foreground/80 leading-relaxed">
        {content}
      </p>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="space-y-2">
      <p className="title-section">{label}</p>
      <p className="text-3xl font-light text-foreground">{value}</p>
    </div>
  )
}
