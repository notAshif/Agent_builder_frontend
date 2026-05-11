import { motion } from "framer-motion";
import { Cpu, Sparkles, Bug, Zap, Shield, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";

const releases = [
  {
    version: "v1.2.0", date: "May 8, 2026",
    badge: "Latest",
    badgeVariant: "success" as const,
    changes: [
      { type: "feature", text: "Prompt-to-Agent generation with intent inference" },
      { type: "feature", text: "Real-time execution monitor with streaming logs" },
      { type: "feature", text: "Visual flow graph for agent execution tracing" },
      { type: "enhancement", text: "Improved tool auto-selection accuracy" },
      { type: "fix", text: "Fixed tool execution routing for custom tool names" },
      { type: "fix", text: "Resolved login response parsing issue" },
    ],
  },
  {
    version: "v1.1.0", date: "April 22, 2026",
    badge: "",
    badgeVariant: "secondary" as const,
    changes: [
      { type: "feature", text: "Multi-provider AI support (GPT-4o, Claude)" },
      { type: "feature", text: "API key management dashboard" },
      { type: "feature", text: "OAuth integration (Google, GitHub)" },
      { type: "enhancement", text: "Agent blueprint builder with auto-generated workflows" },
      { type: "enhancement", text: "Paginated agent and run lists" },
    ],
  },
  {
    version: "v1.0.0", date: "April 5, 2026",
    badge: "",
    badgeVariant: "secondary" as const,
    changes: [
      { type: "feature", text: "Initial release of AgentBuilder platform" },
      { type: "feature", text: "Agent CRUD with configurable prompts and tools" },
      { type: "feature", text: "Supabase authentication with email/password" },
      { type: "feature", text: "Web search, email, and code execution tools" },
      { type: "feature", text: "Run history with execution logs" },
    ],
  },
];

const typeConfig = {
  feature: { icon: Sparkles, color: "text-emerald-400", label: "Feature" },
  enhancement: { icon: Zap, color: "text-amber-400", label: "Enhancement" },
  fix: { icon: Bug, color: "text-blue-400", label: "Fix" },
};

export default function Changelog() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-2 text-primary mb-4">
            <Cpu size={20} />
            <span className="text-xs font-bold uppercase tracking-widest">Changelog</span>
          </div>
          <h1 className="text-4xl font-bold mb-2">Release Notes</h1>
          <p className="text-muted-foreground mb-12">Every update shipped to make AgentBuilder better.</p>
        </motion.div>

        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
          <div className="space-y-12">
            {releases.map((release, i) => (
              <motion.div
                key={release.version}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="relative pl-12"
              >
                <div className="absolute left-2.5 top-2 w-3 h-3 rounded-full bg-primary border-2 border-background" />
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-xl font-bold">{release.version}</h2>
                  {release.badge && <Badge variant={release.badgeVariant}>{release.badge}</Badge>}
                  <span className="text-xs text-muted-foreground">{release.date}</span>
                </div>
                <div className="space-y-3">
                  {release.changes.map((change) => {
                    const config = typeConfig[change.type];
                    return (
                      <div key={change.text} className="flex items-start gap-3 text-sm">
                        <config.icon size={16} className={`${config.color} mt-0.5 shrink-0`} />
                        <span className="text-muted-foreground">{change.text}</span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-16 p-8 rounded-2xl border border-border bg-muted/30 text-center"
        >
          <Shield size={24} className="text-primary mx-auto mb-3" />
          <p className="text-sm font-medium">Stay updated</p>
          <p className="text-xs text-muted-foreground mt-1">New releases ship every 2-3 weeks.</p>
        </motion.div>
      </div>
    </div>
  );
}
