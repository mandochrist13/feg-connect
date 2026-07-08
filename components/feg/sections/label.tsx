import Image from "next/image"
import { FegBadge } from "@/components/feg/feg-badge"
import { Reveal } from "@/components/feg/reveal"
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
        <div className="feg-grid-pattern absolute inset-0 opacity-30" />
        <div className="absolute -left-40 top-1/3 size-[28rem] rounded-full bg-feg-amber/10 blur-[110px]" />
        <div className="absolute -right-32 bottom-0 size-96 rounded-full bg-feg-moss/70 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-feg-amber-bright">
            Certification
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold sm:text-4xl">
            Le Label FEG, votre passeport de fiabilité B2B
          </h2>
          <p className="mt-4 text-pretty text-lg text-white/65">
            Marque collective de certification déposée à l&apos;OAPI — protégée dans 17 États
            membres. La FEG atteste un niveau de conformité&nbsp;: elle ne recommande aucun
            prestataire.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {levels.map((l, i) => (
            <Reveal key={l.title} delay={i * 110} className="h-full">
              <article
                className={cn(
                  "flex h-full flex-col items-start gap-4 rounded-3xl border p-8 backdrop-blur-sm transition-all duration-500 ease-feg hover:-translate-y-1.5",
                  l.highlight
                    ? "border-feg-amber/40 bg-gradient-to-b from-feg-amber/15 to-white/5 hover:border-feg-amber/70"
                    : "border-white/10 bg-white/5 hover:border-white/25",
                )}
              >
                <FegBadge level={l.level} />
                <h3 className="text-xl font-bold text-white">{l.title}</h3>
                <p className="text-sm leading-relaxed text-white/65">{l.desc}</p>
                <span
                  className="mt-auto flex items-center gap-1.5 pt-2"
                  aria-label={`Niveau ${i + 1} sur 3`}
                >
                  {[0, 1, 2].map((n) => (
                    <span
                      key={n}
                      className={cn(
                        "h-1.5 rounded-full transition-all",
                        n <= i ? "w-7 bg-feg-amber" : "w-3.5 bg-white/15",
                      )}
                      aria-hidden="true"
                    />
                  ))}
                </span>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-16" delay={120}>
          <div className="grid overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm lg:grid-cols-[1.1fr_1fr]">
            <div className="relative h-64 lg:h-auto lg:min-h-72">
              <Image
                src="/images/label-handshake.jpg"
                alt="Poignée de main entre deux professionnels dans un bureau"
                fill
                sizes="(min-width: 1024px) 55vw, 100vw"
                className="object-cover"
              />
              {/* Voile vert pour intégrer la photo à la section sombre */}
              <div
                className="absolute inset-0 bg-linear-to-r from-feg-forest/30 via-transparent to-feg-forest/60"
                aria-hidden="true"
              />
            </div>
            <div className="flex flex-col justify-center gap-4 p-8 lg:p-10">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-feg-amber-bright">
                Une attestation, pas une recommandation
              </span>
              <p className="text-pretty text-lg leading-relaxed text-white/80">
                Le Label FEG certifie la conformité d&apos;une entreprise au référentiel — il ne
                désigne aucun prestataire. La présélection automatique éclaire le choix, la
                décision finale appartient toujours au donneur d&apos;ordre.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal className="mt-20" delay={120}>
          <h3 className="text-center text-sm font-bold uppercase tracking-[0.18em] text-feg-gold-soft">
            Le processus de labellisation en 7 étapes
          </h3>
          <ol className="relative mt-10 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4 lg:grid-cols-7">
            <span
              className="pointer-events-none absolute left-[7%] right-[7%] top-5 hidden h-px bg-gradient-to-r from-transparent via-feg-khaki/50 to-transparent lg:block"
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
        </Reveal>
      </div>
    </section>
  )
}
