"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export type Screen = "minddump" | "blueprint" | "today" | "reflection"

export interface Task {
  id: string
  text: string
  done: boolean
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

export interface ForgeState {
  // Onboarding / identity
  onboardingComplete: boolean
  userName: string

  // Mind Dump
  mindDump: string

  // Blueprint
  destination: string       // who you want to become
  currentReality: string    // where you are now
  gap: string               // what must change
  milestones: Milestone[]

  // Today
  tasks: Task[]             // max 3
  deepWorkMinutes: number
  deepWorkGoal: number      // minutes per day goal

  // Reflection history
  reflections: ReflectionEntry[]

  // Metrics (derived, minimal)
  streakDays: number
  totalDeepWorkHours: number
  completedToday: number

  // Navigation
  currentScreen: Screen

  // Actions
  setScreen: (screen: Screen) => void
  completeMindDump: (name: string, dump: string) => void
  setMindDump: (dump: string) => void
  setBlueprint: (destination: string, currentReality: string, gap: string) => void
  setMilestones: (milestones: Milestone[]) => void
  toggleMilestone: (id: string) => void
  setTasks: (tasks: Task[]) => void
  addTask: (text: string) => void
  toggleTask: (id: string) => void
  removeTask: (id: string) => void
  logDeepWork: (minutes: number) => void
  setDeepWorkGoal: (minutes: number) => void
  addReflection: (entry: Omit<ReflectionEntry, "id" | "date">) => void
  resetOnboarding: () => void
}

const defaultMilestones: Milestone[] = [
  { id: "1", label: "Identify the one skill that unlocks everything", timeframe: "30 days", done: false },
  { id: "2", label: "Ship a real project to a real audience", timeframe: "90 days", done: false },
  { id: "3", label: "Generate first income from your craft", timeframe: "6 months", done: false },
  { id: "4", label: "Go full-time on your vision", timeframe: "2 years", done: false },
  { id: "5", label: "Reach the top 1% in your field", timeframe: "5 years", done: false },
]

export const useForgeStore = create<ForgeState>()(
  persist(
    (set, get) => ({
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
      reflections: [],
      streakDays: 0,
      totalDeepWorkHours: 0,
      completedToday: 0,
      currentScreen: "minddump",

      setScreen: (screen) => set({ currentScreen: screen }),

      completeMindDump: (name, dump) =>
        set({
          onboardingComplete: true,
          userName: name,
          mindDump: dump,
          currentScreen: "blueprint",
        }),

      setMindDump: (dump) => set({ mindDump: dump }),

      setBlueprint: (destination, currentReality, gap) =>
        set({ destination, currentReality, gap }),

      setMilestones: (milestones) => set({ milestones }),

      toggleMilestone: (id) =>
        set((s) => ({
          milestones: s.milestones.map((m) =>
            m.id === id ? { ...m, done: !m.done } : m
          ),
        })),

      setTasks: (tasks) => set({ tasks }),

      addTask: (text) => {
        const { tasks } = get()
        if (tasks.filter((t) => !t.done).length >= 3) return
        set({
          tasks: [
            ...tasks,
            { id: Date.now().toString(), text, done: false },
          ],
        })
      },

      toggleTask: (id) =>
        set((s) => {
          const updated = s.tasks.map((t) =>
            t.id === id ? { ...t, done: !t.done } : t
          )
          const completedToday = updated.filter((t) => t.done).length
          return { tasks: updated, completedToday }
        }),

      removeTask: (id) =>
        set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),

      logDeepWork: (minutes) =>
        set((s) => {
          const total = s.totalDeepWorkHours + minutes / 60
          return {
            deepWorkMinutes: s.deepWorkMinutes + minutes,
            totalDeepWorkHours: parseFloat(total.toFixed(1)),
          }
        }),

      setDeepWorkGoal: (minutes) => set({ deepWorkGoal: minutes }),

      addReflection: (entry) =>
        set((s) => {
          const newEntry: ReflectionEntry = {
            id: Date.now().toString(),
            date: new Date().toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }),
            ...entry,
          }
          // Increment streak
          const streak = s.streakDays + 1
          // Reset tasks for tomorrow
          return {
            reflections: [newEntry, ...s.reflections],
            streakDays: streak,
            tasks: s.tasks.map((t) => ({ ...t, done: false })),
            deepWorkMinutes: 0,
            completedToday: 0,
            currentScreen: "today" as Screen,
          }
        }),

      resetOnboarding: () =>
        set({
          onboardingComplete: false,
          currentScreen: "minddump",
          userName: "",
          mindDump: "",
        }),
    }),
    { name: "alera-v1" }
  )
)
