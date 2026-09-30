import { Moon, Sun } from "lucide-react"
import { Outlet } from "react-router-dom"

import { useTheme } from "@/context/ThemeContext"
import { useUser } from "@/features/auth/useUser"
import { Button } from "@/components/ui/button"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import Logo from "./Logo"
import Logout from "./Logout"
import Navigation from "./Navigation"

function AppLayout() {
  const {
    context: { isDarkMode, toggleDarkMode },
  } = useTheme()
  const { user } = useUser()

  const name =
    (user?.user_metadata?.fullName as string | undefined) ||
    user?.email ||
    "Signed in"
  const email = user?.email ?? ""

  return (
    <SidebarProvider>
      <Navigation />
      <SidebarInset>
        <header className="flex h-16 items-center gap-3 border-b px-4 md:px-8">
          <SidebarTrigger />
          <Logo className="font-heading text-xl font-medium tracking-[-0.02em] md:hidden" />
          <div className="ml-auto flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              aria-label={isDarkMode ? "Use light theme" : "Use dark theme"}
            >
              {isDarkMode ? <Sun /> : <Moon />}
            </Button>
            <div className="hidden min-w-0 items-center sm:flex">
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-sm">{name}</span>
                {email && name !== email ? (
                  <span className="truncate text-xs text-muted-foreground">
                    {email}
                  </span>
                ) : null}
              </div>
            </div>
            <Logout />
          </div>
        </header>
        <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-6 md:px-10 md:py-10">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default AppLayout
