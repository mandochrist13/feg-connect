import type { Profile } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import { getFegSession } from "@/lib/feg-session"

export type { Profile }

/**
 * Retrouve le profil sous-traitance de l'adhérent FEG connecté, ou le crée
 * à la volée à partir de l'identité du JWT (spec §5.3, §10.2).
 *
 * Liaison SSO : Profile.userId = token.id (id de l'adhérent FEG).
 * Renvoie null si aucune session FEG (route publique).
 */
export async function getOrCreateProfile(): Promise<Profile | null> {
  const session = await getFegSession()
  if (!session?.id) return null

  const existing = await prisma.profile.findUnique({
    where: { userId: session.id },
  })
  if (existing) return existing

  // Création à la volée. Aucun rôle applicatif par défaut : l'utilisateur
  // choisit donneur d'ordre et/ou prestataire à l'onboarding (spec §6).
  return prisma.profile.create({
    data: {
      userId: session.id,
      email: session.email ?? null,
      nom: session.nom ?? null,
      prenom: session.prenom ?? null,
      entreprise: session.entreprise ?? null,
      // Miroir informatif du statut d'adhésion FEG lu via SSO (spec §5.4).
      membershipStatus: session.statutAdhesion ?? null,
    },
  })
}
