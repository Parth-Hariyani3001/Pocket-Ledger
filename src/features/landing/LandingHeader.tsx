import { Menu, Moon, Sun, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
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
  const sentinelRef = useRef<HTMLDivElement>(null)
  const [raised, setRaised] = useState(false)

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(([entry]) => {
      setRaised(!entry.isIntersecting)
    })
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [])

  return (
    <>
    <div ref={sentinelRef} className="site-header-sentinel" aria-hidden="true" />
    <header className={raised ? "site-header is-raised" : "site-header"}>
      <div className="site-header-bar">
        <Link to="/landing" className="site-logo">
          <Logo />
        </Link>

        <nav className="site-nav" aria-label="Page">
          <a href="#book">A month</a>
          <a href="#plan">Categories</a>
          <a href="#settle">Debts</a>
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
          A month
        </a>
        <a href="#plan" onClick={toggleMobileMenu}>
          Categories
        </a>
        <a href="#settle" onClick={toggleMobileMenu}>
          Debts
        </a>
        <a href="#questions" onClick={toggleMobileMenu}>
          Questions
        </a>
        <button type="button" className="site-pill" onClick={onGetStarted}>
          Sign in
        </button>
      </div>
    </header>
    </>
  )
}

export default LandingHeader
