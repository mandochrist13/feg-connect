import Link from "next/link"
import { redirect } from "next/navigation"
import { BadgeCheck } from "lucide-react"
import type { LabelStage, LabelLevel } from "@prisma/client"
import { getFegSession, isAdminFeg } from "@/lib/feg-session"
import { prisma } from "@/lib/prisma"
import { PageHeader } from "@/components/feg/workspace/page-header"
import { EmptyState } from "@/components/feg/workspace/empty-state"
import { LabelFunnel } from "@/components/feg/workspace/label-funnel"
import { StageBadge } from "@/components/feg/workspace/stage-badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { LABEL_LEVEL_LABELS } from "@/lib/label-level"
import { LABEL_STAGE_LABELS } from "@/lib/status-labels"
import { labelPhase, stageProgress, nextStage, type LabelPhase } from "@/lib/label-phase"
import { advanceLabelStage } from "@/lib/actions/label-file"

// Couleur du statut : or = Label délivré, vert = Membre, rouge = « Non membre »
// (anomalie — seuls les membres FEG accèdent à la plateforme).
function levelBadgeClass(level: LabelLevel): string {
  if (level === "CERTIFIE_FEG")
    return "border-feg-gold-deep/30 bg-feg-gold-light/30 text-feg-gold-deep"
  if (level === "MEMBRE_FEG") return "border-feg-green/30 bg-feg-light-green text-feg-green"
  return "border-red-200 bg-red-50 text-red-700"
}

// Étapes fines du dossier, dans l'ordre du parcours (pour le détail).
const LABEL_STAGES: LabelStage[] = [
  "CANDIDATURE",
  "AUTO_EVALUATION",
  "AUDIT",
  "CONTRAT_LICENCE",
  "DELIVRE",
  "SURVEILLANCE",
]

export default async function AdminLabellisationPage() {
  const session = await getFegSession()
  if (!session?.id) redirect("/")
  // Rôle Admin FEG porté par le JWT (spec §6).
  if (!isAdminFeg(session.role)) redirect("/dashboard")

  // Toute entreprise ici est déjà membre de la FEG. Dernière mise à jour
  // d'abord — fait opérationnel, jamais un classement.
  const providers = await prisma.provider.findMany({
    include: { profile: { select: { entreprise: true, email: true } }, labelFile: true },
    orderBy: { updatedAt: "desc" },
  })

  // Comptages : phases macro (funnel) + étapes fines (détail).
  const phaseCounts: Record<LabelPhase, number> = { membre: 0, dossier: 0, delivre: 0 }
  const stageCounts = new Map<LabelStage, number>(LABEL_STAGES.map((s) => [s, 0]))
  let sansDossier = 0
  for (const provider of providers) {
    phaseCounts[labelPhase(provider.labelFile?.stage)] += 1
    if (provider.labelFile) {
      stageCounts.set(
        provider.labelFile.stage,
        (stageCounts.get(provider.labelFile.stage) ?? 0) + 1,
      )
    } else {
      sansDossier += 1
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Administration"
        title="Suivi de la labellisation"
        description="Toutes les entreprises de la plateforme sont membres de la FEG. Ce suivi retrace leur parcours vers le Label : constitution du dossier, audit de conformité, puis délivrance."
      />

      {/* ── Funnel : Membre → Dossier & audit → Label délivré ──── */}
      <LabelFunnel counts={phaseCounts} total={providers.length} />

      {/* ── Détail par étape du dossier ────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        <div className="rounded-xl border border-cool-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-ink">
            Sans dossier
          </p>
          <p className="mt-1 font-display text-2xl font-extrabold tracking-tight text-feg-green">
            {sansDossier}
          </p>
        </div>
        {LABEL_STAGES.map((stage) => {
          const isAudit = stage === "AUDIT"
          return (
            <div
              key={stage}
              className={`rounded-xl border p-4 ${
                isAudit ? "border-amber-300 bg-amber-50" : "border-cool-200 bg-white"
              }`}
            >
              <p className="flex items-center gap-1.5 text-xs font-semibold uppercase leading-snug tracking-wide text-muted-ink">
                {isAudit && (
                  <span
                    className="inline-block size-1.5 shrink-0 animate-pulse rounded-full bg-amber-500"
                    aria-hidden="true"
                  />
                )}
                {LABEL_STAGE_LABELS[stage]}
              </p>
              <p
                className={`mt-1 font-display text-2xl font-extrabold tracking-tight ${
                  isAudit ? "text-amber-700" : "text-feg-green"
                }`}
              >
                {stageCounts.get(stage) ?? 0}
              </p>
            </div>
          )
        })}
      </div>

      {providers.length === 0 ? (
        <EmptyState
          icon={BadgeCheck}
          title="Aucune entreprise membre pour l’instant"
          description="Les dossiers de labellisation apparaîtront ici dès l’arrivée des premières entreprises membres."
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-cool-200 bg-white">
          <div className="border-b border-cool-200 px-5 py-4">
            <h2 className="text-sm font-bold uppercase tracking-wide text-feg-green">
              Dossiers de labellisation
            </h2>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-cool-50 hover:bg-cool-50">
                  <TableHead className="pl-5">Entreprise</TableHead>
                  <TableHead>Secteur</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Étape du dossier</TableHead>
                  <TableHead className="w-40">Progression</TableHead>
                  <TableHead>Dernière mise à jour</TableHead>
                  <TableHead className="pr-5" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {providers.map((provider) => {
                  const stage = provider.labelFile?.stage ?? null
                  const pct = Math.round(stageProgress(stage) * 100)
                  const isCertified = provider.labelLevel === "CERTIFIE_FEG"
                  return (
                    <TableRow key={provider.id}>
                      <TableCell className="pl-5 font-medium text-ink">
                        {provider.profile.entreprise ?? provider.profile.email ?? "—"}
                      </TableCell>
                      <TableCell className="text-sm text-muted-ink">
                        {provider.secteur?.trim() || "—"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={levelBadgeClass(provider.labelLevel)}>
                          {LABEL_LEVEL_LABELS[provider.labelLevel]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <StageBadge stage={stage} />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-24 overflow-hidden rounded-full bg-cool-100">
                            <div
                              className={
                                isCertified
                                  ? "h-full rounded-full bg-feg-amber"
                                  : "h-full rounded-full bg-feg-green"
                              }
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-xs tabular-nums text-muted-ink">{pct}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-ink">
                        {(provider.labelFile?.updatedAt ?? provider.updatedAt).toLocaleDateString(
                          "fr-FR",
                        )}
                      </TableCell>
                      <TableCell className="pr-5">
                        <div className="flex items-center justify-end gap-3">
                          {nextStage(stage) && (
                            <form action={advanceLabelStage}>
                              <input type="hidden" name="providerId" value={provider.id} />
                              <button
                                type="submit"
                                className="text-sm font-semibold text-feg-green hover:underline"
                              >
                                {stage ? "Valider →" : "Ouvrir →"}
                              </button>
                            </form>
                          )}
                          <Link
                            href={`/admin/providers/${provider.id}`}
                            className="whitespace-nowrap text-sm font-semibold text-muted-ink hover:text-feg-green hover:underline"
                          >
                            Dossier →
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </>
  )
}
