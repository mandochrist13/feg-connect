import type { CSSProperties } from "react"
import { ArrowRight, ShieldCheck, Gauge, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { HeroSectors } from "@/components/feg/hero-sectors"

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
            La sous-traitance B2B au {" "}
            <span className="relative inline-block">
              Gabon
              <svg
                className="absolute -bottom-1.5 left-0 w-full text-feg-gold"
                viewBox="0 0 200 10"
                fill="none"
                aria-hidden="true"
                preserveAspectRatio="none"
              >
                <path d="M2 7C60 2 140 2 198 6" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </span>
            .
          </h1>

          <p
            className="feg-enter max-w-xl text-pretty text-lg leading-relaxed text-muted-ink"
            style={{ "--enter-delay": "200ms" } as CSSProperties}
          >
            FEG Connect met en relation donneurs d&apos;ordre et prestataires certifiés par le
            Label FEG. Présélection automatique, indice indicatif transparent — la décision
            reste toujours celle du donneur d&apos;ordre.
          </p>

          <div
            className="feg-enter flex flex-col gap-3 sm:flex-row"
            style={{ "--enter-delay": "300ms" } as CSSProperties}
          >
            <Button
              size="lg"
              className="group h-12 bg-feg-green px-6 text-base font-semibold text-white hover:bg-feg-green/90"
            >
              Publier un appel d&apos;offres
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 border-[1.5px] border-feg-green bg-transparent px-6 text-base font-semibold text-feg-green hover:bg-feg-light-green"
            >
              Devenir prestataire certifié
            </Button>
          </div>

          {/* <div
            className="feg-enter mt-2 flex flex-wrap items-center gap-x-7 gap-y-3 border-t border-feg-green/10 pt-6 text-sm font-medium text-muted-ink"
            style={{ "--enter-delay": "420ms" } as CSSProperties}
          >
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="size-4 text-feg-green" aria-hidden="true" />
              Label FEG — marque OAPI
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
