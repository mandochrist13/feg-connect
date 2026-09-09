import Link from "next/link"
import Image from "next/image"
import { redirect } from "next/navigation"
import { Search } from "lucide-react"
import { getFegSession } from "@/lib/feg-session"
import { getOrCreateProfile } from "@/lib/profile"
import { getOrCreateProvider } from "@/lib/provider"
import { prisma } from "@/lib/prisma"
import { eligibleMinLevels } from "@/lib/label-level"
import { tenderImage } from "@/lib/sector-images"
import { PageHeader } from "@/components/feg/workspace/page-header"
import { EmptyState } from "@/components/feg/workspace/empty-state"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TENDER_MODALITY_LABELS, GME_FORM_LABELS } from "@/lib/status-labels"

export default async function PrestataireTendersPage() {
  const session = await getFegSession()
  if (!session?.id) redirect("/")

  const profile = await getOrCreateProfile()
  if (!profile) redirect("/")

  const provider = await getOrCreateProvider(profile)

  const tenders = await prisma.tender.findMany({
    where: {
      status: "PUBLIE",
      donneurOrdreId: { not: profile.userId },
      OR: [
        { minLabelLevel: null },
        { minLabelLevel: { in: eligibleMinLevels(provider.labelLevel) } },
      ],
    },
    orderBy: { createdAt: "desc" }, // ordre neutre, jamais un tri par score
    include: { donneurOrdre: { select: { entreprise: true } } },
  })

  return (
    <>
      <PageHeader
        eyebrow="Sous-traitance & Co-traitance"
        title="Appels d’offres ouverts"
        description="Les appels d’offres — sous-traitance et co-traitance — sont présentés par ordre de publication, du plus récent au plus ancien, sans classement ni recommandation."
      />

      {tenders.length === 0 ? (
        <EmptyState
          icon={Search}
          title="Aucun appel d’offres ouvert"
          description="Aucun appel d’offres n’est ouvert pour l’instant. Revenez régulièrement : les nouveaux besoins publiés par les entreprises membres apparaîtront ici."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tenders.map((tender) => (
            <Link key={tender.id} href={`/prestataire/tenders/${tender.id}`}>
              <Card className="h-full gap-4 overflow-hidden border-cool-200 pt-0 pb-5 transition-shadow hover:shadow-md">
                <div className="relative h-36 w-full overflow-hidden">
                  <Image
                    src={tenderImage(tender.secteur, tender.id)}
                    alt=""
                    fill
                    sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                    className="object-cover"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-linear-to-t from-black/25 to-transparent"
                  />
                </div>
                <CardHeader className="px-5">
                  <div className="flex flex-wrap gap-1.5">
                    <Badge
                      variant="outline"
                      className={
                        tender.modality === "COTRAITANCE"
                          ? "w-fit border-feg-gold-deep/30 bg-feg-gold-light/30 text-feg-gold-deep"
                          : "w-fit border-feg-green/30 bg-feg-light-green text-feg-green"
                      }
                    >
                      {TENDER_MODALITY_LABELS[tender.modality]}
                    </Badge>
                    {tender.secteur && (
                      <Badge variant="outline" className="w-fit">
                        {tender.secteur}
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="mt-1 text-base font-bold text-ink">
                    {tender.titre}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1 px-5 text-sm text-muted-ink">
                  <p className="font-medium text-ink">
                    {tender.donneurOrdre.entreprise ?? "Entreprise membre FEG"}
                  </p>
                  {tender.gmeForm && <p>Forme : {GME_FORM_LABELS[tender.gmeForm]}</p>}
                  {tender.budget != null && (
                    <p>Budget : {tender.budget.toLocaleString("fr-FR")} FCFA</p>
                  )}
                  {tender.delai && <p>Délai : {tender.delai}</p>}
                </CardContent>
                <CardFooter className="mt-auto justify-between border-t border-cool-200 px-5 pt-4! text-sm">
                  <span className="text-cool-400">
                    Publié le {tender.createdAt.toLocaleDateString("fr-FR")}
                  </span>
                  <span className="font-semibold text-feg-green">Voir →</span>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
