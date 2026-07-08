import { ShieldOff, FileWarning, AlertTriangle, Lock } from "lucide-react"
import { Reveal } from "@/components/feg/reveal"

const problems = [
  {
    Icon: ShieldOff,
    title: "Manque de confiance entre entreprises",
    desc: "Difficile d'évaluer la fiabilité réelle d'un partenaire avant de s'engager.",
  },
  {
    Icon: FileWarning,
    title: "Aucune standardisation documentaire",
    desc: "Des dossiers hétérogènes qui ralentissent et fragilisent la contractualisation.",
  },
  {
    Icon: AlertTriangle,
    title: "Risques réputationnels sur les partenaires",
    desc: "Une défaillance d'un sous-traitant peut compromettre tout le projet.",
  },
  {
    Icon: Lock,
    title: "PME exclues des grands marchés",
    desc: "Les petites structures peinent à accéder aux donneurs d'ordre du réseau.",
  },
]

export function Problem() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-feg-green">
            Le constat
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold text-feg-green sm:text-4xl">
            Pourquoi une plateforme FEG&nbsp;?
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-ink">
            Les relations B2B au Gabon se heurtent à des freins structurels que FEG Connect
            résout par la certification et la standardisation.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {problems.map(({ Icon, title, desc }, i) => (
            <Reveal key={title} delay={i * 90}>
              <article className="group relative flex h-full flex-col gap-4 overflow-hidden rounded-2xl border border-feg-cream bg-feg-sand p-6 transition-all duration-500 ease-feg hover:-translate-y-1.5 hover:border-feg-khaki/60 hover:shadow-[0_24px_50px_-30px_rgba(20,56,35,0.35)]">
                <span
                  className="pointer-events-none absolute -right-3 -top-5 font-display text-7xl font-extrabold text-feg-forest/[0.06] transition-colors duration-500 group-hover:text-feg-green/15"
                  aria-hidden="true"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="grid size-11 place-items-center rounded-xl bg-feg-green text-white transition-colors duration-300 group-hover:bg-feg-forest">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="text-base font-bold leading-snug text-ink">{title}</h3>
                <p className="text-sm leading-relaxed text-muted-ink">{desc}</p>
                <span
                  className="mt-auto h-0.5 w-8 rounded-full bg-cool-200 transition-all duration-500 ease-feg group-hover:w-full group-hover:bg-feg-green"
                  aria-hidden="true"
                />
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
