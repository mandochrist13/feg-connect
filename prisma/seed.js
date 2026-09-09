/* ─────────────────────────────────────────────────────────────
 * Seed de démonstration FEG Connect — schema Postgres `feg_connect`.
 * Node CJS, idempotent : ids fixes ("seed-…") + upsert partout.
 * Exécution : npm run db:seed  (node prisma/seed.js)
 *
 * Invariants métier respectés :
 *  - aucune entreprise ne soumet d’offre sur son propre appel ;
 *  - chaque appel ATTRIBUE a exactement 1 offre RETENUE, les autres REJETEE ;
 *  - aucun scoring/classement — dates fixes, ordre chronologique seulement.
 * ───────────────────────────────────────────────────────────── */
"use strict";

const fs = require("fs");
const path = require("path");

/** Charge .env manuellement (sans dépendance), sans écraser process.env. */
function loadEnv() {
  const envPath = path.resolve(__dirname, "..", ".env");
  let raw;
  try {
    raw = fs.readFileSync(envPath, "utf8");
  } catch {
    return; // pas de .env : on suppose les variables déjà présentes
  }
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"') && value.length >= 2) ||
      (value.startsWith("'") && value.endsWith("'") && value.length >= 2)
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

// ── Données ──────────────────────────────────────────────────

const NOW = new Date();

/** Profiles : 3 personas dev (ids de lib/actions/dev-login.ts) + 5 fictifs. */
const PROFILES = [
  // Personas dev — mêmes identités que dev-login.ts
  {
    userId: "dev-donneur-1",
    email: "donneur@dev.local",
    nom: "Moussavou",
    prenom: "Alice",
    entreprise: "Entreprise Démo A",
  },
  {
    userId: "dev-prestataire-1",
    email: "prestataire-a@dev.local",
    nom: "Nguema",
    prenom: "Bruno",
    entreprise: "Entreprise Démo B",
  },
  {
    userId: "dev-prestataire-2",
    email: "prestataire-b@dev.local",
    nom: "Ondo",
    prenom: "Chantal",
    entreprise: "Entreprise Démo C",
  },
  // Entreprises fictives supplémentaires
  {
    userId: "seed-co-1",
    email: "serge.mba@exemple.ga",
    nom: "Mba",
    prenom: "Serge",
    entreprise: "BTP Ogooué SARL",
  },
  {
    userId: "seed-co-2",
    email: "diane.obame@exemple.ga",
    nom: "Obame",
    prenom: "Diane",
    entreprise: "Gabon Énergie Solutions",
  },
  {
    userId: "seed-co-3",
    email: "patrick.koumba@exemple.ga",
    nom: "Koumba",
    prenom: "Patrick",
    entreprise: "SoluNet Services",
  },
  {
    userId: "seed-co-4",
    email: "eric.ndong@exemple.ga",
    nom: "Ndong",
    prenom: "Éric",
    entreprise: "Bois & Forêts du Haut-Ogooué",
  },
  {
    userId: "seed-co-5",
    email: "mireille.ibinga@exemple.ga",
    nom: "Ibinga",
    prenom: "Mireille",
    entreprise: "TransLog Libreville",
  },
];

/** Providers — id fixe utilisé à la création ; upsert par profileUserId (unique). */
const PROVIDERS = [
  {
    key: "dev-a",
    id: "seed-provider-dev-a",
    profileUserId: "dev-donneur-1",
    secteur: "BTP",
    specialites: ["Gros œuvre", "Second œuvre"],
    // Label délivré (stage DELIVRE) ⇒ niveau Certifié.
    labelLevel: "CERTIFIE_FEG",
  },
  {
    key: "dev-b",
    id: "seed-provider-dev-b",
    profileUserId: "dev-prestataire-1",
    secteur: "Énergie",
    specialites: ["Électricité industrielle", "Maintenance multitechnique"],
    labelLevel: "CERTIFIE_FEG",
  },
  {
    key: "dev-c",
    id: "seed-provider-dev-c",
    profileUserId: "dev-prestataire-2",
    secteur: "Services",
    specialites: ["Facility management", "Services numériques"],
    // Membre FEG sans dossier de label ouvert (tout membre est au moins MEMBRE_FEG).
    labelLevel: "MEMBRE_FEG",
  },
  {
    key: "co-1",
    id: "seed-provider-co-1",
    profileUserId: "seed-co-1",
    secteur: "BTP",
    specialites: ["Gros œuvre", "Voirie et réseaux divers", "Charpente métallique"],
    labelLevel: "CERTIFIE_FEG",
  },
  {
    key: "co-2",
    id: "seed-provider-co-2",
    profileUserId: "seed-co-2",
    secteur: "Énergie",
    specialites: ["Installations électriques HT/BT", "Solaire photovoltaïque", "Groupes électrogènes"],
    labelLevel: "MEMBRE_FEG",
  },
  {
    key: "co-3",
    id: "seed-provider-co-3",
    profileUserId: "seed-co-3",
    secteur: "Services",
    specialites: ["Facility management", "Sécurité électronique", "Infogérance"],
    labelLevel: "MEMBRE_FEG",
  },
  {
    key: "co-4",
    id: "seed-provider-co-4",
    profileUserId: "seed-co-4",
    secteur: "Bois",
    specialites: ["Exploitation forestière", "Sciage et séchage", "Menuiserie industrielle"],
    // Membre FEG, dossier tout juste ouvert (stage CANDIDATURE).
    labelLevel: "MEMBRE_FEG",
  },
  {
    key: "co-5",
    id: "seed-provider-co-5",
    profileUserId: "seed-co-5",
    secteur: "Transport",
    specialites: ["Transport routier de marchandises", "Manutention portuaire"],
    labelLevel: "MEMBRE_FEG",
  },
];

/** Dossiers de labellisation — étapes variées (le stage n’est pas une note). */
const LABEL_FILES = [
  { id: "seed-label-dev-a", providerKey: "dev-a", stage: "DELIVRE", scoreBlocA: 72, scoreBlocB: 68, scoreBlocC: 81, scoreBlocD: 75 },
  { id: "seed-label-dev-b", providerKey: "dev-b", stage: "SURVEILLANCE", scoreBlocA: 85, scoreBlocB: 79, scoreBlocC: 88, scoreBlocD: 90 },
  { id: "seed-label-co-1", providerKey: "co-1", stage: "DELIVRE", scoreBlocA: 82, scoreBlocB: 77, scoreBlocC: 85, scoreBlocD: 80 },
  { id: "seed-label-co-2", providerKey: "co-2", stage: "AUDIT", scoreBlocA: 74, scoreBlocB: 69, scoreBlocC: null, scoreBlocD: null },
  { id: "seed-label-co-3", providerKey: "co-3", stage: "CONTRAT_LICENCE", scoreBlocA: 78, scoreBlocB: 74, scoreBlocC: 70, scoreBlocD: 83 },
  { id: "seed-label-co-4", providerKey: "co-4", stage: "CANDIDATURE", scoreBlocA: null, scoreBlocB: null, scoreBlocC: null, scoreBlocD: null },
  { id: "seed-label-co-5", providerKey: "co-5", stage: "AUTO_EVALUATION", scoreBlocA: 61, scoreBlocB: 58, scoreBlocC: null, scoreBlocD: null },
];

/** Appels d’offres — dates FIXES étalées sur les 3 dernières semaines. */
const TENDERS = [
  {
    id: "seed-tender-1",
    donneurOrdreId: "dev-donneur-1",
    modality: "SOUS_TRAITANCE",
    gmeForm: null,
    titre: "Construction d’un hangar logistique de 1 200 m² à Owendo",
    secteur: "BTP",
    budget: 450000000,
    delai: "6 mois",
    minLabelLevel: "MEMBRE_FEG",
    status: "PUBLIE",
    createdAt: new Date("2026-07-10T09:00:00.000Z"),
  },
  {
    id: "seed-tender-2",
    donneurOrdreId: "dev-donneur-1",
    modality: "SOUS_TRAITANCE",
    gmeForm: null,
    titre: "Maintenance préventive de deux groupes électrogènes de 800 kVA",
    secteur: "Énergie",
    budget: 35000000,
    delai: "45 jours",
    minLabelLevel: null,
    status: "ATTRIBUE",
    createdAt: new Date("2026-07-12T10:30:00.000Z"),
  },
  {
    id: "seed-tender-3",
    donneurOrdreId: "dev-donneur-1",
    modality: "COTRAITANCE",
    gmeForm: "SOLIDAIRE",
    titre: "Réhabilitation de la voirie d’accès à la zone industrielle de Nkok",
    secteur: "BTP",
    budget: 280000000,
    delai: "4 mois",
    minLabelLevel: "MEMBRE_FEG",
    status: "PUBLIE",
    createdAt: new Date("2026-07-21T08:00:00.000Z"),
  },
  {
    id: "seed-tender-4",
    donneurOrdreId: "seed-co-1",
    modality: "SOUS_TRAITANCE",
    gmeForm: null,
    titre: "Fourniture et pose de menuiseries bois — programme de 40 logements à Bikélé",
    secteur: "Bois",
    budget: 120000000,
    delai: "3 mois",
    minLabelLevel: null,
    status: "PUBLIE",
    createdAt: new Date("2026-07-16T14:00:00.000Z"),
  },
  {
    id: "seed-tender-5",
    donneurOrdreId: "seed-co-1",
    modality: "SOUS_TRAITANCE",
    gmeForm: null,
    titre: "Gardiennage et sécurité du chantier d’Akanda (12 mois)",
    secteur: "Services",
    budget: 48000000,
    delai: "12 mois",
    minLabelLevel: null,
    status: "ATTRIBUE",
    createdAt: new Date("2026-07-11T09:15:00.000Z"),
  },
  {
    id: "seed-tender-6",
    donneurOrdreId: "seed-co-2",
    modality: "COTRAITANCE",
    gmeForm: "CONJOINT_MANDATAIRE_SOLIDAIRE",
    titre: "Électrification solaire de trois villages de la Ngounié",
    secteur: "Énergie",
    budget: 390000000,
    delai: "8 mois",
    minLabelLevel: "CERTIFIE_FEG",
    status: "PUBLIE",
    createdAt: new Date("2026-07-18T11:00:00.000Z"),
  },
  {
    id: "seed-tender-7",
    donneurOrdreId: "seed-co-3",
    modality: "SOUS_TRAITANCE",
    gmeForm: null,
    titre: "Développement d’un portail intranet et d’une GED d’entreprise",
    secteur: "Numérique",
    budget: 25000000,
    delai: "90 jours",
    minLabelLevel: null,
    status: "CLOTURE",
    createdAt: new Date("2026-07-13T15:45:00.000Z"),
  },
  {
    id: "seed-tender-8",
    donneurOrdreId: "seed-co-5",
    modality: "SOUS_TRAITANCE",
    gmeForm: null,
    titre: "Transport de grumes Lastoursville – Owendo (marché cadre annuel)",
    secteur: "Transport",
    budget: 95000000,
    delai: "6 mois",
    minLabelLevel: null,
    status: "PUBLIE",
    createdAt: new Date("2026-07-24T10:00:00.000Z"),
  },
];

/**
 * Offres — jamais du provider du donneur d’ordre lui-même.
 * Tenders ATTRIBUE (2 et 5) : exactement 1 RETENUE + autres REJETEE.
 * dev-prestataire-1 (dev-b) : 1 RETENUE, 1 REJETEE, 2 SOUMISE (≥3).
 * dev-prestataire-2 (dev-c) : 3 REJETEE (dont l’appel 7 clôturé sans suite).
 */
const BIDS = [
  // Tender 2 (dev-donneur-1, ATTRIBUE) — 1 RETENUE, 2 REJETEE
  {
    id: "seed-bid-1",
    tenderId: "seed-tender-2",
    providerKey: "dev-b",
    montant: 32500000,
    delai: "40 jours",
    message: "Équipe de maintenance disponible sous 72 h, pièces d’origine garanties.",
    status: "RETENUE",
    createdAt: new Date("2026-07-14T09:20:00.000Z"),
  },
  {
    id: "seed-bid-2",
    tenderId: "seed-tender-2",
    providerKey: "co-2",
    montant: 34800000,
    delai: "45 jours",
    message: "Devis incluant le remplacement des filtres et la mise à niveau des tableaux.",
    status: "REJETEE",
    createdAt: new Date("2026-07-15T11:05:00.000Z"),
  },
  {
    id: "seed-bid-3",
    tenderId: "seed-tender-2",
    providerKey: "dev-c",
    montant: 36900000,
    delai: "50 jours",
    message: "Offre multitechnique avec astreinte 24/7 pendant toute la durée du contrat.",
    status: "REJETEE",
    createdAt: new Date("2026-07-16T16:40:00.000Z"),
  },
  // Tender 5 (seed-co-1, ATTRIBUE) — 1 RETENUE, 2 REJETEE
  {
    id: "seed-bid-4",
    tenderId: "seed-tender-5",
    providerKey: "co-3",
    montant: 46500000,
    delai: "12 mois",
    message: "Agents formés et encadrés, superviseur dédié au site d’Akanda.",
    status: "RETENUE",
    createdAt: new Date("2026-07-13T08:30:00.000Z"),
  },
  {
    id: "seed-bid-5",
    tenderId: "seed-tender-5",
    providerKey: "dev-b",
    montant: 51000000,
    delai: "12 mois",
    message: "Dispositif de 12 agents avec rondes de nuit et main courante électronique.",
    status: "REJETEE",
    createdAt: new Date("2026-07-14T14:10:00.000Z"),
  },
  {
    id: "seed-bid-6",
    tenderId: "seed-tender-5",
    providerKey: "dev-c",
    montant: 49200000,
    delai: "12 mois",
    message: "Couverture 24/7, contrôle d’accès et reporting mensuel au maître d’ouvrage.",
    status: "REJETEE",
    createdAt: new Date("2026-07-15T10:00:00.000Z"),
  },
  // Tender 1 (dev-donneur-1, PUBLIE) — offres SOUMISE
  {
    id: "seed-bid-7",
    tenderId: "seed-tender-1",
    providerKey: "dev-b",
    montant: 438000000,
    delai: "6 mois",
    message: "Références récentes sur deux hangars industriels à Libreville.",
    status: "SOUMISE",
    createdAt: new Date("2026-07-15T09:00:00.000Z"),
  },
  {
    id: "seed-bid-8",
    tenderId: "seed-tender-1",
    providerKey: "co-1",
    montant: 445000000,
    delai: "5 mois et demi",
    message: "Gros œuvre et charpente réalisés en propre, planning optimisé.",
    status: "SOUMISE",
    createdAt: new Date("2026-07-17T13:25:00.000Z"),
  },
  // Tender 3 (dev-donneur-1, PUBLIE, cotraitance)
  {
    id: "seed-bid-9",
    tenderId: "seed-tender-3",
    providerKey: "co-1",
    montant: 272000000,
    delai: "4 mois",
    message: "Ateliers VRD mobilisables dès notification, centrale d’enrobés partenaire.",
    status: "SOUMISE",
    createdAt: new Date("2026-07-24T09:45:00.000Z"),
  },
  // Tender 4 (seed-co-1, PUBLIE)
  {
    id: "seed-bid-10",
    tenderId: "seed-tender-4",
    providerKey: "co-4",
    montant: 114000000,
    delai: "3 mois",
    message: "Bois issus de nos concessions du Haut-Ogooué, pose comprise.",
    status: "SOUMISE",
    createdAt: new Date("2026-07-19T10:15:00.000Z"),
  },
  // Tender 7 (seed-co-3, CLOTURE) — appel clôturé sans suite : offre non retenue
  {
    id: "seed-bid-11",
    tenderId: "seed-tender-7",
    providerKey: "dev-c",
    montant: 23500000,
    delai: "90 jours",
    message: "Portail intranet et GED sur socle open source, formation des équipes incluse.",
    status: "REJETEE",
    createdAt: new Date("2026-07-17T15:30:00.000Z"),
  },
  // Tender 6 (seed-co-2, PUBLIE, cotraitance)
  {
    id: "seed-bid-12",
    tenderId: "seed-tender-6",
    providerKey: "dev-b",
    montant: 368000000,
    delai: "8 mois",
    message: "Kits solaires dimensionnés village par village, maintenance 24 mois incluse.",
    status: "SOUMISE",
    createdAt: new Date("2026-07-23T08:50:00.000Z"),
  },
  // Tender 8 (seed-co-5, PUBLIE)
  {
    id: "seed-bid-13",
    tenderId: "seed-tender-8",
    providerKey: "co-4",
    montant: 92000000,
    delai: "6 mois",
    message: "Flotte de 8 grumiers récents, suivi GPS et assurance tous risques.",
    status: "SOUMISE",
    createdAt: new Date("2026-07-28T11:20:00.000Z"),
  },
];

/** Messages de démo — fil lié à un appel d'offres, entre parties légitimes. */
const MESSAGES = [
  {
    id: "seed-msg-1",
    tenderId: "seed-tender-1",
    senderId: "dev-donneur-1",
    recipientId: "dev-prestataire-1",
    body: "Bonjour, votre offre nous intéresse. Pouvez-vous préciser vos références sur des hangars similaires ?",
    createdAt: new Date("2026-07-16T09:00:00.000Z"),
    readAt: new Date("2026-07-16T10:00:00.000Z"),
  },
  {
    id: "seed-msg-2",
    tenderId: "seed-tender-1",
    senderId: "dev-prestataire-1",
    recipientId: "dev-donneur-1",
    body: "Bonjour, avec plaisir : deux hangars industriels livrés à Libreville en 2025. Je peux détailler le planning si besoin.",
    createdAt: new Date("2026-07-16T11:30:00.000Z"),
    readAt: null,
  },
];

// ── Exécution ────────────────────────────────────────────────

async function main() {
  loadEnv();

  const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("Erreur : ni DIRECT_URL ni DATABASE_URL n’est défini (.env).");
    process.exit(1);
  }

  const { PrismaPg } = require("@prisma/adapter-pg");
  const { PrismaClient } = require("@prisma/client");

  const adapter = new PrismaPg({ connectionString }, { schema: "feg_connect" });
  const prisma = new PrismaClient({ adapter });

  try {
    // 1) Profiles ────────────────────────────────────────────
    for (const p of PROFILES) {
      const data = {
        email: p.email,
        nom: p.nom,
        prenom: p.prenom,
        entreprise: p.entreprise,
        isDonneurOrdre: true,
        isPrestataire: true,
        membershipStatus: "ACTIF",
        labelStatusCache: "DELIVRE",
        statusCheckedAt: NOW,
      };
      await prisma.profile.upsert({
        where: { userId: p.userId },
        update: data,
        create: { userId: p.userId, ...data },
      });
    }

    // 2) Providers — upsert par profileUserId (unique) ; id fixe à la
    //    création. On mémorise l’id réel pour LabelFiles et Bids.
    /** @type {Record<string, string>} clé logique -> id réel du Provider */
    const providerIds = {};
    for (const pr of PROVIDERS) {
      const record = await prisma.provider.upsert({
        where: { profileUserId: pr.profileUserId },
        update: {
          secteur: pr.secteur,
          specialites: pr.specialites,
          labelLevel: pr.labelLevel,
        },
        create: {
          id: pr.id,
          profileUserId: pr.profileUserId,
          secteur: pr.secteur,
          specialites: pr.specialites,
          labelLevel: pr.labelLevel,
        },
      });
      providerIds[pr.key] = record.id;
    }

    // 3) LabelFiles — upsert par providerId (unique), id fixe à la création
    for (const lf of LABEL_FILES) {
      const providerId = providerIds[lf.providerKey];
      const scores = {
        stage: lf.stage,
        scoreBlocA: lf.scoreBlocA,
        scoreBlocB: lf.scoreBlocB,
        scoreBlocC: lf.scoreBlocC,
        scoreBlocD: lf.scoreBlocD,
      };
      await prisma.labelFile.upsert({
        where: { providerId },
        update: scores,
        create: { id: lf.id, providerId, ...scores },
      });
    }

    // 4) Tenders — upsert par id fixe
    for (const t of TENDERS) {
      const data = {
        modality: t.modality,
        gmeForm: t.gmeForm,
        titre: t.titre,
        secteur: t.secteur,
        budget: t.budget,
        delai: t.delai,
        minLabelLevel: t.minLabelLevel,
        status: t.status,
      };
      await prisma.tender.upsert({
        where: { id: t.id },
        update: data,
        create: {
          id: t.id,
          donneurOrdreId: t.donneurOrdreId,
          createdAt: t.createdAt,
          ...data,
        },
      });
    }

    // 5) Bids — upsert par la contrainte @@unique([tenderId, providerId])
    for (const b of BIDS) {
      const providerId = providerIds[b.providerKey];
      const data = {
        montant: b.montant,
        delai: b.delai,
        message: b.message,
        status: b.status,
      };
      await prisma.bid.upsert({
        where: { tenderId_providerId: { tenderId: b.tenderId, providerId } },
        update: data,
        create: {
          id: b.id,
          tenderId: b.tenderId,
          providerId,
          createdAt: b.createdAt,
          ...data,
        },
      });
    }

    // 6) Messages — upsert par id fixe
    for (const m of MESSAGES) {
      const data = { body: m.body, readAt: m.readAt };
      await prisma.message.upsert({
        where: { id: m.id },
        update: data,
        create: {
          id: m.id,
          tenderId: m.tenderId,
          senderId: m.senderId,
          recipientId: m.recipientId,
          createdAt: m.createdAt,
          ...data,
        },
      });
    }

    // Récapitulatif ────────────────────────────────────────────
    const [profiles, providers, labelFiles, tenders, bids, messages] = await Promise.all([
      prisma.profile.count(),
      prisma.provider.count(),
      prisma.labelFile.count(),
      prisma.tender.count(),
      prisma.bid.count(),
      prisma.message.count(),
    ]);

    console.log("Seed FEG Connect terminé (idempotent).");
    console.log(`  Profiles   : ${PROFILES.length} upsertés (${profiles} en base)`);
    console.log(`  Providers  : ${PROVIDERS.length} upsertés (${providers} en base)`);
    console.log(`  LabelFiles : ${LABEL_FILES.length} upsertés (${labelFiles} en base)`);
    console.log(`  Tenders    : ${TENDERS.length} upsertés (${tenders} en base)`);
    console.log(`  Bids       : ${BIDS.length} upsertées (${bids} en base)`);
    console.log(`  Messages   : ${MESSAGES.length} upsertés (${messages} en base)`);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error("Échec du seed :", err);
    process.exit(1);
  });
