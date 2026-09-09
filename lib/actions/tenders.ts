"use server"

import { redirect } from "next/navigation"
import type { GmeForm, TenderModality } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import { getFegSession } from "@/lib/feg-session"
import { getOrCreateProfile } from "@/lib/profile"

const MODALITIES: TenderModality[] = ["SOUS_TRAITANCE", "COTRAITANCE"]
const GME_FORMS: GmeForm[] = ["SOLIDAIRE", "CONJOINT", "CONJOINT_MANDATAIRE_SOLIDAIRE"]

/**
 * Publie un appel d'offres (spec §8.2). Créé directement PUBLIE — pas de
 * brouillon dans cette itération. Tout membre peut publier (capacités
 * universelles, décision 2026-07-31). En co-traitance, la forme de GME est
 * obligatoire ; la constitution formelle du groupement (Group/GroupMember)
 * viendra dans une itération dédiée. minLabelLevel n'est pas exposé ici :
 * voir lib/label-level.ts pour le pourquoi.
 */
export async function createTender(formData: FormData) {
  const session = await getFegSession()
  if (!session?.id) redirect("/")

  const profile = await getOrCreateProfile()
  if (!profile) redirect("/")

  const titre = String(formData.get("titre") ?? "").trim()
  if (!titre) redirect("/donneur-ordre/tenders/new?error=titre_requis")

  const secteur = String(formData.get("secteur") ?? "").trim() || null
  const delai = String(formData.get("delai") ?? "").trim() || null

  const budgetRaw = formData.get("budget")
  const budget = budgetRaw ? Number(budgetRaw) : null
  if (budget !== null && !Number.isFinite(budget)) {
    redirect("/donneur-ordre/tenders/new?error=budget_invalide")
  }

  const modalityRaw = String(formData.get("modality") ?? "")
  const modality: TenderModality = MODALITIES.includes(modalityRaw as TenderModality)
    ? (modalityRaw as TenderModality)
    : "SOUS_TRAITANCE"

  const gmeFormRaw = String(formData.get("gmeForm") ?? "")
  let gmeForm: GmeForm | null = GME_FORMS.includes(gmeFormRaw as GmeForm)
    ? (gmeFormRaw as GmeForm)
    : null
  if (modality === "COTRAITANCE" && !gmeForm) {
    redirect("/donneur-ordre/tenders/new?error=gme_form_requise")
  }
  if (modality === "SOUS_TRAITANCE") gmeForm = null

  const tender = await prisma.tender.create({
    data: {
      donneurOrdreId: profile.userId,
      modality,
      gmeForm,
      titre,
      secteur,
      budget,
      delai,
      status: "PUBLIE",
    },
  })

  redirect(`/donneur-ordre/tenders/${tender.id}`)
}
