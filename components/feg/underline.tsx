import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

/**
 * Souligné manuscrit doré (charte FEG) — le trait signature du hero, réutilisable
 * sur un mot-clé de n'importe quel titre de section. La couleur du trait suit
 * `text-feg-gold` par défaut ; on peut la surcharger via `className`.
 */
export function Underline({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <span className={cn("relative inline-block", className)}>
      {children}
      <svg
        className="absolute -bottom-1.5 left-0 w-full text-feg-gold"
        viewBox="0 0 200 10"
        fill="none"
        aria-hidden="true"
        preserveAspectRatio="none"
      >
        <path
          d="M2 7C60 2 140 2 198 6"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
    </span>
  )
}
