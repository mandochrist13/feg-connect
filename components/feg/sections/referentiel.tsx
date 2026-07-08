import { Scale, Users, FileCheck2, Handshake } from "lucide-react"
import { Reveal } from "@/components/feg/reveal"

const pillars = [
  {
    letter: "A",
    Icon: Scale,
    title: "Gouvernance & Intégrité",
    desc: "Transparence de la direction, éthique des affaires et lutte contre la corruption.",
  },
  {
    letter: "B",
    Icon: Users,
    title: "Conformité sociale & RH",
    desc: "Respect du droit du travail, sécurité et bonnes pratiques de gestion des équipes.",
  },
  {
    letter: "C",
    Icon: FileCheck2,
    title: "Conformité administrative & traçabilité",
    desc: "Dossiers à jour, obligations fiscales et documentation vérifiable.",
  },
  {
    letter: "D",
    Icon: Handshake,
    title: "Fiabilité commerciale & qualité de service",
    desc: "Références clients, respect des délais et satisfaction des donneurs d'ordre.",
  },
]

export function Referentiel() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <Reveal className="flex flex-col justify-center gap-5">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-feg-green">
              Le référentiel
            </p>
            <h2 className="text-balance text-3xl font-bold text-feg-green sm:text-4xl">
              Quatre blocs d&apos;évaluation, un langage commun
            </h2>
            <p className="text-pretty text-lg leading-relaxed text-muted-ink">
              Chaque entreprise est évaluée sur le même référentiel A–D. Le résultat est un
              indice indicatif&nbsp;: un repère objectif et transparent qui éclaire la décision
              du donneur d&apos;ordre, sans jamais s&apos;y substituer.
            </p>
            <div className="mt-2 flex items-center gap-3 rounded-2xl border border-cool-200 bg-cool-50 p-4">
              <span className="font-display text-3xl font-extrabold text-feg-green">A–D</span>
              <p className="text-sm leading-snug text-muted-ink">
                Un score par bloc, agrégé en indice indicatif sur 100 — audité et surveillé
                chaque année.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-5 sm:grid-cols-2">
            {pillars.map(({ letter, Icon, title, desc }, i) => (
              <Reveal key={letter} delay={i * 100} className="h-full">
                <article className="group relative flex h-full flex-col gap-3 overflow-hidden rounded-2xl border border-feg-cream bg-white p-6 shadow-sm transition-all duration-500 ease-feg hover:-translate-y-1.5 hover:border-feg-khaki/60 hover:shadow-[0_24px_50px_-30px_rgba(20,56,35,0.35)]">
                  <span
                    className="pointer-events-none absolute -bottom-7 -right-2 font-display text-[7rem] font-extrabold leading-none text-feg-sand transition-colors duration-500 group-hover:text-feg-cream"
                    aria-hidden="true"
                  >
                    {letter}
                  </span>
                  <div className="relative flex items-center gap-3">
                    <span className="grid size-11 place-items-center rounded-xl bg-feg-light-green text-feg-green transition-colors duration-300 group-hover:bg-feg-forest group-hover:text-feg-cream">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <span className="rounded-full bg-cool-100 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-cool-700">
                      Bloc {letter}
                    </span>
                  </div>
                  <h3 className="relative text-base font-bold leading-snug text-feg-green">
                    {title}
                  </h3>
                  <p className="relative text-sm leading-relaxed text-muted-ink">{desc}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
