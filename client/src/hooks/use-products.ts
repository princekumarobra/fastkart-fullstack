import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { z } from "zod";
import { fetchWithAuth } from "@/lib/api";

type ProductListParams = {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
};

export function useProducts(params?: ProductListParams) {
  return useQuery({
    queryKey: [api.products.list.path, params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.set("page", params.page.toString());
      if (params?.limit) searchParams.set("limit", params.limit.toString());
      if (params?.category) searchParams.set("category", params.category);
      if (params?.search) searchParams.set("search", params.search);
      
      const qs = searchParams.toString();
      const url = `${api.products.list.path}${qs ? `?${qs}` : ""}`;
      
      const data = await fetchWithAuth(url);
      return api.products.list.responses[200].parse(data);
    },
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: z.infer<typeof api.products.create.input>) => {
      const res = await fetchWithAuth(api.products.create.path, {
        method: api.products.create.method,
        body: JSON.stringify(data),
      });
      return api.products.create.responses[201].parse(res);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.products.list.path] }),
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: z.infer<typeof api.products.update.input> }) => {
      const url = buildUrl(api.products.update.path, { id });
      const res = await fetchWithAuth(url, {
        method: api.products.update.method,
        body: JSON.stringify(data),
      });
      return api.products.update.responses[200].parse(res);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.products.list.path] }),
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const url = buildUrl(api.products.delete.path, { id });
      await fetchWithAuth(url, { method: api.products.delete.method });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.products.list.path] }),
  });
}

export function useBulkUploadProducts() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetchWithAuth(api.products.bulkUpload.path, {
        method: api.products.bulkUpload.method,
        body: formData,
      });
      return api.products.bulkUpload.responses[200].parse(res);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.products.list.path] }),
  });
}
