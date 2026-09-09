import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

/**
 * Client Prisma (singleton) — Prisma 7 requiert un driver adapter.
 * DATABASE_URL (pooler, pour le runtime applicatif) ; les tables vivent
 * dans le schema Postgres dédié `feg_connect`, isolé de celui de l'Espace
 * Adhérent (cf. prisma.config.ts pour la partie migration/CLI).
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient() {
  const adapter = new PrismaPg(
    { connectionString: process.env.DATABASE_URL },
    { schema: "feg_connect" },
  )
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
