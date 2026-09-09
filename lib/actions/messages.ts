"use server"

import { redirect, notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { getFegSession } from "@/lib/feg-session"
import { getOrCreateProfile } from "@/lib/profile"
import { canConverse, redactContacts } from "@/lib/messages"

/**
 * Envoie un message dans le fil d'un appel d'offres. Toutes les gardes sont
 * revérifiées ici (une URL/action directe ne doit jamais contourner les
 * règles) : contexte d'appel d'offres valide + masquage des coordonnées.
 */
export async function sendMessage(formData: FormData) {
  const session = await getFegSession()
  if (!session?.id) redirect("/")

  const profile = await getOrCreateProfile()
  if (!profile) redirect("/")

  const tenderId = String(formData.get("tenderId") ?? "")
  const recipientId = String(formData.get("recipientId") ?? "")
  const bodyRaw = String(formData.get("body") ?? "").trim()

  const thread = `/messages/${tenderId}/${recipientId}`
  if (!bodyRaw) redirect(thread)

  const allowed = await canConverse(tenderId, profile.userId, recipientId)
  if (!allowed) notFound()

  const body = redactContacts(bodyRaw).slice(0, 4000)
  await prisma.message.create({
    data: { tenderId, senderId: profile.userId, recipientId, body },
  })

  redirect(thread)
}
