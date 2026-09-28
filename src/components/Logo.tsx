import { cn } from "cn"

const page =
  "M6 2.25h19.2a2.6 2.6 0 0 1 2.6 2.6v22.3a2.6 2.6 0 0 1-2.6 2.6H6a2.6 2.6 0 0 1-2.6-2.6V4.85A2.6 2.6 0 0 1 6 2.25z"
const spine =
  "M9.15 2.25H6a2.6 2.6 0 0 0-2.6 2.6v22.3a2.6 2.6 0 0 0 2.6 2.6h3.15z"

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
        <path
          d={page}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path d={spine} fill="currentColor" />
        <path
          d="M12.2 11.15H21.15M12.2 16.7H25.7M12.2 22.25H19.4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.65"
          strokeLinecap="butt"
        />
        <circle cx="24.15" cy="11.15" r="1.55" fill="var(--inflow)" />
      </svg>
      {wordmark ? <span>PocketLedger</span> : null}
    </span>
  )
}

export default Logo
