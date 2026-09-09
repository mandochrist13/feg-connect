import { UserCheck, ClipboardCheck, BadgeCheck, type LucideIcon } from "lucide-react"
import {
  LABEL_PHASE_ORDER,
  LABEL_PHASE_LABELS,
  LABEL_PHASE_HINTS,
  type LabelPhase,
} from "@/lib/label-phase"
import { cn } from "@/lib/utils"

const PHASE_ICONS: Record<LabelPhase, LucideIcon> = {
  membre: UserCheck,
  dossier: ClipboardCheck,
  delivre: BadgeCheck,
}

/**
 * Funnel du parcours de labellisation : Membre → Dossier & audit → Label
 * délivré. Compteurs factuels + part relative du réseau (jamais un rang).
 */
export function LabelFunnel({
  counts,
  total,
}: {
  counts: Record<LabelPhase, number>
  total: number
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {LABEL_PHASE_ORDER.map((phase) => {
        const Icon = PHASE_ICONS[phase]
        const n = counts[phase] ?? 0
        const pct = total > 0 ? Math.round((n / total) * 100) : 0
        const isGoal = phase === "delivre"
        return (
          <div
            key={phase}
            className={cn(
              "rounded-xl border p-5",
              isGoal ? "border-feg-amber/40 bg-feg-amber/5" : "border-cool-200 bg-white",
            )}
          >
            <div className="flex items-center justify-between">
              <span
                className={cn(
                  "grid size-10 place-items-center rounded-lg",
                  isGoal ? "bg-feg-amber text-feg-deep" : "bg-feg-light-green text-feg-green",
                )}
              >
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <span className="font-display text-3xl font-extrabold tracking-tight text-feg-green">
                {n}
              </span>
            </div>
            <p className="mt-3 text-sm font-bold text-ink">{LABEL_PHASE_LABELS[phase]}</p>
            <p className="mt-0.5 text-xs leading-snug text-muted-ink">
              {LABEL_PHASE_HINTS[phase]}
            </p>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-cool-100">
              <div
                className={cn("h-full rounded-full", isGoal ? "bg-feg-amber" : "bg-feg-green")}
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="mt-1 text-[11px] text-cool-400">{pct}% des membres</p>
          </div>
        )
      })}
    </div>
  )
}
