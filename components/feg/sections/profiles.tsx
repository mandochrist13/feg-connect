import Image from "next/image"
import { Briefcase, Building2, ShieldCheck, Check, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Reveal } from "@/components/feg/reveal"
import { cn } from "@/lib/utils"

const profiles = [
  {
    Icon: Briefcase,
    tag: "Donneur d'ordre",
    title: "Trouvez en confiance",
    bullets: [
      "Publier un appel d'offres en quelques minutes",
      "Présélection automatique de 3 à 5 prestataires certifiés",
      "Décision finale et contractualisation en ligne",
    ],
    cta: "Publier un besoin",
    featured: true,
    disabled: false,
  },
  {
    Icon: Building2,
    tag: "Prestataire",
    title: "Gagnez en visibilité",
    bullets: [
      "Profil entreprise détaillé et vérifiable",
      "Réponse directe aux appels d'offres du réseau",
      "Indice indicatif & Label FEG certifié",
    ],
    cta: "Créer mon profil",
    featured: false,
    disabled: false,
  },
  // {
  //   Icon: ShieldCheck,
  //   tag: "Admin FEG",
  //   title: "Garantissez le cadre",
  //   bullets: [
  //     "Vérification des dossiers de certification",
  //     "Attribution des badges du Label FEG",
  //     "Supervision de la qualité de la plateforme",
  //   ],
  //   cta: "Accès réservé",
  //   featured: false,
  //   disabled: true,
  // },
]

export function Profiles() {
  return (
    <section id="comment" className="relative overflow-hidden bg-feg-sand py-20 lg:py-28">
      <div
        className="pointer-events-none absolute -right-32 -top-32 size-96 rounded-full bg-feg-cream blur-3xl"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-feg-green">
            Comment ça marche
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold text-feg-green sm:text-4xl">
            Une plateforme, trois profils
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-ink">
            Chaque rôle dispose de son propre espace. La FEG atteste la fiabilité, la décision
            appartient au donneur d&apos;ordre.
          </p>
        </Reveal>

        <Reveal delay={100}>
          <figure className="relative mt-12 h-64 overflow-hidden rounded-3xl shadow-[0_30px_60px_-30px_rgba(10,38,22,0.45)] sm:h-80 lg:h-96">
            <Image
              src="/images/profiles-meeting.jpg"
              alt="Professionnels réunis autour d'une table de conseil lors d'une séance de travail"
              fill
              sizes="(min-width: 1280px) 1216px, 100vw"
              className="object-cover"
            />
            {/* Voile vert FEG pour garder une tonalité froide et institutionnelle */}
            <div
              className="absolute inset-0 bg-linear-to-t from-feg-deep/80 via-feg-forest/25 to-feg-forest/10"
              aria-hidden="true"
            />
            <figcaption className="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-6 text-white sm:p-8">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-feg-gold-soft">
                Le réseau en action
              </span>
              <span className="max-w-xl text-sm leading-relaxed text-white/85 sm:text-base">
                Donneurs d&apos;ordre et prestataires certifiés collaborent dans un cadre
                standardisé — chaque décision reste celle du donneur d&apos;ordre.
              </span>
            </figcaption>
          </figure>
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {profiles.map((p, i) => (
            <Reveal key={p.tag} delay={i * 110} className="h-full">
              <article
                className={cn(
                  "group flex h-full flex-col gap-6 rounded-3xl p-8 transition-all duration-500 ease-feg hover:-translate-y-1.5",
                  p.featured
                    ? "bg-feg-forest text-white shadow-[0_30px_60px_-30px_rgba(10,38,22,0.6)] hover:shadow-[0_36px_70px_-30px_rgba(10,38,22,0.7)]"
                    : "border border-feg-cream bg-white shadow-sm hover:border-feg-khaki/60 hover:shadow-[0_24px_50px_-30px_rgba(20,56,35,0.35)]",
                )}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      "grid size-12 place-items-center rounded-2xl transition-colors duration-300",
                      p.featured
                        ? "bg-feg-amber text-feg-deep"
                        : "bg-feg-light-green text-feg-green group-hover:bg-feg-green group-hover:text-white",
                    )}
                  >
                    <p.Icon className="size-6" aria-hidden="true" />
                  </span>
                  <span
                    className={cn(
                      "rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider",
                      p.featured ? "bg-white/10 text-feg-gold-soft" : "bg-cool-100 text-cool-700",
                    )}
                  >
                    {p.tag}
                  </span>
                </div>

                <h3
                  className={cn(
                    "text-2xl font-bold",
                    p.featured ? "text-white" : "text-feg-green",
                  )}
                >
                  {p.title}
                </h3>

                <ul className="flex flex-col gap-3.5">
                  {p.bullets.map((b) => (
                    <li
                      key={b}
                      className={cn(
                        "flex items-start gap-2.5 text-sm leading-relaxed",
                        p.featured ? "text-white/75" : "text-muted-ink",
                      )}
                    >
                      <Check
                        className={cn(
                          "mt-0.5 size-4 shrink-0",
                          p.featured ? "text-feg-amber-bright" : "text-feg-green",
                        )}
                        aria-hidden="true"
                      />
                      {b}
                    </li>
                  ))}
                </ul>

                <Button
                  disabled={p.disabled}
                  className={cn(
                    "group/btn mt-auto h-11 justify-between rounded-full px-5 font-semibold",
                    p.featured
                      ? "bg-feg-amber text-feg-deep hover:bg-feg-amber-bright"
                      : "border-[1.5px] border-feg-green bg-transparent text-feg-green hover:bg-feg-light-green disabled:border-border disabled:text-muted-foreground",
                  )}
                  variant={p.featured ? "default" : "outline"}
                >
                  {p.cta}
                  <ArrowRight
                    className="size-4 transition-transform duration-300 group-hover/btn:translate-x-1"
                    aria-hidden="true"
                  />
                </Button>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
