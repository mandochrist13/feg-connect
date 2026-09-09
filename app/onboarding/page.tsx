import { redirect } from "next/navigation"

/**
 * Obsolète depuis les capacités universelles (décision 2026-07-31) : tout
 * membre est à la fois donneur d'ordre, sous-traitant et co-traitant — plus
 * de choix de rôle. Conservé en simple redirection pour les liens/onglets
 * encore ouverts.
 */
export default function OnboardingPage() {
  redirect("/dashboard")
}
