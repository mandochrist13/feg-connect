import { ArrowRight, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Reveal } from "@/components/feg/reveal"
import { RfpCard, type Rfp } from "@/components/feg/rfp-card"

const rfps: Rfp[] = [
  {
    sector: "BTP",
    title: "Construction d'un entrepôt logistique de 2 000 m² à Owendo",
    budget: "180 000 000 FCFA",
    deadline: "30 jours",
    image: "/images/rfp-btp.jpg",
    imageAlt: "Chantier de construction avec équipe en gilets de sécurité",
  },
  {
    sector: "Énergie",
    title: "Installation de panneaux solaires pour un site industriel",
    budget: "75 000 000 FCFA",
    deadline: "21 jours",
    image: "/images/rfp-energie.jpg",
    imageAlt: "Rangées de panneaux solaires sur un terrain dégagé",
  },
  {
    sector: "Services",
    title: "Prestation de nettoyage et maintenance d'immeubles de bureaux",
    budget: "12 000 000 FCFA",
    deadline: "14 jours",
    image: "/images/rfp-services.jpg",
    imageAlt: "Façades vitrées d'immeubles de bureaux vues en contre-plongée",
  },
]

export function Opportunities() {
  return (
    <section id="appels-offres" className="bg-feg-sand py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-feg-green">
              En ce moment
            </p>
            <h2 className="mt-3 text-balance text-3xl font-bold text-feg-green sm:text-4xl">
              Opportunités récentes
            </h2>
            <p className="mt-3 text-lg text-muted-ink">
              Les derniers appels d&apos;offres publiés par les donneurs d&apos;ordre du réseau.
            </p>
          </div>
          <Button
            variant="outline"
            className="group h-11 shrink-0 rounded-full border-[1.5px] border-feg-green bg-transparent px-5 font-semibold text-feg-green hover:bg-feg-light-green"
          >
            Tous les appels d&apos;offres
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {rfps.map((rfp, i) => (
            <Reveal key={rfp.title} delay={i * 110} className="h-full">
              <RfpCard rfp={rfp} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={200}>
          <p className="mt-8 flex items-start gap-2 text-sm text-muted-ink sm:items-center">
            <Info className="mt-0.5 size-4 shrink-0 text-feg-green sm:mt-0" aria-hidden="true" />
            Chaque appel d&apos;offres est visible par les entreprises membres du secteur
            concerné, dans l&apos;ordre de publication — la décision finale appartient toujours
            au donneur d&apos;ordre.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
