"use client"

import { useForgeStore } from "@/lib/forge-store"
import { useAuth } from "@/lib/auth-context"
import { LogOut, RefreshCw } from "lucide-react"

export function ProfileScreen() {
  const { userName, mission } = useForgeStore()
  const { signOut, user } = useAuth()

  return (
    <div className="py-24 space-y-24 animate-in fade-in duration-1000">

      <div className="space-y-6">
        <p className="os-label tracking-[0.4em]">System Access</p>
        <h1 className="os-title">{userName}</h1>
        <p className="text-sm font-mono text-muted-foreground uppercase tracking-widest">{user?.email}</p>
      </div>

      <hr className="border-foreground/5" />

      <div className="space-y-8">
        <p className="os-label">North Star</p>
        <p className="text-xl font-light text-foreground/80 leading-relaxed italic">
          &ldquo;{mission}&rdquo;
        </p>
      </div>

      <div className="space-y-4 pt-12">
        <button
          onClick={signOut}
          className="w-full bg-destructive/5 text-destructive border border-destructive/10 p-6 rounded-[2rem] flex items-center justify-center gap-4 font-bold uppercase tracking-[0.3em] text-[10px] hover:bg-destructive/10 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Shut Down System
        </button>
      </div>

      <div className="text-center">
        <p className="os-label !text-[8px] opacity-20 tracking-[0.6em]">Forge OS v1.0.0 &bull; Build for ALERA</p>
      </div>

    </div>
  )
}
