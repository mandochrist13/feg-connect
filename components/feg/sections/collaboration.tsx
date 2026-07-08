import Image from "next/image"
import { Reveal } from "@/components/feg/reveal"

const modes = [
  {
    title: "Sous-traitance",
    desc: "Délégation d'une partie du contrat à un prestataire spécialisé.",
  },
  {
    title: "GME Solidaire",
    desc: "Solidarité totale du groupement face au donneur d'ordre.",
  },
  {
    title: "GME Conjoint",
    desc: "Responsabilité limitée au lot attribué à chaque membre.",
  },
  {
    title: "Hybride",
    desc: "Mandataire solidaire associé à des membres conjoints.",
  },
]

export function Collaboration() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-feg-green">
            Cadre juridique
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold text-feg-green sm:text-4xl">
            Des modalités de collaboration adaptées
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-ink">
            Choisissez le cadre qui correspond à votre projet et à votre niveau de
            responsabilité.
          </p>
        </Reveal>

        <Reveal delay={100}>
          <figure className="relative mt-12 h-64 overflow-hidden rounded-3xl shadow-[0_30px_60px_-30px_rgba(10,38,22,0.45)] sm:h-80">
            <Image
              src="/images/556371082_767582622721568_892145445618033723_n-1.webp"
              alt="Vue aérienne d'un grand projet de développement en bord de mer à Libreville"
              fill
              sizes="(min-width: 1280px) 1216px, 100vw"
              className="object-cover"
            />
            {/* Voile vert FEG pour l'unité visuelle et la lisibilité de la légende */}
            <div
              className="absolute inset-0 bg-linear-to-t from-feg-deep/80 via-feg-forest/25 to-feg-forest/10"
              aria-hidden="true"
            />
            <figcaption className="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-6 text-white sm:p-8">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-feg-gold-soft">
                Des projets d&apos;envergure
              </span>
              <span className="max-w-xl text-sm leading-relaxed text-white/85 sm:text-base">
                Sous-traitance, groupements solidaires ou conjoints — chaque grand chantier du
                réseau mobilise plusieurs entreprises certifiées autour d&apos;un même objectif.
              </span>
            </figcaption>
          </figure>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {modes.map((m, i) => (
            <Reveal key={m.title} delay={i * 90} className="h-full">
              <article className="group relative flex h-full flex-col gap-3 overflow-hidden rounded-2xl border-t-4 border-cool-200 bg-cool-50 p-6 transition-all duration-500 ease-feg hover:-translate-y-1.5 hover:border-feg-green hover:shadow-[0_24px_50px_-30px_rgba(15,23,42,0.25)]">
                <span className="font-display text-sm font-extrabold tracking-widest text-cool-500 transition-colors duration-300 group-hover:text-feg-green">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-lg font-bold text-feg-green">{m.title}</h3>
                <p className="text-sm leading-relaxed text-muted-ink">{m.desc}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
