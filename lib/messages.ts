import { prisma } from "@/lib/prisma"

/**
 * Anti-contournement (spec §9.2) : masque emails et numéros de téléphone dans
 * le corps d'un message. On échange sur la plateforme, jamais en direct.
 */
export function redactContacts(text: string): string {
  return text
    .replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g, "[coordonnée masquée]")
    // Séquences de type téléphone : 8 chiffres ou plus, espaces/séparateurs tolérés.
    .replace(/\+?\d[\d\s().\-]{7,}\d/g, "[coordonnée masquée]")
}

/**
 * Un échange n'est autorisé que dans le contexte d'un appel d'offres : entre le
 * donneur d'ordre et une entreprise ayant soumis une offre sur cet appel. Cela
 * évite tout annuaire de contacts libre (anti-contournement).
 */
export async function canConverse(
  tenderId: string,
  meUserId: string,
  otherUserId: string,
): Promise<boolean> {
  if (!tenderId || !otherUserId || meUserId === otherUserId) return false

  const tender = await prisma.tender.findUnique({
    where: { id: tenderId },
    select: { donneurOrdreId: true },
  })
  if (!tender) return false

  const participants = new Set([meUserId, otherUserId])
  if (!participants.has(tender.donneurOrdreId)) return false

  // L'autre partie (celle qui n'est pas le donneur d'ordre) doit avoir soumis
  // une offre sur cet appel.
  const bidderUserId = meUserId === tender.donneurOrdreId ? otherUserId : meUserId
  const bid = await prisma.bid.findFirst({
    where: { tenderId, provider: { profileUserId: bidderUserId } },
    select: { id: true },
  })
  return Boolean(bid)
}
