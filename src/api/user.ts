import { apiClient } from "./client";
import type { ApiResponse, User } from "../types";

export interface ApiKey {
  id: string;
  key: string;
  name: string;
  userId: string;
  createdAt: string;
  updatedAt?: string;
  lastTime?: string | null;
}

export type ProviderKeyProvider = "openrouter" | "openai" | "anthropic";

export interface ProviderKeyStatus {
  provider: ProviderKeyProvider;
  hasKey: boolean;
  updatedAt: string | null;
  lastTime: string | null;
}

const normalizeApiKey = (apiKey: any): ApiKey => ({
  ...apiKey,
  createdAt: apiKey.createdAt ?? apiKey.createAt,
});

export const userApi = {
  getProfile: async () => {
    const response = await apiClient.get<ApiResponse<{ user: User }>>("/users/profile");
    return response.data;
  },
  updateProfile: async (data: { name: string }) => {
    const response = await apiClient.patch<ApiResponse<{ user: User }>>("/users/profile", data);
    return response.data;
  },
  listApiKeys: async () => {
    const response = await apiClient.get<ApiResponse<{ apiKeys: ApiKey[] }>>("/users/api-keys");
    return {
      ...response.data,
      data: {
        keys: response.data.data.apiKeys.map(normalizeApiKey),
      },
    };
  },
  createApiKey: async (data: { name: string }) => {
    const response = await apiClient.post<ApiResponse<{ apiKey: ApiKey }>>("/users/api-keys", data);
    return {
      ...response.data,
      data: {
        key: normalizeApiKey(response.data.data.apiKey),
      },
    };
  },
  deleteApiKey: async (id: string) => {
    const response = await apiClient.delete<ApiResponse<null>>(`/users/api-keys/${id}`);
    return response.data;
  },
  listProviderKeys: async () => {
    const response = await apiClient.get<ApiResponse<{ providerKeys: ProviderKeyStatus[] }>>("/users/provider-keys");
    return response.data;
  },
  saveProviderKey: async (provider: ProviderKeyProvider, key: string) => {
    const response = await apiClient.put<ApiResponse<{ providerKey: ProviderKeyStatus }>>(`/users/provider-keys/${provider}`, { key });
    return response.data;
  },
  deleteProviderKey: async (provider: ProviderKeyProvider) => {
    const response = await apiClient.delete<ApiResponse<null>>(`/users/provider-keys/${provider}`);
    return response.data;
  },
};
