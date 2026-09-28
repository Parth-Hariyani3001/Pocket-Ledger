import { Moon, Sun } from "lucide-react"
import { Link } from "react-router-dom"

import LedgerStage from "@/components/LedgerStage"
import Logo from "@/components/Logo"
import { useTheme } from "@/context/ThemeContext"

function AuthShell({ children }: { children: React.ReactNode }) {
  const {
    context: { isDarkMode, toggleDarkMode },
  } = useTheme()

  return (
    <div className="site site-auth">
      <aside className="site-auth-stage">
        <Link to="/landing" className="site-logo">
          <Logo />
        </Link>

        <div className="site-auth-book">
          <LedgerStage />
          <p>Sample figures. Your book starts empty.</p>
        </div>
      </aside>

      <div className="site-auth-panel">
        <header className="site-auth-bar">
          <Link to="/landing" className="site-logo site-auth-mark">
            <Logo />
          </Link>
          <button
            type="button"
            className="site-icon-button"
            onClick={toggleDarkMode}
            aria-label={isDarkMode ? "Use light theme" : "Use dark theme"}
          >
            {isDarkMode ? <Sun /> : <Moon />}
          </button>
        </header>

        <main className="site-auth-main">{children}</main>
      </div>
    </div>
  )
}

export default AuthShell
