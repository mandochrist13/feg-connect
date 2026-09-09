"use server"

import { redirect, notFound } from "next/navigation"
import { Prisma } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import { getFegSession } from "@/lib/feg-session"
import { getOrCreateProfile } from "@/lib/profile"
import { getOrCreateProvider } from "@/lib/provider"
import { meetsMinLabelLevel } from "@/lib/label-level"

/**
 * Soumet une offre sur un appel d'offres publié (spec §8.3). Toutes les
 * gardes sont revérifiées ici même si la page de listing/détail a déjà
 * filtré — une URL directe ne doit jamais contourner les règles.
 */
export async function submitBid(formData: FormData) {
  const session = await getFegSession()
  if (!session?.id) redirect("/")

  const profile = await getOrCreateProfile()
  if (!profile) redirect("/")

  const tenderId = String(formData.get("tenderId") ?? "")
  const tender = await prisma.tender.findUnique({ where: { id: tenderId } })
  if (!tender || tender.status !== "PUBLIE") notFound()

  // Anti-double-camp : une entreprise ne peut jamais soumettre sur son
  // propre besoin, même en rejouant l'action directement.
  if (tender.donneurOrdreId === profile.userId) notFound()

  const provider = await getOrCreateProvider(profile)
  if (!meetsMinLabelLevel(provider.labelLevel, tender.minLabelLevel)) notFound()

  const delai = String(formData.get("delai") ?? "").trim() || null
  const message = String(formData.get("message") ?? "").trim() || null
  const montantRaw = formData.get("montant")
  const montant = montantRaw ? Number(montantRaw) : null

  try {
    await prisma.bid.create({
      data: { tenderId, providerId: provider.id, montant, delai, message, status: "SOUMISE" },
    })
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      redirect(`/prestataire/tenders/${tenderId}?error=offre_deja_soumise`)
    }
    throw err
  }

  redirect(`/prestataire/tenders/${tenderId}`)
}

/**
 * Retient une offre (spec §8.4). Rejette automatiquement les autres offres
 * encore SOUMISE sur le même appel d'offres — un seul lauréat en mode
 * sous-traitance (pas d'ambiguïté à laisser ouverte).
 */
export async function retainBid(formData: FormData) {
  const session = await getFegSession()
  if (!session?.id) redirect("/")

  const profile = await getOrCreateProfile()
  if (!profile) redirect("/")

  const bidId = String(formData.get("bidId") ?? "")
  const bid = await prisma.bid.findUnique({ where: { id: bidId }, include: { tender: true } })
  if (!bid) notFound()
  if (bid.tender.donneurOrdreId !== profile.userId) notFound()
  if (bid.tender.status !== "PUBLIE" || bid.status !== "SOUMISE") notFound()

  await prisma.$transaction([
    prisma.bid.update({ where: { id: bidId }, data: { status: "RETENUE" } }),
    prisma.bid.updateMany({
      where: { tenderId: bid.tenderId, id: { not: bidId }, status: "SOUMISE" },
      data: { status: "REJETEE" },
    }),
    prisma.tender.update({ where: { id: bid.tenderId }, data: { status: "ATTRIBUE" } }),
  ])

  redirect(`/donneur-ordre/tenders/${bid.tenderId}`)
}
