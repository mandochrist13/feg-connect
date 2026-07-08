"use server"

import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { getFegSession } from "@/lib/feg-session"

/**
 * Enregistre le(s) rôle(s) applicatif(s) choisi(s) à l'onboarding (spec §6).
 * Un compte peut cumuler donneur d'ordre et prestataire. Ces rôles sont
 * PROPRES à l'app (stockés dans profile), pas issus du JWT FEG.
 * (Le rôle Admin FEG vient du JWT et n'est jamais choisi ici.)
 */
export async function setRoles(formData: FormData) {
  const session = await getFegSession()
  if (!session?.id) redirect("/")

  const isDonneurOrdre = formData.get("donneur_ordre") === "on"
  const isPrestataire = formData.get("prestataire") === "on"

  if (!isDonneurOrdre && !isPrestataire) {
    redirect("/onboarding?error=role_requis")
  }

  await prisma.profile.update({
    where: { userId: session.id },
    data: { isDonneurOrdre, isPrestataire },
  })

  redirect("/dashboard")
}
