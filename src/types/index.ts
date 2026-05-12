export type AgentPurpose =
  | "BUSINESS"
  | "RESEARCH"
  | "CUSTOMER_SUPPORT"
  | "DATA_ANALYSIS"
  | "CONTENT_CREATION"
  | "CODING"
  | "GENERAL";

export type AgentStatus = "ACTIVE" | "INACTIVE" | "DRAFT";

export type RunStatus = "PENDING" | "RUNNING" | "COMPLETED" | "FAILED" | "CANCELLED";

export interface Agent {
  id: string;
  name: string;
  description: string | null;
  prompt: string;
  purpose: AgentPurpose;
  status: AgentStatus;
  config: {
    model?: string;
    maxToken?: number;
    temperature?: number;
    destinations?: Array<{
      type: "EMAIL" | "WEBHOOK";
      target: string;
      label?: string;
      config?: Record<string, unknown>;
    }>;
  };
  userId: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    runs: number;
    tools?: number;
  };
  tools?: { tool: Tool }[];
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  inputSchema?: Record<string, unknown>;
  config?: Record<string, unknown>;
  isBuiltin: boolean;
  createdAt: string;
}

export interface AgentRun {
  id: string;
  agentId: string;
  status: RunStatus;
  input: string;
  output: string | null;
  error: string | null;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  _count?: {
    logs: number;
    toolExecution: number;
  };
}

export interface User {
  id: string;
  email: string;
  name: string | null;
  avatarUrl?: string | null;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: any;
}
