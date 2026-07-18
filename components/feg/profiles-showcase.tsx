"use client"

import { useState } from "react"
import Image from "next/image"
import { Briefcase, Handshake, Wrench, Check, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/**
 * « Trois profils » présentés en panneaux-images extensibles (sans cards).
 * Au survol (desktop) ou au tap (mobile), le panneau actif s'agrandit et
 * dévoile ses avantages + CTA. En dessous de lg, les panneaux sont empilés
 * et toujours ouverts. Le panneau « Donneur d'ordre » est ouvert par défaut.
 */
const profiles = [
  {
    Icon: Briefcase,
    tag: "Donneur d'ordre",
    title: "Trouvez en confiance",
    bullets: [
      "Publier un appel d'offres en quelques minutes",
      "Accès direct aux entreprises membres du réseau FEG",
      "Décision finale et contractualisation en ligne",
    ],
    cta: "Publier un besoin",
    img: "/images/donneur-ordre.jpg",
    alt: "Chef d'entreprise en costume étudiant un dossier dans son bureau",
    objectPos: "center 25%",
    featured: true,
  },
  {
    Icon: Handshake,
    tag: "Co-traitant",
    title: "Répondez en groupement",
    bullets: [
      "Constituer un GME solidaire ou conjoint",
      "Mutualiser capacités et références pour viser plus grand",
      "Un mandataire unique face au donneur d'ordre",
    ],
    cta: "Rejoindre un groupement",
    img: "/images/label-handshake.jpg",
    alt: "Poignée de main scellant un groupement d'entreprises",
    featured: false,
  },
  {
    Icon: Wrench,
    tag: "Sous-traitant",
    title: "Gagnez en visibilité",
    bullets: [
      "Profil entreprise détaillé et vérifiable",
      "Exécuter une partie des marchés du réseau",
      "Label FEG en appui — un gage de confiance",
    ],
    cta: "Créer mon profil",
    img: "/images/rfp-btp.jpg",
    alt: "Ouvriers en gilet et casque sur un chantier de construction",
    featured: false,
  },
]

export function ProfilesShowcase() {
  const [active, setActive] = useState(0)

  return (
    <div className="mt-12 flex flex-col gap-4 lg:h-120 lg:flex-row">
      {profiles.map((p, i) => {
        const isActive = i === active
        return (
          <button
            key={p.tag}
            type="button"
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            onClick={() => setActive(i)}
            aria-expanded={isActive}
            style={{ flexGrow: isActive ? 5 : 1.4 }}
            className={cn(
              "group relative min-h-100 basis-0 cursor-pointer overflow-hidden rounded-3xl text-left outline-none ring-feg-green/40 transition-[flex-grow] duration-700 ease-feg focus-visible:ring-2 sm:min-h-88 lg:h-full lg:min-h-0",
              isActive
                ? "shadow-[0_36px_70px_-30px_rgba(10,38,22,0.7)]"
                : "shadow-[0_24px_50px_-30px_rgba(20,56,35,0.45)]",
            )}
          >
            <Image
              src={p.img}
              alt={p.alt}
              fill
              sizes="(min-width: 1024px) 60vw, 100vw"
              style={{ objectPosition: p.objectPos ?? "center" }}
              className={cn(
                "object-cover transition-transform duration-[1200ms] ease-feg",
                isActive ? "scale-105" : "scale-100 group-hover:scale-105",
              )}
            />

            {/* Voile vert FEG — tonalité institutionnelle + lisibilité du texte */}
            <div
              className={cn(
                "absolute inset-0 transition-opacity duration-700",
                isActive
                  ? "bg-linear-to-t from-feg-deep/92 via-feg-forest/45 to-feg-forest/10"
                  : "bg-linear-to-t from-feg-deep/85 via-feg-forest/55 to-feg-forest/35",
              )}
              aria-hidden="true"
            />

            {/* Numéro filigrane */}
            <span
              className="pointer-events-none absolute right-5 top-4 font-display text-6xl font-extrabold text-white/20 transition-colors duration-500 group-hover:text-feg-gold-soft/40"
              aria-hidden="true"
            >
              {String(i + 1).padStart(2, "0")}
            </span>

            {/* Contenu bas */}
            <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-6 text-white lg:p-7">
              <div className="flex items-center gap-3">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white/15 text-white ring-1 ring-white/25 backdrop-blur-sm transition-colors duration-300 group-hover:bg-feg-amber group-hover:text-feg-deep group-hover:ring-feg-amber">
                  <p.Icon className="size-5" aria-hidden="true" />
                </span>
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-feg-gold-soft">
                  {p.tag}
                </span>
              </div>

              <h3 className="text-balance text-xl font-bold leading-tight sm:text-2xl">
                {p.title}
              </h3>

              {/* Détails révélés quand le panneau est actif (toujours visibles < lg) */}
              <div
                className={cn(
                  "grid transition-all duration-500 ease-feg",
                  "grid-rows-[1fr] opacity-100",
                  "lg:grid-rows-[0fr] lg:opacity-0",
                  isActive && "lg:grid-rows-[1fr] lg:opacity-100",
                )}
              >
                <div className="overflow-hidden">
                  <ul className="flex flex-col gap-2.5 pt-1">
                    {p.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2.5 text-sm leading-relaxed text-white/85">
                        <Check className="mt-0.5 size-4 shrink-0 text-feg-amber-bright" aria-hidden="true" />
                        {b}
                      </li>
                    ))}
                  </ul>

                  <Button
                    asChild
                    className={cn(
                      "group/btn mt-5 h-11 w-full justify-between rounded-full px-5 font-semibold sm:w-auto",
                      p.featured
                        ? "bg-feg-amber text-feg-deep hover:bg-feg-amber-bright"
                        : "bg-white/95 text-feg-green hover:bg-white",
                    )}
                  >
                    <span>
                      {p.cta}
                      <ArrowRight
                        className="ml-2 inline size-4 transition-transform duration-300 group-hover/btn:translate-x-1"
                        aria-hidden="true"
                      />
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
