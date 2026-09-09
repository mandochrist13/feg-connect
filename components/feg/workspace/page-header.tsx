/**
 * En-tête standard des pages du workspace : eyebrow (rôle/section), titre,
 * description, et actions (boutons) à droite.
 */
export function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string
  title: string
  description?: string
  children?: React.ReactNode
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        {eyebrow && (
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-feg-gold-deep">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-1 text-2xl font-bold text-feg-green sm:text-3xl">{title}</h1>
        {description && <p className="mt-1.5 text-sm text-muted-ink">{description}</p>}
      </div>
      {children && <div className="flex shrink-0 items-center gap-2">{children}</div>}
    </div>
  )
}
