import Link from "next/link"
import { redirect } from "next/navigation"
import { FilePlus2, FileText, Handshake, Inbox } from "lucide-react"
import { getFegSession } from "@/lib/feg-session"
import { getOrCreateProfile } from "@/lib/profile"
import { prisma } from "@/lib/prisma"
import { PageHeader } from "@/components/feg/workspace/page-header"
import { StatCard } from "@/components/feg/workspace/stat-card"
import { EmptyState } from "@/components/feg/workspace/empty-state"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { TENDER_STATUS_LABELS } from "@/lib/status-labels"

export default async function DonneurOrdrePage() {
  const session = await getFegSession()
  if (!session?.id) redirect("/")

  const profile = await getOrCreateProfile()
  if (!profile) redirect("/")

  const tenders = await prisma.tender.findMany({
    where: { donneurOrdreId: profile.userId },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { bids: true } } },
  })

  const published = tenders.filter((t) => t.status === "PUBLIE").length
  const awarded = tenders.filter((t) => t.status === "ATTRIBUE").length
  const totalBids = tenders.reduce((sum, t) => sum + t._count.bids, 0)

  return (
    <>
      <PageHeader
        eyebrow="Donneur d’ordre"
        title="Mes appels d’offres"
        description="Vos appels d’offres publiés sur le réseau des entreprises membres de la FEG."
      >
        <Button asChild variant="feg">
          <Link href="/donneur-ordre/tenders/new">
            <FilePlus2 className="size-4" />
            Publier un appel d’offres
          </Link>
        </Button>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Appels d’offres ouverts" value={published} icon={FileText} />
        <StatCard label="Appels d’offres attribués" value={awarded} icon={Handshake} />
        <StatCard label="Offres reçues" value={totalBids} icon={Inbox} />
      </div>

      {tenders.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="Aucun appel d’offres publié"
          description="Publiez votre premier besoin de sous-traitance : il sera visible par les entreprises membres du réseau FEG."
        >
          <Button asChild variant="feg">
            <Link href="/donneur-ordre/tenders/new">Publier un appel d’offres</Link>
          </Button>
        </EmptyState>
      ) : (
        <div className="overflow-hidden rounded-xl border border-cool-200 bg-white">
          <div className="border-b border-cool-200 px-5 py-4">
            <h2 className="text-sm font-bold uppercase tracking-wide text-feg-green">
              Mes appels d’offres
            </h2>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="bg-cool-50 hover:bg-cool-50">
                <TableHead className="pl-5">Titre</TableHead>
                <TableHead>Secteur</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Offres reçues</TableHead>
                <TableHead>Publié le</TableHead>
                <TableHead className="pr-5" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {tenders.map((tender) => (
                <TableRow key={tender.id}>
                  <TableCell className="pl-5 font-medium text-ink">{tender.titre}</TableCell>
                  <TableCell className="text-muted-ink">{tender.secteur ?? "—"}</TableCell>
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
                    {tender.createdAt.toLocaleDateString("fr-FR")}
                  </TableCell>
                  <TableCell className="pr-5 text-right">
                    <Link
                      href={`/donneur-ordre/tenders/${tender.id}`}
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
    </>
  )
}
