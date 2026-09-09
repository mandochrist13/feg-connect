import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { Inbox } from "lucide-react"
import { getFegSession } from "@/lib/feg-session"
import { getOrCreateProfile } from "@/lib/profile"
import { prisma } from "@/lib/prisma"
import { retainBid } from "@/lib/actions/bids"
import { PageHeader } from "@/components/feg/workspace/page-header"
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
import {
  TENDER_STATUS_LABELS,
  BID_STATUS_LABELS,
  TENDER_MODALITY_LABELS,
  GME_FORM_LABELS,
} from "@/lib/status-labels"
import { LABEL_LEVEL_LABELS } from "@/lib/label-level"

export default async function DonneurOrdreTenderPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await getFegSession()
  if (!session?.id) redirect("/")

  const profile = await getOrCreateProfile()
  if (!profile) redirect("/")

  const { id } = await params
  const tender = await prisma.tender.findUnique({
    where: { id },
    include: {
      bids: {
        orderBy: { createdAt: "asc" }, // ordre de réception, jamais un tri par montant
        include: { provider: { include: { profile: { select: { entreprise: true } } } } },
      },
    },
  })

  // Ressource qui n'existe pas ou n'appartient pas à ce donneur d'ordre : 404,
  // jamais de redirection (ne pas révéler l'existence du tender d'un tiers).
  if (!tender || tender.donneurOrdreId !== profile.userId) notFound()

  const facts = [
    {
      label: "Modalité",
      value:
        TENDER_MODALITY_LABELS[tender.modality] +
        (tender.gmeForm ? ` — ${GME_FORM_LABELS[tender.gmeForm]}` : ""),
    },
    { label: "Secteur", value: tender.secteur ?? "—" },
    {
      label: "Budget indicatif",
      value: tender.budget != null ? `${tender.budget.toLocaleString("fr-FR")} FCFA` : "—",
    },
    { label: "Délai souhaité", value: tender.delai ?? "—" },
  ]

  return (
    <>
      <PageHeader
        eyebrow="Donneur d’ordre"
        title={tender.titre}
        description={`Appel d’offres publié le ${tender.createdAt.toLocaleDateString("fr-FR")}${
          tender.secteur ? ` · ${tender.secteur}` : ""
        }.`}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-cool-200 bg-white p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-muted-ink">Statut</p>
          <div className="mt-2">
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
          </div>
        </div>
        {facts.map((fact) => (
          <div key={fact.label} className="rounded-xl border border-cool-200 bg-white p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-muted-ink">
              {fact.label}
            </p>
            <p className="mt-2 text-sm font-semibold text-ink">{fact.value}</p>
          </div>
        ))}
      </div>

      {tender.bids.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="Aucune offre reçue"
          description="Les offres des entreprises membres apparaîtront ici, dans leur ordre de réception."
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-cool-200 bg-white">
          <div className="border-b border-cool-200 px-5 py-4">
            <h2 className="text-sm font-bold uppercase tracking-wide text-feg-green">
              Offres reçues ({tender.bids.length})
            </h2>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="bg-cool-50 hover:bg-cool-50">
                <TableHead className="pl-5">Entreprise</TableHead>
                <TableHead>Label</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Délai</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="pr-5" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {tender.bids.map((bid) => (
                <TableRow key={bid.id}>
                  <TableCell className="pl-5 font-medium text-ink">
                    {bid.provider.profile.entreprise ?? "—"}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{LABEL_LEVEL_LABELS[bid.provider.labelLevel]}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-ink">
                    {bid.montant != null ? `${bid.montant.toLocaleString("fr-FR")} FCFA` : "—"}
                  </TableCell>
                  <TableCell className="text-muted-ink">{bid.delai ?? "—"}</TableCell>
                  <TableCell className="max-w-64 whitespace-normal text-sm text-muted-ink">
                    {bid.message ?? "—"}
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
                  <TableCell className="pr-5">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/messages/${tender.id}/${bid.provider.profileUserId}`}
                        className="whitespace-nowrap text-sm font-semibold text-feg-green hover:underline"
                      >
                        Contacter
                      </Link>
                      {bid.status === "SOUMISE" && tender.status === "PUBLIE" && (
                        <form action={retainBid}>
                          <input type="hidden" name="bidId" value={bid.id} />
                          <Button type="submit" size="sm" variant="feg">
                            Retenir
                          </Button>
                        </form>
                      )}
                    </div>
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
