import Image from "next/image"
import { ArrowRight, Calendar, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"

export type Rfp = {
  sector: string
  title: string
  budget: string
  deadline: string
  status?: string
  image?: string
  imageAlt?: string
}

export function RfpCard({ rfp }: { rfp: Rfp }) {
  return (
    <article className="group flex h-full flex-col gap-5 overflow-hidden rounded-3xl border border-feg-cream bg-white p-7 shadow-sm transition-all duration-500 ease-feg hover:-translate-y-1.5 hover:border-feg-khaki/60 hover:shadow-[0_28px_55px_-32px_rgba(20,56,35,0.4)]">
      {rfp.image && (
        <div className="relative -mx-7 -mt-7 h-40 overflow-hidden">
          <Image
            src={rfp.image}
            alt={rfp.imageAlt ?? ""}
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            className="object-cover transition-transform duration-700 ease-feg group-hover:scale-105"
          />
          {/* Voile froid pour rester dans la charte */}
          <div
            className="absolute inset-0 bg-linear-to-t from-feg-forest/45 via-feg-forest/10 to-transparent"
            aria-hidden="true"
          />
        </div>
      )}
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full bg-feg-light-green px-3 py-1 text-xs font-bold uppercase tracking-wider text-feg-green">
          {rfp.sector}
        </span>
        <span className="inline-flex items-center gap-2 text-xs font-semibold text-feg-green">
          <span
            className="feg-live-dot size-2 rounded-full bg-feg-green text-feg-green"
            aria-hidden="true"
          />
          {rfp.status ?? "Ouvert"}
        </span>
      </div>

      <h3 className="text-pretty text-lg font-bold leading-snug text-feg-green">
        {rfp.title}
      </h3>

      <div className="mt-auto flex flex-col gap-2.5 rounded-2xl bg-feg-sand p-4 text-sm text-muted-ink">
        <span className="inline-flex items-center gap-2">
          <Wallet className="size-4 text-feg-green" aria-hidden="true" />
          Budget estimé&nbsp;: <strong className="font-semibold text-ink">{rfp.budget}</strong>
        </span>
        <span className="inline-flex items-center gap-2">
          <Calendar className="size-4 text-feg-green" aria-hidden="true" />
          Délai&nbsp;: <strong className="font-semibold text-ink">{rfp.deadline}</strong>
        </span>
      </div>

      <Button
        variant="outline"
        className="justify-between rounded-full border-[1.5px] border-feg-green/25 font-semibold text-feg-green transition-colors duration-300 hover:border-feg-green hover:bg-feg-light-green"
      >
        Voir l&apos;appel
        <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
      </Button>
    </article>
  )
}
