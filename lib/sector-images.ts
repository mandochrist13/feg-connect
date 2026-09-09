// Illustration factuelle des appels d'offres par secteur — images locales
// (public/images), jamais un signal de qualité ni de classement.
const SECTOR_IMAGES: [RegExp, string][] = [
  [/btp|construction|b[âa]timent|chantier|travaux/i, "/images/rfp-btp.jpg"],
  [/[ée]nergie|solaire|[ée]lectri/i, "/images/rfp-energie.jpg"],
  [/service|nettoyage|maintenance|entretien/i, "/images/rfp-services.jpg"],
  [/bois|for[êe]t|scierie/i, "/images/sector-bois.jpg"],
  [/mine|minier/i, "/images/sector-mines.jpg"],
  [/agro|agricult|p[êe]che|[ée]levage/i, "/images/sector-agro.jpg"],
  [/num[ée]rique|informatique|digital|logiciel/i, "/images/sector-numerique.jpg"],
  [/transport|logistique|port|fret/i, "/images/cta-port.jpg"],
]

const FALLBACKS = [
  "/images/feature-mise-en-relation.jpg",
  "/images/collab-chantier.jpg",
  "/images/profiles-meeting.jpg",
]

/**
 * Image d'illustration d'un appel d'offres : par secteur si reconnu, sinon
 * un visuel générique choisi de façon DÉTERMINISTE à partir de l'id (stable
 * entre deux rendus, aucune hiérarchie entre appels).
 */
export function tenderImage(secteur: string | null, seedKey: string): string {
  if (secteur) {
    for (const [pattern, image] of SECTOR_IMAGES) {
      if (pattern.test(secteur)) return image
    }
  }
  let hash = 0
  for (const char of seedKey) hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  return FALLBACKS[hash % FALLBACKS.length]
}
