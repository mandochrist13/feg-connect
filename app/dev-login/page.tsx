import { notFound } from "next/navigation"
import { FlaskConical } from "lucide-react"
import { devLogin } from "@/lib/actions/dev-login"
import { FegLogo } from "@/components/feg/feg-logo"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

// Tout membre cumule les facettes donneur d'ordre / sous-traitant /
// co-traitant (capacités universelles) — les personas sont des entreprises
// neutres, pas des rôles.
const PERSONAS = [
  {
    value: "donneur-ordre",
    label: "Entreprise Démo A",
    description: "Label délivré.",
  },
  {
    value: "prestataire-a",
    label: "Entreprise Démo B",
    description: "Label délivré — en suivi annuel.",
  },
  {
    value: "prestataire-b",
    label: "Entreprise Démo C",
    description: "Membre FEG — labellisation à engager.",
  },
  {
    value: "admin",
    label: "Admin FEG (démo)",
    description: "Supervise la plateforme côté FEG.",
  },
]

/**
 * Aperçu local sans SSO réelle — jamais accessible en production. Émet un
 * vrai cookie de session NextAuth (lib/actions/dev-login.ts), lu par
 * proxy.ts exactement comme un cookie posé par l'Espace Adhérent : aucune
 * modification du garde-fou de sécurité réel.
 */
export default async function DevLoginPage() {
  if (process.env.NODE_ENV === "production") notFound()

  return (
    <main className="flex min-h-screen items-center justify-center bg-cool-50 p-6">
      <div className="w-full max-w-md rounded-2xl border border-cool-200 bg-white p-6 shadow-sm sm:p-8">
        <FegLogo />

        <Badge
          variant="outline"
          className="mt-6 border-amber-200 bg-amber-50 text-amber-800"
        >
          <FlaskConical aria-hidden="true" />
          Environnement de développement
        </Badge>

        <h1 className="mt-3 text-2xl font-bold text-feg-green">
          Se connecter (démo)
        </h1>
        <p className="mt-2 text-sm text-muted-ink">
          Simule une session Espace Adhérent, sans passer par la vraie SSO.
          Disponible uniquement en développement.
        </p>

        <div className="mt-6 flex flex-col gap-2.5">
          {PERSONAS.map((persona) => (
            <form key={persona.value} action={devLogin}>
              <input type="hidden" name="persona" value={persona.value} />
              <Button
                type="submit"
                variant="fegOutline"
                className="h-auto w-full flex-col items-start gap-0.5 whitespace-normal px-4 py-3 text-left"
              >
                <span className="font-semibold">{persona.label}</span>
                <span className="text-xs font-normal opacity-75">
                  {persona.description}
                </span>
              </Button>
            </form>
          ))}
        </div>
      </div>
    </main>
  )
}
