import { Facebook, Linkedin, MapPin, Phone, Mail } from "lucide-react"
import { FegLogo } from "@/components/feg/feg-logo"

const fegLinks = [
  { label: "À propos", href: "#" },
  { label: "Mot du président", href: "#" },
  { label: "Activité", href: "#" },
]
const platformLinks = [
  { label: "Espace donneur d'ordre", href: "#" },
  { label: "Espace prestataire", href: "#" },
  { label: "Label FEG", href: "#label" },
  { label: "Tarifs", href: "#tarifs" },
]
const usefulLinks = [
  { label: "ANPI", href: "#" },
  { label: "Chambre de Commerce", href: "#" },
  { label: "Journal officiel", href: "#" },
  { label: "Ministères", href: "#" },
]

export function Footer() {
  return (
    <footer id="contact" className="relative bg-feg-deep text-white">
      <span
        className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-feg-amber via-feg-gold-soft to-feg-amber"
        aria-hidden="true"
      />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-4">
            <FegLogo variant="light" />
            <p className="max-w-xs text-sm leading-relaxed text-white/60">
              Connecter les entreprises du Gabon dans un cadre certifié de confiance.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="#"
                aria-label="Facebook"
                className="grid size-9 place-items-center rounded-full bg-white/10 transition-all duration-300 hover:-translate-y-0.5 hover:bg-feg-amber hover:text-feg-deep"
              >
                <Facebook className="size-4" />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="grid size-9 place-items-center rounded-full bg-white/10 transition-all duration-300 hover:-translate-y-0.5 hover:bg-feg-amber hover:text-feg-deep"
              >
                <Linkedin className="size-4" />
              </a>
            </div>
          </div>

          <FooterColumn title="FEG" links={fegLinks} />
          <FooterColumn title="Plateforme" links={platformLinks} />

          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-feg-gold-soft">
              Contact
            </h3>
            <ul className="flex flex-col gap-3 text-sm text-white/60">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0 text-feg-amber" aria-hidden="true" />
                Immeuble Odyssée, BP 410 Libreville
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="size-4 shrink-0 text-feg-amber" aria-hidden="true" />
                (+241) 065 81 57 38
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="size-4 shrink-0 text-feg-amber" aria-hidden="true" />
                info@lafeg.ga
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-8">
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-white/35">
              Liens utiles
            </span>
            {usefulLinks.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="text-xs text-white/55 transition-colors hover:text-feg-gold-soft"
              >
                {l.label}
              </a>
            ))}
          </div>
          <p className="text-xs text-white/45">
            © 2026 FEG Connect — Fédération des Entreprises du Gabon. La FEG atteste la
            conformité des entreprises certifiées&nbsp;; la décision de sélection appartient au
            donneur d&apos;ordre.
          </p>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({
  title,
  links,
}: {
  title: string
  links: { label: string; href: string }[]
}) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-sm font-bold uppercase tracking-wider text-feg-gold-soft">{title}</h3>
      <ul className="flex flex-col gap-3 text-sm">
        {links.map((l) => (
          <li key={l.label}>
            <a
              href={l.href}
              className="group inline-flex items-center gap-0 text-white/60 transition-colors duration-300 hover:text-white"
            >
              <span
                className="h-px w-0 bg-feg-amber transition-all duration-300 group-hover:mr-2 group-hover:w-4"
                aria-hidden="true"
              />
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
