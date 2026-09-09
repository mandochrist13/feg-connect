import type { LabelStage } from "@prisma/client"

/**
 * Grille tarifaire de la labellisation (cf. vitrine, section Tarifs) :
 * frais de dossier à la candidature, audit tiers, licence annuelle.
 *
 * IMPORTANT : les paiements réels sont encaissés côté FEG (site/Espace
 * Adhérent), jamais dans cette plateforme. Les montants calculés ici sont
 * des ESTIMATIONS indicatives déduites de l'étape du dossier — à présenter
 * comme telles dans l'UI.
 */
export const FRAIS_DOSSIER = 100_000
export const FRAIS_AUDIT = 300_000
export const FRAIS_LICENCE = 250_000

const STAGE_ORDER: LabelStage[] = [
  "CANDIDATURE",
  "AUTO_EVALUATION",
  "AUDIT",
  "CONTRAT_LICENCE",
  "DELIVRE",
  "SURVEILLANCE",
]

function reached(stage: LabelStage, milestone: LabelStage): boolean {
  return STAGE_ORDER.indexOf(stage) >= STAGE_ORDER.indexOf(milestone)
}

export type LabelFeeEstimate = {
  dossier: number
  audit: number
  licence: number
  total: number
}

/** Frais engagés estimés pour un dossier, cumulés selon l'étape atteinte. */
export function estimateLabelFees(stage: LabelStage): LabelFeeEstimate {
  const dossier = FRAIS_DOSSIER // dû dès l'ouverture du dossier (candidature)
  const audit = reached(stage, "AUDIT") ? FRAIS_AUDIT : 0
  const licence = reached(stage, "CONTRAT_LICENCE") ? FRAIS_LICENCE : 0
  return { dossier, audit, licence, total: dossier + audit + licence }
}

export function formatFcfa(amount: number): string {
  return `${amount.toLocaleString("fr-FR")} FCFA`
}
