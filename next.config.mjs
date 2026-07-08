/** @type {import('next').NextConfig} */
const nextConfig = {
  // Prisma 7 + driver adapter : garder ces paquets natifs hors du bundle
  // serveur, sinon turbopack échoue au build (externalRequire).
  serverExternalPackages: ["@prisma/client", "@prisma/adapter-pg", "pg"],
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
}

export default nextConfig
