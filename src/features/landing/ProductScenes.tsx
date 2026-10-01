import { ChevronDown } from "lucide-react"

import { usePlayOnView } from "./usePlayOnView"

function MonthScene() {
  const { ref, play } = usePlayOnView<HTMLElement>()

  return (
    <section
      ref={ref}
      id="book"
      className="site-section site-scene"
      data-play={play ? "true" : "false"}
      aria-labelledby="book-title"
    >
      <h2 id="book-title">A month, read at a glance.</h2>
      <p className="site-lead">
        Spent, received, and what is left, as each line is written.
      </p>
      <p className="sr-only">
        Sample month. Spent ₹20,340, received ₹52,000, ₹31,660 left.
      </p>
      <div aria-hidden="true">
        <div className="site-figures">
          <p>
            <span className="site-swap at-spend">
              <span className="is-start">₹18,000</span>
              <span className="is-final">₹20,340</span>
            </span>
            <span>Spent</span>
          </p>
          <p>
            <span className="site-swap at-receive">
              <span className="is-start">₹48,000</span>
              <span className="is-final">₹52,000</span>
            </span>
            <span>Received</span>
          </p>
          <p>
            <span className="site-swap at-left">
              <span className="is-start">₹30,000</span>
              <span className="is-mid">₹27,660</span>
              <span className="is-final">₹31,660</span>
            </span>
            <span>Left</span>
          </p>
        </div>
        <ul className="site-lines">
          <li>
            <span>Salary</span>
            <span className="in">+₹48,000</span>
          </li>
          <li>
            <span>Rent</span>
            <span className="out">−₹18,000</span>
          </li>
          <li className="site-enter at-spend">
            <span>Groceries</span>
            <span className="out">−₹2,340</span>
          </li>
          <li className="site-enter at-receive">
            <span>Received from Meera</span>
            <span className="in">+₹4,000</span>
          </li>
        </ul>
      </div>
    </section>
  )
}

function PlanScene() {
  const { ref, play } = usePlayOnView<HTMLElement>()

  return (
    <section
      ref={ref}
      id="plan"
      className="site-band site-scene"
      data-play={play ? "true" : "false"}
      aria-labelledby="plan-title"
    >
      <div className="site-band-inner site-plan">
        <div>
          <h2 id="plan-title">A name, then a limit.</h2>
          <p>
            Categories can hold smaller ones. A budget shows how much of that
            name is left.
          </p>
          <p className="sr-only">
            Home holds Rent and Groceries. ₹7,660 left of a ₹28,000 limit after
            ₹20,340 spent. Income holds Salary.
          </p>
          <div className="site-tree" aria-hidden="true">
            <div className="site-tree-name">
              <ChevronDown className="site-chevron" aria-hidden="true" />
              Home
            </div>
            <ul>
              <li className="site-enter at-child">Rent</li>
              <li className="site-enter at-child-2">Groceries</li>
            </ul>
            <div className="site-tree-name">Income</div>
            <ul>
              <li>Salary</li>
            </ul>
          </div>
        </div>
        <div className="site-budget" aria-hidden="true">
          <p className="site-budget-name">Home</p>
          <p className="site-budget-figure">
            <span className="site-swap at-budget">
              <span className="is-start">₹28,000 left</span>
              <span className="is-final">₹7,660 left</span>
            </span>
          </p>
          <p className="site-budget-meta">of ₹28,000</p>
          <div className="site-budget-rule">
            <span className="site-budget-fill" />
          </div>
          <p className="site-budget-meta">
            <span className="site-swap at-budget">
              <span className="is-start">Nothing spent yet</span>
              <span className="is-final">₹20,340 spent</span>
            </span>
          </p>
        </div>
      </div>
    </section>
  )
}

function SettleScene() {
  const { ref, play } = usePlayOnView<HTMLElement>()

  return (
    <section
      ref={ref}
      id="settle"
      className="site-section site-scene"
      data-play={play ? "true" : "false"}
      aria-labelledby="settle-title"
    >
      <h2 id="settle-title">What is still open.</h2>
      <p className="site-lead">
        Debts you owe or are owed, and money that stays yours after spending.
      </p>
      <p className="sr-only">
        Meera still owes ₹8,000 after ₹4,000 was received. Arun is still owed
        ₹6,000. Emergency fund ₹45,000 after a ₹5,000 contribution. SIP
        ₹5,000 of ₹5,000 this month. FD ₹1,00,000. Savings ₹22,400.
      </p>
      <div className="site-settle" aria-hidden="true">
        <div>
          <h3>Debts</h3>
          <ul className="book-lines site-live">
            <li>
              <div className="site-live-row">
                <span>
                  <span className="site-live-title">Meera</span>
                  <span className="site-live-note">Owed to me</span>
                </span>
                <span className="book-amount site-swap at-receive">
                  <span className="is-start">₹12,000</span>
                  <span className="is-final">₹8,000</span>
                </span>
              </div>
              <p className="site-enter at-receive site-live-note">
                Received ₹4,000
              </p>
            </li>
            <li>
              <div className="site-live-row">
                <span>
                  <span className="site-live-title">Arun</span>
                  <span className="site-live-note">I owe</span>
                </span>
                <span className="book-amount">₹6,000</span>
              </div>
            </li>
          </ul>
        </div>
        <div>
          <h3>Positions</h3>
          <ul className="book-lines site-live">
            <li>
              <div className="site-live-row">
                <span>
                  <span className="site-live-title">Emergency fund</span>
                  <span className="site-enter at-receive site-live-note">
                    Contributed ₹5,000
                  </span>
                </span>
                <span className="site-live-figure">
                  <span className="book-amount site-swap at-receive">
                    <span className="is-start">₹40,000</span>
                    <span className="is-final">₹45,000</span>
                  </span>
                  <span className="site-live-note">contributed</span>
                </span>
              </div>
            </li>
            <li>
              <div className="site-live-row">
                <span>
                  <span className="site-live-title">SIP</span>
                  <span className="site-enter at-child site-live-note">
                    ₹5,000 of ₹5,000 this month
                  </span>
                </span>
                <span className="site-live-figure">
                  <span className="book-amount">₹15,000</span>
                  <span className="site-live-note">contributed</span>
                </span>
              </div>
            </li>
            <li>
              <div className="site-live-row">
                <span className="site-live-title">FD</span>
                <span className="site-live-figure">
                  <span className="book-amount">₹1,00,000</span>
                  <span className="site-live-note">contributed</span>
                </span>
              </div>
            </li>
            <li>
              <div className="site-live-row">
                <span className="site-live-title">Savings</span>
                <span className="site-live-figure">
                  <span className="book-amount">₹22,400</span>
                  <span className="site-live-note">contributed</span>
                </span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}

export { MonthScene, PlanScene, SettleScene }
