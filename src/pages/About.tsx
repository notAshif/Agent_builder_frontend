import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Cpu, Rocket, Users, Shield, Zap, ArrowRight } from "lucide-react";
import { Button } from "../components/ui/Button";

const values = [
  { icon: Rocket, title: "Speed", desc: "From idea to deployed agent in minutes, not days." },
  { icon: Users, title: "Developer First", desc: "Built by developers, for developers. Clean APIs, clear docs." },
  { icon: Shield, title: "Enterprise Grade", desc: "Security, reliability, and scalability out of the box." },
  { icon: Zap, title: "AI-Native", desc: "Every feature designed around the capabilities of modern LLMs." },
];

export default function About() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-2 text-primary mb-4">
            <Cpu size={20} />
            <span className="text-xs font-bold uppercase tracking-widest">About</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">Building the Future of AI Agents</h1>
          <p className="text-muted-foreground text-lg leading-8 mb-12">
            AgentBuilder is a production-grade platform for designing, deploying, and monitoring autonomous AI agents.
            We believe the future of software is agentic — AI systems that understand intent, use tools, and execute complex workflows autonomously.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl border border-border bg-card p-6"
            >
              <div className="p-3 rounded-xl bg-primary/10 text-primary w-fit mb-3">
                <v.icon size={22} />
              </div>
              <h3 className="font-bold mb-1">{v.title}</h3>
              <p className="text-sm text-muted-foreground">{v.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 p-8 text-center"
        >
          <h2 className="text-2xl font-bold mb-3">Start building today</h2>
          <p className="text-sm text-muted-foreground mb-6">No credit card required. Full platform access during trial.</p>
          <Link to="/auth/register">
            <Button size="lg" className="gap-2">
              <Rocket size={20} />
              Get Started Free
              <ArrowRight size={18} />
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
