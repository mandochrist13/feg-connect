// Liens externes vers l'écosystème FEG — l'adhésion et l'accès applicatif
// se font hors de cette plateforme (cf. process-adhesion, mémoire projet).

// Demande d'adhésion FEG — parcours externe (frais, vérif documents, Label).
export const FEG_ADHESION_URL = "https://lafeg.ga/home#register"

// Espace Adhérent — connexion, SSO, et tout ce qui se gère une fois adhérent.
export const ESPACE_ADHERENT_URL =
  process.env.NEXT_PUBLIC_ESPACE_ADHERENT_URL || "https://espace-adherent.lafeg.ga"
