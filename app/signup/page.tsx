"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { ForgeLogo } from "@/components/forge-logo"

export default function SignupPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error, session } = await signUp(email, password, name)

    if (error) {
      if (error.message.includes("rate limit")) {
        setError("Too many attempts. Please wait a few minutes and try again.")
      } else {
        setError(error.message)
      }
      setLoading(false)
    } else {
      if (!session) {
        setSuccess(true)
        setLoading(false)
      } else {
        router.push("/")
      }
    }
  }

  if (success) {
    return (
      <div className="min-h-[100dvh] bg-background flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm text-center space-y-8">
          <ForgeLogo className="w-16 h-16 mx-auto" />
          <div className="space-y-3">
            <h1 className="text-xl md:text-2xl font-semibold text-foreground tracking-tight">Check your email</h1>
            <p className="text-xs md:text-sm text-muted-foreground/60 leading-relaxed">
              We&apos;ve sent a confirmation link to <span className="text-foreground font-medium">{email}</span>.
              Please confirm your email to continue.
            </p>
          </div>
          <button
            onClick={() => router.push("/login")}
            className="w-full text-xs font-mono text-primary hover:text-foreground transition-all py-3 rounded-lg border border-primary/20 uppercase tracking-widest"
          >
            Back to login &rarr;
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm space-y-10 md:space-y-12">
        <div className="flex flex-col items-center space-y-6">
          <ForgeLogo className="w-16 h-16 md:w-20 md:h-20" />
          <div className="space-y-2 text-center">
            <h1 className="text-xl md:text-2xl font-semibold text-foreground tracking-tight">Create your account</h1>
            <p className="text-xs md:text-sm text-muted-foreground/60">
              Start building your system
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="name" className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
              className="w-full bg-card border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground/30 outline-none p-3.5 transition-all focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
              placeholder="Your name"
            />
          </div>

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
            <label htmlFor="password" className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              minLength={6}
              className="w-full bg-card border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground/30 outline-none p-3.5 transition-all focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
              placeholder="At least 6 characters"
            />
          </div>

          {error && (
            <p className="text-[11px] text-destructive/90 text-center font-medium bg-destructive/5 py-2 rounded-md border border-destructive/10">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !name.trim() || !email.trim() || password.length < 6}
            className="w-full text-xs font-mono text-primary disabled:text-muted-foreground/30 transition-all hover:text-foreground hover:bg-primary/5 py-3 rounded-lg border border-primary/20 hover:border-primary/40 uppercase tracking-widest"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="text-center text-[11px] text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:text-foreground transition-colors font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
