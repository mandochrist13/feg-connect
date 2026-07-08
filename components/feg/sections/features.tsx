import Image from "next/image"
import { ListChecks, SlidersHorizontal, MessageSquareLock, LayoutDashboard } from "lucide-react"
import { Reveal } from "@/components/feg/reveal"
import { cn } from "@/lib/utils"

const features = [
  {
    Icon: ListChecks,
    tag: "Présélection",
    title: "Présélection automatique",
    desc: "Pour chaque appel d'offres, la plateforme présélectionne automatiquement 3 à 5 prestataires certifiés correspondant au besoin. Le donneur d'ordre garde l'entière décision.",
    image: "/images/FB_IMG_1716703640609.jpg",
    alt: "Ouvriers et engins de chantier sur un site de construction certifié à Libreville",
  },
  {
    Icon: SlidersHorizontal,
    tag: "Comparaison",
    title: "Comparateur multicritères",
    desc: "Comparez les candidats selon l'indice indicatif, le prix, le délai et les badges de certification obtenus — en un seul coup d'œil, en toute transparence.",
    image: "/images/FB_IMG_1763665700884.jpg",
    alt: "Immeubles en construction alignés — projet Gabon Développement à Libreville",
  },
  {
    Icon: MessageSquareLock,
    tag: "Sécurité",
    title: "Messagerie sécurisée",
    desc: "Échangez en toute sécurité : coordonnées masquées et dispositif anti-contournement pour protéger les deux parties et la plateforme.",
    image: "/images/DSC04776.webp",
    alt: "Professionnels devant un immeuble de bureaux moderne à Libreville",
  },
  {
    Icon: LayoutDashboard,
    tag: "Pilotage",
    title: "Tableau de bord temps réel",
    desc: "Un tableau de bord adapté à chaque rôle pour suivre vos appels d'offres, vos candidatures et votre indice indicatif en direct.",
    image: "/images/sector-numerique.jpg",
    alt: "Infrastructure numérique — carte électronique en gros plan",
  },
]

export function Features() {
  return (
    <section className="relative overflow-hidden bg-feg-sand py-20 lg:py-28">
      <div
        className="pointer-events-none absolute -left-32 top-40 size-96 rounded-full bg-feg-cream blur-3xl"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-feg-green">
            Fonctionnalités
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold text-feg-green sm:text-4xl">
            Des outils pensés pour la confiance
          </h2>
        </Reveal>

        <div className="mt-16 flex flex-col gap-20 lg:gap-28">
          {features.map((f, i) => {
            const reversed = i % 2 === 1
            return (
              <div key={f.title} className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
                <Reveal className={cn(reversed && "lg:order-2")} delay={80}>
                  <div className="flex items-center gap-3">
                    <span className="grid size-12 place-items-center rounded-2xl bg-feg-green text-white">
                      <f.Icon className="size-6" aria-hidden="true" />
                    </span>
                    <span className="rounded-full bg-feg-light-green px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-feg-green">
                      {f.tag}
                    </span>
                  </div>
                  <h3 className="mt-6 text-2xl font-bold text-feg-green sm:text-3xl">{f.title}</h3>
                  <p className="mt-4 max-w-md text-pretty text-lg leading-relaxed text-muted-ink">
                    {f.desc}
                  </p>
                  <span
                    className="mt-6 block h-1 w-14 rounded-full bg-feg-green"
                    aria-hidden="true"
                  />
                </Reveal>
                <Reveal className={cn(reversed && "lg:order-1")} delay={180}>
                  <div
                    className={cn(
                      "group relative overflow-hidden rounded-3xl border border-feg-cream shadow-[0_30px_60px_-35px_rgba(20,56,35,0.45)]",
                      reversed ? "lg:-rotate-1" : "lg:rotate-1",
                      "transition-transform duration-700 ease-feg lg:hover:rotate-0",
                    )}
                  >
                    <Image
                      src={f.image}
                      alt={f.alt}
                      width={640}
                      height={460}
                      className="h-full w-full object-cover transition-transform duration-700 ease-feg group-hover:scale-[1.04]"
                    />
                    <div
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-feg-forest/25 via-transparent to-transparent"
                      aria-hidden="true"
                    />
                  </div>
                </Reveal>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
