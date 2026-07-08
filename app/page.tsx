import { Header } from "@/components/feg/header"
import { Footer } from "@/components/feg/footer"
import { Hero } from "@/components/feg/sections/hero"
import { Problem } from "@/components/feg/sections/problem"
import { Profiles } from "@/components/feg/sections/profiles"
import { Label } from "@/components/feg/sections/label"
import { Referentiel } from "@/components/feg/sections/referentiel"
import { Features } from "@/components/feg/sections/features"
import { Collaboration } from "@/components/feg/sections/collaboration"
import { Opportunities } from "@/components/feg/sections/opportunities"
import { Stats } from "@/components/feg/sections/stats"
import { Pricing } from "@/components/feg/sections/pricing"
import { FinalCta } from "@/components/feg/sections/final-cta"

export default function Page() {
  return (
    <div className="min-h-screen bg-white antialiased">
      <Header />
      <main>
        <Hero />
        <Problem />
        <Profiles />
        <Label />
        <Referentiel />
        <Features />
        <Collaboration />
        {/* <Opportunities /> */}
        {/* <Stats /> */}
        <Pricing />
        <FinalCta />
      </main>
      <Footer />
    </div>
  )
}
