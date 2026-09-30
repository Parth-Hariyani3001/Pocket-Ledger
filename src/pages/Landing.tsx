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
import LandingHeader from "../features/landing/LandingHeader"

const holdings = [
  {
    title: "Everyday lines",
    description: "Write income and spending as they happen, with the amount last.",
  },
  {
    title: "Names you already use",
    description: "Categories follow the words you use at home, and can hold a few smaller ones.",
  },
  {
    title: "Debts in the same book",
    description: "What you owe and what you are owed sit beside rent, not in another app.",
  },
  {
    title: "Money you still own",
    description: "SIP, FD, savings, and an emergency fund keep a balance after the money leaves spending.",
  },
]

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
        <svg
          className="site-road"
          viewBox="0 0 1440 780"
          preserveAspectRatio="xMaxYMin slice"
          aria-hidden="true"
        >
          <path
            className="site-road-stroke"
            pathLength={1}
            d="M1040 -180C780 20 860 200 1120 320C1420 460 1280 560 1620 700"
            fill="none"
            strokeLinecap="butt"
          />
        </svg>
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

      <section className="site-section" id="book" aria-labelledby="book-title">
        <h2 id="book-title">What the book holds</h2>
        <div className="site-holdings">
          {holdings.map((item) => (
            <article key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="site-band" aria-labelledby="band-title">
        <div className="site-band-inner">
          <div>
            <h2 id="band-title">Written the way a cashbook is written.</h2>
            <p>
              A date, a name, and an amount. The page stays quiet so the figures
              can be read.
            </p>
          </div>
          <dl>
            <div>
              <dt>One column</dt>
              <dd>for every amount</dd>
            </div>
            <div>
              <dt>Same list</dt>
              <dd>for spending and debts</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="site-section site-record" aria-labelledby="record-title">
        <div>
          <h2 id="record-title">A line is enough.</h2>
          <ul>
            <li>The amount is the last thing on the line.</li>
            <li>A category can hold a few smaller ones.</li>
            <li>Borrowed and lent money stay next to rent.</li>
          </ul>
        </div>
        <LedgerStage />
      </section>

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
            <a href="#book">The book</a>
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
