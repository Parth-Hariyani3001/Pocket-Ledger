import {
  ArrowRightLeft,
  HandCoins,
  Home,
  Landmark,
  Notebook,
  Target,
} from "lucide-react"
import { Fragment } from "react"
import { NavLink, useLocation } from "react-router-dom"

import Logo from "@/components/Logo"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import type { NavigationType } from "@/types/general"

type NavSection = {
  label: string
  items: NavigationType[]
}

const sections: NavSection[] = [
  {
    label: "Overview",
    items: [{ icon: Home, label: "Dashboard", path: "/" }],
  },
  {
    label: "Plan",
    items: [
      { icon: Notebook, label: "Categories", path: "/categories" },
      { icon: Target, label: "Budget", path: "/budget" },
    ],
  },
  {
    label: "Ledger",
    items: [
      { icon: HandCoins, label: "Debts", path: "/debts" },
      { icon: Landmark, label: "Positions", path: "/positions" },
      { icon: ArrowRightLeft, label: "Transactions", path: "/transactions" },
    ],
  },
]

function Navigation() {
  const { pathname } = useLocation()

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="group-data-[collapsible=icon]:items-center">
        <Logo
          className="logo-on-night px-2 py-1 font-heading text-[1.35rem] font-medium tracking-[-0.02em] text-sidebar-foreground group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:px-0 [&>span]:whitespace-nowrap group-data-[collapsible=icon]:[&>span]:hidden"
          markClassName="size-8 group-data-[collapsible=icon]:size-7"
        />
      </SidebarHeader>
      <SidebarContent>
        {sections.map((section, index) => (
          <Fragment key={section.label}>
            {index > 0 ? <SidebarSeparator className="my-1" /> : null}
            <SidebarGroup className="py-1">
              <SidebarGroupLabel className="font-heading text-sm font-normal tracking-[-0.01em] text-sidebar-foreground/55 italic">
                {section.label}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="gap-1">
                  {section.items.map((item) => {
                    const Icon = item.icon
                    const isActive =
                      item.path === "/"
                        ? pathname === "/"
                        : pathname.startsWith(item.path)

                    return (
                      <SidebarMenuItem key={item.path}>
                        <SidebarMenuButton
                          asChild
                          isActive={isActive}
                          tooltip={item.label}
                          className="h-9 text-[0.95rem]"
                        >
                          <NavLink to={item.path}>
                            <Icon />
                            <span>{item.label}</span>
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </Fragment>
        ))}
      </SidebarContent>
    </Sidebar>
  )
}

export default Navigation
