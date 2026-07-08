import { ArrowRight, FileText, ClipboardCheck, BadgeCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Reveal } from "@/components/feg/reveal"

const tiers = [
  {
    Icon: FileText,
    step: "Étape 1",
    title: "Frais de dossier",
    price: "100 000",
    note: "Ouverture et constitution du dossier d'adhésion.",
  },
  {
    Icon: ClipboardCheck,
    step: "Étape 2",
    title: "Audit tiers",
    price: "300 000",
    note: "Audit indépendant d'évaluation et calcul de l'indice indicatif.",
  },
  {
    Icon: BadgeCheck,
    step: "Étape 3",
    title: "Licence annuelle",
    price: "250 000",
    note: "Maintien du label et surveillance continue.",
  },
]

export function Pricing() {
  return (
    <section id="tarifs" className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-feg-green">Tarifs</p>
          <h2 className="mt-3 text-balance text-3xl font-bold text-feg-green sm:text-4xl">
            Une tarification claire et transparente
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-ink">
            Trois étapes, trois montants — aucun coût caché sur le parcours de certification.
          </p>
        </Reveal>

        <div className="relative mt-14 grid gap-6 md:grid-cols-3">
          <span
            className="pointer-events-none absolute left-[16%] right-[16%] top-14 hidden h-px bg-gradient-to-r from-transparent via-feg-khaki/50 to-transparent md:block"
            aria-hidden="true"
          />
          {tiers.map(({ Icon, step, title, price, note }, i) => (
            <Reveal key={title} delay={i * 110} className="h-full">
              <article className="group relative flex h-full flex-col gap-4 rounded-3xl border border-feg-cream bg-feg-sand p-8 transition-all duration-500 ease-feg hover:-translate-y-1.5 hover:border-feg-khaki/60 hover:shadow-[0_24px_50px_-30px_rgba(20,56,35,0.35)]">
                <span className="grid size-12 place-items-center rounded-2xl bg-feg-green text-white ring-8 ring-white transition-colors duration-300 group-hover:bg-feg-forest">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-cool-500">
                  {step}
                </span>
                <h3 className="text-lg font-bold text-feg-green">{title}</h3>
                <p className="flex items-baseline gap-1.5">
                  <span className="font-display text-3xl font-extrabold tracking-tight text-feg-forest">
                    {price}
                  </span>
                  <span className="text-sm font-semibold text-muted-ink">FCFA</span>
                </p>
                <p className="text-sm leading-relaxed text-muted-ink">{note}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-12 flex justify-center" delay={150}>
          <Button
            size="lg"
            className="group h-12 rounded-full bg-feg-green px-6 font-semibold text-white hover:bg-feg-forest"
          >
            Voir tous les tarifs
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </Reveal>
      </div>
    </section>
  )
}
