import { useCallback, useState } from "react"
import { PaginatedRequestParams, PaginatedResponse, Transaction } from "../utils/types"
import { PaginatedTransactionsResult } from "./types"
import { useCustomFetch } from "./useCustomFetch"

export function usePaginatedTransactions(): PaginatedTransactionsResult {
  const { fetchWithCache, fetchWithoutCache, loading } = useCustomFetch()
  const [paginatedTransactions, setPaginatedTransactions] = useState<PaginatedResponse<
    Transaction[]
  > | null>(null)

  const fetchAll = useCallback(async () => {
    const response = await fetchWithoutCache<PaginatedResponse<Transaction[]>, PaginatedRequestParams>(
      "paginatedTransactions",
      {
        page: paginatedTransactions === null ? 0 : paginatedTransactions.nextPage,
      }
      
    )
    console.log("fetchall resp:",response);
    setPaginatedTransactions((previousResponse) => {
      if (response === null || previousResponse === null) {
        return response
      }
      // console.log("response.data:",response.data);
      // console.log("orig data",paginatedTransactions);
      let newData:Transaction[] = [];
      if(paginatedTransactions){
        newData = newData.concat(...paginatedTransactions.data);
      }
      newData = newData.concat(...response.data);
      return { data: newData, nextPage: response.nextPage }
    })
  }, [fetchWithoutCache, paginatedTransactions])

  const invalidateData = useCallback(() => {
    setPaginatedTransactions(null)
  }, [])

  return { data: paginatedTransactions, loading, fetchAll, invalidateData }
}
