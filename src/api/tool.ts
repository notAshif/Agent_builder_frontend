import { apiClient } from "./client";
import type { ApiResponse, Tool } from "../types";

export const toolApi = {
  list: async () => {
    const response = await apiClient.get<ApiResponse<{ tools: Tool[] }>>("/tools");
    return response.data;
  },
  create: async (data: { name: string; description: string; category: string; inputSchema?: Record<string, unknown>; config?: Record<string, unknown> }) => {
    const response = await apiClient.post<ApiResponse<{ tool: Tool }>>("/tools", data);
    return response.data;
  },
};
