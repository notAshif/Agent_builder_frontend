import { apiClient } from "./client";
import type { ApiResponse, Tool } from "../types";

export const toolApi = {
  list: async () => {
    const response = await apiClient.get<ApiResponse<{ tools: Tool[] }>>("/tools");
    return response.data;
  },
  create: async (data: { name: string; description: string; category: string; inputSchema?: Record<string, unknown>; config?: Record<string, unknown>; webhookUrl?: string; webhookMethod?: string; webhookHeaders?: Record<string, string> }) => {
    const payload = {
      ...data,
      config: {
        webhookUrl: data.webhookUrl,
        method: data.webhookMethod ?? "POST",
        headers: data.webhookHeaders ?? {},
        ...data.config,
      },
    };
    const response = await apiClient.post<ApiResponse<{ tool: Tool }>>("/tools", payload);
    return response.data;
  },
};
