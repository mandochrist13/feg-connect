import type { Profile, Provider } from "@prisma/client"
import { prisma } from "@/lib/prisma"

/**
 * Retrouve la fiche prestataire liée au profil, ou la crée à la volée
 * (même logique que getOrCreateProfile, cf. lib/profile.ts). Niveau de
 * Label par défaut NON_CERTIFIE — rien ne le fait encore progresser, ce
 * sera le futur workflow de validation admin.
 */
export async function getOrCreateProvider(profile: Profile): Promise<Provider> {
  const existing = await prisma.provider.findUnique({
    where: { profileUserId: profile.userId },
  })
  if (existing) return existing

  return prisma.provider.create({
    data: { profileUserId: profile.userId },
  })
}
