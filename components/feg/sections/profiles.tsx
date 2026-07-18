import { Reveal } from "@/components/feg/reveal"
import { Underline } from "@/components/feg/underline"
import { ProfilesShowcase } from "@/components/feg/profiles-showcase"

export function Profiles() {
  return (
    <section id="comment" className="relative overflow-hidden bg-feg-sand py-20 lg:py-28">
      <div
        className="pointer-events-none absolute -right-32 -top-32 size-96 rounded-full bg-feg-cream blur-3xl"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-feg-green">
            Comment ça marche
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold text-feg-green sm:text-4xl">
            Une plateforme, <Underline>trois profils</Underline>
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-ink">
            Donneur d&apos;ordre, co-traitant ou sous-traitant - chacun a sa place. La FEG réunit
            le secteur privé formel ; la décision appartient toujours au donneur d&apos;ordre.
          </p>
        </Reveal>

        <Reveal delay={100}>
          <ProfilesShowcase />
        </Reveal>
      </div>
    </section>
  )
}
