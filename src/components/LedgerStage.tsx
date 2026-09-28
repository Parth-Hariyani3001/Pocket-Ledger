const lines = [
  { label: "Salary", amount: "+₹48,000", kind: "in" as const },
  { label: "Rent", amount: "−₹18,000", kind: "out" as const },
  { label: "Groceries", amount: "−₹2,340", kind: "out" as const },
  { label: "A loan repaid", amount: "+₹4,000", kind: "in" as const },
]

function LedgerStage() {
  return (
    <figure className="site-sheet" aria-label="A sample page from the book">
      <figcaption>This month</figcaption>
      <ul>
        {lines.map((line) => (
          <li key={line.label}>
            <span>{line.label}</span>
            <span className={line.kind} data-amount>
              {line.amount}
            </span>
          </li>
        ))}
      </ul>
      <p className="site-sheet-total">
        <span>Left</span>
        <span data-amount>₹31,660</span>
      </p>
    </figure>
  )
}

export default LedgerStage
