import type { LabelStage } from "@prisma/client"

/**
 * Toute entreprise présente sur la plateforme est déjà MEMBRE de la FEG.
 * Le « suivi de labellisation » décrit donc sa progression le long d'un
 * parcours simple : Membre → Dossier & audit → Label délivré.
 *
 * On regroupe les étapes fines de l'enum LabelStage en 3 phases macro pour
 * un pilotage lisible (funnel), sans toucher au schéma.
 */
export type LabelPhase = "membre" | "dossier" | "delivre"

export const LABEL_PHASE_ORDER: LabelPhase[] = ["membre", "dossier", "delivre"]

export const LABEL_PHASE_LABELS: Record<LabelPhase, string> = {
  membre: "Membre FEG",
  dossier: "Dossier & audit",
  delivre: "Label délivré",
}

export const LABEL_PHASE_HINTS: Record<LabelPhase, string> = {
  membre: "Adhérent — dossier de label à engager",
  dossier: "Dossier en constitution ou audit de conformité en cours",
  delivre: "Label délivré, en vigueur (suivi annuel inclus)",
}

/** Phase macro d'un membre selon l'étape de son dossier (ou son absence). */
export function labelPhase(stage: LabelStage | null | undefined): LabelPhase {
  if (!stage) return "membre"
  if (stage === "DELIVRE" || stage === "SURVEILLANCE") return "delivre"
  return "dossier"
}

// Progression indicative (0 → 1) le long du parcours, pour une barre d'avancement.
const STAGE_PROGRESS: Record<LabelStage, number> = {
  CANDIDATURE: 0.15,
  AUTO_EVALUATION: 0.35,
  AUDIT: 0.55,
  CONTRAT_LICENCE: 0.8,
  DELIVRE: 1,
  SURVEILLANCE: 1,
}

export function stageProgress(stage: LabelStage | null | undefined): number {
  return stage ? STAGE_PROGRESS[stage] : 0
}

// Séquence complète des étapes (ordre du parcours). Sert à la validation
// pas-à-pas côté admin (bouton « Valider l'étape suivante »).
export const LABEL_STAGE_SEQUENCE: LabelStage[] = [
  "CANDIDATURE",
  "AUTO_EVALUATION",
  "AUDIT",
  "CONTRAT_LICENCE",
  "DELIVRE",
  "SURVEILLANCE",
]

/** Étape suivante du parcours (ou null si terminé). Sans dossier → CANDIDATURE. */
export function nextStage(stage: LabelStage | null | undefined): LabelStage | null {
  if (!stage) return "CANDIDATURE"
  const i = LABEL_STAGE_SEQUENCE.indexOf(stage)
  if (i < 0 || i >= LABEL_STAGE_SEQUENCE.length - 1) return null
  return LABEL_STAGE_SEQUENCE[i + 1]
}

/** Niveau de Label déduit de l'étape (Certifié ⇔ Label délivré/suivi). */
export function levelForStage(stage: LabelStage | null | undefined): "MEMBRE_FEG" | "CERTIFIE_FEG" {
  return stage === "DELIVRE" || stage === "SURVEILLANCE" ? "CERTIFIE_FEG" : "MEMBRE_FEG"
}
