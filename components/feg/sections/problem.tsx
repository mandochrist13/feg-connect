import Image from "next/image"
import { SearchX, Network, ShieldQuestion, Lock } from "lucide-react"
import { Reveal } from "@/components/feg/reveal"
import { Underline } from "@/components/feg/underline"

const problems = [
  {
    Icon: SearchX,
    title: "Trouver un partenaire fiable",
    desc: "Le bouche-à-oreille et l'informel dominent — peu de visibilité sur les entreprises structurées du secteur formel.",
    img: "/images/label-handshake.jpg",
    alt: "Deux dirigeants concluent un accord par une poignée de main dans un bureau",
  },
  {
    Icon: Network,
    title: "Un réseau dispersé",
    desc: "Aucun point d'entrée unique pour rencontrer les entreprises membres de la FEG, toutes issues du secteur privé formel.",
    img: "/images/cta-port.jpg",
    alt: "Vue aérienne d'un port à conteneurs illustrant un réseau économique éclaté",
  },
  {
    Icon: ShieldQuestion,
    title: "Confiance difficile à établir",
    desc: "Sans cadre commun ni réseau de référence, évaluer le sérieux d'un partenaire avant de s'engager reste un pari.",
    img: "/images/profiles-meeting.jpg",
    alt: "Professionnels réunis autour d'une table de conseil pour évaluer un partenariat",
  },
  {
    Icon: Lock,
    title: "PME à l'écart des grands marchés",
    desc: "Les petites structures formelles peinent à accéder aux donneurs d'ordre du réseau.",
    img: "/images/DSC04776.webp",
    alt: "Siège d'entreprise moderne en verre symbolisant les grands donneurs d'ordre",
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
            Pourquoi une <Underline> plateforme </Underline>&nbsp;FEG ?
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-ink">
            Les relations B2B au Gabon se heurtent à des freins structurels que FEG Connect
            résout en mettant en relation les entreprises membres de la FEG - le réseau du
            secteur privé formel.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {problems.map(({ Icon, title, desc, img, alt }, i) => (
            <Reveal key={title} delay={i * 90}>
              <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-feg-cream bg-white transition-all duration-500 ease-feg hover:-translate-y-1.5 hover:border-feg-khaki/60 hover:shadow-[0_24px_50px_-30px_rgba(20,56,35,0.35)]">
                <div className="relative h-40 overflow-hidden">
                  <Image
                    src={img}
                    alt={alt}
                    fill
                    sizes="(min-width: 1024px) 304px, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-900 ease-feg group-hover:scale-105"
                  />
                  {/* Voile vert FEG — tonalité institutionnelle et lisibilité du numéro */}
                  <div
                    className="absolute inset-0 bg-linear-to-t from-feg-deep/85 via-feg-forest/30 to-feg-forest/5"
                    aria-hidden="true"
                  />
                  <span
                    className="pointer-events-none absolute right-3 top-2 font-display text-5xl font-extrabold text-white/25 transition-colors duration-500 group-hover:text-feg-gold-soft/60"
                    aria-hidden="true"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className="relative flex flex-1 flex-col gap-3 p-6 pt-0">
                  <span className="-mt-6 grid size-12 place-items-center rounded-xl bg-feg-green text-white shadow-[0_10px_24px_-10px_rgba(20,56,35,0.7)] ring-4 ring-white transition-colors duration-300 group-hover:bg-feg-forest">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <h3 className="text-base font-bold leading-snug text-ink">{title}</h3>
                  <p className="text-sm leading-relaxed text-muted-ink">{desc}</p>
                  <span
                    className="mt-auto h-0.5 w-8 rounded-full bg-cool-200 transition-all duration-500 ease-feg group-hover:w-full group-hover:bg-feg-green"
                    aria-hidden="true"
                  />
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
