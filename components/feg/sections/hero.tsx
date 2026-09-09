import type { CSSProperties } from "react"
import { ArrowRight, ShieldCheck, Gauge, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { HeroSectors } from "@/components/feg/hero-sectors"
import { Underline } from "@/components/feg/underline"
import { FEG_ADHESION_URL } from "@/lib/feg-links"

export function Hero() {
  return (
    <section id="accueil" className="relative overflow-hidden bg-white">
      {/* Fond du hero : diaporama des secteurs (BTP, Bois, Transport, Services, Mines) */}
      <HeroSectors />

      <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-36 sm:px-6 lg:pb-28 lg:pt-44">
        <div className="flex max-w-2xl flex-col gap-6">
          {/* <span
            className="feg-enter inline-flex w-fit items-center gap-2.5 rounded-full border border-feg-green/15 bg-feg-light-green/60 px-4 py-1.5 text-xs font-semibold tracking-wide text-feg-green"
            style={{ "--enter-delay": "0ms" } as CSSProperties}
          >
            <span className="size-1.5 rounded-full bg-feg-gold" aria-hidden="true" />
            Plateforme officielle de la Fédération des Entreprises du Gabon
          </span> */}

          <h1
            className="feg-enter text-balance text-4xl font-extrabold leading-[1.06] text-feg-green sm:text-5xl lg:text-[3.6rem]"
            style={{ "--enter-delay": "100ms" } as CSSProperties}
          >
            La sous-traitance B2B au <Underline>Gabon</Underline>.
          </h1>

          <p
            className="feg-enter max-w-xl text-pretty text-lg leading-relaxed text-muted-ink"
            style={{ "--enter-delay": "200ms" } as CSSProperties}
          >
            FEG Connect est un outil de la Fédération des Entreprises du Gabon, qui met en relation donneurs d&apos;ordre et entreprises membres de la FEG.
            {/* le réseau du secteur privé formel gabonais. */}
          </p>

          <div
            className="feg-enter flex flex-col gap-3 sm:flex-row"
            style={{ "--enter-delay": "300ms" } as CSSProperties}
          >
            <Button
              asChild
              size="lg"
              variant="feg"
              className="group h-12 min-w-50 px-6 text-base font-semibold"
            >
              <a href="/dashboard">
                Publier un appel d&apos;offres
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="fegGold"
              className="h-12 min-w-50 px-6 text-base font-semibold"
            >
              <a href={FEG_ADHESION_URL}>Devenir prestataire</a>
            </Button>
          </div>

          {/* <div
            className="feg-enter mt-2 flex flex-wrap items-center gap-x-7 gap-y-3 border-t border-feg-green/10 pt-6 text-sm font-medium text-muted-ink"
            style={{ "--enter-delay": "420ms" } as CSSProperties}
          >
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="size-4 text-feg-green" aria-hidden="true" />
              Label FEG — conformité vérifiée
            </span>
            <span className="inline-flex items-center gap-2">
              <Gauge className="size-4 text-feg-green" aria-hidden="true" />
              Présélection automatique
            </span>
            <span className="inline-flex items-center gap-2">
              <Building2 className="size-4 text-feg-green" aria-hidden="true" />
              Réseau d&apos;entreprises pilotes
            </span>
          </div> */}
        </div>
      </div>
    </section>
  )
}
