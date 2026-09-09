import Link from "next/link"
import { redirect } from "next/navigation"
import { Clock, Handshake, Search, Send } from "lucide-react"
import { getFegSession } from "@/lib/feg-session"
import { getOrCreateProfile } from "@/lib/profile"
import { getOrCreateProvider } from "@/lib/provider"
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
import { TENDER_STATUS_LABELS, BID_STATUS_LABELS } from "@/lib/status-labels"

export default async function PrestatairePage() {
  const session = await getFegSession()
  if (!session?.id) redirect("/")

  const profile = await getOrCreateProfile()
  if (!profile) redirect("/")

  const provider = await getOrCreateProvider(profile)

  const bids = await prisma.bid.findMany({
    where: { providerId: provider.id },
    orderBy: { createdAt: "desc" },
    include: { tender: { select: { titre: true, status: true } } },
  })

  const retained = bids.filter((bid) => bid.status === "RETENUE").length
  const pending = bids.filter((bid) => bid.status === "SOUMISE").length

  return (
    <>
      <PageHeader
        eyebrow="Sous-traitance & Co-traitance"
        title="Mes offres"
        description="Vos offres soumises sur le réseau des entreprises membres de la FEG."
      >
        <Button asChild variant="feg">
          <Link href="/prestataire/tenders">
            <Search className="size-4" />
            Voir les appels d’offres
          </Link>
        </Button>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Offres soumises" value={bids.length} icon={Send} />
        <StatCard label="Offres retenues" value={retained} icon={Handshake} />
        <StatCard label="En attente de réponse" value={pending} icon={Clock} />
      </div>

      {bids.length === 0 ? (
        <EmptyState
          icon={Send}
          title="Aucune offre soumise"
          description="Parcourez les appels d’offres ouverts et soumettez votre première offre aux entreprises membres du réseau FEG."
        >
          <Button asChild variant="feg">
            <Link href="/prestataire/tenders">Voir les appels d’offres</Link>
          </Button>
        </EmptyState>
      ) : (
        <div className="overflow-hidden rounded-xl border border-cool-200 bg-white">
          <div className="border-b border-cool-200 px-5 py-4">
            <h2 className="text-sm font-bold uppercase tracking-wide text-feg-green">
              Mes offres
            </h2>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="bg-cool-50 hover:bg-cool-50">
                <TableHead className="pl-5">Appel d’offres</TableHead>
                <TableHead>Statut de l’appel</TableHead>
                <TableHead>Montant proposé</TableHead>
                <TableHead>Statut de l’offre</TableHead>
                <TableHead className="pr-5" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {bids.map((bid) => (
                <TableRow key={bid.id}>
                  <TableCell className="pl-5 font-medium text-ink">
                    {bid.tender.titre}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        bid.tender.status === "PUBLIE"
                          ? "border-feg-green/30 bg-feg-light-green text-feg-green"
                          : bid.tender.status === "ATTRIBUE"
                            ? "border-feg-gold-deep/30 bg-feg-gold-light/30 text-feg-gold-deep"
                            : ""
                      }
                    >
                      {TENDER_STATUS_LABELS[bid.tender.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-ink">
                    {bid.montant != null
                      ? `${bid.montant.toLocaleString("fr-FR")} FCFA`
                      : "—"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        bid.status === "RETENUE"
                          ? "border-feg-green/30 bg-feg-light-green text-feg-green"
                          : bid.status === "REJETEE"
                            ? "border-red-200 bg-red-50 text-red-700"
                            : ""
                      }
                    >
                      {BID_STATUS_LABELS[bid.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="pr-5 text-right">
                    <Link
                      href={`/prestataire/tenders/${bid.tenderId}`}
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
