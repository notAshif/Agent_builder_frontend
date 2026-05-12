import { useState, useEffect, useRef } from "react";
import { Send, Bot, User, Loader2, MessageSquare } from "lucide-react";
import { agentApi } from "../../api/agent";
import { apiClient } from "../../api/client";
import { Button } from "../ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { toast } from "sonner";
import { cn } from "../../lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface ConversationChatProps {
  agentId: string;
  agentName: string;
}

export default function ConversationChat({ agentId, agentName }: ConversationChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const res = await agentApi.getRuns(agentId, { limit: 50 });
        if (res.success && res.data.runs.length > 0) {
          const history: Message[] = res.data.runs
            .filter((r: any) => r.output)
            .flatMap((r: any) => [
              { id: `${r.id}-user`, role: "user" as const, content: r.input, timestamp: r.createdAt },
              { id: `${r.id}-assistant`, role: "assistant" as const, content: r.output, timestamp: r.createdAt },
            ])
            .sort((a: Message, b: Message) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
          setMessages(history);
          if (history.length > 0) {
            setConversationId(res.data.runs[res.data.runs.length - 1].id);
          }
        }
      } catch {
      } finally {
        setHistoryLoaded(true);
      }
    };
    loadHistory();
  }, [agentId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const payload = { input: userMsg.content, conversationId: conversationId || undefined };
      const res = await agentApi.run(agentId, payload);

      if (res.success) {
        const runId = res.data.run.id;
        setConversationId(runId);

        const pollOutput = setInterval(async () => {
          const statusRes = await apiClient.get(`/runs/${runId}`);
          const statusData = statusRes.data;
          if (statusData.success && statusData.data.run.output) {
            clearInterval(pollOutput);
            const assistantMsg: Message = {
              id: `assistant-${Date.now()}`,
              role: "assistant",
              content: statusData.data.run.output,
              timestamp: new Date().toISOString(),
            };
            setMessages((prev) => [...prev, assistantMsg]);
            setLoading(false);
          } else if (statusData.success && ["FAILED", "CANCELLED"].includes(statusData.data.run.status)) {
            clearInterval(pollOutput);
            toast.error("Agent run failed");
            setLoading(false);
          }
        }, 1000);

        setTimeout(() => {
          clearInterval(pollOutput);
          setLoading(false);
        }, 120000);
      }
    } catch {
      toast.error("Failed to send message");
      setLoading(false);
    }
  };

  if (!historyLoaded) {
    return (
      <Card className="border-border/50">
        <CardContent className="p-8 text-center text-muted-foreground">
          <Loader2 className="animate-spin mx-auto mb-2" size={20} />
          <span className="text-sm">Loading conversation...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50 flex flex-col h-[500px]">
      <CardHeader className="py-3 border-b border-border/50 shrink-0">
        <div className="flex items-center gap-2">
          <MessageSquare size={16} className="text-primary" />
          <CardTitle className="text-sm font-semibold">Chat with {agentName}</CardTitle>
          {loading && <Loader2 size={14} className="animate-spin ml-auto text-muted-foreground" />}
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <Bot size={32} className="mb-2 opacity-30" />
            <p className="text-sm">Start a conversation with {agentName}</p>
          </div>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex gap-2 max-w-[85%]",
              msg.role === "user" ? "ml-auto" : ""
            )}
          >
            {msg.role === "assistant" && (
              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                <Bot size={14} className="text-primary" />
              </div>
            )}
            <div
              className={cn(
                "px-3.5 py-2.5 rounded-xl text-sm leading-relaxed whitespace-pre-wrap",
                msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-md"
                  : "bg-muted/30 border border-border/50 rounded-bl-md"
              )}
            >
              {msg.content}
            </div>
            {msg.role === "user" && (
              <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center shrink-0 mt-1">
                <User size={14} className="text-primary-foreground" />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex gap-2 max-w-[85%]">
            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
              <Bot size={14} className="text-primary" />
            </div>
            <div className="px-3.5 py-2.5 rounded-xl bg-muted/30 border border-border/50 text-sm text-muted-foreground">
              <span className="inline-flex gap-1">
                <span className="animate-bounce">.</span>
                <span className="animate-bounce delay-75">.</span>
                <span className="animate-bounce delay-150">.</span>
              </span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </CardContent>
      <div className="p-3 border-t border-border/50 shrink-0">
        <div className="flex gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            placeholder="Type a message..."
            rows={1}
            className="flex-1 px-3 py-2 rounded-lg bg-background border border-border text-sm outline-none focus:border-primary resize-none"
          />
          <Button size="icon" onClick={sendMessage} disabled={loading || !input.trim()} className="shrink-0">
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          </Button>
        </div>
      </div>
    </Card>
  );
}
