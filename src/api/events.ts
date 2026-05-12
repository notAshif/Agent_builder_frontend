import { API_BASE_URL } from "./client";

export function getEventStreamUrl(): string {
  const token = localStorage.getItem("access_token");
  return `${API_BASE_URL}/events/stream?token=${token}`;
}

export function getRunStreamUrl(runId: string): string {
  const token = localStorage.getItem("access_token");
  return `${API_BASE_URL}/events/runs/${runId}/stream?token=${token}`;
}
