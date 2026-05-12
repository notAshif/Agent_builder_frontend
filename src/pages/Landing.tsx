import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useRef } from "react";
import {
  ArrowRight, Bot, BrainCircuit, Cable, CheckCircle2, Cpu, Play, Sparkles, Workflow, Zap,
  MessageSquare, Code, Globe, Mail, Database, Search, Shield, BarChart3, Palette,
  Rocket, Layers, Terminal, ExternalLink, ChevronRight, FileText, Star
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

const testimonials = [
  {
    name: "Sarah Chen",
    role: "CTO at TechFlow",
    avatar: "SC",
    content: "AgentBuilder transformed how we build internal tools. What used to take weeks now takes hours.",
    rating: 5
  },
  {
    name: "Marcus Johnson",
    role: "Lead Engineer at DataCorp",
    avatar: "MJ",
    content: "The orchestration capabilities are incredible. We've automated 80% of our workflows with it.",
    rating: 5
  },
  {
    name: "Elena Rodriguez",
    role: "Product Manager at AI Labs",
    avatar: "ER",
    content: "Finally, a platform that makes AI agent development accessible without compromising on power.",
    rating: 5
  },
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

  return (
    <div className="min-h-screen overflow-hidden bg-[#0a0a0f] text-white">
      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-[#6366f1]/10 rounded-full blur-[150px] opacity-50" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-[#8b5cf6]/10 rounded-full blur-[120px] opacity-40" />
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-[#a855f7]/5 rounded-full blur-[100px] opacity-30" />
      </div>

      {/* Header */}
      <header className="fixed inset-x-0 top-0 z-50 glass">
        <nav className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center text-white shadow-lg shadow-[#6366f1]/30 group-hover:shadow-[#6366f1]/50 transition-all group-hover:scale-105">
              <Cpu size={20} />
            </div>
            <div>
              <span className="text-sm font-bold text-white tracking-tight">AgentBuilder</span>
              <span className="block text-[10px] text-slate-500 uppercase tracking-widest">AI Platform</span>
            </div>
          </Link>
          <div className="flex items-center gap-3">
                {isAuthenticated ? (
                  <>
                    <Link to="/dashboard">
                      <Button variant="ghost" size="sm">Dashboard</Button>
                    </Link>
                    <Link to="/agents">
                      <Button size="sm" className="gap-2">
                        My Agents
                        <ArrowRight size={15} />
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/auth/login">
                      <Button variant="ghost" size="sm">Sign in</Button>
                    </Link>
                    <Link to="/pricing">
                      <Button variant="ghost" size="sm">Pricing</Button>
                    </Link>
                    <Link to="/auth/register">
                      <Button size="sm" className="gap-2">
                        Get Started
                        <ArrowRight size={15} />
                      </Button>
                    </Link>
                  </>
                )}
              </div>
        </nav>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center overflow-hidden pt-[72px]">
          <div className="absolute inset-0">
            <img src={heroImage} alt="" className="h-full w-full object-cover opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f] via-[#0a0a0f]/90 to-[#0a0a0f]/60" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.15),transparent_70%)]" />
          </div>

          <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 px-6 py-16 lg:grid-cols-[1fr_0.9fr]">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="mb-6 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium text-[#6366f1]"
              >
                <Sparkles size={14} />
                Production-grade AI Agent Builder
              </motion.div>

              <h1 className="text-5xl font-black leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
                <span className="text-white">Build intelligent</span>
                <br />
                <span className="bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#a855f7] bg-clip-text text-transparent">AI Agents</span>
                <br />
                <span className="text-white">with natural language</span>
              </h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-slate-400 sm:text-lg">
                Design, run, and observe autonomous AI agents from one workspace.
                Describe what you need — the platform generates the agent, selects tools, configures memory, and deploys it instantly.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to="/auth/register">
                  <Button size="lg" className="w-full gap-2 sm:w-auto text-base shadow-xl shadow-[#6366f1]/30 hover:shadow-[#6366f1]/50 transition-shadow">
                    <Rocket size={20} />
                    Build Your First Agent
                    <ArrowRight size={18} />
                  </Button>
                </Link>
                <Link to="/auth/login">
                  <Button size="lg" variant="outline" className="w-full gap-2 border-white/10 bg-white/5 hover:bg-white/10 sm:w-auto">
                    <Play size={17} />
                    Launch Console
                  </Button>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="mt-8 flex items-center gap-4 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-400" />
                  <span>No credit card required</span>
                </div>
                <span className="w-px h-4 bg-white/10" />
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-400" />
                  <span>14-day free trial</span>
                </div>
                <span className="w-px h-4 bg-white/10" />
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-400" />
                  <span>SOC2 compliant</span>
                </div>
              </div>

              <div className="mt-12 grid grid-cols-4 gap-6 pt-8">
                {metrics.map((metric, i) => (
                  <motion.div
                    key={metric.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                  >
                    <p className="text-2xl font-bold text-white">{metric.value}</p>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-slate-500">{metric.label}</p>
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
                className="glass-card p-6 shadow-2xl"
              >
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-red-500/80" />
                    <span className="h-3 w-3 rounded-full bg-amber-400/80" />
                    <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
                  </div>
                  <span className="font-mono text-[10px] text-slate-500">agent_builder_session</span>
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
                          {index < 3 && <ChevronRight size={14} className="text-slate-600" />}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">{step.desc}</p>
                        <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/5">
                          <motion.div
                            className="h-full rounded-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6]"
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
                className="absolute -bottom-6 -left-8 glass-card p-4 max-w-[260px]"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <CheckCircle2 size={18} className="text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Agent Ready</p>
                    <p className="text-[11px] text-slate-400">3 tools · 4 workflow steps</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Capabilities bar */}
        <section className="relative z-10 border-y border-white/5 glass py-12">
          <div className="mx-auto max-w-7xl px-6">
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
                <div key={item.text} className="flex items-center gap-3 text-sm text-slate-400">
                  <div className="p-2 rounded-lg bg-[#6366f1]/10 border border-[#6366f1]/20">
                    <item.icon size={16} className="text-[#6366f1]" />
                  </div>
                  {item.text}
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section ref={featuresRef} className="py-28 relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.08),transparent_60%)]" />
          <div className="mx-auto max-w-7xl px-6 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              className="text-center mb-16"
            >
              <div className="mb-4 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium text-[#6366f1]">
                <Sparkles size={14} />
                Everything you need
              </div>
              <h2 className="text-4xl font-bold text-white">Enterprise-Grade Agent Platform</h2>
              <p className="mt-4 text-slate-400 max-w-2xl mx-auto">
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
                  className="glass-card p-6 group cursor-pointer"
                >
                  <div className="p-3 rounded-xl bg-gradient-to-br from-[#6366f1]/10 to-[#8b5cf6]/5 border border-[#6366f1]/20 text-[#6366f1] w-fit mb-4 group-hover:from-[#6366f1] group-hover:to-[#8b5cf6] group-hover:text-white transition-all duration-300">
                    <feature.icon size={22} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-slate-400 leading-6">{feature.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-24 border-y border-white/5 bg-[#0d0d0f]">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              className="text-center mb-16"
            >
              <div className="mb-4 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium text-amber-400">
                <Layers size={14} />
                From idea to execution
              </div>
              <h2 className="text-4xl font-bold text-white">How It Works</h2>
              <p className="mt-4 text-slate-400 max-w-2xl mx-auto">
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
                  color: "from-[#6366f1] to-[#8b5cf6]"
                },
                {
                  step: "02",
                  icon: Bot,
                  title: "Configure",
                  desc: "Review the auto-generated blueprint: tools, workflow, memory, and prompts. Fine-tune or accept.",
                  color: "from-[#8b5cf6] to-[#a855f7]"
                },
                {
                  step: "03",
                  icon: Rocket,
                  title: "Deploy & Monitor",
                  desc: "Launch your agent and watch it execute in real-time with streaming logs, tool traces, and flow graphs.",
                  color: "from-[#a855f7] to-emerald-400"
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
                    <div className="hidden md:block absolute top-12 -right-4 w-8 h-0.5 bg-gradient-to-r from-[#6366f1]/40 to-transparent" />
                  )}
                  <div className="glass-card p-8 h-full relative overflow-hidden">
                    <span className="text-[80px] font-black text-white/[0.03] absolute top-4 right-6 select-none">{item.step}</span>
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} p-0.5 mb-6 relative z-10`}>
                      <div className="w-full h-full rounded-2xl bg-[#0d0d0f] flex items-center justify-center">
                        <item.icon size={24} className="text-white" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 relative z-10">{item.title}</h3>
                    <p className="text-sm text-slate-400 leading-6 relative z-10">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Tools Showcase */}
        <section className="py-24 relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(99,102,241,0.06),transparent_50%)]" />
          <div className="mx-auto max-w-7xl px-6 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              className="text-center mb-16"
            >
              <div className="mb-4 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium text-emerald-400">
                <Cable size={14} />
                Integrated tool ecosystem
              </div>
              <h2 className="text-4xl font-bold text-white">Built-in Tools & Integrations</h2>
              <p className="mt-4 text-slate-400 max-w-2xl mx-auto">
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
                  className="glass-card p-5 group cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 rounded-xl bg-[#6366f1]/10 border border-[#6366f1]/20 text-[#6366f1] group-hover:bg-[#6366f1] group-hover:text-white group-hover:border-[#6366f1] transition-all duration-300">
                      <tool.icon size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-white">{tool.name}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{tool.desc}</p>
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

        {/* Testimonials */}
        <section className="py-24 border-y border-white/5 bg-[#0d0d0f]">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              className="text-center mb-16"
            >
              <div className="mb-4 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium text-amber-400">
                <Star size={14} />
                Loved by developers
              </div>
              <h2 className="text-4xl font-bold text-white">What Our Users Say</h2>
              <p className="mt-4 text-slate-400 max-w-2xl mx-auto">
                Join thousands of developers who are already building AI agents with AgentBuilder.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, i) => (
                <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card p-6"
                >
                  <div className="flex gap-1 mb-4">
                    {Array(testimonial.rating).fill(0).map((_, j) => (
                      <Star key={j} size={14} className="text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-slate-300 leading-6 mb-6">"{testimonial.content}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center text-white text-sm font-bold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{testimonial.name}</p>
                      <p className="text-xs text-slate-500">{testimonial.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative py-28 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#6366f1]/20 via-[#6366f1]/5 to-[#0a0a0f]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.15),transparent_60%)]" />
          <div className="mx-auto max-w-4xl px-6 text-center relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-[#6366f1]/30 animate-pulse-glow">
                <Cpu size={40} className="text-white" />
              </div>
              <h2 className="text-4xl sm:text-5xl font-black text-white leading-tight">
                Ready to build your first{" "}
                <span className="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] bg-clip-text text-transparent">
                  AI agent?
                </span>
              </h2>
              <p className="mt-6 text-lg text-slate-400 max-w-2xl mx-auto">
                Join thousands of developers using AgentBuilder to design, deploy, and monitor autonomous AI agents.
                No complex setup. Just describe what you need.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/auth/register">
                  <Button size="lg" className="gap-2 text-base shadow-2xl shadow-[#6366f1]/30">
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
              <p className="mt-6 text-xs text-slate-600">No credit card required. Full access during trial.</p>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/5 bg-[#0a0a0f] py-16 relative">
          <div className="mx-auto max-w-7xl px-6 relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="col-span-2 md:col-span-1">
                <Link to="/" className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center text-white">
                    <Cpu size={16} />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-white">AgentBuilder</span>
                </Link>
                <p className="text-xs text-slate-600 leading-5 max-w-xs">
                  Build, deploy, and monitor AI agents from one workspace. Powered by GPT-4o, Claude, and more.
                </p>
                <div className="flex items-center gap-3 mt-4">
                  <a href="#" className="text-slate-600 hover:text-[#6366f1] transition-colors">
                    <ExternalLink size={18} />
                  </a>
                  <a href="#" className="text-slate-600 hover:text-[#6366f1] transition-colors">
                    <MessageSquare size={18} />
                  </a>
                </div>
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Product</h4>
                <ul className="space-y-2">
                  <li><Link to="/auth/register" className="text-xs text-slate-600 hover:text-[#6366f1] transition-colors">Get Started</Link></li>
                  <li><Link to="/auth/login" className="text-xs text-slate-600 hover:text-[#6366f1] transition-colors">Sign In</Link></li>
                  <li><Link to="/pricing" className="text-xs text-slate-600 hover:text-[#6366f1] transition-colors">Pricing</Link></li>
                  <li><Link to="/changelog" className="text-xs text-slate-600 hover:text-[#6366f1] transition-colors">Changelog</Link></li>
                  <li><Link to="/roadmap" className="text-xs text-slate-600 hover:text-[#6366f1] transition-colors">Roadmap</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Resources</h4>
                <ul className="space-y-2">
                  <li><Link to="/docs" className="text-xs text-slate-600 hover:text-[#6366f1] transition-colors">Documentation</Link></li>
                  <li><Link to="/api-reference" className="text-xs text-slate-600 hover:text-[#6366f1] transition-colors">API Reference</Link></li>
                  <li><Link to="/guides" className="text-xs text-slate-600 hover:text-[#6366f1] transition-colors">Guides</Link></li>
                  <li><Link to="/support" className="text-xs text-slate-600 hover:text-[#6366f1] transition-colors">Support</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Company</h4>
                <ul className="space-y-2">
                  <li><Link to="/about" className="text-xs text-slate-600 hover:text-[#6366f1] transition-colors">About</Link></li>
                  <li><Link to="/blog" className="text-xs text-slate-600 hover:text-[#6366f1] transition-colors">Blog</Link></li>
                  <li><Link to="/privacy" className="text-xs text-slate-600 hover:text-[#6366f1] transition-colors">Privacy</Link></li>
                  <li><Link to="/terms" className="text-xs text-slate-600 hover:text-[#6366f1] transition-colors">Terms</Link></li>
                </ul>
              </div>
            </div>
            <div className="mt-12 pt-8 border-t border-white/5 text-center">
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-700">
                &copy; {new Date().getFullYear()} AgentBuilder. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}