import { useState, useEffect } from "react";
import { Trash2, Mail, Webhook, Loader2, Send } from "lucide-react";
import { Button } from "../ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/Card";
import { toast } from "sonner";
import { agentApi } from "../../api/agent";
import type { Agent } from "../../types";

interface Destination {
  type: "EMAIL" | "WEBHOOK";
  target: string;
  label?: string;
  config?: Record<string, unknown>;
}

interface OutputDestinationsProps {
  agent: Agent;
  onUpdate: (a: Agent) => void;
}

export default function OutputDestinations({ agent, onUpdate }: OutputDestinationsProps) {
  const destinations = (agent.config as any)?.destinations ?? [];
  const [items, setItems] = useState<Destination[]>(destinations);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setItems(destinations);
  }, [agent.config]);

  const addEmail = () => {
    setItems([...items, { type: "EMAIL", target: "", label: "", config: {} }]);
  };

  const addWebhook = () => {
    setItems([...items, { type: "WEBHOOK", target: "", label: "", config: {} }]);
  };

  const updateItem = (index: number, field: keyof Destination, value: string) => {
    const updated = [...items];
    (updated as any)[index][field] = value;
    setItems(updated);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    const valid = items.filter((d) => d.target.trim());
    if (valid.length === 0 && items.length > 0) {
      toast.error("Please fill in target addresses or URLs");
      return;
    }
    setSaving(true);
    try {
      const res = await agentApi.update(agent.id, {
        config: {
          ...agent.config,
          destinations: valid,
        },
      });
      if (res.success) {
        onUpdate(res.data.agent);
        toast.success("Destinations saved");
      }
    } catch {
      toast.error("Failed to save destinations");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-sm uppercase tracking-wider text-muted-foreground">
              <Send size={16} />
              Output Destinations
            </CardTitle>
            <CardDescription>Deliver run results to email or webhook</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.length === 0 && (
          <p className="text-sm text-muted-foreground italic">
            No destinations configured. Results are only visible in the dashboard.
          </p>
        )}
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
            <div className="mt-1">
              {item.type === "EMAIL" ? (
                <Mail size={16} className="text-blue-500" />
              ) : (
                <Webhook size={16} className="text-purple-500" />
              )}
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                  {item.type}
                </span>
                <input
                  value={item.label}
                  onChange={(e) => updateItem(i, "label", e.target.value)}
                  placeholder="Label (optional)"
                  className="flex-1 text-xs bg-transparent border-b border-transparent hover:border-border focus:border-primary outline-none px-1 py-0.5"
                />
              </div>
              <input
                value={item.target}
                onChange={(e) => updateItem(i, "target", e.target.value)}
                placeholder={item.type === "EMAIL" ? "user@example.com" : "https://hooks.example.com/..."}
                className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm outline-none focus:border-primary"
              />
              {item.type === "EMAIL" && (
                <input
                  value={(item.config?.subject as string) ?? ""}
                  onChange={(e) => {
                    const updated = [...items];
                    updated[i] = { ...updated[i], config: { ...updated[i].config, subject: e.target.value } };
                    setItems(updated);
                  }}
                  placeholder='Subject (default: "[AI Agent] Agent Name - Run Complete")'
                  className="w-full px-3 py-1.5 rounded-lg bg-background border border-border text-xs outline-none focus:border-primary"
                />
              )}
            </div>
            <button
              onClick={() => removeItem(i)}
              className="p-1.5 rounded-md hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={addEmail} className="gap-1.5">
            <Mail size={14} /> Add Email
          </Button>
          <Button size="sm" variant="outline" onClick={addWebhook} className="gap-1.5">
            <Webhook size={14} /> Add Webhook
          </Button>
        </div>
        {items.length > 0 && (
          <Button className="w-full" onClick={handleSave} disabled={saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Destinations
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
