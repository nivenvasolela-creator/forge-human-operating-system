"use client"

import { useState } from "react"
import { useForgeStore } from "@/lib/forge-store"
import { CheckCircle2, Circle, Plus, Trash2, Target, Zap, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

const PRIORITY_CONFIG = {
  high: { label: "HIGH", color: "text-rose-400 border-rose-400/30 bg-rose-400/10" },
  medium: { label: "MED", color: "text-primary border-primary/30 bg-primary/10" },
  low: { label: "LOW", color: "text-muted-foreground border-border bg-transparent" },
}

export function CommandCenterScreen() {
  const {
    userName,
    dailyMission,
    tasks,
    sessions,
    setDailyMission,
    addTask,
    toggleTask,
    removeTask,
    futureIdentity,
    milestones,
  } = useForgeStore()

  const [newTask, setNewTask] = useState("")
  const [priority, setPriority] = useState<"high" | "medium" | "low">("high")
  const [editingMission, setEditingMission] = useState(!dailyMission)
  const [missionDraft, setMissionDraft] = useState(dailyMission)

  const completedToday = tasks.filter((t) => t.done).length
  const totalTasks = tasks.length
  const todayDeepWork = sessions
    .filter((s) => s.date === new Date().toLocaleDateString())
    .reduce((acc, s) => acc + s.minutes, 0)

  const topPriorityTasks = tasks.filter((t) => t.priority === "high")
  const otherTasks = tasks.filter((t) => t.priority !== "high")

  const now = new Date()
  const hour = now.getHours()
  const greeting = hour < 12 ? "Morning" : hour < 17 ? "Afternoon" : "Evening"

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-mono text-primary tracking-[0.2em] uppercase">Command Center — Layer 5</p>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mt-1">
            {greeting}, {userName}.
          </h1>
          <p className="text-muted-foreground mt-1 font-mono text-sm">
            {now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </p>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">OPERATIVE STATUS</p>
          <p className="text-xs text-primary font-mono mt-1">ONLINE</p>
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse mt-1 ml-auto" />
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Tasks Done", value: `${completedToday}/${totalTasks}`, icon: CheckCircle2, note: "today" },
          { label: "Deep Work", value: `${Math.round(todayDeepWork / 60 * 10) / 10}h`, icon: Clock, note: "today" },
          { label: "Blueprint", value: `${milestones.filter((m) => m.done).length}/${milestones.length}`, icon: Target, note: "milestones" },
        ].map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="bg-[var(--surface)] border border-border rounded-sm p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                <p className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider">{stat.label}</p>
              </div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{stat.note}</p>
            </div>
          )
        })}
      </div>

      {/* Daily Mission */}
      <div className="bg-[var(--surface)] border border-border rounded-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            <p className="font-semibold text-foreground text-sm uppercase tracking-wider">Mission of the Day</p>
          </div>
          {!editingMission && (
            <button
              onClick={() => { setMissionDraft(dailyMission); setEditingMission(true) }}
              className="text-[11px] font-mono text-muted-foreground hover:text-primary uppercase tracking-wider transition-colors"
            >
              Edit
            </button>
          )}
        </div>

        {editingMission ? (
          <div className="space-y-3">
            <textarea
              value={missionDraft}
              onChange={(e) => setMissionDraft(e.target.value)}
              placeholder="What is the single most important thing you must accomplish today to serve your future self?"
              className="w-full h-24 bg-[var(--surface-raised)] border border-border rounded-sm p-4 text-foreground placeholder:text-muted-foreground/50 resize-none text-sm leading-relaxed focus:outline-none focus:border-primary/50 transition-colors"
              autoFocus
            />
            <button
              onClick={() => { setDailyMission(missionDraft); setEditingMission(false) }}
              className="text-xs bg-primary text-primary-foreground px-4 py-2 font-bold hover:bg-primary/90 transition-all"
            >
              SET MISSION
            </button>
          </div>
        ) : (
          <div>
            {dailyMission ? (
              <p className="text-foreground leading-relaxed">{dailyMission}</p>
            ) : (
              <p className="text-muted-foreground/50 italic text-sm">
                No mission set. Click Edit to define your purpose for today.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Task Engine */}
      <div className="bg-[var(--surface)] border border-border rounded-sm p-6 space-y-5">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-foreground text-sm uppercase tracking-wider">Execution Stack</p>
          <p className="text-[11px] font-mono text-muted-foreground">
            {completedToday}/{totalTasks} complete
          </p>
        </div>

        {/* Progress */}
        {totalTasks > 0 && (
          <div className="h-1 bg-[var(--surface-raised)] rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${totalTasks ? (completedToday / totalTasks) * 100 : 0}%` }}
            />
          </div>
        )}

        {/* High priority */}
        {topPriorityTasks.length > 0 && (
          <div className="space-y-2">
            <p className="text-[11px] font-mono text-rose-400/70 uppercase tracking-widest">High Priority</p>
            {topPriorityTasks.map((task) => (
              <TaskRow key={task.id} task={task} onToggle={toggleTask} onRemove={removeTask} />
            ))}
          </div>
        )}

        {/* Other tasks */}
        {otherTasks.length > 0 && (
          <div className="space-y-2">
            {topPriorityTasks.length > 0 && (
              <p className="text-[11px] font-mono text-muted-foreground/70 uppercase tracking-widest">Other Tasks</p>
            )}
            {otherTasks.map((task) => (
              <TaskRow key={task.id} task={task} onToggle={toggleTask} onRemove={removeTask} />
            ))}
          </div>
        )}

        {tasks.length === 0 && (
          <p className="text-sm text-muted-foreground/50 italic text-center py-4">
            No tasks yet. Add your first execution target below.
          </p>
        )}

        {/* Add task */}
        <div className="flex gap-2 pt-2 border-t border-border">
          <input
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && newTask.trim() && (addTask(newTask.trim(), priority), setNewTask(""))}
            placeholder="Add a task..."
            className="flex-1 bg-[var(--surface-raised)] border border-border rounded-sm px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 transition-colors"
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as "high" | "medium" | "low")}
            className="bg-[var(--surface-raised)] border border-border rounded-sm px-2 py-2.5 text-xs text-foreground focus:outline-none focus:border-primary/50"
          >
            <option value="high">High</option>
            <option value="medium">Med</option>
            <option value="low">Low</option>
          </select>
          <button
            onClick={() => newTask.trim() && (addTask(newTask.trim(), priority), setNewTask(""))}
            className="px-3 py-2.5 bg-primary/20 border border-primary/30 hover:bg-primary/30 transition-colors rounded-sm"
            aria-label="Add task"
          >
            <Plus className="w-4 h-4 text-primary" />
          </button>
        </div>
      </div>

      {/* Identity reminder */}
      <div className="bg-[var(--forge-muted)] border border-primary/20 rounded-sm p-4">
        <p className="text-[11px] font-mono text-primary/70 uppercase tracking-widest mb-1">
          The Question
        </p>
        <p className="text-sm text-foreground font-medium">
          Given who you&apos;re becoming —{" "}
          <span className="text-primary">{futureIdentity[0] ?? "your future self"}</span>{" "}
          — what is the highest-leverage action right now?
        </p>
      </div>
    </div>
  )
}

function TaskRow({
  task,
  onToggle,
  onRemove,
}: {
  task: { id: string; text: string; done: boolean; priority: string }
  onToggle: (id: string) => void
  onRemove: (id: string) => void
}) {
  const config = PRIORITY_CONFIG[task.priority as keyof typeof PRIORITY_CONFIG] || PRIORITY_CONFIG.medium
  return (
    <div className={cn(
      "flex items-center gap-3 p-3 rounded-sm border transition-all group",
      task.done
        ? "bg-transparent border-transparent opacity-40"
        : "bg-[var(--surface-raised)] border-border hover:border-primary/20"
    )}>
      <button onClick={() => onToggle(task.id)} className="flex-shrink-0">
        {task.done ? (
          <CheckCircle2 className="w-4 h-4 text-primary" />
        ) : (
          <Circle className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />
        )}
      </button>
      <p className={cn("flex-1 text-sm", task.done && "line-through text-muted-foreground")}>
        {task.text}
      </p>
      <span className={cn("text-[10px] font-mono px-1.5 py-0.5 border rounded-sm flex-shrink-0", config.color)}>
        {config.label}
      </span>
      <button
        onClick={() => onRemove(task.id)}
        className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
        aria-label="Remove task"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}
