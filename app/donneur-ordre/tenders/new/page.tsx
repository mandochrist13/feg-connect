import Link from "next/link"
import { redirect } from "next/navigation"
import { getFegSession } from "@/lib/feg-session"
import { getOrCreateProfile } from "@/lib/profile"
import { createTender } from "@/lib/actions/tenders"
import { PageHeader } from "@/components/feg/workspace/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TENDER_MODALITY_LABELS, GME_FORM_LABELS } from "@/lib/status-labels"

const ERROR_MESSAGES: Record<string, string> = {
  titre_requis: "Le titre est obligatoire.",
  budget_invalide: "Le budget indiqué n’est pas un nombre valide.",
  gme_form_requise: "En co-traitance, la forme du groupement (GME) est obligatoire.",
}

// Select natif stylé comme les Input (Server Component — pas le Select Radix client).
const selectClassName =
  "border-input h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"

export default async function NewTenderPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const session = await getFegSession()
  if (!session?.id) redirect("/")

  const profile = await getOrCreateProfile()
  if (!profile) redirect("/")

  const { error } = await searchParams

  return (
    <>
      <PageHeader
        eyebrow="Donneur d’ordre"
        title="Publier un appel d’offres"
        description="Décrivez votre besoin — en sous-traitance ou en co-traitance (GME) — il sera visible par les entreprises membres du réseau FEG."
      />

      {error && ERROR_MESSAGES[error] && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {ERROR_MESSAGES[error]}
        </p>
      )}

      <div className="max-w-2xl rounded-xl border border-cool-200 bg-white p-6 sm:p-8">
        <form action={createTender} className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="titre">Titre *</Label>
            <Input id="titre" name="titre" required placeholder="Ex. Rénovation d’entrepôt logistique" />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="secteur">Secteur</Label>
            <Input id="secteur" name="secteur" placeholder="Ex. BTP, Transport, Services…" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="modality">Modalité</Label>
              <select id="modality" name="modality" defaultValue="SOUS_TRAITANCE" className={selectClassName}>
                {Object.entries(TENDER_MODALITY_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="gmeForm">Forme du groupement</Label>
              <select id="gmeForm" name="gmeForm" defaultValue="" className={selectClassName}>
                <option value="">— (sous-traitance)</option>
                {Object.entries(GME_FORM_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-muted-ink">
                Obligatoire en co-traitance, ignorée en sous-traitance.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="budget">Budget indicatif (FCFA)</Label>
              <Input id="budget" name="budget" type="number" min="0" placeholder="Ex. 5000000" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="delai">Délai souhaité</Label>
              <Input id="delai" name="delai" placeholder="Ex. 30 jours" />
            </div>
          </div>

          <Button type="submit" variant="feg">
            Publier
          </Button>
        </form>
      </div>

      {/* Aide contextuelle repliée — <details> natif, pas de JS client. */}
      <details className="max-w-2xl rounded-xl border border-cool-200 bg-feg-light-green/30 p-4">
        <summary className="cursor-pointer text-sm font-semibold text-feg-green">
          Comment ça marche ?
        </summary>
        <ul className="mt-3 space-y-1.5 text-sm text-muted-ink">
          <li>
            Une fois publié, votre appel d’offres est visible par toutes les entreprises
            membres du réseau FEG.
          </li>
          <li>
            Les offres reçues s’affichent dans leur ordre d’arrivée — sans classement ni
            recommandation.
          </li>
          <li>Vous ne pouvez pas soumettre d’offre sur votre propre appel d’offres.</li>
          <li>Lorsque vous retenez une offre, les autres sont automatiquement déclinées.</li>
        </ul>
        <Link
          href="/guide"
          className="mt-3 inline-block text-sm font-semibold text-feg-green hover:underline"
        >
          Consulter le guide complet →
        </Link>
      </details>
    </>
  )
}
