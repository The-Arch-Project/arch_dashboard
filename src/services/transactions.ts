import { useQuery } from "@tanstack/react-query";
import { Transaction } from "@shared/schema";
import { ApiResponse } from "@/types/api";

export function useTransactions(page: number, limit: number) {
  return useQuery<ApiResponse<Transaction[]>>({
    queryKey: ['/api/transactions', page, limit],
    queryFn: async ({ queryKey }) => {
      const [_, page, limit] = queryKey;
      return fetch(`/api/transactions?page=${page}&limit=${limit}`, {
        credentials: 'include'
      }).then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch transactions');
        }
        return res.json();
      });
    }
  });
}

export function useRecentTransactions(page: number = 1, limit: number = 5) {
  return useQuery<ApiResponse<Transaction[]>>({
    queryKey: ['/api/transactions/recent', page, limit],
    queryFn: async ({ queryKey }) => {
      const [_, page, limit] = queryKey;
      return fetch(`/api/transactions/recent?page=${page}&limit=${limit}`, {
        credentials: 'include'
      }).then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch recent transactions');
        }
        return res.json();
      });
    }
  });
}

export function useTransactionById(id: number | undefined) {
  return useQuery<ApiResponse<Transaction>>({
    queryKey: [`/api/transactions/${id}`],
    queryFn: async ({ queryKey }) => {
      const [url] = queryKey;
      return fetch(url, {
        credentials: 'include'
      }).then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch transaction');
        }
        return res.json();
      });
    },
    enabled: !!id
  });
}
