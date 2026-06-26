"use client"

import { useForgeStore } from "@/lib/forge-store"
import { cn } from "@/lib/utils"

export function MetricsScreen() {
  const {
    streakDays,
    totalDeepWorkHours,
    reflections,
    tasks,
    milestones,
    patterns,
    setScreen,
  } = useForgeStore()

  const completedTasks = tasks.filter((t) => t.done).length
  const totalTasks = tasks.length

  const optimalHours = patterns.find(p => p.type === 'optimal_hours')?.data || []
  const taskRate = patterns.find(p => p.type === 'task_completion_rate')?.data?.rate || 0
  const dwConsistency = patterns.find(p => p.type === 'deep_work_consistency')?.data?.rate || 0

  return (
    <div className="max-w-xl mx-auto py-12 md:py-24 px-8 md:px-0 space-y-24 animate-in fade-in duration-700">

      {/* 01. Review Header */}
      <div className="space-y-6">
        <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.3em] font-bold">
          System Review
        </p>
        <h1 className="text-3xl md:text-4xl text-foreground font-medium tracking-tight leading-tight">
          The algorithm is observing.
        </h1>
        <p className="text-lg text-muted-foreground font-light leading-relaxed">
          Patterns emerge from action. Silence reveals the truth of your execution.
        </p>
      </div>

      {/* 02. Core Review Insights (Silence Principle) */}
      <div className="space-y-16">
        <div className="space-y-8">
          <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.3em] font-bold">Execution Insight</p>
          <div className="space-y-12">
            <div className="space-y-4">
              <p className="text-2xl md:text-3xl font-light text-foreground/90 leading-tight">
                You have maintained a <span className="text-primary font-medium">{streakDays} day</span> momentum.
              </p>
              <p className="text-lg text-muted-foreground font-light">
                {totalDeepWorkHours.toFixed(1)} hours of deep focus have been forged in total.
              </p>
            </div>

            {patterns.length > 0 ? (
              <div className="space-y-12">
                <InsightItem
                  title="Peak Performance"
                  content={optimalHours.length > 0
                    ? `Your highest completion rates occur between ${Math.min(...optimalHours)}:00 and ${Math.max(...optimalHours) + 1}:00.`
                    : "Calibrating your peak performance window..."
                  }
                />
                <InsightItem
                  title="System Load"
                  content={`Your current task completion rate is ${Math.round(taskRate * 100)}%. The system is adjusting your suggested daily load.`}
                />
                <InsightItem
                  title="Focus Consistency"
                  content={`You reach your deep work targets ${Math.round(dwConsistency * 100)}% of the time.`}
                />
              </div>
            ) : (
              <div className="p-12 border border-dashed border-foreground/5 rounded-[2.5rem] text-center">
                <p className="text-sm font-mono text-muted-foreground/40 uppercase tracking-widest">
                  Observing behavior patterns...
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 03. Subtle Stats */}
      <div className="grid grid-cols-2 gap-y-12 gap-x-8 opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-500">
        <Stat label="Total Reflections" value={reflections.length} />
        <Stat label="Milestones Met" value={milestones.filter(m => m.done).length} />
        <Stat label="Current Streak" value={`${streakDays}d`} />
        <Stat label="Avg. Focus" value={`${(totalDeepWorkHours / (reflections.length || 1)).toFixed(1)}h/d`} />
      </div>

      {/* 04. CTA */}
      <div className="pt-12 flex justify-center">
        <button
          onClick={() => setScreen("today")}
          className="text-[10px] font-mono text-muted-foreground hover:text-foreground uppercase tracking-[0.4em] font-bold transition-colors"
        >
          Return to Workspace &rarr;
        </button>
      </div>

    </div>
  )
}

function InsightItem({ title, content }: { title: string; content: string }) {
  return (
    <div className="space-y-4">
      <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.2em] font-bold opacity-50">{title}</p>
      <p className="text-xl md:text-2xl font-light text-foreground/80 leading-snug">
        {content}
      </p>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">{label}</p>
      <p className="text-2xl font-light text-foreground">{value}</p>
    </div>
  )
}
