import { redirect } from "next/navigation"
import { Banknote, BadgeCheck, FolderOpen } from "lucide-react"
import { getFegSession, isAdminFeg } from "@/lib/feg-session"
import { prisma } from "@/lib/prisma"
import { PageHeader } from "@/components/feg/workspace/page-header"
import { StatCard } from "@/components/feg/workspace/stat-card"
import { EmptyState } from "@/components/feg/workspace/empty-state"
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { LABEL_STAGE_LABELS } from "@/lib/status-labels"
import {
  FRAIS_AUDIT,
  FRAIS_DOSSIER,
  FRAIS_LICENCE,
  estimateLabelFees,
  formatFcfa,
} from "@/lib/label-fees"

export default async function AdminFinancesPage() {
  const session = await getFegSession()
  if (!session?.id) redirect("/")
  // Rôle Admin FEG porté par le JWT (spec §6).
  if (!isAdminFeg(session.role)) redirect("/dashboard")

  const [attributedTenders, labelFiles] = await Promise.all([
    prisma.tender.findMany({
      where: { status: "ATTRIBUE" },
      include: {
        donneurOrdre: { select: { entreprise: true, email: true } },
        bids: {
          where: { status: "RETENUE" },
          include: {
            provider: {
              include: { profile: { select: { entreprise: true, email: true } } },
            },
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.labelFile.findMany({
      include: {
        provider: {
          include: { profile: { select: { entreprise: true, email: true } } },
        },
      },
    }),
  ])

  // Volume économique : somme factuelle des montants des offres retenues.
  // Bid.montant est nullable — les offres sans montant sont exclues de la somme.
  const volumeMarches = attributedTenders
    .flatMap((tender) => tender.bids)
    .reduce((sum, bid) => sum + (bid.montant ?? 0), 0)

  // Estimation des revenus de labellisation d'après l'étape de chaque dossier.
  // Tri alphabétique par entreprise (ordre neutre — jamais un classement).
  const billableFiles = labelFiles
    .map((file) => ({
      id: file.id,
      entreprise: file.provider.profile.entreprise ?? file.provider.profile.email ?? "—",
      stage: file.stage,
      fees: estimateLabelFees(file.stage),
    }))
    .sort((a, b) => a.entreprise.localeCompare(b.entreprise, "fr"))

  const revenusLabellisation = billableFiles.reduce((sum, row) => sum + row.fees.total, 0)

  return (
    <>
      <PageHeader
        eyebrow="Administration"
        title="Finances"
        description="Double lecture des gains générés : volume économique des marchés attribués via la plateforme, et revenus de labellisation estimés d’après l’étape des dossiers."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Volume des marchés attribués"
          value={formatFcfa(volumeMarches)}
          icon={Banknote}
          hint="Somme des montants retenus"
        />
        <StatCard
          label="Revenus labellisation estimés"
          value={formatFcfa(revenusLabellisation)}
          icon={BadgeCheck}
          hint="Estimation d’après l’étape des dossiers"
        />
        <StatCard
          label="Dossiers facturables"
          value={labelFiles.length}
          icon={FolderOpen}
          hint="Dossiers de labellisation ouverts"
        />
      </div>

      {/* ── Section 1 · Marchés attribués ─────────────────────── */}
      {attributedTenders.length === 0 ? (
        <EmptyState
          icon={Banknote}
          title="Aucun marché attribué pour l’instant"
          description="Les marchés attribués via la plateforme et leurs montants retenus apparaîtront ici."
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-cool-200 bg-white">
          <div className="border-b border-cool-200 px-5 py-4">
            <h2 className="text-sm font-bold uppercase tracking-wide text-feg-green">
              Marchés attribués
            </h2>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="bg-cool-50 hover:bg-cool-50">
                <TableHead className="pl-5">Marché</TableHead>
                <TableHead>Donneur d’ordre</TableHead>
                <TableHead>Attributaire</TableHead>
                <TableHead className="text-right">Montant retenu</TableHead>
                <TableHead className="pr-5">Attribué le</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attributedTenders.map((tender) => {
                const retained = tender.bids[0]
                return (
                  <TableRow key={tender.id}>
                    <TableCell className="pl-5 font-medium text-ink">
                      {tender.titre}
                    </TableCell>
                    <TableCell>
                      {tender.donneurOrdre.entreprise ?? tender.donneurOrdre.email ?? "—"}
                    </TableCell>
                    <TableCell>
                      {retained
                        ? (retained.provider.profile.entreprise ??
                          retained.provider.profile.email ??
                          "—")
                        : "—"}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {retained?.montant != null ? formatFcfa(retained.montant) : "—"}
                    </TableCell>
                    <TableCell className="pr-5">
                      {tender.updatedAt.toLocaleDateString("fr-FR")}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
            <TableFooter className="bg-cool-50">
              <TableRow className="hover:bg-cool-50">
                <TableCell className="pl-5 font-semibold text-ink" colSpan={3}>
                  Total des montants retenus
                </TableCell>
                <TableCell className="text-right font-semibold tabular-nums text-feg-green">
                  {formatFcfa(volumeMarches)}
                </TableCell>
                <TableCell className="pr-5" />
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      )}

      {/* ── Section 2 · Revenus de labellisation (estimation) ──── */}
      {labelFiles.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title="Aucun dossier de labellisation"
          description="Les revenus estimés apparaîtront dès l’ouverture des premiers dossiers de labellisation."
        />
      ) : (
        <section className="space-y-3">
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Montants estimés d’après l’étape de chaque dossier et la grille
            tarifaire (dossier {formatFcfa(FRAIS_DOSSIER)} · audit{" "}
            {formatFcfa(FRAIS_AUDIT)} · licence annuelle {formatFcfa(FRAIS_LICENCE)}).
            Les paiements réels sont encaissés et suivis par la FEG (site FEG /
            Espace Adhérent), pas par cette plateforme.
          </div>
          <div className="overflow-hidden rounded-xl border border-cool-200 bg-white">
            <div className="border-b border-cool-200 px-5 py-4">
              <h2 className="text-sm font-bold uppercase tracking-wide text-feg-green">
                Revenus de labellisation (estimation)
              </h2>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="bg-cool-50 hover:bg-cool-50">
                  <TableHead className="pl-5">Entreprise</TableHead>
                  <TableHead>Étape du dossier</TableHead>
                  <TableHead className="text-right">Frais de dossier</TableHead>
                  <TableHead className="text-right">Audit</TableHead>
                  <TableHead className="text-right">Licence</TableHead>
                  <TableHead className="pr-5 text-right">Total estimé</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {billableFiles.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="pl-5 font-medium text-ink">
                      {row.entreprise}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{LABEL_STAGE_LABELS[row.stage]}</Badge>
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {row.fees.dossier > 0 ? formatFcfa(row.fees.dossier) : "—"}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {row.fees.audit > 0 ? formatFcfa(row.fees.audit) : "—"}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {row.fees.licence > 0 ? formatFcfa(row.fees.licence) : "—"}
                    </TableCell>
                    <TableCell className="pr-5 text-right font-semibold tabular-nums">
                      {formatFcfa(row.fees.total)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter className="bg-cool-50">
                <TableRow className="hover:bg-cool-50">
                  <TableCell className="pl-5 font-semibold text-ink" colSpan={5}>
                    Total général estimé
                  </TableCell>
                  <TableCell className="pr-5 text-right font-semibold tabular-nums text-feg-green">
                    {formatFcfa(revenusLabellisation)}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </section>
      )}
    </>
  )
}
