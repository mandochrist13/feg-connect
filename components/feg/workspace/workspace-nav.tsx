"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BadgeCheck,
  Banknote,
  BookOpen,
  Briefcase,
  FilePlus2,
  FileText,
  LayoutDashboard,
  MessagesSquare,
  Search,
  Send,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

// Les icônes sont résolues côté client : le layout serveur ne passe que des
// données sérialisables (noms d'icônes, pas de composants).
const ICONS: Record<string, LucideIcon> = {
  dashboard: LayoutDashboard,
  messages: MessagesSquare,
  guide: BookOpen,
  publish: FilePlus2,
  workspace: Briefcase,
  browse: Search,
  bids: Send,
  admin: ShieldCheck,
  label: BadgeCheck,
  markets: FileText,
  finance: Banknote,
}

export type WorkspaceNavGroup = {
  label: string
  items: { title: string; href: string; icon: string }[]
}

export function WorkspaceNav({ groups }: { groups: WorkspaceNavGroup[] }) {
  const pathname = usePathname()

  // L'item actif est celui dont le href est le plus long préfixe du chemin
  // courant — ainsi /donneur-ordre/tenders/new active bien « Publier » et
  // /donneur-ordre/tenders/abc retombe sur « Tableau de bord ».
  const allItems = groups.flatMap((g) => g.items)
  const active = allItems
    .filter((i) => pathname === i.href || pathname.startsWith(`${i.href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href

  return (
    <>
      {groups.map((group) => (
        <SidebarGroup key={group.label}>
          <SidebarGroupLabel className="text-feg-amber-bright/80">
            {group.label}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {group.items.map((item) => {
                const Icon = ICONS[item.icon] ?? LayoutDashboard
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={item.href === active}
                      tooltip={item.title}
                      className="data-[active=true]:bg-feg-amber data-[active=true]:font-semibold data-[active=true]:text-feg-deep"
                    >
                      <Link href={item.href}>
                        <Icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
  )
}
