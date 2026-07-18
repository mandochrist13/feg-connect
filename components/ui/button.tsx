import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline:
          'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost:
          'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
        link: 'text-primary underline-offset-4 hover:underline',
        // ── Signature FEG — shimmer (cf. guide-numerique.lafeg.ga) ─
        // Primaire : dégradé vert à reflet balayant continu.
        feg:
          'feg-shimmer bg-[length:200%_100%] bg-[linear-gradient(110deg,#0B3E23,45%,#386140,55%,#0B3E23)] text-white font-semibold transition-[filter] duration-300 hover:brightness-110',
        // Secondaire bronze : au survol, un voile vert monte du bas (before),
        // le texte passe au blanc. Le remplissage reste sous le texte.
        fegGold:
          'relative isolate overflow-hidden bg-[#b0b08b] text-white font-semibold ease-feg transition-colors duration-500 hover:text-[#063a1e] before:absolute before:inset-0 before:-z-10 before:translate-y-full before:bg-[#e6e4b4]/70 before:transition-transform before:duration-500 before:ease-feg hover:before:translate-y-0',
        // Contour vert qui se remplit de vert au survol (texte -> blanc).
        fegOutline:
          'relative isolate overflow-hidden border-[1.5px] border-feg-green bg-transparent text-feg-green ease-feg transition-colors duration-500 hover:text-white before:absolute before:inset-0 before:-z-10 before:translate-y-full before:bg-feg-green before:transition-transform before:duration-500 before:ease-feg hover:before:translate-y-0',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        icon: 'size-9',
        'icon-sm': 'size-8',
        'icon-lg': 'size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
