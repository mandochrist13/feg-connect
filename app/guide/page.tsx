import Image from "next/image"
import { redirect } from "next/navigation"
import { getFegSession } from "@/lib/feg-session"
import { PageHeader } from "@/components/feg/workspace/page-header"

/**
 * Guide d’utilisation illustré : les parcours clés de la plateforme expliqués
 * pas à pas. Page purement éditoriale — aucune donnée métier, uniquement la
 * garde de session standard (le contenu vaut pour tous les membres).
 */

// Étapes du parcours donneur d’ordre.
const PUBLISH_STEPS = [
  {
    title: "Décrivez le besoin",
    detail: "Titre, secteur, budget indicatif et délai souhaité.",
  },
  {
    title: "Choisissez la modalité",
    detail:
      "Sous-traitance ou co-traitance (GME) — en co-traitance, précisez la forme du groupement.",
  },
  {
    title: "Publiez",
    detail: "Votre appel d’offres devient visible par tout le réseau des entreprises membres.",
  },
  {
    title: "Recevez les offres dans l’ordre d’arrivée",
    detail: "Aucune offre n’est mise en avant : elles s’affichent strictement par ordre chronologique.",
  },
  {
    title: "Retenez une offre",
    detail: "Les autres offres sont automatiquement déclinées et leurs auteurs en sont informés.",
  },
]

// Étapes du parcours prestataire.
const RESPOND_STEPS = [
  {
    title: "Parcourez les appels d’offres ouverts",
    detail: "Depuis « Appels d’offres ouverts », consultez les besoins publiés par le réseau.",
  },
  {
    title: "Ouvrez un appel d’offres",
    detail: "Prenez connaissance du besoin : secteur, modalité, budget indicatif, délai.",
  },
  {
    title: "Proposez votre offre",
    detail: "Indiquez votre montant, votre délai et un message de présentation.",
  },
  {
    title: "Suivez le statut dans « Mes offres »",
    detail: "Soumise, retenue ou rejetée : vous êtes informé de chaque évolution.",
  },
]

// Formes de collaboration — libellés et descriptions repris de la section
// « Cadre juridique » du site vitrine (components/feg/sections/collaboration.tsx).
const COLLAB_MODES = [
  {
    title: "Sous-traitance",
    desc: "Délégation d’une partie du contrat à un prestataire spécialisé.",
    img: "/images/collab-sous-traitance.jpg",
    alt: "Ouvrier spécialisé soudant une structure sur un chantier",
  },
  {
    title: "GME Solidaire",
    desc: "Solidarité totale du groupement face au donneur d’ordre.",
    img: "/images/collab-solidaire.jpg",
    alt: "Deux professionnelles du BTP collaborent, soudées autour d’une même tâche",
  },
  {
    title: "GME Conjoint",
    desc: "Responsabilité limitée au lot attribué à chaque membre.",
    img: "/images/collab-conjoint.jpg",
    alt: "Ingénieure et ouvrier examinent ensemble les plans d’un ouvrage",
  },
  {
    title: "Hybride",
    desc: "Mandataire solidaire associé à des membres conjoints.",
    img: "/images/collab-hybride.jpg",
    alt: "Deux intervenants coordonnent leurs tâches sur un chantier",
  },
]

const IMPARTIALITY_RULES = [
  "Les offres sont présentées dans un ordre strictement chronologique, celui de leur arrivée.",
  "La plateforme n’applique aucun classement, scoring ni recommandation entre les entreprises.",
  "Une entreprise ne peut jamais répondre à son propre appel d’offres.",
  "La décision finale appartient toujours au donneur d’ordre.",
]

/** Liste d’étapes numérotées avec pastilles vertes. */
function Steps({ steps }: { steps: { title: string; detail: string }[] }) {
  return (
    <ol className="space-y-4">
      {steps.map((step, i) => (
        <li key={step.title} className="flex gap-3">
          <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-feg-light-green text-xs font-bold text-feg-green">
            {i + 1}
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-ink">{step.title}</p>
            <p className="mt-0.5 text-sm text-muted-ink">{step.detail}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}

export default async function GuidePage() {
  const session = await getFegSession()
  if (!session?.id) redirect("/")

  return (
    <>
      <PageHeader
        eyebrow="Général"
        title="Guide d’utilisation"
        description="Les parcours clés de la plateforme, expliqués pas à pas : publier, répondre, choisir le bon cadre de collaboration."
      />

      {/* a. Publier un appel d'offres */}
      <section className="overflow-hidden rounded-xl border border-cool-200 bg-white">
        <div className="relative h-44 sm:h-56">
          <Image
            src="/images/donneur-ordre.jpg"
            alt="Donneur d’ordre présentant son projet à des partenaires"
            fill
            sizes="(min-width: 1152px) 1088px, 100vw"
            className="object-cover"
          />
        </div>
        <div className="p-6 sm:p-8">
          <h2 className="text-lg font-bold text-feg-green">Publier un appel d’offres</h2>
          <p className="mt-1 text-sm text-muted-ink">
            En cinq étapes, votre besoin de sous-traitance ou de co-traitance est diffusé au
            réseau des entreprises membres de la FEG.
          </p>
          <div className="mt-5">
            <Steps steps={PUBLISH_STEPS} />
          </div>
        </div>
      </section>

      {/* b. Répondre à un appel d'offres */}
      <section className="overflow-hidden rounded-xl border border-cool-200 bg-white">
        <div className="flex flex-col sm:flex-row-reverse">
          <div className="relative h-44 shrink-0 sm:h-auto sm:w-2/5">
            <Image
              src="/images/profiles-meeting.jpg"
              alt="Représentants d’entreprises membres en discussion autour d’une offre"
              fill
              sizes="(min-width: 640px) 40vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="p-6 sm:w-3/5 sm:p-8">
            <h2 className="text-lg font-bold text-feg-green">Répondre à un appel d’offres</h2>
            <p className="mt-1 text-sm text-muted-ink">
              Chaque entreprise membre peut se positionner sur les besoins publiés par le
              réseau — sauf sur ses propres appels d’offres.
            </p>
            <div className="mt-5">
              <Steps steps={RESPOND_STEPS} />
            </div>
          </div>
        </div>
      </section>

      {/* c. Sous-traitance ou co-traitance ? */}
      <section className="rounded-xl border border-cool-200 bg-white p-6 sm:p-8">
        <h2 className="text-lg font-bold text-feg-green">Sous-traitance ou co-traitance ?</h2>
        <p className="mt-1 text-sm text-muted-ink">
          Quatre cadres de collaboration, selon votre projet et votre niveau de responsabilité.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {COLLAB_MODES.map((mode) => (
            <article
              key={mode.title}
              className="overflow-hidden rounded-xl border border-cool-200"
            >
              <div className="relative h-28">
                <Image
                  src={mode.img}
                  alt={mode.alt}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-sm font-bold text-feg-green">{mode.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-ink">{mode.desc}</p>
              </div>
            </article>
          ))}
        </div>
        <p className="mt-5 rounded-lg bg-cool-50 px-4 py-3 text-sm text-muted-ink">
          La constitution formelle du groupement (GME) directement sur la plateforme arrive
          prochainement. En attendant, l’appel d’offres précise la forme visée et le
          groupement se formalise entre les entreprises retenues.
        </p>
      </section>

      {/* d. Le Label FEG */}
      <section className="overflow-hidden rounded-xl border border-cool-200 bg-white">
        <div className="flex flex-col sm:flex-row">
          <div className="relative h-44 shrink-0 sm:h-auto sm:w-2/5">
            <Image
              src="/images/label-handshake.jpg"
              alt="Poignée de main scellant la confiance entre entreprises labellisées"
              fill
              sizes="(min-width: 640px) 40vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="p-6 sm:w-3/5 sm:p-8">
            <h2 className="text-lg font-bold text-feg-green">Le Label FEG</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-ink">
              Le Label FEG est une <strong className="font-semibold text-ink">attestation de
              conformité</strong> délivrée par la Fédération des Entreprises du Gabon. Ce
              n’est jamais une note ni un classement : il atteste qu’une entreprise répond
              aux exigences du référentiel FEG.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-muted-ink">
              <li className="flex items-center gap-2">
                <span className="rounded-full border border-feg-green/30 bg-feg-light-green px-2.5 py-0.5 text-xs font-semibold text-feg-green">
                  Membre FEG
                </span>
                Adhésion à la FEG validée — le point de départ.
              </li>
              <li className="flex items-center gap-2">
                <span className="rounded-full border border-cool-200 bg-cool-50 px-2.5 py-0.5 text-xs font-semibold text-muted-ink">
                  Dossier &amp; audit
                </span>
                Dossier constitué, audit de conformité par la FEG.
              </li>
              <li className="flex items-center gap-2">
                <span className="rounded-full border border-feg-gold-deep/30 bg-feg-gold-light/30 px-2.5 py-0.5 text-xs font-semibold text-feg-gold-deep">
                  Label délivré
                </span>
                Le Label FEG est délivré après vérification.
              </li>
            </ul>
            <p className="mt-4 text-sm text-muted-ink">
              La progression entre ces étapes est gérée par la FEG, en dehors de la
              plateforme, via l’Espace Adhérent.
            </p>
          </div>
        </div>
      </section>

      {/* e. Nos règles d'impartialité */}
      <section className="rounded-xl border border-cool-200 bg-white p-6 sm:p-8">
        <h2 className="text-lg font-bold text-feg-green">Nos règles d’impartialité</h2>
        <p className="mt-1 text-sm text-muted-ink">
          La plateforme met en relation, elle ne départage pas.
        </p>
        <ul className="mt-4 space-y-2.5">
          {IMPARTIALITY_RULES.map((rule) => (
            <li key={rule} className="flex gap-3 text-sm text-muted-ink">
              <span
                className="mt-1.75 size-1.5 shrink-0 rounded-full bg-feg-green"
                aria-hidden="true"
              />
              {rule}
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
