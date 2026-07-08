import Link from "next/link"

const ESPACE_ADHERENT_URL =
  process.env.NEXT_PUBLIC_ESPACE_ADHERENT_URL || "https://adherent.lafeg.ga"

/**
 * Coquille commune aux tableaux de bord. En-tête FEG + lien de retour
 * « ← Espace Adhérent » (spec §5.4 — navigation transparente via session
 * partagée). Identité visuelle FEG : vert #063D21, doré #AFAE7E (spec §10.2).
 */
export function DashboardShell({
  title,
  role,
  displayName,
  email,
  nav,
  children,
}: {
  title: string
  role: string
  displayName?: string | null
  email?: string | null
  nav: { donneurOrdre?: boolean; prestataire?: boolean; adminFeg?: boolean }
  children?: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#F7F7F4]">
      <header className="bg-[#063D21] text-white">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <a
            href={ESPACE_ADHERENT_URL}
            className="text-sm text-white/80 hover:text-white transition-colors"
          >
            ← Espace Adhérent
          </a>
          <nav className="flex items-center gap-4 text-sm">
            {nav.donneurOrdre && (
              <Link href="/donneur-ordre" className="hover:text-[#AFAE7E]">
                Donneur d’ordre
              </Link>
            )}
            {nav.prestataire && (
              <Link href="/prestataire" className="hover:text-[#AFAE7E]">
                Prestataire
              </Link>
            )}
            {nav.adminFeg && (
              <Link href="/admin" className="hover:text-[#AFAE7E]">
                Admin FEG
              </Link>
            )}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <p className="text-sm font-semibold text-[#AFAE7E] uppercase tracking-wide">
          {role}
        </p>
        <h1 className="mt-1 text-3xl font-bold text-[#063D21]">{title}</h1>
        {(displayName || email) && (
          <p className="mt-1 text-sm text-neutral-500">
            Connecté en tant que {displayName || email}
          </p>
        )}
        <div className="mt-8">{children}</div>
      </main>
    </div>
  )
}
