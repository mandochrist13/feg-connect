import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { ArrowLeft, ShieldCheck } from "lucide-react"
import { getFegSession } from "@/lib/feg-session"
import { getOrCreateProfile } from "@/lib/profile"
import { prisma } from "@/lib/prisma"
import { canConverse } from "@/lib/messages"
import { sendMessage } from "@/lib/actions/messages"
import { PageHeader } from "@/components/feg/workspace/page-header"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export default async function MessageThreadPage({
  params,
}: {
  params: Promise<{ tenderId: string; contactId: string }>
}) {
  const session = await getFegSession()
  if (!session?.id) redirect("/")

  const profile = await getOrCreateProfile()
  if (!profile) redirect("/")
  const me = profile.userId

  const { tenderId, contactId } = await params

  // Garde : échange autorisé uniquement dans le contexte d'un appel d'offres.
  const allowed = await canConverse(tenderId, me, contactId)
  if (!allowed) notFound()

  const [tender, contact, messages] = await Promise.all([
    prisma.tender.findUnique({ where: { id: tenderId }, select: { titre: true } }),
    prisma.profile.findUnique({
      where: { userId: contactId },
      select: { entreprise: true, email: true },
    }),
    prisma.message.findMany({
      where: {
        tenderId,
        OR: [
          { senderId: me, recipientId: contactId },
          { senderId: contactId, recipientId: me },
        ],
      },
      orderBy: { createdAt: "asc" },
    }),
  ])
  if (!tender) notFound()

  // Accusé de lecture : les messages entrants non lus passent en « lu ».
  await prisma.message.updateMany({
    where: { tenderId, senderId: contactId, recipientId: me, readAt: null },
    data: { readAt: new Date() },
  })

  const contactName = contact?.entreprise ?? contact?.email ?? "Entreprise membre FEG"

  return (
    <>
      <PageHeader eyebrow="Messagerie sécurisée" title={contactName} description={tender.titre}>
        <Link
          href="/messages"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-feg-green hover:underline"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Tous les messages
        </Link>
      </PageHeader>

      <div className="flex items-center gap-2 rounded-lg border border-feg-green/15 bg-feg-light-green/40 px-4 py-2.5 text-xs text-feg-green">
        <ShieldCheck className="size-4 shrink-0" aria-hidden="true" />
        Échange sécurisé lié à cet appel d’offres. Les coordonnées (email, téléphone) sont
        automatiquement masquées.
      </div>

      <div className="flex flex-col gap-3">
        {messages.length === 0 ? (
          <p className="rounded-xl border border-cool-200 bg-white px-5 py-8 text-center text-sm text-muted-ink">
            Aucun message pour l’instant. Démarrez la conversation ci-dessous.
          </p>
        ) : (
          messages.map((m) => {
            const mine = m.senderId === me
            return (
              <div key={m.id} className={mine ? "flex justify-end" : "flex justify-start"}>
                <div
                  className={
                    mine
                      ? "max-w-[80%] rounded-2xl rounded-br-sm bg-feg-green px-4 py-2.5 text-sm text-white"
                      : "max-w-[80%] rounded-2xl rounded-bl-sm border border-cool-200 bg-white px-4 py-2.5 text-sm text-ink"
                  }
                >
                  <p className="whitespace-pre-wrap break-words">{m.body}</p>
                  <p
                    className={
                      mine
                        ? "mt-1 text-right text-[10px] text-white/60"
                        : "mt-1 text-right text-[10px] text-cool-400"
                    }
                  >
                    {m.createdAt.toLocaleString("fr-FR", {
                      day: "2-digit",
                      month: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            )
          })
        )}
      </div>

      <form
        action={sendMessage}
        className="sticky bottom-0 rounded-xl border border-cool-200 bg-white p-3 shadow-sm"
      >
        <input type="hidden" name="tenderId" value={tenderId} />
        <input type="hidden" name="recipientId" value={contactId} />
        <Textarea
          name="body"
          required
          rows={2}
          maxLength={4000}
          placeholder="Écrire un message… (les coordonnées seront masquées)"
          className="resize-none border-0 shadow-none focus-visible:ring-0"
        />
        <div className="mt-2 flex justify-end">
          <Button type="submit" variant="feg">
            Envoyer
          </Button>
        </div>
      </form>
    </>
  )
}
