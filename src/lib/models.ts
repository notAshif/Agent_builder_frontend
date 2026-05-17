export interface ModelOption {
  value: string;
  label: string;
  provider: "openai" | "anthropic" | "gemini" | "openrouter";
  badge: string;
}

export const MODEL_OPTIONS: ModelOption[] = [
  { value: "gpt-4o", label: "GPT-4o", provider: "openai", badge: "OpenAI" },
  { value: "gpt-4-turbo", label: "GPT-4 Turbo", provider: "openai", badge: "OpenAI" },
  { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo", provider: "openai", badge: "OpenAI" },
  { value: "claude-sonnet-4", label: "Claude Sonnet 4", provider: "anthropic", badge: "Anthropic" },
  { value: "claude-3-haiku-20240307", label: "Claude 3 Haiku", provider: "anthropic", badge: "Anthropic" },
  { value: "claude-3-opus-20240229", label: "Claude 3 Opus", provider: "anthropic", badge: "Anthropic" },
  { value: "gemini-2.0-flash", label: "Gemini 2.0 Flash", provider: "gemini", badge: "Gemini" },
  { value: "gemini-2.0-flash-lite", label: "Gemini 2.0 Flash Lite", provider: "gemini", badge: "Gemini" },
  { value: "gemini-1.5-flash", label: "Gemini 1.5 Flash", provider: "gemini", badge: "Gemini" },
  { value: "gemini-1.5-pro", label: "Gemini 1.5 Pro", provider: "gemini", badge: "Gemini" },
  { value: "openrouter/free", label: "OpenRouter Free", provider: "openrouter", badge: "OpenRouter" },
  { value: "meta-llama/llama-3.3-70b-instruct:free", label: "Llama 3.3 70B (free)", provider: "openrouter", badge: "OpenRouter" },
  { value: "deepseek/deepseek-chat-v3.2:free", label: "DeepSeek V3.2 (free)", provider: "openrouter", badge: "OpenRouter" },
  { value: "mistralai/mistral-small-3.1:free", label: "Mistral Small 3.1 (free)", provider: "openrouter", badge: "OpenRouter" },
];

export function getModelInfo(modelName: string | undefined): ModelOption {
  return MODEL_OPTIONS.find((m) => m.value === modelName) || {
    value: modelName || "unknown",
    label: modelName || "Default",
    provider: modelName?.startsWith("claude") ? "anthropic" : modelName?.startsWith("gemini") ? "gemini" : modelName?.includes("/") ? "openrouter" : "openai",
    badge: modelName?.startsWith("claude") ? "Anthropic" : modelName?.startsWith("gemini") ? "Gemini" : modelName?.includes("/") ? "OpenRouter" : "OpenAI",
  };
}
