import type { CSSProperties, ReactNode } from "react"
import { cn } from "@/lib/utils"

/**
 * Marquee CSS pur (horizontal ou vertical) — contenu dupliqué pour une boucle
 * sans couture. Pause au survol, désactivé si prefers-reduced-motion.
 */
export function Marquee({
  children,
  vertical = false,
  reverse = false,
  duration = 32,
  className,
  itemClassName,
}: {
  children: ReactNode
  vertical?: boolean
  reverse?: boolean
  /** durée d'un cycle complet, en secondes */
  duration?: number
  className?: string
  itemClassName?: string
}) {
  const group = cn(
    "flex shrink-0",
    vertical ? "flex-col gap-4 pb-4" : "flex-row gap-4 pr-4",
    itemClassName,
  )

  return (
    <div
      className={cn(
        "feg-marquee overflow-hidden",
        vertical ? "feg-mask-y" : "feg-mask-x",
        className,
      )}
      style={{ "--marquee-duration": `${duration}s` } as CSSProperties}
    >
      <div
        className={cn(
          "flex w-max",
          vertical ? "feg-marquee-track-y h-max w-full flex-col" : "feg-marquee-track-x flex-row",
          reverse && "feg-marquee-reverse",
        )}
      >
        <div className={group}>{children}</div>
        <div className={cn(group, "feg-marquee-copy")} aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  )
}
