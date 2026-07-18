"use client"

import { useEffect, useRef, type ReactNode } from "react"
import { cn } from "@/lib/utils"

/**
 * Parallaxe verticale au scroll : l'enfant dérive doucement à contre-sens du
 * défilement pour créer de la profondeur. Le calcul se fait sur un conteneur
 * externe stable (non transformé) ; seule la couche interne reçoit le transform.
 * Respecte prefers-reduced-motion (aucun mouvement).
 *
 * `speed` = amplitude relative à la hauteur du conteneur (0.1 ≈ discret, 0.3 = marqué).
 * Le conteneur ne rogne pas : c'est au parent (frame arrondie) de porter overflow-hidden.
 */
export function Parallax({
  children,
  className,
  speed = 0.12,
}: {
  children: ReactNode
  className?: string
  speed?: number
}) {
  const outerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const outer = outerRef.current
    const inner = innerRef.current
    if (!outer || !inner) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let raf = 0
    const update = () => {
      raf = 0
      const rect = outer.getBoundingClientRect()
      const vh = window.innerHeight || document.documentElement.clientHeight
      if (rect.bottom < 0 || rect.top > vh) return // hors écran : on ne recalcule pas
      // progress : -1 (conteneur en bas de l'écran) → +1 (en haut), 0 au centre
      const progress = (rect.top + rect.height / 2 - vh / 2) / (vh / 2 + rect.height / 2)
      const shift = -progress * rect.height * speed
      inner.style.transform = `translate3d(0, ${shift.toFixed(2)}px, 0)`
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }

    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [speed])

  return (
    <div ref={outerRef} className={className}>
      <div ref={innerRef} className="h-full w-full will-change-transform">
        {children}
      </div>
    </div>
  )
}
