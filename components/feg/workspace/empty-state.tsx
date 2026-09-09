import type { LucideIcon } from "lucide-react"

/**
 * État vide standard : icône, titre, description, action optionnelle.
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: LucideIcon
  title: string
  description?: string
  children?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-cool-200 bg-white px-6 py-14 text-center">
      <span className="grid size-12 place-items-center rounded-full bg-feg-light-green text-feg-green">
        <Icon className="size-6" aria-hidden="true" />
      </span>
      <p className="text-base font-semibold text-feg-green">{title}</p>
      {description && <p className="max-w-sm text-sm text-muted-ink">{description}</p>}
      {children && <div className="mt-2">{children}</div>}
    </div>
  )
}
