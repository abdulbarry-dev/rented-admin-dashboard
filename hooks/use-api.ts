import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"

export function useApi<T>(key: string[], endpoint: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: key,
    queryFn: () => apiClient.get<T>(endpoint),
    enabled: options?.enabled ?? true,
  })
}

export function useApiMutation<T, V = unknown>(endpoint: string, method: "post" | "put" | "delete" = "post") {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: V) => {
      switch (method) {
        case "post":
          return apiClient.post<T>(endpoint, data)
        case "put":
          return apiClient.put<T>(endpoint, data)
        case "delete":
          return apiClient.delete<T>(endpoint)
        default:
          return apiClient.post<T>(endpoint, data)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries()
    },
  })
}
