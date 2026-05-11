import { apiClient } from "./client";
import type { ApiResponse, User } from "../types";

export type OAuthProvider = "google" | "github";

export interface AuthSession {
  access_token: string;
  refresh_token?: string;
  expire_at?: number;
}

export const authApi = {
  login: async (data: any) => {
    const response = await apiClient.post<ApiResponse<{ user: User } & AuthSession>>("/auth/login", data);
    return response.data;
  },
  register: async (data: any) => {
    const response = await apiClient.post<ApiResponse<{ user: User; session: AuthSession | null }>>("/auth/register", data);
    return response.data;
  },
  getOAuthUrl: async (provider: OAuthProvider) => {
    const response = await apiClient.get<ApiResponse<{ url: string }>>(`/auth/oauth/${provider}`);
    return response.data;
  },
  syncOAuthUser: async () => {
    const response = await apiClient.post<ApiResponse<{ user: User }>>("/auth/oauth/sync");
    return response.data;
  },
  me: async () => {
    const response = await apiClient.get<ApiResponse<{ user: User }>>("/auth/me");
    return response.data;
  },
  logout: async () => {
    const response = await apiClient.post<ApiResponse<null>>("/auth/logout");
    return response.data;
  },
  forgotPassword: async (data: { email: string }) => {
    const response = await apiClient.post<ApiResponse<null>>("/auth/forget-password", data);
    return response.data;
  },
  resetPassword: async (data: { password: string }) => {
    const response = await apiClient.post<ApiResponse<null>>("/auth/reset-password", data);
    return response.data;
  },
};
