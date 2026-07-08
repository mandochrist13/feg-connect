import { redirect } from "next/navigation"
import { getFegSession, isAdminFeg } from "@/lib/feg-session"
import { getOrCreateProfile } from "@/lib/profile"
import { setRoles } from "@/lib/actions/roles"

/**
 * Onboarding : choix du/des rôle(s) applicatif(s) (spec §6).
 * Affiché aux profils créés à la volée sans rôle encore choisi.
 */
export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const session = await getFegSession()
  if (!session?.id) redirect("/")
  // Un admin FEG n'a pas de rôle donneur/prestataire à choisir.
  if (isAdminFeg(session.role)) redirect("/admin")

  const profile = await getOrCreateProfile()
  if (!profile) redirect("/")
  // Rôle déjà défini → vers le tableau de bord.
  if (profile.isDonneurOrdre || profile.isPrestataire) redirect("/dashboard")

  const { error } = await searchParams
  const prenom = profile.prenom

  return (
    <main className="min-h-screen bg-[#F7F7F4] flex items-center justify-center p-6">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-sm border border-black/5 p-8">
        <p className="text-sm font-semibold text-[#AFAE7E] uppercase tracking-wide">
          Plateforme Sous-traitance & Cotraitance
        </p>
        <h1 className="mt-2 text-2xl font-bold text-[#063D21]">
          Bienvenue{prenom ? `, ${prenom}` : ""}
        </h1>
        <p className="mt-2 text-sm text-neutral-600">
          Comment souhaitez-vous utiliser la plateforme&nbsp;? Vous pourrez
          cumuler les deux rôles et modifier ce choix plus tard.
        </p>

        {error === "role_requis" && (
          <p className="mt-4 rounded-lg bg-red-50 text-red-700 text-sm px-4 py-3">
            Veuillez sélectionner au moins un rôle.
          </p>
        )}

        <form action={setRoles} className="mt-6 space-y-3">
          <label className="flex items-start gap-3 rounded-xl border border-neutral-200 p-4 cursor-pointer hover:border-[#063D21] transition-colors">
            <input
              type="checkbox"
              name="donneur_ordre"
              className="mt-1 h-4 w-4 accent-[#063D21]"
            />
            <span>
              <span className="block font-semibold text-[#063D21]">
                Donneur d’ordre
              </span>
              <span className="block text-sm text-neutral-600">
                Publier des appels d’offres et choisir un prestataire.
              </span>
            </span>
          </label>

          <label className="flex items-start gap-3 rounded-xl border border-neutral-200 p-4 cursor-pointer hover:border-[#063D21] transition-colors">
            <input
              type="checkbox"
              name="prestataire"
              className="mt-1 h-4 w-4 accent-[#063D21]"
            />
            <span>
              <span className="block font-semibold text-[#063D21]">
                Prestataire
              </span>
              <span className="block text-sm text-neutral-600">
                Gérer son Label FEG et répondre aux appels d’offres.
              </span>
            </span>
          </label>

          <button
            type="submit"
            className="w-full rounded-xl bg-[#063D21] text-white font-semibold py-3 mt-2 hover:bg-[#0a5230] transition-colors"
          >
            Continuer
          </button>
        </form>
      </div>
    </main>
  )
}
