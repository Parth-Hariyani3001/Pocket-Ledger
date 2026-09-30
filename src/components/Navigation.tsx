import { ArrowRightLeft, HandCoins, Home, Landmark, Notebook, Target } from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"

import Logo from "@/components/Logo"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import type { NavigationType } from "@/types/general"

const navigationItems: NavigationType[] = [
  { icon: Home, label: "Dashboard", path: "/", active: true },
  { icon: Notebook, label: "Categories", path: "/categories" },
  { icon: Target, label: "Budget", path: "/budget" },
  { icon: HandCoins, label: "Debts", path: "/debts" },
  { icon: Landmark, label: "Positions", path: "/positions" },
  { icon: ArrowRightLeft, label: "Transactions", path: "/transactions" },
]

function Navigation() {
  const { pathname } = useLocation()

  return (
    <Sidebar>
      <SidebarHeader>
        <Logo
          className="logo-on-night px-2 py-1 font-heading text-[1.35rem] font-medium tracking-[-0.02em] text-sidebar-foreground"
          markClassName="size-8"
        />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {navigationItems.map((item) => {
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
      </SidebarContent>
    </Sidebar>
  )
}

export default Navigation
