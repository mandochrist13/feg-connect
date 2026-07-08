import { redirect } from "next/navigation"
import { getFegSession, isAdminFeg } from "@/lib/feg-session"
import { getOrCreateProfile } from "@/lib/profile"
import { DashboardShell } from "@/components/feg/dashboard-shell"

export default async function PrestatairePage() {
  const session = await getFegSession()
  if (!session?.id) redirect("/")

  const profile = await getOrCreateProfile()
  if (!profile) redirect("/")
  if (!profile.isPrestataire) redirect("/dashboard")

  const displayName =
    [profile.prenom, profile.nom].filter(Boolean).join(" ") || null

  return (
    <DashboardShell
      role="Prestataire"
      title="Mon espace"
      displayName={displayName}
      email={profile.email}
      nav={{
        donneurOrdre: profile.isDonneurOrdre,
        prestataire: profile.isPrestataire,
        adminFeg: isAdminFeg(session.role),
      }}
    >
      <p className="text-neutral-600">
        Suivi du Label FEG (niveau, référentiel 4 blocs A–D) et appels d’offres
        anonymisés arriveront ici (spec §8.3).
      </p>
    </DashboardShell>
  )
}
