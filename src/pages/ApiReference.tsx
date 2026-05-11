import { motion } from "framer-motion";
import { Cpu, Code, Key, Shield, ArrowRight, ExternalLink } from "lucide-react";
import { Badge } from "../components/ui/Badge";

const endpoints = [
  {
    method: "POST", path: "/api/v1/auth/login", auth: false,
    desc: "Authenticate with email and password.",
  },
  {
    method: "POST", path: "/api/v1/auth/register", auth: false,
    desc: "Create a new account.",
  },
  {
    method: "GET", path: "/api/v1/agents", auth: true,
    desc: "List all agents for the authenticated user.",
  },
  {
    method: "POST", path: "/api/v1/agents", auth: true,
    desc: "Create a new agent with prompt, config, and tools.",
  },
  {
    method: "GET", path: "/api/v1/agents/:id", auth: true,
    desc: "Get detailed agent information.",
  },
  {
    method: "PATCH", path: "/api/v1/agents/:id", auth: true,
    desc: "Update agent configuration.",
  },
  {
    method: "DELETE", path: "/api/v1/agents/:id", auth: true,
    desc: "Delete an agent and all associated data.",
  },
  {
    method: "POST", path: "/api/v1/agents/:id/run", auth: true,
    desc: "Execute an agent with input text.",
  },
  {
    method: "GET", path: "/api/v1/tools", auth: true,
    desc: "List all available tools.",
  },
  {
    method: "GET", path: "/api/v1/runs/:id", auth: true,
    desc: "Get run status and output.",
  },
  {
    method: "GET", path: "/api/v1/runs/:id/logs", auth: true,
    desc: "Get streaming logs for a run.",
  },
  {
    method: "GET", path: "/api/v1/flows/:runId", auth: true,
    desc: "Get the execution flow graph.",
  },
];

const methodColors: Record<string, string> = {
  GET: "text-emerald-400",
  POST: "text-blue-400",
  PATCH: "text-amber-400",
  DELETE: "text-red-400",
};

export default function ApiReference() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-2 text-primary mb-4">
            <Code size={20} />
            <span className="text-xs font-bold uppercase tracking-widest">API Reference</span>
          </div>
          <h1 className="text-4xl font-bold mb-2">REST API</h1>
          <p className="text-muted-foreground mb-2">All API endpoints are prefixed with the base URL.</p>
          <div className="flex items-center gap-2 mb-12">
            <code className="px-3 py-1 rounded-lg bg-muted text-xs font-mono text-muted-foreground">http://localhost:8000</code>
            <Key size={14} className="text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Auth via Bearer token</span>
          </div>
        </motion.div>

        <div className="space-y-3">
          {endpoints.map((ep, i) => (
            <motion.div
              key={ep.path}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:border-primary/20 transition-colors"
            >
              <span className={`font-mono text-xs font-bold w-14 ${methodColors[ep.method]}`}>{ep.method}</span>
              <code className="flex-1 text-xs font-mono text-muted-foreground">{ep.path}</code>
              {!ep.auth && <Badge variant="outline" className="text-[10px]">Public</Badge>}
              <span className="text-xs text-muted-foreground hidden md:block max-w-xs truncate">{ep.desc}</span>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 p-6 rounded-2xl border border-border bg-muted/30"
        >
          <div className="flex items-center gap-2 mb-3">
            <Shield size={16} className="text-primary" />
            <span className="text-sm font-semibold">Authentication</span>
          </div>
          <p className="text-xs text-muted-foreground leading-6">
            All protected endpoints require a Bearer token in the Authorization header.
            Obtain your token by calling POST /api/v1/auth/login or through OAuth.
            Include it as: <code className="px-1.5 py-0.5 rounded bg-muted font-mono">Authorization: Bearer &lt;token&gt;</code>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
