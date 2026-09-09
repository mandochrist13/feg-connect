import { redirect } from "next/navigation"
import { ExternalLink, Hourglass, RefreshCw } from "lucide-react"
import { getFegSession } from "@/lib/feg-session"
import { ESPACE_ADHERENT_URL } from "@/lib/feg-links"
import { FegLogo } from "@/components/feg/feg-logo"
import { Button } from "@/components/ui/button"

const STEPS = [
  "Demande d'adhésion sur le site de la FEG",
  "Paiement des frais (dossier, audit, licence annuelle)",
  "Vérification de conformité des documents par la FEG",
  "Délivrance du Label FEG",
  "Accès à FEG Connect via votre Espace Adhérent",
]

/**
 * Atteint quand proxy.ts a laissé passer une session valide mais que
 * labelStatus n'est pas DELIVRE (ou absent — jeton émis avant l'ajout de ce
 * claim). Pas de zone métier ici (spec : page d'état, hors accès).
 */
export default async function EligibilitePage() {
  const session = await getFegSession()
  if (!session?.id) redirect("/")

  const labelStatus = session.labelStatus
  const isStaleToken = labelStatus === undefined

  const loginRefreshUrl = new URL("/user/login", ESPACE_ADHERENT_URL)
  loginRefreshUrl.searchParams.set("callbackUrl", "/eligibilite")

  return (
    <main className="flex min-h-screen items-center justify-center bg-cool-50 p-6">
      <div className="w-full max-w-lg rounded-2xl border border-cool-200 bg-white p-6 shadow-sm sm:p-8">
        <FegLogo />

        <p className="mt-6 text-xs font-bold uppercase tracking-[0.16em] text-feg-gold-deep">
          Plateforme Sous-traitance &amp; Cotraitance
        </p>
        <h1 className="mt-1 text-2xl font-bold text-feg-green">
          Accès réservé aux membres labellisés
        </h1>

        {labelStatus === "EN_COURS" && (
          <div className="mt-4 flex items-start gap-3 rounded-xl border border-feg-green/20 bg-feg-light-green px-4 py-3">
            <Hourglass className="mt-0.5 size-4 shrink-0 text-feg-green" aria-hidden="true" />
            <p className="text-sm text-feg-green">
              Votre dossier est en cours d’examen par la FEG.
            </p>
          </div>
        )}

        {isStaleToken && (
          <div className="mt-4 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
            <RefreshCw className="mt-0.5 size-4 shrink-0 text-amber-800" aria-hidden="true" />
            <p className="text-sm text-amber-800">
              Votre session ne porte pas encore l’information la plus récente sur
              votre Label. Actualisez-la depuis l’Espace Adhérent.
            </p>
          </div>
        )}

        <p className="mt-4 text-sm text-muted-ink">
          FEG Connect s’ouvre aux entreprises membres de la FEG une fois leur
          Label délivré. Le parcours complet&nbsp;:
        </p>

        <ol className="mt-5">
          {STEPS.map((step, i) => {
            const isLast = i === STEPS.length - 1
            return (
              <li key={step} className="relative flex gap-4 pb-6 last:pb-0">
                {!isLast && (
                  <span
                    aria-hidden="true"
                    className="absolute left-3.5 top-8 h-[calc(100%-2rem)] w-px bg-cool-200"
                  />
                )}
                <span
                  className={
                    isLast
                      ? "grid size-7 shrink-0 place-items-center rounded-full bg-feg-green text-xs font-bold text-white"
                      : "grid size-7 shrink-0 place-items-center rounded-full border border-feg-green/20 bg-feg-light-green text-xs font-bold text-feg-green"
                  }
                >
                  {i + 1}
                </span>
                <span className="pt-1 text-sm leading-relaxed text-cool-700">
                  {step}
                </span>
              </li>
            )
          })}
        </ol>

        <div className="mt-6 flex flex-col gap-2.5">
          {isStaleToken && (
            <Button asChild variant="fegOutline" size="lg" className="w-full">
              <a href={loginRefreshUrl.toString()}>
                <RefreshCw className="size-4" aria-hidden="true" />
                Actualiser ma session
              </a>
            </Button>
          )}
          <Button asChild variant="feg" size="lg" className="w-full">
            <a href={ESPACE_ADHERENT_URL}>
              Aller à l’Espace Adhérent
              <ExternalLink className="size-4" aria-hidden="true" />
            </a>
          </Button>
        </div>
      </div>
    </main>
  )
}
