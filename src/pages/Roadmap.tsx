import { motion } from "framer-motion";
import { CheckCircle2, Clock, Lightbulb } from "lucide-react";
import { Badge } from "../components/ui/Badge";

const roadmap = [
  {
    quarter: "Q2 2026", status: "In Progress",
    items: [
      "Multi-agent collaboration workflows",
      "Custom tool SDK for external developers",
      "Agent versioning and rollback support",
      "WebSocket-based real-time log streaming",
    ],
  },
  {
    quarter: "Q3 2026", status: "Planned",
    items: [
      "Visual drag-and-drop workflow builder",
      "Team collaboration with shared agent libraries",
      "Vector memory with RAG support (Upstash)",
      "Scheduled / cron-based agent triggers",
    ],
  },
  {
    quarter: "Q4 2026", status: "Planned",
    items: [
      "Self-hosted deployment option (Docker)",
      "Billing and usage-based plans",
      "Agent marketplace for community tools",
      "SOC 2 compliance certification",
    ],
  },
  {
    quarter: "2027+", status: "Future",
    items: [
      "On-device agent execution (edge runtime)",
      "Multi-modal agent support (vision, audio)",
      "Enterprise SSO and SCIM provisioning",
    ],
  },
];

export default function Roadmap() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-2 text-primary mb-4">
            <Lightbulb size={20} />
            <span className="text-xs font-bold uppercase tracking-widest">Roadmap</span>
          </div>
          <h1 className="text-4xl font-bold mb-2">What's Coming Next</h1>
          <p className="text-muted-foreground mb-12">A look at what we're building and what's ahead.</p>
        </motion.div>

        <div className="space-y-8">
          {roadmap.map((phase, i) => (
            <motion.div
              key={phase.quarter}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl border border-border bg-card p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold">{phase.quarter}</h2>
                  <Badge variant={phase.status === "In Progress" ? "success" : "secondary"}>
                    {phase.status}
                  </Badge>
                </div>
                {phase.status === "In Progress" && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock size={14} />
                    Actively developing
                  </div>
                )}
              </div>
              <div className="space-y-3">
                {phase.items.map((item) => (
                  <div key={item} className="flex items-start gap-3 text-sm">
                    <CheckCircle2 size={16} className="text-primary mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 p-8 rounded-2xl border border-dashed border-primary/30 bg-primary/5 text-center"
        >
          <Lightbulb size={24} className="text-primary mx-auto mb-2" />
          <p className="text-sm font-medium">Have a suggestion?</p>
          <p className="text-xs text-muted-foreground mt-1">We'd love to hear what you'd like to see next.</p>
        </motion.div>
      </div>
    </div>
  );
}
