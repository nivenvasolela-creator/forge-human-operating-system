"use client"

import { useForgeStore } from "@/lib/forge-store"

// ─── Arc Gauge ────────────────────────────────────────────────────────────────
function ArcGauge({
  pct,
  label,
  value,
  unit,
  color = "hsl(var(--primary))",
}: {
  pct: number
  label: string
  value: string
  unit: string
  color?: string
}) {
  const W = 200
  const H = 120
  const cx = 100
  const cy = 110
  const r = 90
  const sw = 8

  const startDeg = 200
  const endDeg = 340
  const totalSweep = endDeg - startDeg

  const toRad = (d: number) => (d * Math.PI) / 180
  const pt = (deg: number, radius = r) => ({
    x: cx + radius * Math.cos(toRad(deg)),
    y: cy + radius * Math.sin(toRad(deg)),
  })

  const trackStart = pt(startDeg)
  const trackEnd = pt(endDeg)

  const activeDeg = startDeg + totalSweep * Math.min(pct, 100) / 100
  const activeEnd = pt(activeDeg)
  const largeArc = activeDeg - startDeg > 180 ? 1 : 0
  const needleTip = pt(activeDeg, r - 10)

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="overflow-visible scale-90 md:scale-100">
        <path
          d={`M ${trackStart.x} ${trackStart.y} A ${r} ${r} 0 1 1 ${trackEnd.x} ${trackEnd.y}`}
          fill="none" stroke="hsl(var(--border))" strokeWidth={sw} strokeLinecap="round"
        />
        {[0, 25, 50, 75, 100].map((tick) => {
          const d = startDeg + totalSweep * tick / 100
          const inner = pt(d, r - sw - 3)
          const outer = pt(d, r + 4)
          return (
            <line key={tick} x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y}
              stroke="hsl(var(--muted-foreground) / 0.25)" strokeWidth={1.5} strokeLinecap="round" />
          )
        })}
        {pct > 0 && (
          <path
            d={`M ${trackStart.x} ${trackStart.y} A ${r} ${r} 0 ${largeArc} 1 ${activeEnd.x} ${activeEnd.y}`}
            fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round"
            style={{ transition: "all 0.7s cubic-bezier(0.4,0,0.2,1)" }}
          />
        )}
        <line x1={cx} y1={cy} x2={needleTip.x} y2={needleTip.y}
          stroke={color} strokeWidth={1.5} strokeLinecap="round"
          style={{ transition: "all 0.7s cubic-bezier(0.4,0,0.2,1)" }} />
        <circle cx={cx} cy={cy} r={3.5} fill={color} />
        <text x={cx} y={cy - 14} textAnchor="middle" fill="hsl(var(--muted-foreground) / 0.5)" fontSize="10" fontFamily="monospace">
          {Math.round(pct)}%
        </text>
      </svg>
      <div className="text-center -mt-2 space-y-0.5">
        <p className="text-lg md:text-xl font-semibold text-foreground leading-none tabular-nums">{value}</p>
        <p className="text-[9px] md:text-[11px] font-mono text-muted-foreground/60 uppercase tracking-wider">{unit}</p>
      </div>
      <p className="text-[10px] md:text-xs font-mono text-muted-foreground uppercase tracking-[0.15em] mt-1">{label}</p>
    </div>
  )
}

// ─── Bar Metric ───────────────────────────────────────────────────────────────
function BarMetric({ label, value, pct, note }: { label: string; value: string; pct: number; note?: string }) {
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between">
        <p className="text-[10px] md:text-xs font-mono text-muted-foreground uppercase tracking-[0.15em]">{label}</p>
        <p className="text-xs md:text-sm font-semibold text-foreground tabular-nums">{value}</p>
      </div>
      <div className="h-px bg-border w-full overflow-hidden">
        <div className="h-full bg-primary transition-all duration-700" style={{ width: `${Math.min(pct, 100)}%` }} />
      </div>
      {note && <p className="text-[10px] md:text-[11px] text-muted-foreground/50">{note}</p>}
    </div>
  )
}

// ─── Score Arc ────────────────────────────────────────────────────────────────
function ScoreArc({ score }: { score: number }) {
  const W = 320, H = 180, cx = 160, cy = 165, r = 130, sw = 12
  const startDeg = 200, endDeg = 340, totalSweep = endDeg - startDeg
  const toRad = (d: number) => (d * Math.PI) / 180
  const pt = (deg: number, radius = r) => ({ x: cx + radius * Math.cos(toRad(deg)), y: cy + radius * Math.sin(toRad(deg)) })

  const trackStart = pt(startDeg), trackEnd = pt(endDeg)
  const zone30 = pt(startDeg + totalSweep * 0.30), zone60 = pt(startDeg + totalSweep * 0.60)
  const activeDeg = startDeg + totalSweep * Math.min(score, 100) / 100
  const activeEnd = pt(activeDeg), largeArc = activeDeg - startDeg > 180 ? 1 : 0
  const needleTip = pt(activeDeg, r - 14)
  const arcColor = score < 30 ? "#ef4444" : score < 60 ? "#f59e0b" : "hsl(var(--primary))"
  const grade = score >= 90 ? "S" : score >= 75 ? "A" : score >= 60 ? "B" : score >= 40 ? "C" : "D"

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="overflow-visible scale-75 md:scale-100">
        <path d={`M ${trackStart.x} ${trackStart.y} A ${r} ${r} 0 1 1 ${trackEnd.x} ${trackEnd.y}`} fill="none" stroke="hsl(var(--border))" strokeWidth={sw} strokeLinecap="round" />
        <path d={`M ${trackStart.x} ${trackStart.y} A ${r} ${r} 0 0 1 ${zone30.x} ${zone30.y}`} fill="none" stroke="#ef4444" strokeWidth={sw} opacity={0.15} />
        <path d={`M ${zone30.x} ${zone30.y} A ${r} ${r} 0 0 1 ${zone60.x} ${zone60.y}`} fill="none" stroke="#f59e0b" strokeWidth={sw} opacity={0.15} />
        <path d={`M ${zone60.x} ${zone60.y} A ${r} ${r} 0 0 1 ${trackEnd.x} ${trackEnd.y}`} fill="none" stroke="hsl(var(--primary))" strokeWidth={sw} opacity={0.15} />
        {[0, 25, 50, 75, 100].map((tick) => {
          const d = startDeg + totalSweep * tick / 100
          return <line key={tick} x1={pt(d, r - sw - 4).x} y1={pt(d, r - sw - 4).y} x2={pt(d, r + 5).x} y2={pt(d, r + 5).y} stroke="hsl(var(--muted-foreground) / 0.3)" strokeWidth={2} strokeLinecap="round" />
        })}
        {score > 0 && <path d={`M ${trackStart.x} ${trackStart.y} A ${r} ${r} 0 ${largeArc} 1 ${activeEnd.x} ${activeEnd.y}`} fill="none" stroke={arcColor} strokeWidth={sw} strokeLinecap="round" style={{ transition: "all 0.9s cubic-bezier(0.4,0,0.2,1)" }} />}
        <line x1={cx} y1={cy} x2={needleTip.x} y2={needleTip.y} stroke={arcColor} strokeWidth={2.5} strokeLinecap="round" style={{ transition: "all 0.9s cubic-bezier(0.4,0,0.2,1)" }} />
        <circle cx={cx} cy={cy} r={5} fill={arcColor} />
        <text x={cx} y={cy - 20} textAnchor="middle" fill="hsl(var(--muted-foreground) / 0.45)" fontSize="11" fontFamily="monospace">{Math.round(score)}%</text>
      </svg>
      <div className="text-center -mt-8 md:-mt-4">
        <div className="flex items-end justify-center gap-2">
          <p className="text-4xl md:text-5xl font-semibold tabular-nums leading-none" style={{ color: arcColor }}>{Math.round(score)}</p>
          <span className="text-xl md:text-2xl font-semibold mb-0.5" style={{ color: arcColor }}>{grade}</span>
        </div>
        <p className="text-[10px] font-mono text-muted-foreground/60 uppercase tracking-[0.2em] mt-2">System Score</p>
      </div>
    </div>
  )
}

function PatternMetric({ label, value, description }: { label: string; value: string; description: string }) {
  return (
    <div className="space-y-0.5">
      <p className="text-[9px] md:text-[10px] font-mono text-muted-foreground uppercase tracking-wider">{label}</p>
      <p className="text-base md:text-lg font-semibold text-foreground leading-tight">{value}</p>
      <p className="text-[10px] md:text-[11px] text-muted-foreground/50 leading-relaxed">{description}</p>
    </div>
  )
}

export function MetricsScreen() {
  const {
    streakDays, totalDeepWorkHours, reflections, tasks, milestones, deepWorkMinutes, deepWorkGoal, destination, patterns, setScreen,
  } = useForgeStore()

  const completedTasks = tasks.filter((t) => t.done).length
  const totalTasks = tasks.length
  const doneMilestones = milestones.filter((m) => m.done).length

  const optimalHours = patterns.find(p => p.type === 'optimal_hours')?.data || []
  const blockers = patterns.find(p => p.type === 'common_blockers')?.data?.blockers || []
  const signals = patterns.find(p => p.type === 'success_signals')?.data?.signals || []
  const taskRate = patterns.find(p => p.type === 'task_completion_rate')?.data?.rate || 0
  const dwConsistency = patterns.find(p => p.type === 'deep_work_consistency')?.data?.rate || 0

  const streakPct = Math.min((streakDays / 30) * 100, 100)
  const deepWorkTodayPct = deepWorkGoal > 0 ? Math.min((deepWorkMinutes / deepWorkGoal) * 100, 100) : 0
  const deepWorkTotalPct = Math.min((totalDeepWorkHours / 100) * 100, 100)
  const taskPct = totalTasks > 0 ? Math.min((completedTasks / totalTasks) * 100, 100) : 0
  const milestonePct = milestones.length > 0 ? Math.min((doneMilestones / milestones.length) * 100, 100) : 0
  const reflectionPct = Math.min((reflections.length / 14) * 100, 100)
  const blueprintPct = destination ? 100 : 0

  const weights = [
    { score: streakPct, w: 0.20 },
    { score: deepWorkTodayPct, w: 0.20 },
    { score: deepWorkTotalPct, w: 0.15 },
    { score: taskPct, w: 0.15 },
    { score: milestonePct, w: 0.15 },
    { score: reflectionPct, w: 0.10 },
    { score: blueprintPct, w: 0.05 },
  ]
  const overall = weights.reduce((acc, { score, w }) => acc + score * w, 0)

  return (
    <div className="max-w-2xl mx-auto py-6 md:py-12 px-6 space-y-12 md:space-y-16">
      <div className="space-y-1 text-center md:text-left">
        <p className="text-[10px] md:text-xs font-mono text-muted-foreground uppercase tracking-[0.2em]">Metrics</p>
        <h1 className="text-xl md:text-2xl font-semibold text-foreground">Your system, measured.</h1>
        <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">Every number here is earned. No vanity metrics.</p>
      </div>

      <div className="flex justify-center"><ScoreArc score={overall} /></div>

      <div className="h-px bg-border" />

      {patterns.length > 0 && (
        <div className="space-y-8 md:space-y-10">
          <div className="text-center md:text-left">
            <p className="text-[10px] md:text-xs font-mono text-muted-foreground uppercase tracking-[0.2em] mb-1">Behavior Patterns</p>
            <p className="text-[10px] md:text-[11px] text-muted-foreground/50 italic">Learned from your actions over the last 14 days.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
            <div className="space-y-4">
              <PatternMetric label="Peak Focus Hours" value={optimalHours.length > 0 ? `${Math.min(...optimalHours)}:00 - ${Math.max(...optimalHours) + 1}:00` : "Detecting..."} description="When your task completion rate is highest." />
              <PatternMetric label="Task Completion Rate" value={`${Math.round(taskRate * 100)}%`} description="How often you finish what you start." />
            </div>
            <div className="space-y-4">
              <PatternMetric label="Deep Work Consistency" value={`${Math.round(dwConsistency * 100)}%`} description="Frequency of reaching your daily goal." />
              <div className="space-y-1.5">
                <p className="text-[9px] md:text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Top Blockers</p>
                <div className="flex flex-wrap gap-2">
                  {blockers.length > 0 ? blockers.map((b: string) => <span key={b} className="text-[9px] md:text-[11px] font-mono bg-destructive/10 text-destructive/80 px-2 py-0.5 rounded border border-destructive/20 capitalize">{b}</span>) : <span className="text-[10px] font-mono text-muted-foreground/30 italic">Observing...</span>}
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-3 text-center md:text-left">
            <p className="text-[9px] md:text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Success Signals</p>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              {signals.length > 0 ? signals.map((s: string) => <span key={s} className="text-[9px] md:text-[11px] font-mono bg-primary/10 text-primary/80 px-2 py-0.5 rounded border border-primary/20 capitalize">{s}</span>) : <span className="text-[10px] font-mono text-muted-foreground/30 italic">Learning...</span>}
            </div>
          </div>
        </div>
      )}

      <div className="h-px bg-border" />
      <div>
        <p className="text-[10px] md:text-xs font-mono text-muted-foreground uppercase tracking-[0.2em] mb-8 text-center md:text-left">Dimensions</p>
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3">
          <ArcGauge pct={streakPct} label="Streak" value={String(streakDays)} unit="days" />
          <ArcGauge pct={deepWorkTodayPct} label="Deep Work Today" value={`${(deepWorkMinutes / 60).toFixed(1)}h`} unit={`of ${(deepWorkGoal / 60).toFixed(0)}h goal`} />
          <ArcGauge pct={deepWorkTotalPct} label="Total Volume" value={`${totalDeepWorkHours.toFixed(1)}h`} unit="of 100h" />
          <ArcGauge pct={taskPct} label="Tasks Done" value={`${completedTasks}/${totalTasks}`} unit="today" />
          <ArcGauge pct={milestonePct} label="Milestones" value={`${doneMilestones}/${milestones.length}`} unit="complete" />
          <ArcGauge pct={reflectionPct} label="Reflection" value={String(reflections.length)} unit="of 14 days" />
        </div>
      </div>

      <div className="h-px bg-border" />
      <div className="space-y-6">
        <p className="text-[10px] md:text-xs font-mono text-muted-foreground uppercase tracking-[0.2em] text-center md:text-left">Breakdown</p>
        <div className="space-y-5">
          <BarMetric label="Consistency (streak)" value={`${streakDays} days`} pct={streakPct} note="30-day streak = 100%. The single most powerful signal." />
          <BarMetric label="Daily execution (deep work)" value={`${(deepWorkMinutes / 60).toFixed(1)}h / ${(deepWorkGoal / 60).toFixed(0)}h`} pct={deepWorkTodayPct} note="Did you protect your deep work today?" />
          <BarMetric label="Volume (lifetime deep work)" value={`${totalDeepWorkHours.toFixed(1)}h`} pct={deepWorkTotalPct} note="100 hours of focused output is the first inflection point." />
          <BarMetric label="Daily tasks" value={`${completedTasks} of ${totalTasks}`} pct={taskPct} note="Did the 3 things that mattered get done?" />
          <BarMetric label="Roadmap progress" value={`${doneMilestones} of ${milestones.length} milestones`} pct={milestonePct} note="Long-game execution. Each milestone is a step change." />
          <BarMetric label="Reflection habit" value={`${reflections.length} entries`} pct={reflectionPct} note="14 reflections = full calibration. You grow by reviewing." />
        </div>
      </div>

      <div className="pt-2 border-t border-border flex flex-col md:flex-row gap-4 md:gap-6 items-center">
        <button onClick={() => setScreen("today")} className="text-sm font-mono text-primary hover:text-foreground transition-colors">Back to today &rarr;</button>
        <button onClick={() => setScreen("reflection")} className="text-sm font-mono text-muted-foreground hover:text-foreground transition-colors">Reflect &rarr;</button>
      </div>
    </div>
  )
}
