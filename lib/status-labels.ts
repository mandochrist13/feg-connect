import type {
  BidStatus,
  GmeForm,
  LabelStage,
  TenderModality,
  TenderStatus,
} from "@prisma/client"

export const TENDER_STATUS_LABELS: Record<TenderStatus, string> = {
  BROUILLON: "Brouillon",
  PUBLIE: "Publié",
  CLOTURE: "Clôturé",
  ATTRIBUE: "Attribué",
  ANNULE: "Annulé",
}

export const BID_STATUS_LABELS: Record<BidStatus, string> = {
  SOUMISE: "Soumise",
  RETENUE: "Retenue",
  REJETEE: "Rejetée",
  RETIREE: "Retirée",
}

export const TENDER_MODALITY_LABELS: Record<TenderModality, string> = {
  SOUS_TRAITANCE: "Sous-traitance",
  COTRAITANCE: "Co-traitance (GME)",
}

export const GME_FORM_LABELS: Record<GmeForm, string> = {
  SOLIDAIRE: "GME solidaire",
  CONJOINT: "GME conjoint",
  CONJOINT_MANDATAIRE_SOLIDAIRE: "GME conjoint, mandataire solidaire",
}

// Étapes fines du dossier de labellisation (la FEG fait la vérification).
// Vocabulaire aligné sur le parcours réel : membre → dossier & audit → label.
export const LABEL_STAGE_LABELS: Record<LabelStage, string> = {
  CANDIDATURE: "Dossier ouvert",
  AUTO_EVALUATION: "Dossier en constitution",
  AUDIT: "Audit de conformité",
  CONTRAT_LICENCE: "Vérification finale",
  DELIVRE: "Label délivré",
  SURVEILLANCE: "Suivi annuel",
}
