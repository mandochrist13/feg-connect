import type { LabelStage } from "@prisma/client"
import { Badge } from "@/components/ui/badge"
import { LABEL_STAGE_LABELS } from "@/lib/status-labels"
import { cn } from "@/lib/utils"

// Couleur de l'étape du dossier. L'audit ressort (ambre + point clignotant) :
// c'est le moment où le cabinet d'audit / la FEG vérifie activement le dossier.
function stageClass(stage: LabelStage): string {
  if (stage === "DELIVRE" || stage === "SURVEILLANCE")
    return "border-feg-green/30 bg-feg-light-green text-feg-green"
  if (stage === "AUDIT") return "border-amber-300 bg-amber-50 text-amber-800"
  return "border-cool-200 bg-cool-50 text-cool-700"
}

/**
 * Badge d'étape du dossier de labellisation. `stage` null = dossier non ouvert.
 * L'étape « Audit de conformité » affiche un point clignotant pour signaler une
 * vérification en cours.
 */
export function StageBadge({ stage }: { stage: LabelStage | null | undefined }) {
  if (!stage) {
    return (
      <Badge variant="outline" className="border-cool-200 bg-cool-50 text-muted-ink">
        Dossier non ouvert
      </Badge>
    )
  }
  return (
    <Badge variant="outline" className={cn("gap-1.5", stageClass(stage))}>
      {stage === "AUDIT" && (
        <span
          className="inline-block size-1.5 animate-pulse rounded-full bg-amber-500"
          aria-hidden="true"
        />
      )}
      {LABEL_STAGE_LABELS[stage]}
    </Badge>
  )
}
