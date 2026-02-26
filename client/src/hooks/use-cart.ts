import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { fetchWithAuth } from "@/lib/api";
import { useAuthStore } from "./use-auth";

export function useCart() {
  const { user } = useAuthStore();
  
  return useQuery({
    queryKey: [api.cart.get.path],
    queryFn: async () => {
      const data = await fetchWithAuth(api.cart.get.path);
      return api.cart.get.responses[200].parse(data);
    },
    enabled: !!user, // Only fetch if user is logged in
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ productId, quantity }: { productId: string; quantity: number }) => {
      const res = await fetchWithAuth(api.cart.add.path, {
        method: api.cart.add.method,
        body: JSON.stringify({ productId, quantity }),
      });
      return api.cart.add.responses[200].parse(res);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.cart.get.path] }),
  });
}

export function useRemoveFromCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (productId: string) => {
      const url = buildUrl(api.cart.remove.path, { productId });
      const res = await fetchWithAuth(url, { method: api.cart.remove.method });
      return api.cart.remove.responses[200].parse(res);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.cart.get.path] }),
  });
}
