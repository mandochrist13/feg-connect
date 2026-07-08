"use client"

import { useEffect, useRef, useState } from "react"
import { Menu, X, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FegLogo } from "@/components/feg/feg-logo"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "Accueil", href: "#accueil" },
  { label: "Comment ça marche", href: "#comment" },
  { label: "Label FEG", href: "#label" },
  { label: "Appels d'offres", href: "#appels-offres" },
  { label: "Tarifs", href: "#tarifs" },
  { label: "Contact", href: "#contact" },
]

export function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState("accueil")

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Scroll-spy : surligne l'item de nav de la section actuellement à l'écran.
  useEffect(() => {
    const sections = navItems
      .map((item) => document.getElementById(item.href.slice(1)))
      .filter((el): el is HTMLElement => el !== null)

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]) setActive(visible[0].target.id)
      },
      // Bande fine vers le milieu-haut du viewport = section "courante".
      { rootMargin: "-40% 0px -55% 0px", threshold: [0, 0.25, 0.5, 1] },
    )

    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  // Position du marqueur glass : glisse sous l'item actif.
  const navRef = useRef<HTMLElement>(null)
  const [indicator, setIndicator] = useState({ left: 0, width: 0, ready: false })

  useEffect(() => {
    const nav = navRef.current
    if (!nav) return
    const update = () => {
      const el = nav.querySelector<HTMLElement>(`[data-nav="${active}"]`)
      if (el) setIndicator({ left: el.offsetLeft, width: el.offsetWidth, ready: true })
    }
    update()
    // Recalcule après stabilisation de la mise en page (polices, resize).
    const t = window.setTimeout(update, 160)
    window.addEventListener("resize", update)
    return () => {
      window.clearTimeout(t)
      window.removeEventListener("resize", update)
    }
  }, [active])

  const solid = scrolled || open

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-feg",
        solid
          ? "border-b border-feg-green/10 bg-white/90 shadow-[0_8px_30px_-18px_rgba(12,61,32,0.35)] backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="#accueil" aria-label="FEG Connect — accueil">
          <FegLogo variant="dark" />
        </a>

        <nav
          ref={navRef}
          className={cn(
            "relative hidden items-center gap-1 rounded-full border p-1 lg:flex",
            solid ? "border-feg-green/10 bg-feg-sand/60" : "border-feg-green/10 bg-white/60",
            "backdrop-blur-xl",
          )}
          aria-label="Navigation principale"
        >
          {/* Marqueur glass fluide qui glisse sous la section active (liseré doré = logo FEG) */}
          <span
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute inset-y-1 rounded-full bg-white/70 ring-1 ring-feg-gold/45 backdrop-blur-md",
              "shadow-[inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-2px_4px_rgba(6,61,33,0.10),0_10px_22px_-12px_rgba(6,61,33,0.55)]",
              "transition-[left,width,opacity] duration-500 ease-feg",
              indicator.ready ? "opacity-100" : "opacity-0",
            )}
            style={{ left: indicator.left, width: indicator.width }}
          />
          {navItems.map((item) => {
            const isActive = active === item.href.slice(1)
            return (
              <a
                key={item.href}
                data-nav={item.href.slice(1)}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "relative z-10 rounded-full px-3.5 py-2 text-sm font-medium transition-colors duration-300",
                  isActive ? "text-feg-green" : "text-ink/70 hover:text-feg-green",
                )}
              >
                {item.label}
              </a>
            )
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href="#"
            className="text-sm font-semibold text-feg-green transition-colors hover:text-feg-green/70"
          >
            Se connecter
          </a>
          <Button className="group h-10 rounded-full bg-feg-green px-5 font-semibold text-white hover:bg-feg-green/90">
            S&apos;inscrire
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="grid size-10 place-items-center rounded-full text-feg-green transition-colors hover:bg-feg-light-green lg:hidden"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-feg-green/10 bg-white lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4" aria-label="Navigation mobile">
            {navItems.map((item) => {
              const isActive = active === item.href.slice(1)
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-feg-green text-white"
                      : "text-ink/80 hover:bg-feg-light-green hover:text-feg-green",
                  )}
                >
                  {item.label}
                </a>
              )
            })}
            <div className="mt-2 flex flex-col gap-2 border-t border-feg-green/10 pt-4">
              <a href="#" className="px-3 py-2 text-sm font-semibold text-feg-green">
                Se connecter
              </a>
              <Button className="rounded-full bg-feg-green font-semibold text-white hover:bg-feg-green/90">
                S&apos;inscrire
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
