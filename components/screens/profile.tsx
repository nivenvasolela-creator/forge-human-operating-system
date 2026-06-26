"use client"

import { useForgeStore } from "@/lib/forge-store"
import { useAuth } from "@/lib/auth-context"
import { User, LogOut, Settings, Bell, Shield, CircleHelp } from "lucide-react"

export function ProfileScreen() {
  const { userName } = useForgeStore()
  const { signOut, user } = useAuth()

  return (
    <div className="max-w-xl mx-auto pt-12 pb-32 px-8 space-y-12 animate-in fade-in duration-700">

      {/* Header */}
      <div className="space-y-6 text-center">
        <div className="w-24 h-24 rounded-[2.5rem] bg-foreground/5 flex items-center justify-center mx-auto border border-foreground/5">
          <User className="w-10 h-10 text-muted-foreground/40" />
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-foreground">{userName || "Niven"}</h1>
          <p className="text-sm text-muted-foreground font-mono uppercase tracking-widest">{user?.email}</p>
        </div>
      </div>

      {/* Settings List */}
      <div className="space-y-4">
        <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.3em] font-bold px-2">Account</p>
        <div className="bg-card rounded-[2.5rem] border border-border/40 shadow-sm overflow-hidden divide-y divide-border/20">
          <MenuButton icon={Settings} label="System Settings" />
          <MenuButton icon={Bell} label="Focus Reminders" />
          <MenuButton icon={Shield} label="Privacy & Security" />
          <MenuButton icon={CircleHelp} label="The Forge Method" />
        </div>
      </div>

      {/* Danger Zone */}
      <div className="pt-4">
        <button
          onClick={signOut}
          className="w-full bg-destructive/5 text-destructive border border-destructive/10 p-5 rounded-[2rem] flex items-center justify-center gap-3 font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-destructive/10 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Sign Out of Forge
        </button>
      </div>

      <p className="text-center text-[10px] font-mono text-muted-foreground/30 uppercase tracking-[0.4em]">
        Forge OS v0.1.0
      </p>
    </div>
  )
}

function MenuButton({ icon: Icon, label }: { icon: any, label: string }) {
  return (
    <button className="w-full p-5 flex items-center justify-between hover:bg-muted/5 transition-all group">
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 rounded-xl bg-foreground/[0.03] flex items-center justify-center">
          <Icon className="w-4 h-4 text-muted-foreground/60" />
        </div>
        <span className="text-sm font-medium text-foreground/80">{label}</span>
      </div>
      <div className="w-1.5 h-1.5 rounded-full bg-border group-hover:bg-primary transition-all" />
    </button>
  )
}
