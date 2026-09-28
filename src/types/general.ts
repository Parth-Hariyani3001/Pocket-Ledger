import type { LucideIcon } from "lucide-react"

export type NavigationType = {
    icon: LucideIcon
    label: string,
    path: string,
    active?: boolean
}