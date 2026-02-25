import { create } from "zustand";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { type User } from "@shared/schema";
import { z } from "zod";
import { fetchWithAuth } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

type AuthState = {
  user: User | null;
  token: string | null;
  setUser: (user: User | null, token: string | null) => void;
  logout: () => void;
};

// Simple local state to persist auth without needing a /me endpoint since backend didn't provide one
const getInitialState = () => {
  try {
    const userStr = localStorage.getItem("auth_user");
    const token = localStorage.getItem("auth_token");
    if (userStr && token) {
      return { user: JSON.parse(userStr) as User, token };
    }
  } catch (e) {
    console.error("Failed to parse user from local storage");
  }
  return { user: null, token: null };
};

export const useAuthStore = create<AuthState>((set) => ({
  ...getInitialState(),
  setUser: (user, token) => {
    if (user && token) {
      localStorage.setItem("auth_user", JSON.stringify(user));
      localStorage.setItem("auth_token", token);
    } else {
      localStorage.removeItem("auth_user");
      localStorage.removeItem("auth_token");
    }
    set({ user, token });
  },
  logout: () => {
    localStorage.removeItem("auth_user");
    localStorage.removeItem("auth_token");
    set({ user: null, token: null });
  },
}));

export function useLogin() {
  const { setUser } = useAuthStore();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (data: z.infer<typeof api.auth.login.input>) => {
      const res = await fetch(api.auth.login.path, {
        method: api.auth.login.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Login failed");
      }
      return api.auth.login.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      setUser(data.user, data.token);
      toast({ title: "Welcome back!", description: "Successfully logged in." });
    },
    onError: (err) => {
      toast({ variant: "destructive", title: "Login Failed", description: err.message });
    }
  });
}

export function useRegister() {
  const { setUser } = useAuthStore();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: z.infer<typeof api.auth.register.input>) => {
      const res = await fetch(api.auth.register.path, {
        method: api.auth.register.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Registration failed");
      }
      return api.auth.register.responses[201].parse(await res.json());
    },
    onSuccess: (data) => {
      setUser(data.user, data.token);
      toast({ title: "Account created!", description: "Welcome to AURA." });
    },
    onError: (err) => {
      toast({ variant: "destructive", title: "Registration Failed", description: err.message });
    }
  });
}
