import { format, parseISO, subDays } from "date-fns"

import type { TransactionWithRef } from "@/types/transactions"
import TransactionItem from "./TransactionItem"

interface TransactionListProps {
  transactions: TransactionWithRef[]
  onEdit: (transaction: TransactionWithRef) => void
}

function dayLabel(date: string) {
  if (!date) return "Undated"
  const today = format(new Date(), "yyyy-MM-dd")
  const yesterday = format(subDays(new Date(), 1), "yyyy-MM-dd")
  if (date === today) return "Today"
  if (date === yesterday) return "Yesterday"
  return format(parseISO(date), "d MMM yyyy")
}

function groupByDay(transactions: TransactionWithRef[]) {
  const groups: { date: string; items: TransactionWithRef[] }[] = []

  for (const transaction of transactions) {
    const date = transaction.transactionDate ?? ""
    const last = groups.at(-1)
    if (last?.date === date) last.items.push(transaction)
    else groups.push({ date, items: [transaction] })
  }

  return groups
}

function TransactionList({ transactions, onEdit }: TransactionListProps) {
  const groups = groupByDay(transactions)

  return (
    <div className="flex flex-col gap-8">
      {groups.map((group) => (
        <section key={group.date || "undated"} className="flex flex-col gap-3">
          <h2 className="book-group">{dayLabel(group.date)}</h2>
          <ul className="book-lines">
            {group.items.map((transaction) => (
              <li key={transaction.transactionId}>
                <TransactionItem transaction={transaction} onEdit={onEdit} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}

export default TransactionList
