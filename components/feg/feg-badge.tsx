import { BadgeCheck, Check, ShieldAlert } from "lucide-react"
import { cn } from "@/lib/utils"

type BadgeLevel = "certified" | "member" | "none"

const config: Record<
  BadgeLevel,
  { label: string; className: string; Icon: typeof BadgeCheck }
> = {
  certified: {
    label: "Certifié FEG",
    className: "bg-feg-amber text-feg-deep",
    Icon: BadgeCheck,
  },
  member: {
    label: "Membre FEG",
    className: "bg-feg-light-green text-feg-light-green-foreground",
    Icon: Check,
  },
  none: {
    label: "Non certifié",
    className: "bg-muted text-muted-foreground",
    Icon: ShieldAlert,
  },
}

export function FegBadge({
  level,
  className,
}: {
  level: BadgeLevel
  className?: string
}) {
  const { label, className: variant, Icon } = config[level]
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold tracking-tight",
        variant,
        className,
      )}
    >
      <Icon className="size-3.5" aria-hidden="true" />
      {label}
    </span>
  )
}
