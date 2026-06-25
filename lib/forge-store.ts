"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export type Screen =
  | "onboarding"
  | "identity"
  | "blueprint"
  | "command"
  | "deepwork"
  | "scoreboard"
  | "mirror"
  | "compounder"
  | "review"
  | "recovery"

export interface Milestone {
  id: string
  label: string
  timeframe: string
  done: boolean
}

export interface Task {
  id: string
  text: string
  done: boolean
  priority: "high" | "medium" | "low"
}

export interface DeepWorkSession {
  id: string
  label: string
  minutes: number
  date: string
}

export interface ScoreEntry {
  category: string
  score: number
  maxScore: number
  icon: string
}

export interface CompoundEntry {
  label: string
  value: number
  unit: string
  icon: string
}

export interface ForgeState {
  // Onboarding
  onboardingComplete: boolean
  userName: string
  mindDump: string
  onboardingAnswers: Record<string, string>

  // Identity
  futureIdentity: string[]
  currentIdentity: string[]
  coreValues: string[]

  // Blueprint
  tenYearVision: string
  milestones: Milestone[]

  // Command Center
  dailyMission: string
  tasks: Task[]

  // Deep Work
  sessions: DeepWorkSession[]
  activeSession: { label: string; startTime: number; running: boolean } | null

  // Scores
  scores: ScoreEntry[]

  // Compounder
  compounds: CompoundEntry[]

  // Navigation
  currentScreen: Screen

  // Actions
  setScreen: (screen: Screen) => void
  setOnboardingComplete: (name: string, dump: string, answers: Record<string, string>) => void
  setFutureIdentity: (items: string[]) => void
  setCurrentIdentity: (items: string[]) => void
  setCoreValues: (items: string[]) => void
  setTenYearVision: (v: string) => void
  setMilestones: (m: Milestone[]) => void
  toggleMilestone: (id: string) => void
  setDailyMission: (m: string) => void
  addTask: (text: string, priority?: Task["priority"]) => void
  toggleTask: (id: string) => void
  removeTask: (id: string) => void
  startSession: (label: string) => void
  stopSession: () => void
  updateScore: (category: string, score: number) => void
  incrementCompound: (label: string, amount?: number) => void
  resetToRecovery: () => void
}

export const useForgeStore = create<ForgeState>()(
  persist(
    (set, get) => ({
      onboardingComplete: false,
      userName: "",
      mindDump: "",
      onboardingAnswers: {},
      futureIdentity: ["AI Builder", "Entrepreneur", "Investor", "Leader"],
      currentIdentity: ["Student", "Ambitious", "Inconsistent"],
      coreValues: ["Discipline", "Growth", "Excellence", "Freedom"],
      tenYearVision: "",
      milestones: [
        { id: "1", label: "Master core skill stack", timeframe: "90 days", done: false },
        { id: "2", label: "Launch first project", timeframe: "6 months", done: false },
        { id: "3", label: "First $1K revenue", timeframe: "1 year", done: false },
        { id: "4", label: "Full-time on your craft", timeframe: "3 years", done: false },
        { id: "5", label: "Top 1% in your field", timeframe: "5 years", done: false },
        { id: "6", label: "Build your empire", timeframe: "10 years", done: false },
      ],
      dailyMission: "",
      tasks: [],
      sessions: [],
      activeSession: null,
      scores: [
        { category: "Learning", score: 0, maxScore: 10, icon: "BookOpen" },
        { category: "Health", score: 0, maxScore: 10, icon: "Heart" },
        { category: "Discipline", score: 0, maxScore: 10, icon: "Shield" },
        { category: "Skills", score: 0, maxScore: 10, icon: "Zap" },
        { category: "Relationships", score: 0, maxScore: 10, icon: "Users" },
        { category: "Finances", score: 0, maxScore: 10, icon: "TrendingUp" },
      ],
      compounds: [
        { label: "Deep Work Hours", value: 0, unit: "hrs", icon: "Timer" },
        { label: "Books Read", value: 0, unit: "books", icon: "BookOpen" },
        { label: "Projects Built", value: 0, unit: "built", icon: "Cpu" },
        { label: "Days Disciplined", value: 0, unit: "days", icon: "Flame" },
        { label: "Skills Acquired", value: 0, unit: "skills", icon: "Zap" },
      ],
      currentScreen: "onboarding",

      setScreen: (screen) => set({ currentScreen: screen }),

      setOnboardingComplete: (name, dump, answers) =>
        set({
          onboardingComplete: true,
          userName: name,
          mindDump: dump,
          onboardingAnswers: answers,
          currentScreen: "identity",
        }),

      setFutureIdentity: (items) => set({ futureIdentity: items }),
      setCurrentIdentity: (items) => set({ currentIdentity: items }),
      setCoreValues: (items) => set({ coreValues: items }),
      setTenYearVision: (v) => set({ tenYearVision: v }),
      setMilestones: (m) => set({ milestones: m }),
      toggleMilestone: (id) =>
        set((s) => ({
          milestones: s.milestones.map((m) =>
            m.id === id ? { ...m, done: !m.done } : m
          ),
        })),

      setDailyMission: (m) => set({ dailyMission: m }),
      addTask: (text, priority = "medium") =>
        set((s) => ({
          tasks: [
            ...s.tasks,
            { id: Date.now().toString(), text, done: false, priority },
          ],
        })),
      toggleTask: (id) =>
        set((s) => ({
          tasks: s.tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
        })),
      removeTask: (id) =>
        set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),

      startSession: (label) =>
        set({ activeSession: { label, startTime: Date.now(), running: true } }),
      stopSession: () => {
        const { activeSession, sessions } = get()
        if (!activeSession) return
        const minutes = Math.round((Date.now() - activeSession.startTime) / 60000)
        set({
          activeSession: null,
          sessions: [
            ...sessions,
            {
              id: Date.now().toString(),
              label: activeSession.label,
              minutes: Math.max(1, minutes),
              date: new Date().toLocaleDateString(),
            },
          ],
          compounds: get().compounds.map((c) =>
            c.label === "Deep Work Hours"
              ? { ...c, value: +(c.value + minutes / 60).toFixed(1) }
              : c
          ),
        })
      },

      updateScore: (category, score) =>
        set((s) => ({
          scores: s.scores.map((sc) =>
            sc.category === category ? { ...sc, score } : sc
          ),
        })),

      incrementCompound: (label, amount = 1) =>
        set((s) => ({
          compounds: s.compounds.map((c) =>
            c.label === label ? { ...c, value: +(c.value + amount).toFixed(1) } : c
          ),
        })),

      resetToRecovery: () => set({ currentScreen: "recovery" }),
    }),
    {
      name: "forge-os-v1",
    }
  )
)
