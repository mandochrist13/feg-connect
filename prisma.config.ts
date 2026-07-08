import { defineConfig } from "prisma/config"

/**
 * Configuration Prisma 7 (CLI migrate / introspection).
 * L'URL de connexion vit ici (plus dans schema.prisma).
 * DATABASE_URL = base MÉTIER séparée de l'Espace Adhérent.
 *
 * Fallback placeholder : permet à `prisma generate` (qui n'utilise pas l'URL)
 * de tourner sans DATABASE_URL. Pour `migrate`, définir la vraie valeur dans
 * l'environnement (.env / .env.local).
 */
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url:
      process.env.DATABASE_URL ??
      "postgresql://user:password@localhost:5432/soustraitance",
  },
})
