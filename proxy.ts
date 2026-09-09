import { NextResponse, type NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"
import {
  FEG_SESSION_HEADER,
  encodeFegSession,
  isAdminFeg,
  type FegToken,
} from "@/lib/feg-session"
import { ESPACE_ADHERENT_URL } from "@/lib/feg-links"

// Routes publiques : pas de garde SSO (landing + dev-login, qui doit rester
// joignable sans session pour pouvoir en émettre une en local — la page et
// l'action se coupent elles-mêmes en production, cf. lib/actions/dev-login.ts).
function isPublic(pathname: string): boolean {
  return pathname === "/" || pathname === "/dev-login"
}

// Pages d'état : accessibles avec une session valide même si l'adhérent
// n'est pas (encore) éligible — ce sont justement les pages qui expliquent
// pourquoi. Exemptées du contrôle statut/label pour éviter une boucle de
// redirection.
function isStatePage(pathname: string): boolean {
  return pathname === "/eligibilite" || pathname === "/compte-indisponible"
}

/**
 * SSO NextAuth partagé (spec §5.3).
 *  1. Lit le JWT FEG posé sur .lafeg.ga via getToken() + NEXTAUTH_SECRET partagé.
 *  2. Pas de session → redirige vers le login de l'Espace Adhérent
 *     (aucune page de login ici).
 *  3. Session valide mais adhérent SUSPENDU/INACTIF → /compte-indisponible.
 *     Adhérent sans Label délivré → /eligibilite. Les comptes Admin FEG
 *     (rôle porté par le JWT) sont exemptés de ce palier : ce sont des
 *     membres du personnel, pas des adhérents en cours de labellisation.
 *  4. Sinon → injecte l'identité FEG dans les en-têtes internes ; la
 *     création/synchronisation du profil local et le routage par rôle se
 *     font côté serveur (Node/Prisma) à l'arrivée sur /dashboard.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (isPublic(pathname)) return NextResponse.next()

  const token = (await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
    // En prod (https) le cookie est "__Secure-next-auth.session-token".
    // getToken le détecte via secureCookie ; on force en production pour
    // fiabiliser la lecture derrière un proxy.
    secureCookie: process.env.NODE_ENV === "production",
  })) as FegToken | null

  if (!token || !token.id) {
    // Pas de session FEG → login sur l'Espace Adhérent, avec retour ici.
    const loginUrl = new URL("/user/login", ESPACE_ADHERENT_URL)
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.href)
    return NextResponse.redirect(loginUrl)
  }

  if (!isAdminFeg(token.role) && !isStatePage(pathname)) {
    if (token.statutAdhesion === "SUSPENDU" || token.statutAdhesion === "INACTIF") {
      return NextResponse.redirect(new URL("/compte-indisponible", request.url))
    }
    // Absent (jeton émis avant cette évolution SSO) traité comme non délivré.
    if (token.labelStatus !== "DELIVRE") {
      return NextResponse.redirect(new URL("/eligibilite", request.url))
    }
  }

  // Propager l'identité FEG aux Server Components (ASCII-safe).
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set(
    FEG_SESSION_HEADER,
    encodeFegSession({
      id: token.id,
      email: token.email,
      role: token.role,
      nom: token.nom,
      prenom: token.prenom,
      entreprise: token.entreprise,
      statutAdhesion: token.statutAdhesion,
      isProfileComplete: token.isProfileComplete,
      labelStatus: token.labelStatus,
    }),
  )

  return NextResponse.next({ request: { headers: requestHeaders } })
}

export const config = {
  matcher: [
    // Toutes les routes sauf assets Next et fichiers statiques.
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
}
