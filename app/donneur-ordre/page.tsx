import { redirect } from "next/navigation"
import { getFegSession, isAdminFeg } from "@/lib/feg-session"
import { getOrCreateProfile } from "@/lib/profile"
import { DashboardShell } from "@/components/feg/dashboard-shell"

export default async function DonneurOrdrePage() {
  const session = await getFegSession()
  if (!session?.id) redirect("/")

  const profile = await getOrCreateProfile()
  if (!profile) redirect("/")
  if (!profile.isDonneurOrdre) redirect("/dashboard")

  const displayName =
    [profile.prenom, profile.nom].filter(Boolean).join(" ") || null

  return (
    <DashboardShell
      role="Donneur d’ordre"
      title="Tableau de bord"
      displayName={displayName}
      email={profile.email}
      nav={{
        donneurOrdre: profile.isDonneurOrdre,
        prestataire: profile.isPrestataire,
        adminFeg: isAdminFeg(session.role),
      }}
    >
      <p className="text-neutral-600">
        Appels d’offres, présélection automatique et messagerie sécurisée
        arriveront ici (spec §8.4). La décision du prestataire appartient au
        donneur d’ordre.
      </p>
    </DashboardShell>
  )
}
