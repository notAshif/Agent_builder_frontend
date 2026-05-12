import { apiClient } from "./client";
import type { ApiResponse } from "../types";

export interface ScheduleData {
  scheduleCron: string | null;
  scheduleEnabled: boolean;
  nextScheduledRun: string | null;
  lastScheduledRun: string | null;
}

export const scheduleApi = {
  get: async (agentId: string) => {
    const response = await apiClient.get<ApiResponse<{ schedule: ScheduleData }>>(`/schedules/agents/${agentId}/schedule`);
    return response.data;
  },
  update: async (agentId: string, data: { cron: string | null; enabled: boolean }) => {
    const response = await apiClient.put<ApiResponse<{ agent: any }>>(`/schedules/agents/${agentId}/schedule`, data);
    return response.data;
  },
};
