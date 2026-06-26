import { cn } from "@/lib/utils"

export function ForgeLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("w-8 h-8", className)}
    >
      <defs>
        <linearGradient id="metal-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#94a3b8" />
          <stop offset="50%" stopColor="#475569" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>
        <filter id="orange-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feFlood floodColor="#f97316" floodOpacity="0.6" result="color" />
          <feComposite in="color" in2="blur" operator="in" result="glow" />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Outer/Top Stroke */}
      <path
        d="M28 85 L52 20 L88 20 L80 32 L56 32 L36 85 Z"
        fill="url(#metal-gradient)"
        className="drop-shadow-sm"
      />

      {/* Inner/Bottom Stroke (The Forge Glow) */}
      <path
        d="M44 85 L62 45 L85 45 L78 55 L65 55 L52 85 Z"
        fill="#ff7a00"
        filter="url(#orange-glow)"
      />
    </svg>
  )
}
