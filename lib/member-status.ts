import { headers } from "next/headers"
import { redirect } from "next/navigation"
import type { Profile } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import { ESPACE_ADHERENT_URL } from "@/lib/feg-links"
import type { FegSession } from "@/lib/feg-session"

const REVALIDATE_AFTER_MS = 10 * 60 * 1000 // fraîcheur active (spec critère 4)
const STALE_CACHE_GRACE_MS = 60 * 60 * 1000 // tolérance en cas de panne réseau

type SsoStatusResponse = {
  statutAdhesion?: "ACTIF" | "INACTIF" | "SUSPENDU"
  labelStatus?: "AUCUN" | "EN_COURS" | "DELIVRE" | "RETIRE"
}

/**
 * Filet de sécurité côté serveur (Node) en complément du contrôle JWT fait
 * dans proxy.ts (Edge) : le JWT peut avoir jusqu'à 15 min de retard côté
 * émetteur, donc on revérifie activement au plus toutes les 10 min via
 * l'Espace Adhérent, et on synchronise au passage les champs d'identité du
 * profil local depuis les claims déjà disponibles dans la session.
 *
 * Ne tourne jamais dans proxy.ts : le client Prisma de cette app utilise le
 * driver `pg` (TCP), non supporté en runtime Edge — cette fonction doit donc
 * être appelée depuis un Server Component/Route Node (ici : getOrCreateProfile).
 */
export async function syncMemberStatus(
  profile: Profile,
  session: FegSession,
): Promise<Profile> {
  const now = Date.now()
  const checkedAt = profile.statusCheckedAt?.getTime() ?? 0
  const isStale = now - checkedAt > REVALIDATE_AFTER_MS

  let effectiveStatut = profile.membershipStatus
  let effectiveLabel = profile.labelStatusCache
  let current = profile

  if (isStale) {
    try {
      const cookieHeader = (await headers()).get("cookie")
      const res = await fetch(`${ESPACE_ADHERENT_URL}/api/sso/status`, {
        headers: cookieHeader ? { cookie: cookieHeader } : undefined,
        cache: "no-store",
      })
      if (!res.ok) throw new Error(`sso/status ${res.status}`)

      const data = (await res.json()) as SsoStatusResponse

      current = await prisma.profile.update({
        where: { userId: profile.userId },
        data: {
          // Identité — synchronisée depuis les claims de session déjà
          // disponibles (pas besoin d'un aller-retour réseau pour ça).
          nom: session.nom ?? null,
          prenom: session.prenom ?? null,
          email: session.email ?? null,
          entreprise: session.entreprise ?? null,
          membershipStatus: data.statutAdhesion ?? null,
          labelStatusCache: data.labelStatus ?? null,
          statusCheckedAt: new Date(),
        },
      })
      effectiveStatut = current.membershipStatus
      effectiveLabel = current.labelStatusCache
    } catch {
      // Panne réseau : on garde le dernier état connu s'il est encore
      // raisonnablement frais, sinon on refuse l'accès par prudence.
      // En développement, l'endpoint SSO de l'Espace Adhérent n'existe
      // généralement pas en local : on garde le dernier état connu sans
      // limite d'âge (sinon les personas dev seraient verrouillées après 1 h).
      const cacheAgeMs = now - checkedAt
      const hasUsableCache =
        process.env.NODE_ENV !== "production"
          ? Boolean(profile.statusCheckedAt)
          : profile.statusCheckedAt && cacheAgeMs < STALE_CACHE_GRACE_MS
      if (!hasUsableCache) {
        effectiveStatut = null
        effectiveLabel = null
      }
    }
  }

  if (effectiveStatut === "SUSPENDU" || effectiveStatut === "INACTIF") {
    redirect("/compte-indisponible")
  }
  if (effectiveLabel !== "DELIVRE") {
    redirect("/eligibilite")
  }

  return current
}
