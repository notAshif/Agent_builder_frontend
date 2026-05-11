import { Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useRef } from "react";
import {
  ArrowRight, Bot, BrainCircuit, Cable, CheckCircle2, Cpu, Play, Sparkles, Workflow, Zap,
  MessageSquare, Code, Globe, Mail, Database, Search, Shield, BarChart3, Palette,
  Rocket, Layers, Terminal, ExternalLink, ChevronRight, FileText
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { useAuthStore } from "../stores/authStore";
import heroImage from "../assets/hero.png";

const metrics = [
  { value: "14k", label: "Agent Runs" },
  { value: "42", label: "Tool Integrations" },
  { value: "99.9%", label: "Uptime" },
  { value: "8+", label: "AI Models" },
];

const steps = [
  { icon: MessageSquare, label: "Describe", desc: "Type what you want in plain English", color: "text-cyan-300" },
  { icon: BrainCircuit, label: "Reason", desc: "AI analyzes intent and plans execution", color: "text-violet-300" },
  { icon: Cable, label: "Call tools", desc: "Auto-selects and chains the right tools", color: "text-amber-300" },
  { icon: CheckCircle2, label: "Ship output", desc: "Delivers results with full traceability", color: "text-emerald-300" },
];

const features = [
  { icon: Zap, title: "Prompt-to-Agent", desc: "Type 'Build an email draft agent' — the system auto-generates architecture, tools, and workflow from natural language." },
  { icon: Bot, title: "Visual Agent Studio", desc: "Drag-and-drop node editor to design complex agent workflows with loops, conditions, retry logic, and parallel execution." },
  { icon: Workflow, title: "Smart Tool Orchestration", desc: "AI automatically selects and chains the right tools — email, code execution, web search, APIs — based on task intent." },
  { icon: Terminal, title: "Real-Time Execution Monitor", desc: "Live streaming logs, tool execution timelines, token usage, and flow graph updates as your agent runs." },
  { icon: Globe, title: "Multi-Provider AI", desc: "Supports GPT-4o, Claude Sonnet, and more. Switch models per agent or let the system pick the best fit." },
  { icon: Database, title: "Memory & Context", desc: "Built-in short-term and long-term memory with vector storage support for RAG and persistent context." },
  { icon: Shield, title: "Enterprise Security", desc: "Supabase auth with OAuth (Google, GitHub), API key management, and role-based access control." },
  { icon: BarChart3, title: "Analytics & Observability", desc: "Detailed run history, success rates, latency metrics, token usage tracking, and execution graphs." },
  { icon: Palette, title: "Custom Tools", desc: "Create REST API tools, webhooks, code executors, database queries, or MCP-style tools — all from the dashboard." },
];

const toolsList = [
  { icon: Search, name: "Web Search", desc: "Real-time web and news search via Tavily API" },
  { icon: Mail, name: "Email", desc: "Send transactional emails via Resend integration" },
  { icon: Code, name: "Code Execution", desc: "Run Python/JS in isolated E2B sandboxes" },
  { icon: Globe, name: "API Calls", desc: "Make HTTP requests to any external service" },
  { icon: Database, name: "Database Query", desc: "Execute SQL queries against connected databases" },
  { icon: FileText, name: "File Processing", desc: "Read, write, and transform files on the server" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function Landing() {
  const { isAuthenticated } = useAuthStore();
  const featuresRef = useRef(null);

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen overflow-hidden bg-background text-foreground">
      <header className="fixed inset-x-0 top-0 z-30 border-b border-white/5 bg-background/80 backdrop-blur-2xl">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3 group">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/30 group-hover:shadow-primary/50 transition-all group-hover:scale-105">
              <Cpu size={19} />
            </span>
            <span className="text-sm font-bold uppercase tracking-[0.2em]">AgentBuilder</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/auth/login">
              <Button variant="ghost" size="sm">Sign in</Button>
            </Link>
            <Link to="/auth/register">
              <Button size="sm" className="gap-2">
                Get Started
                <ArrowRight size={15} />
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero */}
        <section className="relative min-h-screen flex items-center overflow-hidden">
          <div className="absolute inset-0">
            <img src={heroImage} alt="" className="h-full w-full object-cover opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/60" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.15),transparent_70%)]" />
            <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-background to-transparent" />
          </div>

          <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 px-4 pt-24 pb-16 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary backdrop-blur"
              >
                <Sparkles size={14} className="text-primary" />
                Production-grade AI Agent Builder
              </motion.div>

              <h1 className="text-5xl font-black leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
                <span className="text-white">Build intelligent</span>
                <br />
                <span className="bg-gradient-to-r from-primary via-purple-400 to-cyan-400 bg-clip-text text-transparent">AI Agents</span>
                <br />
                <span className="text-white">with natural language</span>
              </h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-zinc-400 sm:text-lg">
                Design, run, and observe autonomous AI agents from one workspace.
                Describe what you need — the platform generates the agent, selects tools, configures memory, and deploys it instantly.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to="/auth/register">
                  <Button size="lg" className="w-full gap-2 sm:w-auto text-base shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-shadow">
                    <Rocket size={20} />
                    Build Your First Agent
                    <ArrowRight size={18} />
                  </Button>
                </Link>
                <Link to="/auth/login">
                  <Button size="lg" variant="outline" className="w-full gap-2 border-white/15 bg-white/5 hover:bg-white/10 sm:w-auto">
                    <Play size={17} />
                    Launch Console
                  </Button>
                </Link>
              </div>

              <div className="mt-12 grid grid-cols-4 gap-6 border-t border-white/5 pt-8">
                {metrics.map((metric) => (
                  <motion.div
                    key={metric.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + metrics.indexOf(metric) * 0.1 }}
                  >
                    <p className="text-2xl font-bold bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">{metric.value}</p>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-zinc-500">{metric.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Animated terminal card */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              className="relative hidden lg:block"
            >
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="rounded-2xl border border-white/10 bg-[#151515]/90 p-5 shadow-2xl shadow-black/50 backdrop-blur-2xl"
              >
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-red-500/80" />
                    <span className="h-3 w-3 rounded-full bg-amber-400/80" />
                    <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
                  </div>
                  <span className="font-mono text-[10px] text-zinc-500">agent_builder_session</span>
                </div>
                <div className="space-y-3">
                  {steps.map((step, index) => (
                    <motion.div
                      key={step.label}
                      initial={{ opacity: 0.4, x: 16 }}
                      animate={{ opacity: [0.5, 1, 0.5], x: 0 }}
                      transition={{ duration: 3, repeat: Infinity, delay: index * 0.6, ease: "easeInOut" }}
                      className="flex items-center gap-4 rounded-xl border border-white/5 bg-white/[0.03] p-4 hover:bg-white/[0.06] transition-colors"
                    >
                      <div className="p-2 rounded-lg bg-white/5">
                        <step.icon className={step.color} size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold text-white">{step.label}</p>
                          {index < 3 && <ChevronRight size={14} className="text-zinc-600" />}
                        </div>
                        <p className="text-[11px] text-zinc-500 mt-0.5">{step.desc}</p>
                        <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/5">
                          <motion.div
                            className="h-full rounded-full bg-gradient-to-r from-primary to-purple-500"
                            animate={{ width: ["20%", "95%", "20%"] }}
                            transition={{ duration: 3.5, repeat: Infinity, delay: index * 0.5 }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-6 -left-8 w-64 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 backdrop-blur-2xl"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/20">
                    <CheckCircle2 size={18} className="text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Agent Ready</p>
                    <p className="text-[11px] text-emerald-200/60">3 tools · 4 workflow steps</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Capabilities bar */}
        <section className="relative z-10 -mt-24 border-y border-white/5 bg-[#121212] py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6"
            >
              {[
                { icon: Zap, text: "Multi-step agent orchestration" },
                { icon: Terminal, text: "Run history & execution traces" },
                { icon: Bot, text: "Tool assignment per agent" },
                { icon: Shield, text: "API keys for external workflows" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3 text-sm text-zinc-400">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <item.icon size={16} className="text-primary" />
                  </div>
                  {item.text}
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Features */}
        <section ref={featuresRef} className="py-28 relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.08),transparent_60%)]" />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary mb-4">
                <Sparkles size={14} />
                Everything you need
              </div>
              <h2 className="text-4xl font-bold text-white">Enterprise-Grade Agent Platform</h2>
              <p className="mt-4 text-zinc-400 max-w-2xl mx-auto">
                From prompt-to-agent generation to real-time execution monitoring — build production AI agents in minutes.
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {features.map((feature) => (
                <motion.div
                  key={feature.title}
                  variants={itemVariants}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  className="group rounded-2xl border border-white/5 bg-card p-6 hover:border-primary/20 hover:bg-primary/[0.02] transition-all duration-300"
                >
                  <div className="p-3 rounded-xl bg-primary/10 text-primary w-fit mb-4 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <feature.icon size={22} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-zinc-400 leading-6">{feature.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-24 border-y border-white/5 bg-[#0d0d0d]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-1.5 text-xs font-medium text-amber-400 mb-4">
                <Layers size={14} />
                From idea to execution
              </div>
              <h2 className="text-4xl font-bold text-white">How It Works</h2>
              <p className="mt-4 text-zinc-400 max-w-2xl mx-auto">
                Three simple steps from describing your agent to watching it run.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {[
                {
                  step: "01",
                  icon: MessageSquare,
                  title: "Describe",
                  desc: "Type what you need in natural language — 'Build a customer support agent that drafts replies from tickets'",
                  color: "from-primary to-purple-500"
                },
                {
                  step: "02",
                  icon: Bot,
                  title: "Configure",
                  desc: "Review the auto-generated blueprint: tools, workflow, memory, and prompts. Fine-tune or accept.",
                  color: "from-purple-500 to-cyan-400"
                },
                {
                  step: "03",
                  icon: Rocket,
                  title: "Deploy & Monitor",
                  desc: "Launch your agent and watch it execute in real-time with streaming logs, tool traces, and flow graphs.",
                  color: "from-cyan-400 to-emerald-400"
                },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: i * 0.15, duration: 0.5 }}
                  className="relative"
                >
                  {i < 2 && (
                    <div className="hidden md:block absolute top-12 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary/40 to-transparent" />
                  )}
                  <div className="rounded-2xl border border-white/5 bg-card p-8 h-full">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} p-0.5 mb-6`}>
                      <div className="w-full h-full rounded-2xl bg-card flex items-center justify-center">
                        <item.icon size={24} className="text-white" />
                      </div>
                    </div>
                    <span className="text-5xl font-black text-white/5 absolute top-4 right-6">{item.step}</span>
                    <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                    <p className="text-sm text-zinc-400 leading-6">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Tools Showcase */}
        <section className="py-24 relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(99,102,241,0.06),transparent_50%)]" />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-xs font-medium text-emerald-400 mb-4">
                <Cable size={14} />
                Integrated tool ecosystem
              </div>
              <h2 className="text-4xl font-bold text-white">Built-in Tools & Integrations</h2>
              <p className="mt-4 text-zinc-400 max-w-2xl mx-auto">
                Every agent comes with a growing library of tools. Let the AI choose — or pick manually.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {toolsList.map((tool, i) => (
                <motion.div
                  key={tool.name}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  whileHover={{ y: -4 }}
                  className="rounded-xl border border-white/5 bg-card p-5 hover:border-primary/20 hover:bg-primary/[0.02] transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                      <tool.icon size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-white">{tool.name}</p>
                      <p className="text-xs text-zinc-500 mt-0.5">{tool.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-10 text-center"
            >
              <Link to="/auth/register">
                <Button variant="outline" className="gap-2 border-white/10">
                  View all tools
                  <ArrowRight size={16} />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative py-28 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/5 to-background" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.15),transparent_60%)]" />
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-primary/30">
                <Cpu size={40} className="text-white" />
              </div>
              <h2 className="text-4xl sm:text-5xl font-black text-white leading-tight">
                Ready to build your first{" "}
                <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                  AI agent?
                </span>
              </h2>
              <p className="mt-6 text-lg text-zinc-400 max-w-2xl mx-auto">
                Join thousands of developers using AgentBuilder to design, deploy, and monitor autonomous AI agents.
                No complex setup. Just describe what you need.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/auth/register">
                  <Button size="lg" className="gap-2 text-base shadow-2xl shadow-primary/30">
                    <Rocket size={20} />
                    Get Started Free
                    <ArrowRight size={18} />
                  </Button>
                </Link>
                <Link to="/auth/login">
                  <Button size="lg" variant="outline" className="gap-2 border-white/10">
                    <Play size={18} />
                    Sign In
                  </Button>
                </Link>
              </div>
              <p className="mt-6 text-xs text-zinc-600">No credit card required. Full access during trial.</p>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/5 bg-[#0a0a0a] py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="col-span-2 md:col-span-1">
                <Link to="/" className="flex items-center gap-2 mb-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
                    <Cpu size={16} />
                  </span>
                  <span className="text-xs font-bold uppercase tracking-[0.2em]">AgentBuilder</span>
                </Link>
                <p className="text-xs text-zinc-600 leading-5 max-w-xs">
                  Build, deploy, and monitor AI agents from one workspace. Powered by GPT-4o, Claude, and more.
                </p>
                <div className="flex items-center gap-3 mt-4">
                  <a href="#" className="text-zinc-600 hover:text-primary transition-colors">
                    <ExternalLink size={18} />
                  </a>
                  <a href="#" className="text-zinc-600 hover:text-primary transition-colors">
                    <MessageSquare size={18} />
                  </a>
                </div>
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-4">Product</h4>
                <ul className="space-y-2">
                  <li><Link to="/auth/register" className="text-xs text-zinc-600 hover:text-primary transition-colors">Get Started</Link></li>
                  <li><Link to="/auth/login" className="text-xs text-zinc-600 hover:text-primary transition-colors">Sign In</Link></li>
                  <li><Link to="/changelog" className="text-xs text-zinc-600 hover:text-primary transition-colors">Changelog</Link></li>
                  <li><Link to="/roadmap" className="text-xs text-zinc-600 hover:text-primary transition-colors">Roadmap</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-4">Resources</h4>
                <ul className="space-y-2">
                  <li><Link to="/docs" className="text-xs text-zinc-600 hover:text-primary transition-colors">Documentation</Link></li>
                  <li><Link to="/api-reference" className="text-xs text-zinc-600 hover:text-primary transition-colors">API Reference</Link></li>
                  <li><Link to="/guides" className="text-xs text-zinc-600 hover:text-primary transition-colors">Guides</Link></li>
                  <li><Link to="/support" className="text-xs text-zinc-600 hover:text-primary transition-colors">Support</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-4">Company</h4>
                <ul className="space-y-2">
                  <li><Link to="/about" className="text-xs text-zinc-600 hover:text-primary transition-colors">About</Link></li>
                  <li><Link to="/blog" className="text-xs text-zinc-600 hover:text-primary transition-colors">Blog</Link></li>
                  <li><Link to="/privacy" className="text-xs text-zinc-600 hover:text-primary transition-colors">Privacy</Link></li>
                  <li><Link to="/terms" className="text-xs text-zinc-600 hover:text-primary transition-colors">Terms</Link></li>
                </ul>
              </div>
            </div>
            <div className="mt-12 pt-8 border-t border-white/5 text-center">
              <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-700">
                &copy; {new Date().getFullYear()} AgentBuilder. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
