"use client"

import { useEffect, useRef, type CSSProperties } from "react"
import { Check, ClipboardCheck, BadgeCheck, Flag, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

type Level = {
  key: "member" | "dossier" | "label"
  title: string
  desc: string
  highlight: boolean
}

const ICONS: Record<Level["key"], LucideIcon> = {
  member: Check,
  dossier: ClipboardCheck,
  label: BadgeCheck,
}

// Pastille du titre d'étape (remplace l'ancien badge de niveau de Label).
function stepPillClass(isGoal: boolean): string {
  return cn(
    "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-tight",
    isGoal ? "bg-feg-amber text-feg-deep" : "bg-feg-light-green text-feg-light-green-foreground",
  )
}

// Route horizontale (unités du viewBox) : les arrêts s'égrènent de gauche à
// droite en ondulant haut / bas ; le dernier (certifié) est l'objectif.
const VB_W = 100
const VB_H = 60
const X_LEFT = 13
const X_RIGHT = 87
const Y_UP = 35
const Y_DOWN = 20

export function LevelsRoadmap({ levels }: { levels: Level[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const n = levels.length
  const xAt = (i: number) => X_LEFT + (i * (X_RIGHT - X_LEFT)) / (n - 1)
  const isUp = (i: number) => i % 2 === 1
  const yAt = (i: number) => (isUp(i) ? Y_UP : Y_DOWN)

  // Tracé lissé : chaque segment relie deux arrêts par une courbe en S horizontale.
  let road = `M ${xAt(0)} ${yAt(0)}`
  for (let i = 1; i < n; i++) {
    const xm = (xAt(i - 1) + xAt(i)) / 2
    road += ` C ${xm} ${yAt(i - 1)} ${xm} ${yAt(i)} ${xAt(i)} ${yAt(i)}`
  }

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("is-active")
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.classList.add("is-active")
            io.disconnect()
          }
        }
      },
      { threshold: 0.25, rootMargin: "0px 0px -60px 0px" },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={ref} className="feg-timeline mt-8">
      {/* ─── Desktop : route horizontale ondulée ─── */}
      <div className="relative mx-auto hidden aspect-100/60 w-full max-w-5xl md:block">
        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          preserveAspectRatio="xMidYMid meet"
          className="absolute inset-0 size-full overflow-visible"
          aria-hidden="true"
        >
          <path
            d={road}
            className="feg-road-path"
            fill="none"
            stroke="#AFAE7E"
            strokeWidth={6}
            strokeLinecap="round"
            pathLength={1}
          />
          <path
            d={road}
            className="feg-road-dash"
            fill="none"
            stroke="#0B3E23"
            strokeWidth={0.8}
            strokeDasharray="2 3"
            strokeLinecap="round"
          />
        </svg>

        {levels.map((l, i) => {
          const up = isUp(i)
          const Icon = ICONS[l.key]
          const isGoal = l.highlight
          const leftPct = xAt(i)
          const nodeTop = (yAt(i) / VB_H) * 100
          const labelTop = ((yAt(i) + (up ? -9 : 9)) / VB_H) * 100

          return (
            <div key={l.title}>
              {/* Arrêt sur la route */}
              <div
                className={cn(
                  "feg-road-node absolute z-10 grid place-items-center rounded-full bg-white text-feg-deep ring-4 ring-feg-forest",
                  isGoal
                    ? "size-16 shadow-[0_0_34px_-2px_rgba(214,158,46,0.65)] lg:size-20"
                    : "size-14 shadow-[0_10px_24px_-8px_rgba(0,0,0,0.6)] lg:size-16",
                )}
                style={{ left: `${leftPct}%`, top: `${nodeTop}%`, "--i": i } as CSSProperties}
              >
                <Icon className={cn(isGoal ? "size-7 lg:size-8" : "size-6 lg:size-7")} aria-hidden="true" />
                <span className="absolute -right-1.5 -top-1.5 grid size-6 place-items-center rounded-full bg-feg-forest text-[11px] font-bold text-feg-amber-bright ring-2 ring-feg-amber">
                  {i + 1}
                </span>
                {isGoal && (
                  <span className="absolute -bottom-1.5 -right-1.5 grid size-6 place-items-center rounded-full bg-feg-forest text-feg-amber-bright ring-2 ring-feg-amber">
                    <Flag className="size-3" aria-hidden="true" />
                  </span>
                )}
              </div>

              {/* Libellé, au-dessus (arrêt haut) ou en dessous (arrêt bas) */}
              <div
                className="feg-road-label absolute z-10 flex w-44 flex-col items-center gap-2 text-center"
                style={
                  {
                    left: `${leftPct}%`,
                    top: `${labelTop}%`,
                    transform: up ? "translate(-50%, -100%)" : "translate(-50%, 0)",
                    "--i": i,
                  } as CSSProperties
                }
              >
                <span
                  className={cn(
                    "text-[11px] font-bold uppercase tracking-wider",
                    isGoal ? "text-feg-amber-bright" : "text-feg-gold-soft",
                  )}
                >
                  {isGoal ? "Objectif" : `Étape ${i + 1}`}
                </span>
                <span className={stepPillClass(isGoal)}>{l.title}</span>
                <p className="text-sm leading-relaxed text-white">{l.desc}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* ─── Mobile : étapes empilées le long d'un axe vertical ─── */}
      <ol className="relative mt-5 flex flex-col gap-8 md:hidden">
        <span
          className="pointer-events-none absolute bottom-6 left-5.5 top-6 w-0.5 bg-feg-khaki/40"
          aria-hidden="true"
        />
        {levels.map((l, i) => {
          const Icon = ICONS[l.key]
          const isGoal = l.highlight
          return (
            <li
              key={l.title}
              className="feg-road-label relative flex items-start gap-4"
              style={{ "--i": i } as CSSProperties}
            >
              <span
                className={cn(
                  "relative z-10 grid size-11 shrink-0 place-items-center rounded-full bg-feg-amber text-feg-deep ring-4 ring-feg-forest",
                  isGoal && "shadow-[0_0_24px_-2px_rgba(214,158,46,0.7)]",
                )}
              >
                <Icon className="size-5" aria-hidden="true" />
                <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-feg-forest text-[10px] font-bold text-feg-amber-bright ring-2 ring-feg-amber">
                  {i + 1}
                </span>
              </span>
              <div className="flex flex-col items-start gap-1.5 pt-1">
                <span
                  className={cn(
                    "text-[11px] font-bold uppercase tracking-wider",
                    isGoal ? "text-feg-amber-bright" : "text-feg-gold-soft",
                  )}
                >
                  {isGoal ? "Objectif" : `Étape ${i + 1}`}
                </span>
                <span className={stepPillClass(isGoal)}>{l.title}</span>
                <p className="text-sm leading-relaxed text-white/70">{l.desc}</p>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
