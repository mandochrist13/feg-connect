import Image from "next/image"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { getFegSession } from "@/lib/feg-session"
import { getOrCreateProfile } from "@/lib/profile"
import { getOrCreateProvider } from "@/lib/provider"
import { prisma } from "@/lib/prisma"
import { meetsMinLabelLevel } from "@/lib/label-level"
import { tenderImage } from "@/lib/sector-images"
import { submitBid } from "@/lib/actions/bids"
import { PageHeader } from "@/components/feg/workspace/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  TENDER_STATUS_LABELS,
  BID_STATUS_LABELS,
  TENDER_MODALITY_LABELS,
  GME_FORM_LABELS,
} from "@/lib/status-labels"

const ERROR_MESSAGES: Record<string, string> = {
  offre_deja_soumise: "Vous avez déjà soumis une offre pour cet appel d’offres.",
}

export default async function PrestataireTenderPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ error?: string }>
}) {
  const session = await getFegSession()
  if (!session?.id) redirect("/")

  const profile = await getOrCreateProfile()
  if (!profile) redirect("/")

  const provider = await getOrCreateProvider(profile)
  const { id } = await params
  const { error } = await searchParams

  const tender = await prisma.tender.findUnique({
    where: { id },
    include: { donneurOrdre: { select: { entreprise: true } } },
  })

  // Revérifié ici même si la page de listing a déjà filtré : une URL
  // directe ne doit jamais contourner les règles d'éligibilité.
  if (
    !tender ||
    tender.status !== "PUBLIE" ||
    tender.donneurOrdreId === profile.userId ||
    !meetsMinLabelLevel(provider.labelLevel, tender.minLabelLevel)
  ) {
    notFound()
  }

  const existingBid = await prisma.bid.findUnique({
    where: { tenderId_providerId: { tenderId: id, providerId: provider.id } },
  })

  return (
    <>
      <PageHeader eyebrow="Sous-traitance & Co-traitance" title={tender.titre} />

      <div className="relative h-44 overflow-hidden rounded-2xl sm:h-56">
        <Image
          src={tenderImage(tender.secteur, tender.id)}
          alt=""
          fill
          priority
          sizes="(min-width: 1024px) 1152px, 100vw"
          className="object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-linear-to-t from-feg-deep/50 to-transparent"
        />
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-ink">
        <Badge
          variant="outline"
          className={
            tender.status === "PUBLIE"
              ? "border-feg-green/30 bg-feg-light-green text-feg-green"
              : ""
          }
        >
          {TENDER_STATUS_LABELS[tender.status]}
        </Badge>
        <Badge
          variant="outline"
          className={
            tender.modality === "COTRAITANCE"
              ? "border-feg-gold-deep/30 bg-feg-gold-light/30 text-feg-gold-deep"
              : ""
          }
        >
          {TENDER_MODALITY_LABELS[tender.modality]}
          {tender.gmeForm ? ` — ${GME_FORM_LABELS[tender.gmeForm]}` : ""}
        </Badge>
        <span className="font-medium text-ink">
          {tender.donneurOrdre.entreprise ?? "Entreprise membre FEG"}
        </span>
        {tender.secteur && <span>Secteur : {tender.secteur}</span>}
        {tender.budget != null && (
          <span>Budget : {tender.budget.toLocaleString("fr-FR")} FCFA</span>
        )}
        {tender.delai && <span>Délai : {tender.delai}</span>}
      </div>

      {existingBid ? (
        <div className="max-w-2xl rounded-xl border border-cool-200 bg-white p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-sm font-bold uppercase tracking-wide text-feg-green">
              Votre offre
            </h2>
            <Badge
              variant="outline"
              className={
                existingBid.status === "RETENUE"
                  ? "border-feg-green/30 bg-feg-light-green text-feg-green"
                  : existingBid.status === "REJETEE"
                    ? "border-red-200 bg-red-50 text-red-700"
                    : ""
              }
            >
              {BID_STATUS_LABELS[existingBid.status]}
            </Badge>
          </div>
          <div className="mt-4 space-y-2 text-sm text-muted-ink">
            {existingBid.montant != null && (
              <p>
                Montant proposé :{" "}
                <span className="font-medium text-ink">
                  {existingBid.montant.toLocaleString("fr-FR")} FCFA
                </span>
              </p>
            )}
            {existingBid.delai && (
              <p>
                Délai proposé :{" "}
                <span className="font-medium text-ink">{existingBid.delai}</span>
              </p>
            )}
            {existingBid.message && <p>{existingBid.message}</p>}
          </div>
          <div className="mt-5 border-t border-cool-200 pt-4">
            <Link href={`/messages/${tender.id}/${tender.donneurOrdreId}`}>
              <Button variant="fegOutline">Contacter le donneur d’ordre</Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="max-w-2xl rounded-xl border border-cool-200 bg-white p-6 sm:p-8">
          <h2 className="text-sm font-bold uppercase tracking-wide text-feg-green">
            Soumettre une offre
          </h2>

          {error && ERROR_MESSAGES[error] && (
            <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {ERROR_MESSAGES[error]}
            </p>
          )}

          <form action={submitBid} className="mt-6 space-y-5">
            <input type="hidden" name="tenderId" value={tender.id} />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="montant">Montant proposé (FCFA)</Label>
                <Input id="montant" name="montant" type="number" min="0" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="delai">Délai proposé</Label>
                <Input id="delai" name="delai" placeholder="Ex. 21 jours" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="bid-message">Message</Label>
              <Textarea
                id="bid-message"
                name="message"
                rows={4}
                placeholder="Présentez votre offre…"
              />
            </div>

            <Button type="submit" variant="feg">
              Soumettre l’offre
            </Button>
          </form>
        </div>
      )}
    </>
  )
}
