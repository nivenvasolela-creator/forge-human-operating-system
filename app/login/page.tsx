"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { ForgeLogo } from "@/components/forge-logo"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error } = await signIn(email, password)

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push("/")
    }
  }

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm space-y-10 md:space-y-12">
        <div className="flex flex-col items-center space-y-6">
          <ForgeLogo className="w-16 h-16 md:w-20 md:h-20" />
          <div className="space-y-2 text-center">
            <h1 className="text-xl md:text-2xl font-semibold text-foreground tracking-tight">Welcome back</h1>
            <p className="text-xs md:text-sm text-muted-foreground/60">
              Sign in to continue your journey
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full bg-card border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground/30 outline-none p-3.5 transition-all focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="password" className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                Password
              </label>
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full bg-card border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground/30 outline-none p-3.5 transition-all focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <p className="text-[11px] text-destructive/90 text-center font-medium bg-destructive/5 py-2 rounded-md border border-destructive/10">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !email.trim() || !password.trim()}
            className="w-full text-xs font-mono text-primary disabled:text-muted-foreground/30 transition-all hover:text-foreground hover:bg-primary/5 py-3 rounded-lg border border-primary/20 hover:border-primary/40 uppercase tracking-widest"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="text-center text-[11px] text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-primary hover:text-foreground transition-colors font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
