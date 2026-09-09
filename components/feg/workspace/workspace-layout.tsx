import Link from "next/link"
import { redirect } from "next/navigation"
import { ExternalLink } from "lucide-react"
import { getFegSession, isAdminFeg } from "@/lib/feg-session"
import { getOrCreateProfile } from "@/lib/profile"
import { ESPACE_ADHERENT_URL } from "@/lib/feg-links"
import { devLogout } from "@/lib/actions/dev-login"
import { FegLogo } from "@/components/feg/feg-logo"
import { Separator } from "@/components/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { WorkspaceNav, type WorkspaceNavGroup } from "./workspace-nav"

/**
 * Shell applicatif commun aux espaces donneur d'ordre / prestataire / admin :
 * sidebar FEG (vert profond, cf. tokens --sidebar dans globals.css), en-tête
 * avec identité de l'utilisateur, contenu sur fond neutre. Réutilisé par les
 * layout.tsx de chaque section (pas de déplacement de routes).
 */
export default async function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getFegSession()
  if (!session?.id) redirect("/")

  const admin = isAdminFeg(session.role)
  // getOrCreateProfile est mémoïsé par requête : la page qui suit refera le
  // même appel sans coût supplémentaire. Les admins n'ont pas de profil métier.
  const profile = admin ? null : await getOrCreateProfile()
  if (!admin && !profile) redirect("/")

  const displayName =
    [profile?.prenom ?? session.prenom, profile?.nom ?? session.nom]
      .filter(Boolean)
      .join(" ") ||
    session.email ||
    "Compte FEG"
  const entreprise = admin
    ? "Administration FEG"
    : (profile?.entreprise ?? session.entreprise ?? "Entreprise membre FEG")
  const initials =
    displayName
      .split(/\s+/)
      .map((part) => part[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "FG"

  // Capacités universelles (décision 2026-07-31) : tout membre est à la fois
  // donneur d'ordre, sous-traitant et co-traitant — la navigation ne dépend
  // plus des flags du profil, chacun voit toutes les facettes.
  const groups: WorkspaceNavGroup[] = []
  if (!admin) {
    groups.push(
      {
        label: "Général",
        items: [
          { title: "Tableau de bord", href: "/dashboard", icon: "dashboard" },
          { title: "Messages", href: "/messages", icon: "messages" },
          { title: "Guide d’utilisation", href: "/guide", icon: "guide" },
        ],
      },
      {
        label: "Donneur d’ordre",
        items: [
          { title: "Mes appels d’offres", href: "/donneur-ordre", icon: "workspace" },
          { title: "Publier un appel d’offres", href: "/donneur-ordre/tenders/new", icon: "publish" },
        ],
      },
      {
        label: "Sous-traitance & Co-traitance",
        items: [
          { title: "Appels d’offres ouverts", href: "/prestataire/tenders", icon: "browse" },
          { title: "Mes offres", href: "/prestataire", icon: "bids" },
        ],
      },
    )
  }
  if (admin) {
    groups.push({
      label: "Administration",
      items: [
        { title: "Console FEG", href: "/admin", icon: "admin" },
        { title: "Suivi labellisation", href: "/admin/labellisation", icon: "label" },
        { title: "Appels d’offres & marchés", href: "/admin/marches", icon: "markets" },
        { title: "Finances", href: "/admin/finances", icon: "finance" },
      ],
    })
  }

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader className="border-b border-sidebar-border px-3 py-4">
          <Link href="/" className="group-data-[collapsible=icon]:hidden">
            <FegLogo variant="light" />
          </Link>
          <p className="px-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-feg-amber-bright/70 group-data-[collapsible=icon]:hidden">
            Sous-traitance & Cotraitance
          </p>
        </SidebarHeader>

        <SidebarContent>
          <WorkspaceNav groups={groups} />
        </SidebarContent>

        <SidebarFooter className="border-t border-sidebar-border">
          <div className="flex items-center gap-3 rounded-lg px-2 py-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-feg-amber text-xs font-bold text-feg-deep">
              {initials}
            </span>
            <span className="flex min-w-0 flex-col leading-tight group-data-[collapsible=icon]:hidden">
              <span className="truncate text-sm font-semibold text-white">{displayName}</span>
              <span className="truncate text-xs text-white/55">{entreprise}</span>
            </span>
          </div>
          <a
            href={ESPACE_ADHERENT_URL}
            className="flex items-center gap-2 rounded-lg px-2 py-2 text-xs font-medium text-white/65 transition-colors hover:bg-white/10 hover:text-white group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
          >
            <ExternalLink className="size-4 shrink-0" />
            <span className="group-data-[collapsible=icon]:hidden">Espace Adhérent</span>
          </a>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      <SidebarInset className="bg-cool-50">
        <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-3 border-b border-cool-200 bg-white px-4 lg:px-6">
          <SidebarTrigger className="text-feg-green" />
          <Separator orientation="vertical" className="h-5!" />
          <span className="truncate text-sm font-medium text-muted-ink">
            Plateforme Sous-traitance & Cotraitance
          </span>
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden text-sm text-muted-ink sm:block">
              <span className="font-semibold text-ink">{displayName}</span>
              {" · "}
              {entreprise}
            </span>
            {process.env.NODE_ENV !== "production" && (
              <form action={devLogout}>
                <button
                  type="submit"
                  className="rounded-md border border-cool-200 px-2.5 py-1 text-xs font-medium text-muted-ink transition-colors hover:border-feg-green hover:text-feg-green"
                >
                  Changer de persona (dev)
                </button>
              </form>
            )}
          </div>
        </header>

        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-6xl space-y-8">{children}</div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
