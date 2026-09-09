import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { Award, Briefcase, Inbox, Layers, Megaphone, ArrowRight } from "lucide-react"
import { getFegSession, isAdminFeg } from "@/lib/feg-session"
import { prisma } from "@/lib/prisma"
import { updateLabelFile, advanceLabelStage } from "@/lib/actions/label-file"
import { PageHeader } from "@/components/feg/workspace/page-header"
import { StageBadge } from "@/components/feg/workspace/stage-badge"
import { StatCard } from "@/components/feg/workspace/stat-card"
import { EmptyState } from "@/components/feg/workspace/empty-state"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LABEL_LEVEL_LABELS } from "@/lib/label-level"
import { LABEL_STAGE_LABELS, TENDER_STATUS_LABELS, BID_STATUS_LABELS } from "@/lib/status-labels"
import { formatFcfa } from "@/lib/label-fees"
import { nextStage, stageProgress, LABEL_STAGE_SEQUENCE } from "@/lib/label-phase"

const selectClassName =
  "border-input h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"

function bidBadgeClass(status: string): string {
  if (status === "RETENUE") return "border-feg-green/30 bg-feg-light-green text-feg-green"
  if (status === "REJETEE") return "border-red-200 bg-red-50 text-red-700"
  return ""
}

export default async function AdminProviderPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await getFegSession()
  if (!session?.id) redirect("/")
  if (!isAdminFeg(session.role)) redirect("/dashboard")

  const { id } = await params
  const provider = await prisma.provider.findUnique({
    where: { id },
    include: {
      profile: { select: { entreprise: true, email: true, createdAt: true } },
      labelFile: true,
      // Offres soumises par l'entreprise, appel d'offres inclus (track record).
      bids: {
        orderBy: { createdAt: "desc" },
        include: {
          tender: {
            select: {
              id: true,
              titre: true,
              secteur: true,
              status: true,
              donneurOrdre: { select: { entreprise: true } },
            },
          },
        },
      },
    },
  })
  if (!provider) notFound()

  // Appels d'offres publiés par cette entreprise (en tant que donneur d'ordre).
  const tendersPublished = await prisma.tender.count({
    where: { donneurOrdreId: provider.profileUserId },
  })

  const stage = provider.labelFile?.stage ?? null
  const target = nextStage(stage)
  const pct = Math.round(stageProgress(stage) * 100)
  const currentIndex = stage ? LABEL_STAGE_SEQUENCE.indexOf(stage) : -1

  // Track record factuel — chantiers remportés = offres retenues.
  const wonBids = provider.bids.filter((bid) => bid.status === "RETENUE")
  const nom = provider.profile.entreprise ?? provider.profile.email ?? "Entreprise membre"

  return (
    <>
      <PageHeader eyebrow="Fiche entreprise" title={nom} description={provider.profile.email ?? undefined}>
        <Badge variant="outline">{LABEL_LEVEL_LABELS[provider.labelLevel]}</Badge>
        <StageBadge stage={stage} />
      </PageHeader>

      {/* ── Identité & activité ────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-cool-200 bg-white p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-muted-ink">Secteur</p>
          <p className="mt-2 text-sm font-semibold text-ink">{provider.secteur?.trim() || "—"}</p>
        </div>
        <StatCard label="Chantiers remportés" value={wonBids.length} icon={Award} />
        <StatCard label="Offres soumises" value={provider.bids.length} icon={Inbox} />
        <StatCard label="Appels publiés" value={tendersPublished} icon={Megaphone} />
      </div>

      {provider.specialites.length > 0 && (
        <div className="rounded-xl border border-cool-200 bg-white p-5">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-muted-ink">
            <Layers className="size-4 text-feg-green" aria-hidden="true" />
            Spécialités
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {provider.specialites.map((spec) => (
              <span
                key={spec}
                className="rounded-full border border-feg-green/20 bg-feg-light-green/60 px-3 py-1 text-xs font-medium text-feg-green"
              >
                {spec}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── Parcours de labellisation + validation ─────────────── */}
      <section className="rounded-xl border border-cool-200 bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wide text-feg-green">
              Parcours de labellisation
            </h2>
            <p className="mt-1 text-sm text-muted-ink">
              Progression {pct}% — la FEG valide chaque étape jusqu’à la délivrance du Label.
            </p>
          </div>
          {target ? (
            <form action={advanceLabelStage}>
              <input type="hidden" name="providerId" value={provider.id} />
              <Button type="submit" variant="feg" className="gap-2">
                {stage ? `Valider : ${LABEL_STAGE_LABELS[target]}` : "Ouvrir le dossier d’audit"}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Button>
            </form>
          ) : (
            <Badge variant="outline" className="border-feg-green/30 bg-feg-light-green text-feg-green">
              Parcours terminé — Label en suivi
            </Badge>
          )}
        </div>

        <ol className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {LABEL_STAGE_SEQUENCE.map((s, i) => {
            const done = currentIndex >= 0 && i <= currentIndex
            const isCurrent = i === currentIndex
            return (
              <li
                key={s}
                className={`rounded-lg border p-3 text-center ${
                  isCurrent
                    ? "border-feg-green bg-feg-light-green"
                    : done
                      ? "border-feg-green/30 bg-feg-light-green/40"
                      : "border-cool-200 bg-cool-50"
                }`}
              >
                <span
                  className={`grid size-6 place-items-center rounded-full text-xs font-bold ${
                    done ? "bg-feg-green text-white" : "bg-cool-200 text-cool-700"
                  } mx-auto`}
                >
                  {i + 1}
                </span>
                <p
                  className={`mt-1.5 text-[11px] font-semibold leading-tight ${
                    done ? "text-feg-green" : "text-muted-ink"
                  }`}
                >
                  {LABEL_STAGE_LABELS[s]}
                </p>
              </li>
            )
          })}
        </ol>
      </section>

      {/* ── Chantiers remportés (réalisations sur la plateforme) ── */}
      <section className="overflow-hidden rounded-xl border border-cool-200 bg-white">
        <div className="flex items-center gap-2 border-b border-cool-200 px-5 py-4">
          <Briefcase className="size-4 text-feg-green" aria-hidden="true" />
          <h2 className="text-sm font-bold uppercase tracking-wide text-feg-green">
            Chantiers remportés sur la plateforme ({wonBids.length})
          </h2>
        </div>
        {wonBids.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title="Aucun chantier remporté pour l’instant"
            description="Les marchés attribués à cette entreprise via la plateforme apparaîtront ici."
          />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-cool-50 hover:bg-cool-50">
                  <TableHead className="pl-5">Marché</TableHead>
                  <TableHead>Donneur d’ordre</TableHead>
                  <TableHead>Secteur</TableHead>
                  <TableHead className="text-right">Montant</TableHead>
                  <TableHead className="pr-5" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {wonBids.map((bid) => (
                  <TableRow key={bid.id}>
                    <TableCell className="pl-5 font-medium text-ink">{bid.tender.titre}</TableCell>
                    <TableCell className="text-muted-ink">
                      {bid.tender.donneurOrdre.entreprise ?? "—"}
                    </TableCell>
                    <TableCell className="text-muted-ink">{bid.tender.secteur ?? "—"}</TableCell>
                    <TableCell className="text-right tabular-nums text-muted-ink">
                      {bid.montant != null ? formatFcfa(bid.montant) : "—"}
                    </TableCell>
                    <TableCell className="pr-5">
                      <Link
                        href={`/admin/marches/${bid.tender.id}`}
                        className="text-sm font-semibold text-feg-green hover:underline"
                      >
                        Voir →
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </section>

      {/* ── Participations (toutes offres) ─────────────────────── */}
      {provider.bids.length > 0 && (
        <section className="overflow-hidden rounded-xl border border-cool-200 bg-white">
          <div className="border-b border-cool-200 px-5 py-4">
            <h2 className="text-sm font-bold uppercase tracking-wide text-feg-green">
              Toutes les participations ({provider.bids.length})
            </h2>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-cool-50 hover:bg-cool-50">
                  <TableHead className="pl-5">Marché</TableHead>
                  <TableHead>Montant proposé</TableHead>
                  <TableHead>Statut de l’offre</TableHead>
                  <TableHead className="pr-5">Soumise le</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {provider.bids.map((bid) => (
                  <TableRow key={bid.id}>
                    <TableCell className="pl-5 font-medium text-ink">{bid.tender.titre}</TableCell>
                    <TableCell className="text-muted-ink">
                      {bid.montant != null ? formatFcfa(bid.montant) : "—"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={bidBadgeClass(bid.status)}>
                        {BID_STATUS_LABELS[bid.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="pr-5 text-muted-ink">
                      {bid.createdAt.toLocaleDateString("fr-FR")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>
      )}

      {/* ── Édition manuelle du dossier (repliée) ──────────────── */}
      <details className="rounded-xl border border-cool-200 bg-white p-6">
        <summary className="cursor-pointer text-sm font-bold uppercase tracking-wide text-feg-green">
          Édition manuelle du dossier (étape, niveau, conformité)
        </summary>
        <form action={updateLabelFile} className="mt-5 space-y-6">
          <input type="hidden" name="providerId" value={provider.id} />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="stage">Étape du dossier</Label>
              <select
                id="stage"
                name="stage"
                defaultValue={provider.labelFile?.stage ?? "CANDIDATURE"}
                className={selectClassName}
              >
                {Object.entries(LABEL_STAGE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="labelLevel">Niveau de Label</Label>
              <select
                id="labelLevel"
                name="labelLevel"
                defaultValue={provider.labelLevel}
                className={selectClassName}
              >
                {/* Toute entreprise est au moins membre FEG : « Non membre »
                    n'est pas proposé (il n'existe pas de non-membre ici). */}
                {Object.entries(LABEL_LEVEL_LABELS)
                  .filter(([value]) => value !== "NON_CERTIFIE")
                  .map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="border-t border-cool-200 pt-5">
            <h3 className="text-sm font-bold uppercase tracking-wide text-feg-green">
              Conformité par bloc (audit FEG)
            </h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="scoreBlocA">Bloc A — Gouvernance & Intégrité</Label>
                <Input id="scoreBlocA" name="scoreBlocA" type="number" min="0" max="100" defaultValue={provider.labelFile?.scoreBlocA ?? ""} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="scoreBlocB">Bloc B — Conformité sociale & RH</Label>
                <Input id="scoreBlocB" name="scoreBlocB" type="number" min="0" max="100" defaultValue={provider.labelFile?.scoreBlocB ?? ""} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="scoreBlocC">Bloc C — Conformité administrative</Label>
                <Input id="scoreBlocC" name="scoreBlocC" type="number" min="0" max="100" defaultValue={provider.labelFile?.scoreBlocC ?? ""} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="scoreBlocD">Bloc D — Fiabilité commerciale</Label>
                <Input id="scoreBlocD" name="scoreBlocD" type="number" min="0" max="100" defaultValue={provider.labelFile?.scoreBlocD ?? ""} />
              </div>
            </div>
          </div>

          <Button type="submit" variant="fegOutline">
            Enregistrer les modifications
          </Button>
        </form>
      </details>
    </>
  )
}
