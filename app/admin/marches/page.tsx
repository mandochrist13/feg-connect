import Link from "next/link"
import { redirect } from "next/navigation"
import { Award, FileText, Inbox, Megaphone } from "lucide-react"
import { getFegSession, isAdminFeg } from "@/lib/feg-session"
import { prisma } from "@/lib/prisma"
import { PageHeader } from "@/components/feg/workspace/page-header"
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
import {
  TENDER_STATUS_LABELS,
  TENDER_MODALITY_LABELS,
  GME_FORM_LABELS,
} from "@/lib/status-labels"
import { formatFcfa } from "@/lib/label-fees"

export default async function AdminMarchesPage() {
  const session = await getFegSession()
  if (!session?.id) redirect("/")
  // Rôle Admin FEG porté par le JWT (spec §6).
  if (!isAdminFeg(session.role)) redirect("/dashboard")

  const [tenders, totalBids] = await Promise.all([
    prisma.tender.findMany({
      include: {
        donneurOrdre: { select: { entreprise: true } },
        _count: { select: { bids: true } },
        // Offre retenue (au plus une par appel) : attributaire + montant.
        bids: {
          where: { status: "RETENUE" },
          select: {
            montant: true,
            provider: { select: { profile: { select: { entreprise: true } } } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.bid.count(),
  ])

  // Comptages factuels (jamais un score ni un classement).
  const published = tenders.filter((tender) => tender.status === "PUBLIE").length
  const awarded = tenders.filter((tender) => tender.status === "ATTRIBUE").length

  return (
    <>
      <PageHeader
        eyebrow="Administration"
        title="Appels d’offres & marchés"
        description="Suivi factuel des demandes de sous-traitance et de co-traitance publiées sur la plateforme."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total des appels" value={tenders.length} icon={FileText} />
        <StatCard label="Publiés (en cours)" value={published} icon={Megaphone} />
        <StatCard label="Attribués" value={awarded} icon={Award} />
        <StatCard label="Offres soumises au total" value={totalBids} icon={Inbox} />
      </div>

      {tenders.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="Aucun appel d’offres pour l’instant"
          description="Les demandes de sous-traitance et de co-traitance des donneurs d’ordre apparaîtront ici dès leur création."
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-cool-200 bg-white">
          <div className="border-b border-cool-200 px-5 py-4">
            <h2 className="text-sm font-bold uppercase tracking-wide text-feg-green">
              Appels d’offres ({tenders.length})
            </h2>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="bg-cool-50 hover:bg-cool-50">
                <TableHead className="pl-5">Titre</TableHead>
                <TableHead>Donneur d’ordre</TableHead>
                <TableHead>Modalité</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Offres</TableHead>
                <TableHead>Attributaire</TableHead>
                <TableHead>Montant retenu</TableHead>
                <TableHead>Publié le</TableHead>
                <TableHead className="pr-5" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {tenders.map((tender) => {
                const retained = tender.bids[0] ?? null
                return (
                  <TableRow key={tender.id}>
                    <TableCell className="pl-5 font-medium text-ink">{tender.titre}</TableCell>
                    <TableCell className="text-muted-ink">
                      {tender.donneurOrdre.entreprise ?? "—"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          tender.modality === "COTRAITANCE"
                            ? "border-feg-gold-deep/30 bg-feg-gold-light/30 text-feg-gold-deep"
                            : ""
                        }
                      >
                        {TENDER_MODALITY_LABELS[tender.modality]}
                      </Badge>
                      {tender.gmeForm && (
                        <p className="mt-1 text-xs text-muted-ink">
                          {GME_FORM_LABELS[tender.gmeForm]}
                        </p>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          tender.status === "PUBLIE"
                            ? "border-feg-green/30 bg-feg-light-green text-feg-green"
                            : tender.status === "ATTRIBUE"
                              ? "border-feg-gold-deep/30 bg-feg-gold-light/30 text-feg-gold-deep"
                              : ""
                        }
                      >
                        {TENDER_STATUS_LABELS[tender.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-ink">{tender._count.bids}</TableCell>
                    <TableCell className="text-muted-ink">
                      {retained?.provider.profile.entreprise ?? "—"}
                    </TableCell>
                    <TableCell className="text-muted-ink">
                      {retained?.montant != null ? formatFcfa(retained.montant) : "—"}
                    </TableCell>
                    <TableCell className="text-muted-ink">
                      {tender.createdAt.toLocaleDateString("fr-FR")}
                    </TableCell>
                    <TableCell className="pr-5 text-right">
                      <Link
                        href={`/admin/marches/${tender.id}`}
                        className="text-sm font-semibold text-feg-green hover:underline"
                      >
                        Voir →
                      </Link>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  )
}
