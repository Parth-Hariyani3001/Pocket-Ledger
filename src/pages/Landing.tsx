import { useState } from "react"
import { useNavigate } from "react-router-dom"

import LedgerStage from "@/components/LedgerStage"
import Logo from "@/components/Logo"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import HeroRoad from "../features/landing/HeroRoad"
import LandingHeader from "../features/landing/LandingHeader"
import { MonthScene, PlanScene, SettleScene } from "../features/landing/ProductScenes"
import { usePlayOnView } from "../features/landing/usePlayOnView"

const questions = [
  {
    q: "Where does the book live?",
    a: "Your entries are stored in your account and sync when you sign in on another device.",
  },
  {
    q: "Can I use it on a phone?",
    a: "Yes. The book is the same on a phone, a tablet, and a desk.",
  },
  {
    q: "What can I record?",
    a: "Everyday categories, debts, and positions such as a SIP or an emergency fund.",
  },
]

export default function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate()
  const record = usePlayOnView<HTMLElement>()

  const onGetStarted = () => {
    navigate("/signin")
  }

  return (
    <div className="site">
      <LandingHeader
        onGetStarted={onGetStarted}
        toggleMobileMenu={() => setMobileMenuOpen((open) => !open)}
        mobileMenuOpen={mobileMenuOpen}
      />
      <div className="site-top">
        <HeroRoad />
        <section className="site-hero" aria-labelledby="hero-title">
          <div className="site-hero-copy">
            <h1 id="hero-title">Keep a clear record of the money you move.</h1>
            <p>
              Income, spending, debts, and positions live in one book. Each
              amount sits on the right.
            </p>
            <div className="site-hero-actions">
              <button type="button" className="site-pill" onClick={onGetStarted}>
                Sign in
              </button>
              <button
                type="button"
                className="site-text-button"
                onClick={() => navigate("/signup")}
              >
                Create an account
              </button>
            </div>
          </div>
        </section>
      </div>

      <MonthScene />

      <section
        ref={record.ref}
        className="site-section site-record"
        data-play={record.play ? "true" : "false"}
        aria-labelledby="record-title"
      >
        <div>
          <h2 id="record-title">A line is enough.</h2>
          <ul>
            <li>The amount is the last thing on the line.</li>
            <li>Income and spending share the page.</li>
            <li>What is left is the last figure.</li>
          </ul>
        </div>
        <LedgerStage />
      </section>

      <PlanScene />
      <SettleScene />

      <section className="site-section" id="questions" aria-labelledby="questions-title">
        <h2 id="questions-title">Questions</h2>
        <Accordion type="single" collapsible className="site-accordion">
          {questions.map((item) => (
            <AccordionItem key={item.q} value={item.q}>
              <AccordionTrigger>{item.q}</AccordionTrigger>
              <AccordionContent>{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <section className="site-close" aria-labelledby="close-title">
        <h2 id="close-title">Sign in and write the next line.</h2>
        <button type="button" className="site-pill" onClick={onGetStarted}>
          Sign in
        </button>
      </section>

      <footer className="site-footer">
        <div className="site-footer-grid">
          <div>
            <p className="site-logo">
              <Logo />
            </p>
            <p>A cashbook for everyday money.</p>
          </div>
          <div>
            <p>Product</p>
            <a href="#book">A month</a>
            <a href="#plan">Categories</a>
            <a href="#settle">Debts</a>
            <a href="#questions">Questions</a>
          </div>
          <div>
            <p>Account</p>
            <button type="button" onClick={onGetStarted}>
              Sign in
            </button>
            <button type="button" onClick={() => navigate("/signup")}>
              Create an account
            </button>
          </div>
        </div>
        <p className="site-footer-note">© 2026 PocketLedger</p>
      </footer>
    </div>
  )
}
