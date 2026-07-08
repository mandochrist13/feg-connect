import { NextResponse, type NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"
import {
  FEG_SESSION_HEADER,
  encodeFegSession,
  type FegToken,
} from "@/lib/feg-session"

const ESPACE_ADHERENT_URL =
  process.env.NEXT_PUBLIC_ESPACE_ADHERENT_URL || "https://adherent.lafeg.ga"

// Routes publiques : pas de garde SSO (landing).
function isPublic(pathname: string): boolean {
  return pathname === "/"
}

/**
 * SSO NextAuth partagé (spec §5.3).
 *  1. Lit le JWT FEG posé sur .lafeg.ga via getToken() + NEXTAUTH_SECRET partagé.
 *  2. Pas de session → redirige vers le login de l'Espace Adhérent
 *     (aucune page de login ici).
 *  3. Session valide → injecte l'identité FEG dans les en-têtes internes ;
 *     la création du profil local et le routage par rôle se font côté serveur
 *     (Node/Prisma) à l'arrivée sur /dashboard.
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
