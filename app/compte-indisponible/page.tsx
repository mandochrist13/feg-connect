import { redirect } from "next/navigation"
import { Mail, MapPin, Phone } from "lucide-react"
import { getFegSession } from "@/lib/feg-session"
import { ESPACE_ADHERENT_URL } from "@/lib/feg-links"
import { FegLogo } from "@/components/feg/feg-logo"
import { Button } from "@/components/ui/button"

/**
 * Atteint quand proxy.ts a laissé passer une session valide mais que
 * statutAdhesion est SUSPENDU ou INACTIF. Message sobre, sans détail sur le
 * motif (spec : page d'état, hors accès métier).
 */
export default async function CompteIndisponiblePage() {
  const session = await getFegSession()
  if (!session?.id) redirect("/")

  return (
    <main className="flex min-h-screen items-center justify-center bg-cool-50 p-6">
      <div className="w-full max-w-lg rounded-2xl border border-cool-200 bg-white p-6 shadow-sm sm:p-8">
        <FegLogo />

        <p className="mt-6 text-xs font-bold uppercase tracking-[0.16em] text-feg-gold-deep">
          Plateforme Sous-traitance &amp; Cotraitance
        </p>
        <h1 className="mt-1 text-2xl font-bold text-feg-green">
          Accès indisponible
        </h1>
        <p className="mt-3 text-sm text-muted-ink">
          Votre accès à FEG Connect est actuellement indisponible. Merci de
          régulariser votre situation auprès de la FEG.
        </p>

        <ul className="mt-6 space-y-3 rounded-xl border border-cool-200 bg-cool-50 p-4 text-sm text-cool-700">
          <li className="flex items-start gap-3">
            <MapPin className="mt-0.5 size-4 shrink-0 text-feg-green" aria-hidden="true" />
            Immeuble Odyssée, BP 410 Libreville
          </li>
          <li className="flex items-center gap-3">
            <Phone className="size-4 shrink-0 text-feg-green" aria-hidden="true" />
            (+241) 065 81 57 38
          </li>
          <li className="flex items-center gap-3">
            <Mail className="size-4 shrink-0 text-feg-green" aria-hidden="true" />
            info@lafeg.ga
          </li>
        </ul>

        <Button asChild variant="feg" size="lg" className="mt-6 w-full">
          <a href={ESPACE_ADHERENT_URL}>Retour à l’Espace Adhérent</a>
        </Button>
      </div>
    </main>
  )
}
