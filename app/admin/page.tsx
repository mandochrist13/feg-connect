import { redirect } from "next/navigation"
import { getFegSession, isAdminFeg } from "@/lib/feg-session"
import { DashboardShell } from "@/components/feg/dashboard-shell"

export default async function AdminPage() {
  const session = await getFegSession()
  if (!session?.id) redirect("/")
  // Rôle Admin FEG porté par le JWT (spec §6).
  if (!isAdminFeg(session.role)) redirect("/dashboard")

  const displayName =
    [session.prenom, session.nom].filter(Boolean).join(" ") || null

  return (
    <DashboardShell
      role="Admin FEG"
      title="Console FEG"
      displayName={displayName}
      email={session.email}
      nav={{ adminFeg: true }}
    >
      <p className="text-neutral-600">
        File de validation des dossiers de labellisation et supervision
        arriveront ici (spec §8.5). Pas de composition de présélection : elle est
        automatique.
      </p>
    </DashboardShell>
  )
}
