import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { toast } from "sonner"

import { asTransactionFilter, getTransactions } from "@/services/transactionService"
import { PAGE_SIZE } from "@/utils/constants"
import { useUser } from "../auth/useUser"

export default function useTransactions() {
  const [searchParams] = useSearchParams()
  const queryClient = useQueryClient()
  const { isAuthenticated } = useUser()

  const filter = asTransactionFilter(searchParams.get("kind"))
  const search = searchParams.get("q") ?? ""
  const page = Number(searchParams.get("page") ?? 1)

  const { data, error, isLoading } = useQuery({
    queryKey: ["transactions", filter, search, page],
    queryFn: () => getTransactions(filter, search, page),
    enabled: isAuthenticated,
  })

  const transactions = data?.transactions ?? []
  const count = data?.count ?? 0

  useEffect(() => {
    if (!isAuthenticated || !count) return

    const pageCount = Math.ceil(count / PAGE_SIZE)
    if (page < pageCount) {
      queryClient.prefetchQuery({
        queryKey: ["transactions", filter, search, page + 1],
        queryFn: () => getTransactions(filter, search, page + 1),
      })
    }

    if (page > 1) {
      queryClient.prefetchQuery({
        queryKey: ["transactions", filter, search, page - 1],
        queryFn: () => getTransactions(filter, search, page - 1),
      })
    }
  }, [count, filter, isAuthenticated, page, queryClient, search])

  useEffect(() => {
    if (error) toast.error(error.message)
  }, [error])

  return {
    transactions,
    count,
    isLoading,
  }
}
