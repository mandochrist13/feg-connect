import { Reveal } from "@/components/feg/reveal"

const stats = [
  { value: "10–20", label: "entreprises pilotes" },
  { value: "5", label: "secteurs cibles" },
  { value: "17", label: "États couverts par la marque OAPI" },
  { value: "A–D", label: "blocs du référentiel d'évaluation" },
]

export function Stats() {
  return (
    <section className="border-y border-feg-cream bg-white py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 100}>
              <div className="relative flex flex-col items-center gap-3 text-center">
                <span
                  className="absolute -top-2 h-1 w-10 rounded-full bg-feg-green"
                  aria-hidden="true"
                />
                <span className="pt-4 font-display text-4xl font-extrabold tracking-tight text-feg-forest sm:text-5xl">
                  {s.value}
                </span>
                <span className="max-w-44 text-sm font-medium leading-snug text-muted-ink">
                  {s.label}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
