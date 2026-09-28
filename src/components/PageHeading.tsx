import type { ReactNode } from "react"

interface PageHeadingProps {
  title: string
  description?: string
  action?: ReactNode
}

function PageHeading({ title, description, action }: PageHeadingProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex max-w-xl flex-col gap-2">
        <h1 className="text-[2.35rem] leading-[1.1] font-medium tracking-[-0.02em]">
          {title}
        </h1>
        {description ? (
          <p className="max-w-[38ch] text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  )
}

export default PageHeading
