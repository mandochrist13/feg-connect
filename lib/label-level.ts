import type { LabelLevel } from "@prisma/client"

// Prisma ne compare pas les enums par ordre (pas de gte/lte) — l'ordre de
// confiance du Label est donc porté ici, en code, dans le même ordre que
// l'enum LabelLevel du schéma (spec §7).
export const LABEL_LEVEL_ORDER: LabelLevel[] = ["NON_CERTIFIE", "MEMBRE_FEG", "CERTIFIE_FEG"]

/** Niveaux de Label <= celui du prestataire — pour un `where: { in: [...] } }` Prisma. */
export function eligibleMinLevels(providerLevel: LabelLevel): LabelLevel[] {
  const idx = LABEL_LEVEL_ORDER.indexOf(providerLevel)
  return LABEL_LEVEL_ORDER.slice(0, idx + 1)
}

/** Filtre factuel d'éligibilité (spec : jamais un score) — re-vérifié côté serveur. */
export function meetsMinLabelLevel(providerLevel: LabelLevel, min: LabelLevel | null): boolean {
  if (!min) return true
  return LABEL_LEVEL_ORDER.indexOf(providerLevel) >= LABEL_LEVEL_ORDER.indexOf(min)
}

// Vocabulaire aligné sur la section Label de la vitrine : on ne parle pas de
// « Certifié FEG » mais de « Label délivré ». Tout compte de la plateforme est
// au moins membre — « Non membre » ne devrait pas apparaître.
export const LABEL_LEVEL_LABELS: Record<LabelLevel, string> = {
  NON_CERTIFIE: "Non membre",
  MEMBRE_FEG: "Membre FEG",
  CERTIFIE_FEG: "Label délivré",
}
