import Image from "next/image"
import { Reveal } from "@/components/feg/reveal"
import { Parallax } from "@/components/feg/parallax"
import { LevelsRoadmap } from "@/components/feg/levels-roadmap"
import { Underline } from "@/components/feg/underline"
import { cn } from "@/lib/utils"

const levels = [
  {
    level: "none" as const,
    title: "Non certifié",
    desc: "Profil en cours de constitution — visibilité limitée sur la plateforme.",
    highlight: false,
  },
  {
    level: "member" as const,
    title: "Membre FEG",
    desc: "Adhésion validée et documents administratifs conformes au référentiel.",
    highlight: false,
  },
  {
    level: "certified" as const,
    title: "Certifié FEG",
    desc: "Indice élevé et audit tiers conforme — attestation de fiabilité, sans recommandation.",
    highlight: true,
  },
]

const steps = [
  "Candidature",
  "Auto-évaluation",
  "Audit tiers",
  "Calcul de l'indice",
  "Licence",
  "Remise du label",
  "Surveillance annuelle",
]

export function Label() {
  return (
    <section id="label" className="relative overflow-hidden bg-feg-forest py-20 text-white lg:py-28">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {/* Image de fond en parallaxe, fondue en vert FEG pour rester lisible */}
        <Parallax speed={0.18} className="absolute inset-x-0 -top-[12%] h-[124%]">
          <Image src="/images/sector-btp.jpg" alt="" fill sizes="100vw" className="object-cover" />
        </Parallax>
        <div className="absolute inset-0 bg-feg-forest/70" />
        <div className="absolute inset-0 bg-linear-to-b from-feg-forest via-feg-forest/40 to-feg-forest" />

        <div className="feg-grid-pattern absolute inset-0 opacity-30" />
        <Parallax speed={0.25} className="absolute -left-40 top-1/3">
          <div className="size-112 rounded-full bg-feg-amber/10 blur-[110px]" />
        </Parallax>
        <Parallax speed={-0.2} className="absolute -right-32 bottom-0">
          <div className="size-96 rounded-full bg-feg-moss/70 blur-[100px]" />
        </Parallax>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-feg-amber-bright">
            Gage de confiance
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold sm:text-4xl">
            Le Label FEG, un gage de <Underline>confiance</Underline> en appui
          </h2>
          <p className="mt-4 text-pretty text-lg text-white/65">
            En complément de la mise en relation, le Label FEG atteste qu&apos;une entreprise est
            en règle et conforme aux exigences de la sous-traitance — après vérification par la
            FEG. Un repère, jamais une recommandation&nbsp;: la décision reste au donneur d&apos;ordre.
          </p>
        </Reveal>

        {/* Les 3 niveaux présentés comme une route : Non certifié → Membre →
            Certifié (l'objectif). La route se trace au scroll, les arrêts
            apparaissent en cascade. */}
        <LevelsRoadmap levels={levels} />

        <Reveal className="mt-16" delay={120}>
          <div className="grid overflow-hidden rounded-3xl bg-white shadow-[0_36px_80px_-40px_rgba(0,0,0,0.75)] ring-1 ring-black/5 lg:grid-cols-[1.1fr_1fr]">
            <div className="relative h-64 overflow-hidden lg:h-auto lg:min-h-72">
              <Parallax speed={0.12} className="absolute inset-x-0 -inset-y-[16%]">
                <Image
                  src="/images/label-handshake.jpg"
                  alt="Poignée de main entre deux professionnels dans un bureau"
                  fill
                  sizes="(min-width: 1024px) 55vw, 100vw"
                  className="object-cover"
                />
              </Parallax>
              {/* Léger vignettage vert à gauche, sans strip sombre côté carte blanche */}
              <div
                className="absolute inset-0 bg-linear-to-r from-feg-deep/25 via-transparent to-transparent"
                aria-hidden="true"
              />
            </div>
            <div className="flex flex-col justify-center gap-4 p-8 lg:p-10">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-feg-green">
                Une attestation, pas une recommandation
              </span>
              <p className="text-pretty text-lg leading-relaxed text-muted-ink">
                Le Label FEG atteste qu&apos;une entreprise est en règle et conforme aux exigences
                de la sous-traitance. Il ne désigne aucun prestataire&nbsp;: il éclaire le choix, la
                décision finale appartenant toujours au donneur d&apos;ordre.
              </p>
            </div>
          </div>
        </Reveal>

        {/* <Reveal className="mt-20" delay={120}>
          <h3 className="text-center text-sm font-bold uppercase tracking-[0.18em] text-feg-gold-soft">
            Le processus de labellisation en 7 étapes
          </h3>
          <ol className="relative mt-10 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4 lg:grid-cols-7">
            <span
              className="pointer-events-none absolute left-[7%] right-[7%] top-5 hidden h-px bg-linear-to-r from-transparent via-feg-khaki/50 to-transparent lg:block"
              aria-hidden="true"
            />
            {steps.map((step, i) => (
              <li key={step} className="relative flex flex-col items-center gap-3 text-center">
                <span
                  className={cn(
                    "grid size-10 place-items-center rounded-full text-sm font-bold ring-4 ring-feg-forest transition-transform duration-300 hover:scale-110",
                    i === steps.length - 1
                      ? "bg-feg-amber text-feg-deep"
                      : "bg-feg-moss text-feg-cream",
                  )}
                >
                  {i + 1}
                </span>
                <span className="text-xs font-semibold leading-tight text-white/75">{step}</span>
              </li>
            ))}
          </ol>
        </Reveal> */}
      </div>
    </section>
  )
}
