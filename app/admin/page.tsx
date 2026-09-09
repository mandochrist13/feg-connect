import Link from "next/link"
import { redirect } from "next/navigation"
import {
  Activity,
  BadgeCheck,
  Banknote,
  ClipboardCheck,
  FileText,
  Handshake,
  Layers,
  Send,
  UserCheck,
  Users,
} from "lucide-react"
import { getFegSession, isAdminFeg } from "@/lib/feg-session"
import { prisma } from "@/lib/prisma"
import { PageHeader } from "@/components/feg/workspace/page-header"
import { StatCard } from "@/components/feg/workspace/stat-card"
import { EmptyState } from "@/components/feg/workspace/empty-state"
import { LabelFunnel } from "@/components/feg/workspace/label-funnel"
import { Badge } from "@/components/ui/badge"
import { BID_STATUS_LABELS } from "@/lib/status-labels"
import { formatFcfa } from "@/lib/label-fees"
import { labelPhase, type LabelPhase } from "@/lib/label-phase"
import type { BidStatus } from "@prisma/client"

// Couleurs factuelles des statuts d'offre (pattern badges existant).
function bidBadgeClass(status: BidStatus): string {
  if (status === "RETENUE") return "border-feg-green/30 bg-feg-light-green text-feg-green"
  if (status === "REJETEE") return "border-red-200 bg-red-50 text-red-700"
  return ""
}

// Raccourcis vers les sous-pages d'administration.
const SHORTCUTS = [
  {
    href: "/admin/labellisation",
    title: "Suivi labellisation",
    subtitle: "Parcours des membres vers le Label FEG.",
    icon: BadgeCheck,
  },
  {
    href: "/admin/marches",
    title: "Appels d’offres & marchés",
    subtitle: "Publications, offres reçues et attributions.",
    icon: FileText,
  },
  {
    href: "/admin/finances",
    title: "Finances",
    subtitle: "Volumes attribués et frais de labellisation.",
    icon: Banknote,
  },
] as const

export default async function AdminPage() {
  const session = await getFegSession()
  if (!session?.id) redirect("/")
  // Rôle Admin FEG porté par le JWT (spec §6).
  if (!isAdminFeg(session.role)) redirect("/dashboard")

  const [providers, tendersPublished, tendersAwarded, bidsTotal, retainedAgg, recentBids] =
    await Promise.all([
      // Tout provider = une entreprise membre de la FEG (seuls les membres
      // accèdent à la plateforme). On lit secteur + label pour le pilotage.
      prisma.provider.findMany({
        select: { secteur: true, labelLevel: true, labelFile: { select: { stage: true } } },
      }),
      prisma.tender.count({ where: { status: "PUBLIE" } }),
      prisma.tender.count({ where: { status: "ATTRIBUE" } }),
      prisma.bid.count(),
      prisma.bid.aggregate({
        _sum: { montant: true },
        where: { status: "RETENUE", montant: { not: null } },
      }),
      prisma.bid.findMany({
        orderBy: { createdAt: "desc" },
        take: 6,
        include: {
          provider: { select: { profile: { select: { entreprise: true, email: true } } } },
          tender: { select: { titre: true } },
        },
      }),
    ])

  // Agrégats réseau — comptages factuels, jamais un classement.
  const totalMembers = providers.length
  const phaseCounts: Record<LabelPhase, number> = { membre: 0, dossier: 0, delivre: 0 }
  const sectorCounts = new Map<string, number>()
  let enSuivi = 0
  for (const p of providers) {
    phaseCounts[labelPhase(p.labelFile?.stage)] += 1
    if (p.labelFile?.stage === "SURVEILLANCE") enSuivi += 1
    const secteur = p.secteur?.trim() || "Non précisé"
    sectorCounts.set(secteur, (sectorCounts.get(secteur) ?? 0) + 1)
  }
  const sectors = [...sectorCounts.entries()].sort((a, b) => b[1] - a[1])
  const awardedVolume = retainedAgg._sum.montant ?? 0

  return (
    <>
      <PageHeader
        eyebrow="Administration"
        title="Console FEG"
        description="Pilotage du réseau des entreprises membres : avancement de la labellisation, activité des marchés et couverture sectorielle en un coup d’œil."
      />

      {/* ── Réseau des membres ─────────────────────────────────── */}
      <section className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wide text-feg-green">
          Réseau des membres
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Entreprises membres" value={totalMembers} icon={Users} />
          <StatCard
            label="Labellisées"
            value={phaseCounts.delivre}
            icon={BadgeCheck}
            hint={`dont ${enSuivi} en suivi annuel`}
          />
          <StatCard
            label="Labellisation en cours"
            value={phaseCounts.dossier}
            icon={ClipboardCheck}
            hint="Dossier ou audit en cours"
          />
          <StatCard
            label="Label à engager"
            value={phaseCounts.membre}
            icon={UserCheck}
            hint="Membres sans dossier ouvert"
          />
        </div>
      </section>

      {/* ── Funnel de labellisation ────────────────────────────── */}
      <section className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wide text-feg-green">
          Parcours de labellisation
        </h2>
        <LabelFunnel counts={phaseCounts} total={totalMembers} />
      </section>

      {/* ── Activité des marchés ───────────────────────────────── */}
      <section className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wide text-feg-green">
          Activité des marchés
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Appels d’offres actifs" value={tendersPublished} icon={FileText} />
          <StatCard label="Marchés attribués" value={tendersAwarded} icon={Handshake} />
          <StatCard label="Offres reçues" value={bidsTotal} icon={Send} />
          <StatCard
            label="Volume attribué"
            value={formatFcfa(awardedVolume)}
            icon={Banknote}
            hint="Somme des offres retenues"
          />
        </div>
      </section>

      {/* ── Couverture sectorielle & activité récente ──────────── */}
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-xl border border-cool-200 bg-white">
          <div className="flex items-center gap-2 border-b border-cool-200 px-5 py-4">
            <Layers className="size-4 text-feg-green" aria-hidden="true" />
            <h2 className="text-sm font-bold uppercase tracking-wide text-feg-green">
              Couverture sectorielle
            </h2>
          </div>
          {sectors.length === 0 ? (
            <p className="px-5 py-6 text-sm text-muted-ink">Aucun membre pour l’instant.</p>
          ) : (
            <ul className="divide-y divide-cool-100">
              {sectors.map(([secteur, n]) => {
                const pct = totalMembers > 0 ? Math.round((n / totalMembers) * 100) : 0
                return (
                  <li key={secteur} className="px-5 py-3">
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="font-medium text-ink">{secteur}</span>
                      <span className="shrink-0 tabular-nums text-muted-ink">
                        {n} · {pct}%
                      </span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-cool-100">
                      <div
                        className="h-full rounded-full bg-feg-green"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </section>

        <section className="rounded-xl border border-cool-200 bg-white">
          <div className="flex items-center gap-2 border-b border-cool-200 px-5 py-4">
            <Activity className="size-4 text-feg-green" aria-hidden="true" />
            <h2 className="text-sm font-bold uppercase tracking-wide text-feg-green">
              Activité récente
            </h2>
          </div>
          {recentBids.length === 0 ? (
            <p className="px-5 py-6 text-sm text-muted-ink">
              Les dernières offres soumises apparaîtront ici.
            </p>
          ) : (
            <ul className="divide-y divide-cool-100">
              {recentBids.map((bid) => (
                <li
                  key={bid.id}
                  className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-5 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink">
                      {bid.provider.profile.entreprise ?? bid.provider.profile.email ?? "—"}
                    </p>
                    <p className="truncate text-sm text-muted-ink">sur « {bid.tender.titre} »</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="text-xs text-cool-400">
                      {bid.createdAt.toLocaleDateString("fr-FR")}
                    </span>
                    <Badge variant="outline" className={bidBadgeClass(bid.status)}>
                      {BID_STATUS_LABELS[bid.status]}
                    </Badge>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* ── Raccourcis ─────────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-3">
        {SHORTCUTS.map(({ href, title, subtitle, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="group flex items-start gap-4 rounded-xl border border-cool-200 bg-white p-5 transition-colors hover:border-feg-green/40 hover:bg-feg-light-green/30"
          >
            <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-feg-light-green text-feg-green">
              <Icon className="size-5" aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="block font-semibold text-ink transition-colors group-hover:text-feg-green">
                {title}
              </span>
              <span className="mt-0.5 block text-sm text-muted-ink">{subtitle}</span>
            </span>
          </Link>
        ))}
      </div>
    </>
  )
}
