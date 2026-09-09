"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { encode } from "next-auth/jwt"
import type { FegToken } from "@/lib/feg-session"

/**
 * Personas de démo — jamais utilisés en production (garde en tout premier
 * dans devLogin). Ids stables pour que Profile/Provider persistent entre
 * deux essais. Deux prestataires distincts pour pouvoir tester le rejet
 * automatique des autres offres et la règle anti-double-camp.
 */
const DEV_PERSONAS: Record<string, FegToken> = {
  "donneur-ordre": {
    id: "dev-donneur-1",
    email: "donneur@dev.local",
    role: "ADHERENT",
    nom: "Moussavou",
    prenom: "Alice",
    entreprise: "Entreprise Démo A",
    statutAdhesion: "ACTIF",
    isProfileComplete: true,
    labelStatus: "DELIVRE",
  },
  "prestataire-a": {
    id: "dev-prestataire-1",
    email: "prestataire-a@dev.local",
    role: "ADHERENT",
    nom: "Nguema",
    prenom: "Bruno",
    entreprise: "Entreprise Démo B",
    statutAdhesion: "ACTIF",
    isProfileComplete: true,
    labelStatus: "DELIVRE",
  },
  "prestataire-b": {
    id: "dev-prestataire-2",
    email: "prestataire-b@dev.local",
    role: "ADHERENT",
    nom: "Ondo",
    prenom: "Chantal",
    entreprise: "Entreprise Démo C",
    statutAdhesion: "ACTIF",
    isProfileComplete: true,
    labelStatus: "DELIVRE",
  },
  admin: {
    id: "dev-admin-1",
    email: "admin@dev.local",
    role: "ADMIN",
    nom: "Admin",
    prenom: "FEG",
    statutAdhesion: "ACTIF",
    isProfileComplete: true,
    labelStatus: "DELIVRE",
  },
}

const SESSION_COOKIE = "next-auth.session-token"

export async function devLogin(formData: FormData) {
  if (process.env.NODE_ENV === "production") {
    throw new Error("devLogin est indisponible en production")
  }

  const persona = String(formData.get("persona") ?? "")
  const token = DEV_PERSONAS[persona]
  if (!token) throw new Error("Persona de démo inconnue")

  const secret = process.env.NEXTAUTH_SECRET
  if (!secret) throw new Error("NEXTAUTH_SECRET manquant")

  const encoded = await encode({ token, secret })

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, encoded, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/",
  })

  redirect("/dashboard")
}

export async function devLogout() {
  if (process.env.NODE_ENV === "production") {
    throw new Error("devLogout est indisponible en production")
  }

  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
  redirect("/dev-login")
}
