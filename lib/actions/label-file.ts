"use server"

import { redirect, notFound } from "next/navigation"
import type { LabelLevel, LabelStage } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import { getFegSession, isAdminFeg } from "@/lib/feg-session"
import { nextStage, levelForStage } from "@/lib/label-phase"

const STAGES: LabelStage[] = [
  "CANDIDATURE",
  "AUTO_EVALUATION",
  "AUDIT",
  "CONTRAT_LICENCE",
  "DELIVRE",
  "SURVEILLANCE",
]
const LEVELS: LabelLevel[] = ["NON_CERTIFIE", "MEMBRE_FEG", "CERTIFIE_FEG"]

function parseScore(formData: FormData, key: string): number | null {
  const raw = formData.get(key)
  if (!raw) return null
  const n = Number(raw)
  return Number.isFinite(n) ? n : null
}

/**
 * Enregistre la progression du dossier de labellisation (spec §7.2).
 * Allégé : pas d'upload de pièces ni d'orchestration d'audit tiers — l'admin
 * enregistre juste le résultat (étape, scores, niveau).
 */
export async function updateLabelFile(formData: FormData) {
  const session = await getFegSession()
  if (!session?.id) redirect("/")
  if (!isAdminFeg(session.role)) redirect("/dashboard")

  const providerId = String(formData.get("providerId") ?? "")
  const provider = await prisma.provider.findUnique({ where: { id: providerId } })
  if (!provider) notFound()

  const stageRaw = String(formData.get("stage") ?? "")
  const stage = STAGES.includes(stageRaw as LabelStage) ? (stageRaw as LabelStage) : "CANDIDATURE"

  const levelRaw = String(formData.get("labelLevel") ?? "")
  const labelLevel = LEVELS.includes(levelRaw as LabelLevel)
    ? (levelRaw as LabelLevel)
    : "NON_CERTIFIE"

  const scoreBlocA = parseScore(formData, "scoreBlocA")
  const scoreBlocB = parseScore(formData, "scoreBlocB")
  const scoreBlocC = parseScore(formData, "scoreBlocC")
  const scoreBlocD = parseScore(formData, "scoreBlocD")

  await prisma.labelFile.upsert({
    where: { providerId },
    update: { stage, scoreBlocA, scoreBlocB, scoreBlocC, scoreBlocD },
    create: { providerId, stage, scoreBlocA, scoreBlocB, scoreBlocC, scoreBlocD },
  })
  await prisma.provider.update({ where: { id: providerId }, data: { labelLevel } })

  redirect(`/admin/providers/${providerId}`)
}

/**
 * Valide l'étape suivante du dossier (bouton d'action admin). Sans dossier,
 * l'ouvre (CANDIDATURE). Le niveau de Label suit l'étape automatiquement
 * (Certifié dès la délivrance). Sans effet si le parcours est terminé.
 */
export async function advanceLabelStage(formData: FormData) {
  const session = await getFegSession()
  if (!session?.id) redirect("/")
  if (!isAdminFeg(session.role)) redirect("/dashboard")

  const providerId = String(formData.get("providerId") ?? "")
  const provider = await prisma.provider.findUnique({
    where: { id: providerId },
    include: { labelFile: true },
  })
  if (!provider) notFound()

  const target = nextStage(provider.labelFile?.stage)
  if (!target) redirect(`/admin/providers/${providerId}`) // déjà au bout du parcours

  await prisma.labelFile.upsert({
    where: { providerId },
    update: { stage: target },
    create: { providerId, stage: target },
  })
  await prisma.provider.update({
    where: { id: providerId },
    data: { labelLevel: levelForStage(target) },
  })

  redirect(`/admin/providers/${providerId}`)
}
