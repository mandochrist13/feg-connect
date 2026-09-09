import { cache } from "react"
import type { Profile } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import { getFegSession } from "@/lib/feg-session"
import { syncMemberStatus } from "@/lib/member-status"

export type { Profile }

/**
 * Retrouve le profil sous-traitance de l'adhérent FEG connecté, ou le crée
 * à la volée à partir de l'identité du JWT (spec §5.3, §10.2).
 *
 * Liaison SSO : Profile.userId = token.id (id de l'adhérent FEG).
 * Renvoie null si aucune session FEG (route publique).
 *
 * Revalide aussi activement le statut d'adhésion/Label (syncMemberStatus) —
 * redirige vers /compte-indisponible ou /eligibilite si l'adhérent n'est
 * plus éligible, même si le JWT lu par proxy.ts était encore optimiste.
 *
 * Mémoïsé par requête (React cache) : le layout du workspace et la page
 * peuvent l'appeler chacun sans doubler les allers-retours Prisma/SSO.
 */
export const getOrCreateProfile = cache(async (): Promise<Profile | null> => {
  const session = await getFegSession()
  if (!session?.id) return null

  const existing = await prisma.profile.findUnique({
    where: { userId: session.id },
  })

  // Capacités universelles (décision produit 2026-07-31) : tout membre est à
  // la fois donneur d'ordre, sous-traitant et co-traitant — plus de choix de
  // rôle à l'onboarding. Les anciens profils sont mis à niveau au passage.
  const profile = existing
    ? existing.isDonneurOrdre && existing.isPrestataire
      ? existing
      : await prisma.profile.update({
          where: { userId: session.id },
          data: { isDonneurOrdre: true, isPrestataire: true },
        })
    : await prisma.profile.create({
        data: {
          userId: session.id,
          email: session.email ?? null,
          nom: session.nom ?? null,
          prenom: session.prenom ?? null,
          entreprise: session.entreprise ?? null,
          isDonneurOrdre: true,
          isPrestataire: true,
          // Miroir informatif du statut d'adhésion/Label FEG lu via SSO
          // (spec §5.4). proxy.ts vient de valider ces claims à l'instant :
          // pas besoin de revalidation active immédiate.
          membershipStatus: session.statutAdhesion ?? null,
          labelStatusCache: session.labelStatus ?? null,
          statusCheckedAt: new Date(),
        },
      })

  return syncMemberStatus(profile, session)
})
