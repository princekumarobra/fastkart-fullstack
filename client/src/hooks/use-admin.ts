import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { fetchWithAuth } from "@/lib/api";
import { useAuthStore } from "./use-auth";

export function useAdminUsers() {
  const { user } = useAuthStore();
  
  return useQuery({
    queryKey: [api.admin.users.path],
    queryFn: async () => {
      const data = await fetchWithAuth(api.admin.users.path);
      return api.admin.users.responses[200].parse(data);
    },
    enabled: user?.role === "admin",
  });
}

export function useAdminDashboard() {
  const { user } = useAuthStore();
  
  return useQuery({
    queryKey: [api.admin.dashboard.path],
    queryFn: async () => {
      const data = await fetchWithAuth(api.admin.dashboard.path);
      return api.admin.dashboard.responses[200].parse(data);
    },
    enabled: user?.role === "admin",
  });
}
