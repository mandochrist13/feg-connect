import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Reveal } from "@/components/feg/reveal"

export function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-feg-forest py-24 text-white lg:py-32">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {/* Photo de port en arrière-plan, fortement voilée de vert FEG pour rester froide */}
        <Image
          src="/images/cta-port.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-linear-to-b from-feg-forest/85 via-feg-forest/75 to-feg-forest/95" />
        <div className="feg-grid-pattern absolute inset-0 opacity-30" />
        <div className="absolute left-1/2 top-0 size-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-feg-amber/15 blur-[130px]" />
        <div className="feg-float absolute left-[8%] top-[20%] hidden size-16 rounded-2xl border border-white/10 bg-white/5 lg:block" />
        <div
          className="feg-float absolute bottom-[18%] right-[10%] hidden size-10 rounded-full border border-feg-amber/30 bg-feg-amber/10 lg:block"
          style={{ animationDelay: "1.6s" }}
        />
      </div>

      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-feg-gold-soft">
            Rejoignez le réseau
          </span>
          <h2 className="mt-6 text-balance text-3xl font-extrabold leading-tight sm:text-5xl">
            Prêt à rejoindre le standard de confiance B2B au Gabon&nbsp;?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-pretty text-lg text-white/65">
            Faites certifier votre entreprise ou publiez votre premier appel d&apos;offres —
            l&apos;écosystème FEG Connect vous attend.
          </p>
        </Reveal>
        <Reveal delay={150}>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Button
              size="lg"
              className="group h-12 rounded-full bg-feg-amber px-7 text-base font-semibold text-feg-deep hover:bg-feg-amber-bright"
            >
              Devenir prestataire certifié
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 rounded-full border-[1.5px] border-white/30 bg-transparent px-7 text-base font-semibold text-white hover:border-white hover:bg-white/10 hover:text-white"
            >
              Publier un appel d&apos;offres
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
