import type { QueryClient } from "@tanstack/react-query"

export function refreshLedger(queryClient: QueryClient) {
  queryClient.invalidateQueries({ queryKey: ["transactions"] })
  queryClient.invalidateQueries({ queryKey: ["debts"] })
  queryClient.invalidateQueries({ queryKey: ["budgets"] })
  queryClient.invalidateQueries({ queryKey: ["positions"] })
  queryClient.invalidateQueries({ queryKey: ["month-activity"] })
  queryClient.invalidateQueries({ queryKey: ["net-worth"] })
}
