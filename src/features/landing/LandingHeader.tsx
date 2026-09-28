import { Menu, Moon, Sun, X } from "lucide-react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import Logo from "@/components/Logo"
import { useTheme } from "@/context/ThemeContext"

interface LandingHeaderProps {
  onGetStarted: () => void
  toggleMobileMenu: () => void
  mobileMenuOpen: boolean
}

function LandingHeader({
  onGetStarted,
  toggleMobileMenu,
  mobileMenuOpen,
}: LandingHeaderProps) {
  const {
    context: { isDarkMode, toggleDarkMode },
  } = useTheme()
  const [raised, setRaised] = useState(false)

  useEffect(() => {
    const onScroll = () => setRaised(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header className={raised ? "site-header is-raised" : "site-header"}>
      <div className="site-header-bar">
        <Link to="/landing" className="site-logo">
          <Logo />
        </Link>

        <nav className="site-nav" aria-label="Page">
          <a href="#book">The book</a>
          <a href="#questions">Questions</a>
        </nav>

        <div className="site-header-actions">
          <button
            type="button"
            className="site-icon-button"
            onClick={toggleDarkMode}
            aria-label={isDarkMode ? "Use light theme" : "Use dark theme"}
          >
            {isDarkMode ? <Sun /> : <Moon />}
          </button>
          <button
            type="button"
            className="site-pill site-header-signin"
            onClick={onGetStarted}
          >
            Sign in
          </button>
          <button
            type="button"
            className="site-icon-button site-menu-button"
            onClick={toggleMobileMenu}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      <div className="site-menu" data-open={mobileMenuOpen ? "true" : "false"}>
        <a href="#book" onClick={toggleMobileMenu}>
          The book
        </a>
        <a href="#questions" onClick={toggleMobileMenu}>
          Questions
        </a>
        <button type="button" className="site-pill" onClick={onGetStarted}>
          Sign in
        </button>
      </div>
    </header>
  )
}

export default LandingHeader
