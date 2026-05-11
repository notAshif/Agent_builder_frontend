import { apiClient } from "./client";
import type { ApiResponse, AgentRun } from "../types";

export const runApi = {
  getStatus: async (id: string) => {
    const response = await apiClient.get<ApiResponse<{ run: AgentRun }>>(`/runs/${id}`);
    return response.data;
  },
  getLogs: async (id: string) => {
    const response = await apiClient.get<ApiResponse<{ logs: any[] }>>(`/runs/${id}/logs`);
    return response.data;
  },
  getExecutions: async (id: string) => {
    const response = await apiClient.get<ApiResponse<{ executions: any[] }>>(`/runs/${id}/executions`);
    return response.data;
  },
  cancel: async (id: string) => {
    const response = await apiClient.delete<ApiResponse<null>>(`/runs/${id}`);
    return response.data;
  },
  getFlow: async (id: string) => {
    const response = await apiClient.get<ApiResponse<{ flow: any }>>(`/flows/${id}`);
    return response.data;
  },
};
