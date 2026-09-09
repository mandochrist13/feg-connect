import Link from "next/link"
import Image from "next/image"
import { redirect } from "next/navigation"
import { BookOpen, FilePlus2, FileText, Inbox, Search, Send } from "lucide-react"
import { getFegSession, isAdminFeg } from "@/lib/feg-session"
import { getOrCreateProfile } from "@/lib/profile"
import { getOrCreateProvider } from "@/lib/provider"
import { prisma } from "@/lib/prisma"
import { StatCard } from "@/components/feg/workspace/stat-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TENDER_STATUS_LABELS, BID_STATUS_LABELS } from "@/lib/status-labels"

/**
 * Accueil unifié (capacités universelles, décision 2026-07-31) : tout membre
 * est à la fois donneur d'ordre, sous-traitant et co-traitant — plus de
 * routage par rôle. Les admins FEG gardent leur console dédiée.
 */
export default async function DashboardPage() {
  const session = await getFegSession()
  if (!session?.id) redirect("/")

  // Admin FEG : déterminé par le rôle du JWT, jamais stocké en base (spec §6).
  if (isAdminFeg(session.role)) redirect("/admin")

  const profile = await getOrCreateProfile()
  if (!profile) redirect("/")

  const provider = await getOrCreateProvider(profile)

  const [myTenders, myBids, openTendersCount] = await Promise.all([
    prisma.tender.findMany({
      where: { donneurOrdreId: profile.userId },
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { bids: true } } },
    }),
    prisma.bid.findMany({
      where: { providerId: provider.id },
      orderBy: { createdAt: "desc" },
      include: { tender: { select: { titre: true } } },
    }),
    prisma.tender.count({
      where: { status: "PUBLIE", donneurOrdreId: { not: profile.userId } },
    }),
  ])

  const receivedBids = myTenders.reduce((sum, t) => sum + t._count.bids, 0)
  const recentTenders = myTenders.slice(0, 3)
  const recentBids = myBids.slice(0, 3)

  return (
    <>
      <section className="relative overflow-hidden rounded-2xl">
        <Image
          src="/images/label-handshake.jpg"
          alt=""
          fill
          priority
          sizes="(min-width: 1024px) 1152px, 100vw"
          className="object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-linear-to-r from-feg-deep/90 via-feg-forest/80 to-feg-forest/40"
        />
        <div className="relative flex min-h-56 flex-col justify-center px-6 py-10 sm:px-10">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-feg-amber-bright">
            Espace membre
          </p>
          <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
            Bienvenue{profile.prenom ? `, ${profile.prenom}` : ""}
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-white/80 sm:text-base">
            Publiez vos besoins ou répondez aux appels d’offres du réseau — chaque
            entreprise membre peut être donneur d’ordre, sous-traitant et
            co-traitant.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button
              asChild
              variant="outline"
              className="border-white/50 bg-white/10 text-white shadow-none backdrop-blur-sm hover:bg-white hover:text-feg-green"
            >
              <Link href="/prestataire/tenders">
                <Search className="size-4" />
                Voir les appels d’offres
              </Link>
            </Button>
            <Button asChild variant="fegGold">
              <Link href="/donneur-ordre/tenders/new">
                <FilePlus2 className="size-4" />
                Publier un appel d’offres
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="flex items-center justify-between gap-4 rounded-xl border border-cool-200 bg-white px-5 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <BookOpen className="size-5 shrink-0 text-feg-green" aria-hidden />
          <p className="truncate text-sm font-semibold text-ink">
            Nouveau sur la plateforme ?
          </p>
        </div>
        <Link
          href="/guide"
          className="shrink-0 text-sm font-semibold text-feg-green hover:underline"
        >
          Consulter le guide d’utilisation →
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Mes appels d’offres" value={myTenders.length} icon={FileText} />
        <StatCard label="Offres reçues sur mes appels" value={receivedBids} icon={Inbox} />
        <StatCard label="Mes offres soumises" value={myBids.length} icon={Send} />
        <StatCard label="Appels ouverts sur le réseau" value={openTendersCount} icon={Search} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="overflow-hidden rounded-xl border border-cool-200 bg-white">
          <div className="flex items-center justify-between border-b border-cool-200 px-5 py-4">
            <h2 className="text-sm font-bold uppercase tracking-wide text-feg-green">
              Mes derniers appels d’offres
            </h2>
            <Link
              href="/donneur-ordre"
              className="text-sm font-semibold text-feg-green hover:underline"
            >
              Voir tout →
            </Link>
          </div>
          {recentTenders.length === 0 ? (
            <p className="px-5 py-8 text-sm text-muted-ink">
              Aucun appel d’offres publié pour l’instant.
            </p>
          ) : (
            <ul className="divide-y divide-cool-200">
              {recentTenders.map((tender) => (
                <li key={tender.id}>
                  <Link
                    href={`/donneur-ordre/tenders/${tender.id}`}
                    className="flex items-center justify-between gap-3 px-5 py-3.5 transition-colors hover:bg-cool-50"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-ink">
                        {tender.titre}
                      </span>
                      <span className="text-xs text-muted-ink">
                        {tender._count.bids} offre{tender._count.bids > 1 ? "s" : ""} ·{" "}
                        {tender.createdAt.toLocaleDateString("fr-FR")}
                      </span>
                    </span>
                    <Badge variant="outline" className="shrink-0">
                      {TENDER_STATUS_LABELS[tender.status]}
                    </Badge>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="overflow-hidden rounded-xl border border-cool-200 bg-white">
          <div className="flex items-center justify-between border-b border-cool-200 px-5 py-4">
            <h2 className="text-sm font-bold uppercase tracking-wide text-feg-green">
              Mes dernières offres
            </h2>
            <Link
              href="/prestataire"
              className="text-sm font-semibold text-feg-green hover:underline"
            >
              Voir tout →
            </Link>
          </div>
          {recentBids.length === 0 ? (
            <p className="px-5 py-8 text-sm text-muted-ink">
              Aucune offre soumise pour l’instant.
            </p>
          ) : (
            <ul className="divide-y divide-cool-200">
              {recentBids.map((bid) => (
                <li key={bid.id}>
                  <Link
                    href={`/prestataire/tenders/${bid.tenderId}`}
                    className="flex items-center justify-between gap-3 px-5 py-3.5 transition-colors hover:bg-cool-50"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-ink">
                        {bid.tender.titre}
                      </span>
                      <span className="text-xs text-muted-ink">
                        {bid.createdAt.toLocaleDateString("fr-FR")}
                      </span>
                    </span>
                    <Badge
                      variant="outline"
                      className={
                        bid.status === "RETENUE"
                          ? "shrink-0 border-feg-green/30 bg-feg-light-green text-feg-green"
                          : bid.status === "REJETEE"
                            ? "shrink-0 border-red-200 bg-red-50 text-red-700"
                            : "shrink-0"
                      }
                    >
                      {BID_STATUS_LABELS[bid.status]}
                    </Badge>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  )
}
