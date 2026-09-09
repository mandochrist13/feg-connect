import Link from "next/link"
import { redirect } from "next/navigation"
import { MessagesSquare } from "lucide-react"
import { getFegSession } from "@/lib/feg-session"
import { getOrCreateProfile } from "@/lib/profile"
import { prisma } from "@/lib/prisma"
import { PageHeader } from "@/components/feg/workspace/page-header"
import { EmptyState } from "@/components/feg/workspace/empty-state"

type ThreadSummary = {
  tenderId: string
  otherId: string
  otherName: string
  lastBody: string
  lastAt: Date
  unread: number
}

export default async function MessagesInboxPage() {
  const session = await getFegSession()
  if (!session?.id) redirect("/")

  const profile = await getOrCreateProfile()
  if (!profile) redirect("/")
  const me = profile.userId

  // Tous les messages où je suis émetteur ou destinataire, du plus récent.
  const rows = await prisma.message.findMany({
    where: { OR: [{ senderId: me }, { recipientId: me }] },
    orderBy: { createdAt: "desc" },
    include: {
      sender: { select: { userId: true, entreprise: true, email: true } },
      recipient: { select: { userId: true, entreprise: true, email: true } },
    },
  })

  // Regroupement en fils : (appel d'offres × contrepartie). Le premier message
  // rencontré (ordre décroissant) est le dernier du fil.
  const threads = new Map<string, ThreadSummary>()
  for (const m of rows) {
    if (!m.tenderId) continue
    const other = m.senderId === me ? m.recipient : m.sender
    const key = `${m.tenderId}__${other.userId}`
    if (!threads.has(key)) {
      threads.set(key, {
        tenderId: m.tenderId,
        otherId: other.userId,
        otherName: other.entreprise ?? other.email ?? "Entreprise membre FEG",
        lastBody: m.body,
        lastAt: m.createdAt,
        unread: 0,
      })
    }
    if (m.recipientId === me && m.readAt === null) {
      threads.get(key)!.unread += 1
    }
  }

  const list = [...threads.values()]

  // Titres des appels d'offres concernés (Message n'a pas de relation Tender).
  const tenderIds = [...new Set(list.map((t) => t.tenderId))]
  const tenders =
    tenderIds.length > 0
      ? await prisma.tender.findMany({
          where: { id: { in: tenderIds } },
          select: { id: true, titre: true },
        })
      : []
  const titreById = new Map(tenders.map((t) => [t.id, t.titre]))

  return (
    <>
      <PageHeader
        eyebrow="Messagerie sécurisée"
        title="Messages"
        description="Échanges liés à vos appels d’offres. Coordonnées masquées : tout passe par la plateforme."
      />

      {list.length === 0 ? (
        <EmptyState
          icon={MessagesSquare}
          title="Aucun message"
          description="Vos échanges avec les donneurs d’ordre et les soumissionnaires apparaîtront ici, à partir d’un appel d’offres."
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-cool-200 bg-white">
          <ul className="divide-y divide-cool-100">
            {list.map((t) => (
              <li key={`${t.tenderId}__${t.otherId}`}>
                <Link
                  href={`/messages/${t.tenderId}/${t.otherId}`}
                  className="flex items-start gap-4 px-5 py-4 transition-colors hover:bg-feg-light-green/30"
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-feg-light-green text-sm font-bold text-feg-green">
                    {t.otherName.slice(0, 2).toUpperCase()}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-3">
                      <span className="truncate font-semibold text-ink">{t.otherName}</span>
                      <span className="shrink-0 text-xs text-cool-400">
                        {t.lastAt.toLocaleDateString("fr-FR")}
                      </span>
                    </span>
                    <span className="mt-0.5 block truncate text-xs font-medium text-feg-green">
                      {titreById.get(t.tenderId) ?? "Appel d’offres"}
                    </span>
                    <span className="mt-0.5 block truncate text-sm text-muted-ink">
                      {t.lastBody}
                    </span>
                  </span>
                  {t.unread > 0 && (
                    <span className="mt-1 grid size-5 shrink-0 place-items-center rounded-full bg-feg-green text-[11px] font-bold text-white">
                      {t.unread}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  )
}
