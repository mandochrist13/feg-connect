import { defineConfig } from "prisma/config"

// Schema Postgres dédié à cette app — même instance physique que l'Espace
// Adhérent (Supabase), mais tables et historique de migration totalement
// isolés (l'Espace Adhérent a déjà son propre _prisma_migrations sur
// `public`, on ne le touche jamais).
const SCHEMA_NAME = "feg_connect"

function withSchema(url: string): string {
  const u = new URL(url)
  u.searchParams.set("schema", SCHEMA_NAME)
  return u.toString()
}

/**
 * Configuration Prisma 7 (CLI migrate / introspection).
 * L'URL de connexion vit ici (plus dans schema.prisma).
 *
 * DIRECT_URL (port 5432, hors pgbouncer) et non DATABASE_URL (pooler
 * transactionnel, port 6543) : les migrations (DDL, advisory locks) ne sont
 * pas fiables derrière un pooler en mode transaction.
 *
 * Fallback placeholder : permet à `prisma generate` (qui n'utilise pas l'URL)
 * de tourner sans DIRECT_URL. Pour `migrate`, définir la vraie valeur dans
 * l'environnement (.env / .env.local).
 */
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: withSchema(
      process.env.DIRECT_URL ??
        process.env.DATABASE_URL ??
        "postgresql://user:password@localhost:5432/soustraitance",
    ),
  },
})
