import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { BookOpen, Terminal, Bot, Wrench, Zap, Shield, ArrowRight } from "lucide-react";
import { Button } from "../components/ui/Button";

const sections = [
  { icon: Bot, title: "Getting Started", desc: "Create your first agent in under 5 minutes.", href: "/docs/getting-started" },
  { icon: Terminal, title: "Agent Execution", desc: "Understand how agents run, retry, and report results.", href: "/docs/execution" },
  { icon: Wrench, title: "Tools Reference", desc: "All built-in tools and how to configure them.", href: "/docs/tools" },
  { icon: BookOpen, title: "Prompts & Blueprints", desc: "Best practices for agent prompts and auto-generated blueprints.", href: "/docs/prompts" },
  { icon: Zap, title: "Workflow Builder", desc: "Design multi-step agent workflows with conditions and loops.", href: "/docs/workflows" },
  { icon: Shield, title: "Security & Auth", desc: "Authentication, API keys, and access control.", href: "/docs/security" },
];

export default function Documentation() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-2 text-primary mb-4">
            <BookOpen size={20} />
            <span className="text-xs font-bold uppercase tracking-widest">Documentation</span>
          </div>
          <h1 className="text-4xl font-bold mb-2">Welcome to AgentBuilder Docs</h1>
          <p className="text-muted-foreground mb-12">Everything you need to build and deploy AI agents.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section, i) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ y: -4 }}
              className="rounded-2xl border border-border bg-card p-6 hover:border-primary/30 transition-all group"
            >
              <div className="p-3 rounded-xl bg-primary/10 text-primary w-fit mb-4 group-hover:bg-primary group-hover:text-white transition-all">
                <section.icon size={22} />
              </div>
              <h3 className="font-bold mb-1">{section.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{section.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 text-center"
        >
          <Terminal size={24} className="text-primary mx-auto mb-3" />
          <p className="text-lg font-bold mb-1">Quick Start</p>
          <p className="text-sm text-muted-foreground mb-4">Run your first agent right from the dashboard.</p>
          <Link to="/agents/new">
            <Button className="gap-2">
              Create an Agent
              <ArrowRight size={16} />
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
