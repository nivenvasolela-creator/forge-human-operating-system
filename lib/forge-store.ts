"use client"

import { create } from "zustand"
import { createClient } from "./supabase/client"

export type OSState = "morning" | "focus" | "between" | "evening" | "onboarding"

export interface Session {
  id: string
  goal: string
  startTime: string
  endTime: string | null
  outcome: "done" | "blocked" | "partial" | null
  type: "building" | "meta" // Meta-tax tracking
}

export interface DayLog {
  date: string
  sessions: Session[]
  shipped: boolean | null
  reflection: string
}

export interface ForgeState {
  // Identity
  userName: string
  mission: string // Pre-configured: Build ALERA
  onboardingComplete: boolean

  // Active State
  currentState: OSState
  activeSession: Session | null
  dailyLogs: Record<string, DayLog>

  // Stats (Invisible intelligence)
  metaTaxRatio: number // Ratio of meta-work vs building
  shipRate: number // 30-day binary ship percentage

  // Actions
  setName: (name: string) => void
  completeOnboarding: (dump: string) => Promise<void>
  startSession: (goal: string, type: Session["type"]) => void
  endSession: (outcome: Session["outcome"]) => void
  logShipment: (shipped: boolean) => void
  submitReflection: (reflection: string) => Promise<void>
  setState: (state: OSState) => void

  // System Sync
  hydrate: (userId: string) => Promise<void>
}

export const useForgeStore = create<ForgeState>()((set, get) => ({
  userName: "",
  mission: "Build ALERA — Africa's AI credit scoring infrastructure",
  onboardingComplete: false,
  currentState: "onboarding",
  activeSession: null,
  dailyLogs: {},
  metaTaxRatio: 0,
  shipRate: 0,

  setName: (name) => set({ userName: name }),

  setState: (state) => set({ currentState: state }),

  completeOnboarding: async (dump) => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase.from("profiles").upsert({
      id: user.id,
      name: get().userName,
      mind_dump: dump,
      destination: get().mission,
      updated_at: new Date().toISOString(),
    })

    set({ onboardingComplete: true, currentState: "morning" })
  },

  startSession: (goal, type) => {
    const session: Session = {
      id: crypto.randomUUID(),
      goal,
      type,
      startTime: new Date().toISOString(),
      endTime: null,
      outcome: null,
    }
    set({ activeSession: session, currentState: "focus" })
  },

  endSession: (outcome) => {
    const { activeSession, dailyLogs } = get()
    if (!activeSession) return

    const completedSession: Session = {
      ...activeSession,
      endTime: new Date().toISOString(),
      outcome,
    }

    const today = new Date().toISOString().split("T")[0]
    const currentLog = dailyLogs[today] || { date: today, sessions: [], shipped: null, reflection: "" }

    const updatedLogs = {
      ...dailyLogs,
      [today]: {
        ...currentLog,
        sessions: [...currentLog.sessions, completedSession],
      }
    }

    set({
      activeSession: null,
      currentState: "between",
      dailyLogs: updatedLogs
    })

    // Recalculate Meta-Tax
    const allSessions = Object.values(updatedLogs).flatMap(l => l.sessions)
    const metaCount = allSessions.filter(s => s.type === "meta").length
    set({ metaTaxRatio: allSessions.length > 0 ? (metaCount / allSessions.length) : 0 })
  },

  logShipment: (shipped) => {
    const today = new Date().toISOString().split("T")[0]
    const { dailyLogs } = get()
    const currentLog = dailyLogs[today] || { date: today, sessions: [], shipped: null, reflection: "" }

    const updatedLogs = {
      ...dailyLogs,
      [today]: { ...currentLog, shipped }
    }

    set({ dailyLogs: updatedLogs })

    // Recalculate Ship Rate
    const last30 = Object.values(updatedLogs).slice(-30)
    const shippedCount = last30.filter(l => l.shipped).length
    set({ shipRate: last30.length > 0 ? (shippedCount / last30.length) : 0 })
  },

  submitReflection: async (reflection) => {
    const today = new Date().toISOString().split("T")[0]
    const { dailyLogs } = get()
    const currentLog = dailyLogs[today] || { date: today, sessions: [], shipped: null, reflection: "" }

    set({
      dailyLogs: {
        ...dailyLogs,
        [today]: { ...currentLog, reflection }
      },
      currentState: "morning" // Reset for next day logic (Simplified)
    })
  },

  hydrate: async (userId) => {
    const supabase = createClient()
    const { data: profile } = await supabase.from("profiles").select("*").eq("id", userId).single()

    if (profile) {
      set({
        userName: profile.name || "",
        onboardingComplete: !!profile.mind_dump,
        currentState: profile.mind_dump ? "morning" : "onboarding"
      })
    }
  }
}))
