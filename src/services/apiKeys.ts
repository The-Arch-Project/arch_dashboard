import { useQuery, useMutation } from "@tanstack/react-query";
import { ApiKey, Webhook } from "@shared/schema";
import { ApiResponse } from "@/types/api";
import { apiRequest, queryClient } from "@/lib/queryClient";

// API Keys
export function useApiKeys() {
  return useQuery<ApiResponse<ApiKey[]>>({
    queryKey: ['/api/api-keys'],
  });
}

export function useCreateApiKey() {
  return useMutation({
    mutationFn: async (data: { name: string }) => {
      const response = await apiRequest('POST', '/api/api-keys', data);
      return response.json() as Promise<ApiResponse<ApiKey>>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/api-keys'] });
    }
  });
}

export function useDeleteApiKey() {
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('DELETE', `/api/api-keys/${id}`);
      return response.json() as Promise<ApiResponse<void>>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/api-keys'] });
    }
  });
}

// Webhooks
export function useWebhooks() {
  return useQuery<ApiResponse<Webhook[]>>({
    queryKey: ['/api/webhooks'],
  });
}

export function useCreateWebhook() {
  return useMutation({
    mutationFn: async (data: { url: string, eventType: string, active: boolean }) => {
      const response = await apiRequest('POST', '/api/webhooks', data);
      return response.json() as Promise<ApiResponse<Webhook>>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/webhooks'] });
    }
  });
}

export function useDeleteWebhook() {
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('DELETE', `/api/webhooks/${id}`);
      return response.json() as Promise<ApiResponse<void>>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/webhooks'] });
    }
  });
}
