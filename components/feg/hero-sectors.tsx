"use client"

import { useEffect, useState } from "react"

/**
 * Fond du hero : diaporama en fondu qui parcourt les secteurs de la plateforme
 * (BTP, Bois, Transport, Services, Mines). Une image à la fois → reste épuré,
 * tout en montrant l'étendue sectorielle. Respecte prefers-reduced-motion.
 */
const SECTORS = [
  { key: "BTP", label: "BTP & Construction", src: "/images/sector-btp.jpg" },
  { key: "Bois", label: "Bois & filière forêt", src: "/images/sector-bois.jpg" },
  { key: "Mines", label: "Mines & industrie extractive", src: "/images/sector-mines.jpg" },
  { key: "Energie", label: "Énergie", src: "/images/rfp-energie.jpg" },
  { key: "Agro", label: "Agro-industrie", src: "/images/sector-agro.jpg" },
  { key: "Transport", label: "Transport & logistique", src: "/images/cta-port.jpg" },
  { key: "Numerique", label: "Numérique", src: "/images/sector-numerique.jpg" },
  { key: "Services", label: "Services aux entreprises", src: "/images/profiles-meeting.jpg" },
]

const INTERVAL_MS = 4000

export function HeroSectors() {
  const [i, setI] = useState(0)
  // Le zoom lent (Ken Burns) est désactivé si l'utilisateur réduit les animations.
  const [motion, setMotion] = useState(true)

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setMotion(false)
      return
    }
    const t = window.setInterval(() => setI((p) => (p + 1) % SECTORS.length), INTERVAL_MS)
    return () => window.clearInterval(t)
  }, [])

  return (
    <>
      {/* Calques d'images empilés, transition croisée par opacité */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-y-0 right-0 w-full lg:w-3/5">
          {SECTORS.map((s, idx) => {
            const active = idx === i
            return (
              <div
                key={s.key}
                className="absolute inset-0 bg-cover bg-center ease-feg will-change-transform"
                style={{
                  backgroundImage: `url("${s.src}")`,
                  opacity: active ? 1 : 0,
                  // Léger overscale : l'image active grandit lentement tant qu'elle est visible.
                  transform: active && motion ? "scale(1.08)" : "scale(1)",
                  transitionProperty: "opacity, transform",
                  // Fondu rapide (1s) mais zoom lent (6s) pour un effet discret.
                  transitionDuration: active ? "1000ms, 6000ms" : "1000ms, 1000ms",
                }}
              />
            )
          })}
        </div>
        {/* Fondu vers le blanc : texte lisible à gauche, photo estompée à droite */}
        <div className="absolute inset-0 bg-linear-to-r from-white via-white/92 to-white/45" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-white to-transparent" />
      </div>

      {/* Libellé du secteur courant + puces de navigation */}
      <div className="pointer-events-none absolute bottom-8 right-6 z-10 hidden flex-col items-end gap-3 lg:flex">
        <span className="rounded-full border border-feg-green/15 bg-white/85 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide text-feg-green shadow-sm backdrop-blur">
          {SECTORS[i].label}
        </span>
        <div className="pointer-events-auto flex items-center gap-1.5">
          {SECTORS.map((s, idx) => (
            <button
              key={s.key}
              type="button"
              onClick={() => setI(idx)}
              aria-label={s.label}
              aria-current={idx === i ? "true" : undefined}
              className={
                "h-1.5 rounded-full transition-all duration-500 " +
                (idx === i ? "w-6 bg-feg-green" : "w-1.5 bg-feg-green/25 hover:bg-feg-green/50")
              }
            />
          ))}
        </div>
      </div>
    </>
  )
}
