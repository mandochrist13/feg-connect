import Image from "next/image"
import { cn } from "@/lib/utils"

export function FegLogo({
  className,
  variant = "dark",
}: {
  className?: string
  variant?: "dark" | "light"
}) {
  // "dark" = pour fond CLAIR (logo couleur) · "light" = pour fond SOMBRE (logo blanc)
  const isLight = variant === "light"
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <Image
        src={isLight ? "/images/logo_FEG_blanc.png" : "/images/logo-feg.png"}
        alt="FEG — Fédération des Entreprises du Gabon"
        width={isLight ? 1080 : 520}
        height={isLight ? 998 : 480}
        priority
        className="h-11 w-auto"
      />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display text-base font-bold tracking-tight",
            isLight ? "text-white" : "text-feg-green",
          )}
        >
          FEG Connect
        </span>
        {/* <span
          className={cn(
            "text-[10px] font-medium uppercase tracking-[0.14em]",
            isLight ? "text-white/60" : "text-muted-ink",
          )}
        >
          Marketplace B2B
        </span> */}
      </span>
    </span>
  )
}
