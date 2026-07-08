import { redirect } from "next/navigation"
import { getFegSession, isAdminFeg } from "@/lib/feg-session"
import { getOrCreateProfile } from "@/lib/profile"

/**
 * Point d'entrée après SSO (spec §5.3). Route vers le tableau de bord du rôle.
 * Le middleware garantit déjà une session ici.
 */
export default async function DashboardPage() {
  const session = await getFegSession()
  if (!session?.id) redirect("/")

  // Admin FEG : déterminé par le rôle du JWT, jamais stocké en base (spec §6).
  if (isAdminFeg(session.role)) redirect("/admin")

  // Adhérent : rôles applicatifs propres à l'app, portés par le profil.
  const profile = await getOrCreateProfile()
  if (!profile) redirect("/")

  if (!profile.isDonneurOrdre && !profile.isPrestataire) {
    redirect("/onboarding")
  }
  if (profile.isDonneurOrdre) redirect("/donneur-ordre")
  redirect("/prestataire")
}
