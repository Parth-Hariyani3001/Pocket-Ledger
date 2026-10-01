import { cn } from "cn"

function Logo({
  wordmark = true,
  className,
  markClassName,
}: {
  wordmark?: boolean
  className?: string
  markClassName?: string
}) {
  return (
    <span
      className={cn("inline-flex items-center gap-[0.55rem]", className)}
      aria-label={wordmark ? undefined : "PocketLedger"}
    >
      <svg
        viewBox="0 0 32 32"
        aria-hidden="true"
        className={cn("size-7 shrink-0 overflow-visible", markClassName)}
      >
        <circle cx="14.65" cy="12" r="4.55" fill="var(--inflow)" />
        <path fill="currentColor" d="M5.8 4.29H10.3V24.8H5.8Z" />
        <circle
          cx="14.65"
          cy="12"
          r="6.6"
          fill="none"
          stroke="currentColor"
          strokeWidth="4.5"
        />
      </svg>
      {wordmark ? <span>PocketLedger</span> : null}
    </span>
  )
}

export default Logo
