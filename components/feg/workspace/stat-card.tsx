import type { LucideIcon } from "lucide-react"

/**
 * Tuile de compteur factuel (jamais un score ni un classement — spec).
 */
export function StatCard({
  label,
  value,
  icon: Icon,
  hint,
}: {
  label: string
  value: string | number
  icon: LucideIcon
  hint?: string
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-cool-200 bg-white p-5">
      <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-feg-light-green text-feg-green">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="truncate text-sm text-muted-ink">{label}</p>
        <p className="font-display text-2xl font-extrabold tracking-tight text-feg-green">
          {value}
        </p>
        {hint && <p className="truncate text-xs text-cool-400">{hint}</p>}
      </div>
    </div>
  )
}
