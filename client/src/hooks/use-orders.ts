import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { z } from "zod";
import { fetchWithAuth } from "@/lib/api";
import { useAuthStore } from "./use-auth";

export function useOrders() {
  const { user } = useAuthStore();
  
  return useQuery({
    queryKey: [api.orders.list.path],
    queryFn: async () => {
      const data = await fetchWithAuth(api.orders.list.path);
      return api.orders.list.responses[200].parse(data);
    },
    enabled: !!user,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: z.infer<typeof api.orders.create.input>) => {
      const res = await fetchWithAuth(api.orders.create.path, {
        method: api.orders.create.method,
        body: JSON.stringify(data),
      });
      return api.orders.create.responses[201].parse(res);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.orders.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.cart.get.path] });
    },
  });
}

export function useVerifyPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: z.infer<typeof api.orders.verifyPayment.input>) => {
      const res = await fetchWithAuth(api.orders.verifyPayment.path, {
        method: api.orders.verifyPayment.method,
        body: JSON.stringify(data),
      });
      return api.orders.verifyPayment.responses[200].parse(res);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.orders.list.path] }),
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: "processing" | "shipped" | "delivered" }) => {
      const url = buildUrl(api.orders.updateStatus.path, { id });
      const res = await fetchWithAuth(url, {
        method: api.orders.updateStatus.method,
        body: JSON.stringify({ orderStatus: status }),
      });
      return api.orders.updateStatus.responses[200].parse(res);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.orders.list.path] }),
  });
}
