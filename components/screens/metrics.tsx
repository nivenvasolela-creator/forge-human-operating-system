"use client"

import { useForgeStore } from "@/lib/forge-store"

// ─── Arc Gauge ────────────────────────────────────────────────────────────────
// Draws a 200° arc speedometer (100° left of centre → 100° right).
// pct: 0–100. Uses a fixed 200×120 viewBox so arcs are never clipped.
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
  // Fixed coordinate space: 200 wide, 120 tall
  // Center of circle sits at (100, 110) so only the top portion is visible
  const W = 200
  const H = 120
  const cx = 100
  const cy = 110   // pivot is near the bottom of the SVG
  const r = 90
  const sw = 8

  // Arc from 200° to 340° (200° sweep, centred on 270° / top)
  const startDeg = 200
  const endDeg = 340
  const totalSweep = endDeg - startDeg  // 140°

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

  const needleDeg = activeDeg
  const needleTip = pt(needleDeg, r - 10)

  return (
    <div className="flex flex-col items-center gap-1">
      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        aria-label={`${label}: ${value} ${unit}`}
        className="overflow-visible"
      >
        {/* Track */}
        <path
          d={`M ${trackStart.x} ${trackStart.y} A ${r} ${r} 0 1 1 ${trackEnd.x} ${trackEnd.y}`}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth={sw}
          strokeLinecap="round"
        />
        {/* Tick marks at 0/25/50/75/100 */}
        {[0, 25, 50, 75, 100].map((tick) => {
          const d = startDeg + totalSweep * tick / 100
          const inner = pt(d, r - sw - 3)
          const outer = pt(d, r + 4)
          return (
            <line key={tick}
              x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y}
              stroke="hsl(var(--muted-foreground) / 0.25)"
              strokeWidth={1.5}
              strokeLinecap="round"
            />
          )
        })}
        {/* Fill arc */}
        {pct > 0 && (
          <path
            d={`M ${trackStart.x} ${trackStart.y} A ${r} ${r} 0 ${largeArc} 1 ${activeEnd.x} ${activeEnd.y}`}
            fill="none"
            stroke={color}
            strokeWidth={sw}
            strokeLinecap="round"
            style={{ transition: "all 0.7s cubic-bezier(0.4,0,0.2,1)" }}
          />
        )}
        {/* Needle */}
        <line
          x1={cx} y1={cy}
          x2={needleTip.x} y2={needleTip.y}
          stroke={color}
          strokeWidth={1.5}
          strokeLinecap="round"
          style={{ transition: "all 0.7s cubic-bezier(0.4,0,0.2,1)" }}
        />
        {/* Pivot dot */}
        <circle cx={cx} cy={cy} r={3.5} fill={color} />
        {/* Percent text centered */}
        <text
          x={cx} y={cy - 14}
          textAnchor="middle"
          fill="hsl(var(--muted-foreground) / 0.5)"
          fontSize="10"
          fontFamily="monospace"
        >
          {Math.round(pct)}%
        </text>
      </svg>

      {/* Value + unit + label */}
      <div className="text-center -mt-2 space-y-0.5">
        <p className="text-xl font-semibold text-foreground leading-none tabular-nums">{value}</p>
        <p className="text-[11px] font-mono text-muted-foreground/60 uppercase tracking-wider">{unit}</p>
      </div>
      <p className="text-xs font-mono text-muted-foreground uppercase tracking-[0.15em] mt-1">{label}</p>
    </div>
  )
}

// ─── Bar Metric ───────────────────────────────────────────────────────────────
function BarMetric({
  label,
  value,
  pct,
  note,
}: {
  label: string
  value: string
  pct: number
  note?: string
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between">
        <p className="text-xs font-mono text-muted-foreground uppercase tracking-[0.15em]">{label}</p>
        <p className="text-sm font-semibold text-foreground tabular-nums">{value}</p>
      </div>
      <div className="h-px bg-border w-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-700"
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
      {note && (
        <p className="text-[11px] text-muted-foreground/50">{note}</p>
      )}
    </div>
  )
}

// ─── Overall Score Arc ─────────────────────────────────────────────────────────
function ScoreArc({ score }: { score: number }) {
  // Fixed coordinate space: 320 wide, 180 tall. Pivot at (160, 165).
  const W = 320
  const H = 180
  const cx = 160
  const cy = 165
  const r = 130
  const sw = 12

  const startDeg = 200
  const endDeg = 340
  const totalSweep = endDeg - startDeg  // 140°

  const toRad = (d: number) => (d * Math.PI) / 180
  const pt = (deg: number, radius = r) => ({
    x: cx + radius * Math.cos(toRad(deg)),
    y: cy + radius * Math.sin(toRad(deg)),
  })

  const trackStart = pt(startDeg)
  const trackEnd = pt(endDeg)

  // Zone boundaries
  const zone30 = pt(startDeg + totalSweep * 0.30)
  const zone60 = pt(startDeg + totalSweep * 0.60)

  const activeDeg = startDeg + totalSweep * Math.min(score, 100) / 100
  const activeEnd = pt(activeDeg)
  const largeArc = activeDeg - startDeg > 180 ? 1 : 0

  const needleTip = pt(activeDeg, r - 14)

  const arcColor =
    score < 30 ? "#ef4444" : score < 60 ? "#f59e0b" : "hsl(var(--primary))"

  const grade =
    score >= 90 ? "S" : score >= 75 ? "A" : score >= 60 ? "B" : score >= 40 ? "C" : "D"

  return (
    <div className="flex flex-col items-center gap-1">
      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        aria-label={`Overall score: ${Math.round(score)}%`}
        className="overflow-visible"
      >
        {/* Track */}
        <path
          d={`M ${trackStart.x} ${trackStart.y} A ${r} ${r} 0 1 1 ${trackEnd.x} ${trackEnd.y}`}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth={sw}
          strokeLinecap="round"
        />
        {/* Zone colour bands (muted) */}
        <path
          d={`M ${trackStart.x} ${trackStart.y} A ${r} ${r} 0 0 1 ${zone30.x} ${zone30.y}`}
          fill="none" stroke="#ef4444" strokeWidth={sw} strokeLinecap="butt" opacity={0.15}
        />
        <path
          d={`M ${zone30.x} ${zone30.y} A ${r} ${r} 0 0 1 ${zone60.x} ${zone60.y}`}
          fill="none" stroke="#f59e0b" strokeWidth={sw} strokeLinecap="butt" opacity={0.15}
        />
        <path
          d={`M ${zone60.x} ${zone60.y} A ${r} ${r} 0 0 1 ${trackEnd.x} ${trackEnd.y}`}
          fill="none" stroke="hsl(var(--primary))" strokeWidth={sw} strokeLinecap="butt" opacity={0.15}
        />
        {/* Tick marks */}
        {[0, 25, 50, 75, 100].map((tick) => {
          const d = startDeg + totalSweep * tick / 100
          const inner = pt(d, r - sw - 4)
          const outer = pt(d, r + 5)
          return (
            <line key={tick}
              x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y}
              stroke="hsl(var(--muted-foreground) / 0.3)"
              strokeWidth={2}
              strokeLinecap="round"
            />
          )
        })}
        {/* Fill arc */}
        {score > 0 && (
          <path
            d={`M ${trackStart.x} ${trackStart.y} A ${r} ${r} 0 ${largeArc} 1 ${activeEnd.x} ${activeEnd.y}`}
            fill="none"
            stroke={arcColor}
            strokeWidth={sw}
            strokeLinecap="round"
            style={{ transition: "all 0.9s cubic-bezier(0.4,0,0.2,1)" }}
          />
        )}
        {/* Needle */}
        <line
          x1={cx} y1={cy} x2={needleTip.x} y2={needleTip.y}
          stroke={arcColor} strokeWidth={2.5} strokeLinecap="round"
          style={{ transition: "all 0.9s cubic-bezier(0.4,0,0.2,1)" }}
        />
        <circle cx={cx} cy={cy} r={5} fill={arcColor} />
        {/* Zone labels */}
        {[
          { label: "0", deg: startDeg },
          { label: "100", deg: endDeg },
        ].map(({ label, deg }) => {
          const p = pt(deg, r + 20)
          return (
            <text key={label} x={p.x} y={p.y}
              textAnchor="middle"
              fill="hsl(var(--muted-foreground) / 0.35)"
              fontSize="10"
              fontFamily="monospace"
            >{label}</text>
          )
        })}
        {/* Score text inside arc */}
        <text
          x={cx} y={cy - 20}
          textAnchor="middle"
          fill="hsl(var(--muted-foreground) / 0.45)"
          fontSize="11"
          fontFamily="monospace"
        >
          {Math.round(score)}%
        </text>
      </svg>

      {/* Big number + grade */}
      <div className="text-center -mt-4">
        <div className="flex items-end justify-center gap-2">
          <p className="text-5xl font-semibold tabular-nums leading-none" style={{ color: arcColor }}>
            {Math.round(score)}
          </p>
          <span className="text-2xl font-semibold mb-0.5" style={{ color: arcColor }}>{grade}</span>
        </div>
        <p className="text-xs font-mono text-muted-foreground/60 uppercase tracking-[0.2em] mt-2">
          System Score
        </p>
      </div>
    </div>
  )
}

// ─── Metrics Screen ────────────────────────────────────────────────────────────
export function MetricsScreen() {
  const {
    streakDays,
    totalDeepWorkHours,
    reflections,
    tasks,
    milestones,
    deepWorkMinutes,
    deepWorkGoal,
    destination,
    setScreen,
  } = useForgeStore()

  const completedTasks = tasks.filter((t) => t.done).length
  const totalTasks = tasks.length
  const doneMilestones = milestones.filter((m) => m.done).length

  // ── Individual scores (0–100 each) ──
  // 1. Streak: 30-day streak = 100
  const streakPct = Math.min((streakDays / 30) * 100, 100)

  // 2. Deep work today: goal = 100
  const deepWorkTodayPct =
    deepWorkGoal > 0
      ? Math.min((deepWorkMinutes / deepWorkGoal) * 100, 100)
      : 0

  // 3. Deep work total: 100h lifetime = 100
  const deepWorkTotalPct = Math.min((totalDeepWorkHours / 100) * 100, 100)

  // 4. Tasks: ratio of done today
  const taskPct = totalTasks > 0 ? Math.min((completedTasks / totalTasks) * 100, 100) : 0

  // 5. Milestones: ratio done
  const milestonePct =
    milestones.length > 0
      ? Math.min((doneMilestones / milestones.length) * 100, 100)
      : 0

  // 6. Reflection consistency: 14 reflections = 100
  const reflectionPct = Math.min((reflections.length / 14) * 100, 100)

  // 7. Blueprint: 33pts each for destination / reality / gap
  const blueprintPct = destination ? 100 : 0

  // ── Overall composite score ──
  const weights = [
    { score: streakPct, w: 0.20 },       // consistency
    { score: deepWorkTodayPct, w: 0.20 }, // daily execution
    { score: deepWorkTotalPct, w: 0.15 }, // volume
    { score: taskPct, w: 0.15 },          // daily tasks
    { score: milestonePct, w: 0.15 },     // roadmap
    { score: reflectionPct, w: 0.10 },    // self-awareness
    { score: blueprintPct, w: 0.05 },     // clarity
  ]
  const overall = weights.reduce((acc, { score, w }) => acc + score * w, 0)

  return (
    <div className="max-w-2xl mx-auto py-12 px-6 space-y-16">

      {/* Header */}
      <div className="space-y-1">
        <p className="text-xs font-mono text-muted-foreground uppercase tracking-[0.2em]">Metrics</p>
        <h1 className="text-2xl font-semibold text-foreground">Your system, measured.</h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Every number here is earned. No vanity metrics.
        </p>
      </div>

      {/* Overall score */}
      <div className="flex justify-center">
        <ScoreArc score={overall} />
      </div>

      {/* Divider */}
      <div className="h-px bg-border" />

      {/* Arc gauges — 2 × 3 grid */}
      <div>
        <p className="text-xs font-mono text-muted-foreground uppercase tracking-[0.2em] mb-8">
          Dimensions
        </p>
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3">
          <ArcGauge
            pct={streakPct}
            label="Streak"
            value={String(streakDays)}
            unit="days"
          />
          <ArcGauge
            pct={deepWorkTodayPct}
            label="Deep Work Today"
            value={`${(deepWorkMinutes / 60).toFixed(1)}h`}
            unit={`of ${(deepWorkGoal / 60).toFixed(0)}h goal`}
          />
          <ArcGauge
            pct={deepWorkTotalPct}
            label="Total Volume"
            value={`${totalDeepWorkHours.toFixed(1)}h`}
            unit="of 100h"
          />
          <ArcGauge
            pct={taskPct}
            label="Tasks Done"
            value={`${completedTasks}/${totalTasks}`}
            unit="today"
          />
          <ArcGauge
            pct={milestonePct}
            label="Milestones"
            value={`${doneMilestones}/${milestones.length}`}
            unit="complete"
          />
          <ArcGauge
            pct={reflectionPct}
            label="Reflection"
            value={String(reflections.length)}
            unit="of 14 days"
          />
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-border" />

      {/* Bar breakdown */}
      <div className="space-y-6">
        <p className="text-xs font-mono text-muted-foreground uppercase tracking-[0.2em]">Breakdown</p>
        <div className="space-y-5">
          <BarMetric
            label="Consistency (streak)"
            value={`${streakDays} days`}
            pct={streakPct}
            note="30-day streak = 100%. The single most powerful signal."
          />
          <BarMetric
            label="Daily execution (deep work)"
            value={`${(deepWorkMinutes / 60).toFixed(1)}h / ${(deepWorkGoal / 60).toFixed(0)}h`}
            pct={deepWorkTodayPct}
            note="Did you protect your deep work today?"
          />
          <BarMetric
            label="Volume (lifetime deep work)"
            value={`${totalDeepWorkHours.toFixed(1)}h`}
            pct={deepWorkTotalPct}
            note="100 hours of focused output is the first inflection point."
          />
          <BarMetric
            label="Daily tasks"
            value={`${completedTasks} of ${totalTasks}`}
            pct={taskPct}
            note="Did the 3 things that mattered get done?"
          />
          <BarMetric
            label="Roadmap progress"
            value={`${doneMilestones} of ${milestones.length} milestones`}
            pct={milestonePct}
            note="Long-game execution. Each milestone is a step change."
          />
          <BarMetric
            label="Reflection habit"
            value={`${reflections.length} entries`}
            pct={reflectionPct}
            note="14 reflections = full calibration. You grow by reviewing."
          />
        </div>
      </div>

      {/* CTA */}
      <div className="pt-2 border-t border-border flex gap-6">
        <button
          onClick={() => setScreen("today")}
          className="text-sm font-mono text-primary hover:text-foreground transition-colors"
        >
          Back to today &rarr;
        </button>
        <button
          onClick={() => setScreen("reflection")}
          className="text-sm font-mono text-muted-foreground hover:text-foreground transition-colors"
        >
          Reflect &rarr;
        </button>
      </div>

    </div>
  )
}
