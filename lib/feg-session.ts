import { headers } from "next/headers"

/**
 * Contrat de session partagé — forme du JWT NextAuth émis par l'Espace
 * Adhérent et décodé via getToken() (voir proxy.ts).
 */
export type FegRole =
  | "ADHERENT"
  | "ADMIN"
  | "SUPERADMIN"
  | "RECOUVREUR"
  | "SECRETARIAT"
  | "FINANCE"

export type FegToken = {
  id?: string // id de l'adhérent FEG = clé de liaison SSO
  email?: string
  role: FegRole
  nom?: string
  prenom?: string
  entreprise?: string
  fonction?: string
  telephone?: string
  photo?: string
  date_adhesion?: string
  statutAdhesion?: "ACTIF" | "INACTIF" | "SUSPENDU"
  isProfileComplete?: boolean
}

/** En-tête interne où le middleware place l'identité FEG (JSON encodé URI). */
export const FEG_SESSION_HEADER = "x-feg-session"

/** Sous-ensemble d'identité transmis du middleware vers l'app. */
export type FegSession = Pick<
  FegToken,
  | "id"
  | "email"
  | "role"
  | "nom"
  | "prenom"
  | "entreprise"
  | "statutAdhesion"
  | "isProfileComplete"
>

/** Le rôle FEG désigne-t-il un administrateur de la plateforme ? (spec §6) */
export function isAdminFeg(role: FegRole | undefined): boolean {
  return role === "ADMIN" || role === "SUPERADMIN"
}

/**
 * Encode l'identité FEG pour un en-tête HTTP (ASCII-safe malgré les accents).
 */
export function encodeFegSession(session: FegSession): string {
  return encodeURIComponent(JSON.stringify(session))
}

/**
 * Lit l'identité FEG injectée par le middleware. À utiliser dans les
 * Server Components / Server Actions. Renvoie null si absente (route publique
 * ou erreur) — les routes protégées ont toujours cette valeur.
 */
export async function getFegSession(): Promise<FegSession | null> {
  const raw = (await headers()).get(FEG_SESSION_HEADER)
  if (!raw) return null
  try {
    return JSON.parse(decodeURIComponent(raw)) as FegSession
  } catch {
    return null
  }
}
