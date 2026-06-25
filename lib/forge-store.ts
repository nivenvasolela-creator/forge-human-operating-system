"use client"

import { create } from "zustand"
import { createClient } from "./supabase/client"

export type Screen = "minddump" | "blueprint" | "today" | "reflection" | "metrics"

export interface Task {
  id: string
  text: string
  done: boolean
  created_at: string
  completed_at: string | null
}

export interface Milestone {
  id: string
  label: string
  timeframe: string
  done: boolean
}

export interface ReflectionEntry {
  id: string
  date: string
  did: string
  blocked: string
  tomorrow: string
}

export interface DeepWorkSession {
  id: string
  session_start: string
  session_end: string | null
  duration_minutes: number | null
  label: string
}

export interface Insight {
  id: string
  insight_text: string
  insight_type: "immediate" | "weekly" | "adjustment"
  category: string
  is_dismissed: boolean
  created_at: string
  expires_at: string | null
}

export interface ForgeState {
  // Onboarding / identity
  onboardingComplete: boolean
  userName: string

  // Mind Dump
  mindDump: string

  // Blueprint
  destination: string
  currentReality: string
  gap: string
  milestones: Milestone[]

  // Today
  tasks: Task[]
  deepWorkMinutes: number
  deepWorkGoal: number

  // Deep work sessions
  deepWorkSessions: DeepWorkSession[]

  // Reflection history
  reflections: ReflectionEntry[]

  // Insights
  insights: Insight[]

  // Metrics
  streakDays: number
  totalDeepWorkHours: number
  completedToday: number

  // Navigation
  currentScreen: Screen

  // Loading state
  isHydrated: boolean
  isSyncing: boolean

  // Actions
  setScreen: (screen: Screen) => void
  completeMindDump: (name: string, dump: string) => Promise<void>
  setMindDump: (dump: string) => void
  setBlueprint: (destination: string, currentReality: string, gap: string) => Promise<void>
  setMilestones: (milestones: Milestone[]) => void
  toggleMilestone: (id: string) => Promise<void>
  setTasks: (tasks: Task[]) => void
  addTask: (text: string) => Promise<void>
  toggleTask: (id: string) => Promise<void>
  removeTask: (id: string) => Promise<void>
  logDeepWork: (minutes: number, label?: string) => Promise<void>
  setDeepWorkGoal: (minutes: number) => Promise<void>
  addReflection: (entry: Omit<ReflectionEntry, "id" | "date">) => Promise<void>
  dismissInsight: (id: string) => Promise<void>
  resetOnboarding: () => void

  // Sync actions
  hydrateFromServer: (userId: string) => Promise<void>
  syncToServer: () => Promise<void>
}

const defaultMilestones: Milestone[] = [
  { id: "1", label: "Identify the one skill that unlocks everything", timeframe: "30 days", done: false },
  { id: "2", label: "Ship a real project to a real audience", timeframe: "90 days", done: false },
  { id: "3", label: "Generate first income from your craft", timeframe: "6 months", done: false },
  { id: "4", label: "Go full-time on your vision", timeframe: "2 years", done: false },
  { id: "5", label: "Reach the top 1% in your field", timeframe: "5 years", done: false },
]

export const useForgeStore = create<ForgeState>()((set, get) => ({
  onboardingComplete: false,
  userName: "",
  mindDump: "",
  destination: "",
  currentReality: "",
  gap: "",
  milestones: defaultMilestones,
  tasks: [],
  deepWorkMinutes: 0,
  deepWorkGoal: 240,
  deepWorkSessions: [],
  reflections: [],
  insights: [],
  streakDays: 0,
  totalDeepWorkHours: 0,
  completedToday: 0,
  currentScreen: "minddump",
  isHydrated: false,
  isSyncing: false,

  setScreen: (screen) => set({ currentScreen: screen }),

  completeMindDump: async (name, dump) => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Update profile
    await supabase.from("profiles").upsert({
      id: user.id,
      name,
      email: user.email,
      mind_dump: dump,
      updated_at: new Date().toISOString(),
    })

    set({
      onboardingComplete: true,
      userName: name,
      mindDump: dump,
      currentScreen: "blueprint",
    })

    // Trigger blueprint generation edge function
    await supabase.functions.invoke("generate-blueprint", {
      body: { user_id: user.id, mind_dump: dump },
    })
  },

  setMindDump: (dump) => set({ mindDump: dump }),

  setBlueprint: async (destination, currentReality, gap) => {
    set({ destination, currentReality, gap })

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase.from("profiles").update({
      destination,
      current_reality: currentReality,
      gap,
      updated_at: new Date().toISOString(),
    }).eq("id", user.id)
  },

  setMilestones: (milestones) => set({ milestones }),

  toggleMilestone: async (id) => {
    const { milestones } = get()
    const updated = milestones.map((m) =>
      m.id === id ? { ...m, done: !m.done } : m
    )
    set({ milestones: updated })

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Upsert milestone progress
    const milestone = updated.find((m) => m.id === id)
    if (milestone) {
      await supabase.from("milestone_progress").upsert({
        user_id: user.id,
        milestone_id: id,
        milestone_label: milestone.label,
        timeframe: milestone.timeframe,
        is_completed: milestone.done,
        completed_at: milestone.done ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_id,milestone_id" })
    }
  },

  setTasks: (tasks) => set({ tasks }),

  addTask: async (text) => {
    const { tasks } = get()
    if (tasks.filter((t) => !t.done).length >= 3) return

    const newTask: Task = {
      id: crypto.randomUUID(),
      text,
      done: false,
      created_at: new Date().toISOString(),
      completed_at: null,
    }

    set({ tasks: [...tasks, newTask] })

    // Sync to server (fire and forget)
    get().syncToServer()
  },

  toggleTask: async (id) => {
    const { tasks } = get()
    const task = tasks.find((t) => t.id === id)
    if (!task) return

    const updated = tasks.map((t) =>
      t.id === id
        ? { ...t, done: !t.done, completed_at: !t.done ? new Date().toISOString() : null }
        : t
    )
    const completedToday = updated.filter((t) => t.done).length

    set({ tasks: updated, completedToday })

    get().syncToServer()
  },

  removeTask: async (id) => {
    set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) }))
    get().syncToServer()
  },

  logDeepWork: async (minutes, label = "") => {
    const now = new Date()
    const session: DeepWorkSession = {
      id: crypto.randomUUID(),
      session_start: new Date(now.getTime() - minutes * 60 * 1000).toISOString(),
      session_end: now.toISOString(),
      duration_minutes: minutes,
      label,
    }

    set((s) => {
      const total = s.totalDeepWorkHours + minutes / 60
      return {
        deepWorkMinutes: s.deepWorkMinutes + minutes,
        totalDeepWorkHours: parseFloat(total.toFixed(1)),
        deepWorkSessions: [...s.deepWorkSessions, session],
      }
    })

    get().syncToServer()
  },

  setDeepWorkGoal: async (minutes) => {
    set({ deepWorkGoal: minutes })

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase.from("profiles").update({
      deep_work_goal_minutes: minutes,
      updated_at: new Date().toISOString(),
    }).eq("id", user.id)
  },

  addReflection: async (entry) => {
    const newEntry: ReflectionEntry = {
      id: crypto.randomUUID(),
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      ...entry,
    }

    // Store reflection locally
    set((s) => {
      const streak = s.streakDays + 1
      return {
        reflections: [newEntry, ...s.reflections],
        streakDays: streak,
        tasks: s.tasks.map((t) => ({ ...t, done: false, completed_at: null })),
        deepWorkMinutes: 0,
        completedToday: 0,
        currentScreen: "today" as Screen,
      }
    })

    // Sync to server and trigger analysis
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Insert reflection
    await supabase.from("reflections").insert({
      user_id: user.id,
      reflection_date: new Date().toISOString().split("T")[0],
      did: entry.did,
      blocked: entry.blocked || null,
      tomorrow: entry.tomorrow || null,
    })

    // Update daily log
    const { tasks, deepWorkMinutes, streakDays } = get()
    await supabase.from("daily_logs").upsert({
      user_id: user.id,
      log_date: new Date().toISOString().split("T")[0],
      tasks: JSON.stringify(tasks),
      tasks_completed_count: tasks.filter((t) => t.done).length,
      tasks_total_count: tasks.length,
      deep_work_minutes: deepWorkMinutes,
      streak_days: streakDays,
    }, { onConflict: "user_id,log_date" })

    // Trigger pattern analysis edge function
    await supabase.functions.invoke("analyze-reflection", {
      body: { user_id: user.id },
    })
  },

  dismissInsight: async (id) => {
    set((s) => ({
      insights: s.insights.map((i) =>
        i.id === id ? { ...i, is_dismissed: true } : i
      ),
    }))

    const supabase = createClient()
    await supabase.from("insights").update({ is_dismissed: true }).eq("id", id)
  },

  resetOnboarding: () =>
    set({
      onboardingComplete: false,
      currentScreen: "minddump",
      userName: "",
      mindDump: "",
    }),

  hydrateFromServer: async (userId: string) => {
    const supabase = createClient()

    // Load profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single()

    // Load latest daily log
    const { data: latestLog } = await supabase
      .from("daily_logs")
      .select("*")
      .eq("user_id", userId)
      .order("log_date", { ascending: false })
      .limit(1)
      .maybeSingle()

    // Load milestone progress
    const { data: milestoneProgress } = await supabase
      .from("milestone_progress")
      .select("*")
      .eq("user_id", userId)

    // Load reflections
    const { data: reflections } = await supabase
      .from("reflections")
      .select("*")
      .eq("user_id", userId)
      .order("reflection_date", { ascending: false })

    // Load insights
    const { data: insights } = await supabase
      .from("insights")
      .select("*")
      .eq("user_id", userId)
      .eq("is_dismissed", false)
      .order("created_at", { ascending: false })
      .limit(5)

    // Parse tasks from latest log
    let parsedTasks: Task[] = []
    if (latestLog?.tasks) {
      try {
        parsedTasks = JSON.parse(latestLog.tasks)
      } catch {
        parsedTasks = []
      }
    }

    // Merge with defaults
    set({
      userName: profile?.name || "",
      mindDump: profile?.mind_dump || "",
      destination: profile?.destination || "",
      currentReality: profile?.current_reality || "",
      gap: profile?.gap || "",
      deepWorkGoal: profile?.deep_work_goal_minutes || 240,
      streakDays: latestLog?.streak_days || 0,
      totalDeepWorkHours: latestLog ? (latestLog.deep_work_minutes || 0) / 60 : 0,
      insights: (insights || []).map((i) => ({
        id: i.id,
        insight_text: i.insight_text,
        insight_type: i.insight_type as "immediate" | "weekly" | "adjustment",
        category: i.category || "",
        is_dismissed: i.is_dismissed,
        created_at: i.created_at,
        expires_at: i.expires_at,
      })),
      reflections: (reflections || []).map((r) => ({
        id: r.id,
        date: r.reflection_date,
        did: r.did,
        blocked: r.blocked || "",
        tomorrow: r.tomorrow || "",
      })),
      milestones: milestoneProgress?.length
        ? milestoneProgress.map((m) => ({
            id: m.milestone_id,
            label: m.milestone_label,
            timeframe: m.timeframe,
            done: m.is_completed,
          }))
        : defaultMilestones,
      tasks: parsedTasks,
      onboardingComplete: !!(profile?.mind_dump && profile?.mind_dump.length > 20),
      currentScreen: "today",
      isHydrated: true,
    })
  },

  syncToServer: async () => {
    const { tasks, deepWorkMinutes, deepWorkSessions, isSyncing } = get()
    if (isSyncing) return

    set({ isSyncing: true })

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      set({ isSyncing: false })
      return
    }

    // Upsert daily log
    await supabase.from("daily_logs").upsert({
      user_id: user.id,
      log_date: new Date().toISOString().split("T")[0],
      tasks: JSON.stringify(tasks),
      tasks_completed_count: tasks.filter((t) => t.done).length,
      tasks_total_count: tasks.length,
      deep_work_minutes: deepWorkMinutes,
    }, { onConflict: "user_id,log_date" })

    // Insert new deep work sessions
    for (const session of deepWorkSessions) {
      if (!session.session_end) continue

      const { data: existing } = await supabase
        .from("deep_work_sessions")
        .select("id")
        .eq("user_id", user.id)
        .eq("session_start", session.session_start)
        .maybeSingle()

      if (!existing) {
        await supabase.from("deep_work_sessions").insert({
          user_id: user.id,
          session_start: session.session_start,
          session_end: session.session_end,
          duration_minutes: session.duration_minutes,
          label: session.label,
        })
      }
    }

    set({ isSyncing: false })
  },
}))

// Re-export for backward compatibility
export type { Screen as ScreenType }
