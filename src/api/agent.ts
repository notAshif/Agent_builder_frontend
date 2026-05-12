import { apiClient } from "./client";
import type { ApiResponse, Agent, AgentStatus, AgentPurpose } from "../types";

export const agentApi = {
  list: async (params: { page?: number; limit?: number; status?: AgentStatus; purpose?: AgentPurpose; search?: string }) => {
    const response = await apiClient.get<ApiResponse<{ agents: Agent[]; meta: any }>>("/agents", { params });
    return response.data;
  },
  getById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<{ agent: Agent }>>(`/agents/${id}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await apiClient.post<ApiResponse<{ agent: Agent }>>("/agents", data);
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await apiClient.patch<ApiResponse<{ agent: Agent }>>(`/agents/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await apiClient.delete<ApiResponse<null>>(`/agents/${id}`);
    return response.data;
  },
  run: async (id: string, data: { input: string; conversationId?: string }) => {
    const response = await apiClient.post<ApiResponse<{ run: any }>>(`/agents/${id}/run`, data);
    return response.data;
  },
  getRuns: async (id: string, params?: { page?: number; limit?: number }) => {
    const response = await apiClient.get<ApiResponse<{ runs: any[]; meta: any }>>(`/agents/${id}/runs`, { params });
    return response.data;
  },
};
