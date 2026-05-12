import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Check, Sparkles, Zap, Shield, Bot, ArrowRight, Cpu, Users, Clock, Code, Database, Mail } from "lucide-react";
import { Button } from "../components/ui/Button";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started and experimenting with AI agents.",
    features: [
      "3 active agents",
      "1,000 runs per month",
      "Basic tools (web search, calculator)",
      "Community support",
      "7-day run history",
    ],
    notIncluded: [
      "Custom tools",
      "Scheduled runs",
      "Priority support",
      "API access",
    ],
    cta: "Start Free",
    href: "/auth/register",
    popular: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "per month",
    description: "For developers and teams building production AI workflows.",
    features: [
      "Unlimited active agents",
      "50,000 runs per month",
      "All built-in tools",
      "Custom webhook tools",
      "Scheduled agent runs",
      "30-day run history",
      "Priority email support",
      "API access",
    ],
    notIncluded: [
      "White-label solution",
    ],
    cta: "Get Pro",
    href: "/auth/register?plan=pro",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "contact us",
    description: "For organizations with advanced security and scale requirements.",
    features: [
      "Everything in Pro",
      "Unlimited runs",
      "SSO / SAML authentication",
      "Custom model integrations",
      "Dedicated support manager",
      "99.9% SLA guarantee",
      "White-label option",
      "Custom contract & invoicing",
    ],
    notIncluded: [],
    cta: "Contact Sales",
    href: "/support",
    popular: false,
  },
];

const comparisons = [
  {
    category: "Agents & Execution",
    items: [
      { feature: "Active agents", free: "3", pro: "Unlimited", enterprise: "Unlimited" },
      { feature: "Monthly runs", free: "1,000", pro: "50,000", enterprise: "Unlimited" },
      { feature: "Tool executions", free: "5,000", pro: "250,000", enterprise: "Unlimited" },
      { feature: "Max concurrent runs", free: "1", pro: "10", enterprise: "Unlimited" },
    ],
  },
  {
    category: "Tools & Integrations",
    items: [
      { feature: "Built-in tools", free: "5", pro: "20+", enterprise: "20+" },
      { feature: "Custom webhook tools", free: false, pro: true, enterprise: true },
      { feature: "OAuth integrations", free: false, pro: true, enterprise: true },
      { feature: "API access", free: false, pro: true, enterprise: true },
    ],
  },
  {
    category: "Support & Security",
    items: [
      { feature: "Support", free: "Community", pro: "Priority email", enterprise: "Dedicated manager" },
      { feature: "Run history", free: "7 days", pro: "30 days", enterprise: "Unlimited" },
      { feature: "SSO / SAML", free: false, pro: false, enterprise: true },
      { feature: "SLA guarantee", free: false, pro: false, enterprise: "99.9%" },
    ],
  },
];

const faqs = [
  {
    question: "Can I switch plans anytime?",
    answer: "Yes! You can upgrade or downgrade your plan at any time. Upgrades take effect immediately, and downgrades take effect at the start of your next billing cycle.",
  },
  {
    question: "What happens if I exceed my run limit?",
    answer: "On the Free plan, additional runs are queued. On Pro, additional runs are charged at $0.001 per run. You'll receive notifications before hitting limits.",
  },
  {
    question: "Do you offer discounts for startups or nonprofits?",
    answer: "Yes! We offer 50% off for verified startups and nonprofits. Contact our sales team with your organization details.",
  },
  {
    question: "Is my data used to train AI models?",
    answer: "No. Your prompts, agent configurations, and outputs are never used to train models. You retain full ownership of all data.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, Mastercard, Amex), PayPal, and wire transfer for Enterprise annual contracts.",
  },
];

export default function Pricing() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-[#6366f1]/10 rounded-full blur-[150px] opacity-50" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-[#8b5cf6]/10 rounded-full blur-[120px] opacity-40" />
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium text-[#6366f1] mb-6">
              <Sparkles size={14} />
              Simple, transparent pricing
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Build AI agents at any scale
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-8">
              Start free, scale as you grow. No hidden fees, no surprises.
              Cancel anytime.
            </p>
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mt-12">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`glass-card p-6 relative ${plan.popular ? "border-[#6366f1]/50 scale-105" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] rounded-full text-xs font-semibold">
                    Most Popular
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-white">{plan.price}</span>
                    {plan.period !== "custom" && (
                      <span className="text-slate-500 text-sm">/{plan.period}</span>
                    )}
                  </div>
                  <p className="text-sm text-slate-400 mt-2">{plan.description}</p>
                </div>

                <Link to={plan.href}>
                  <Button
                    variant={plan.popular ? "primary" : "secondary"}
                    className="w-full mb-6"
                  >
                    {plan.cta}
                  </Button>
                </Link>

                <div className="space-y-3">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3 text-sm">
                      <div className="p-0.5 rounded-full bg-emerald-500/10 mt-0.5">
                        <Check size={14} className="text-emerald-400" />
                      </div>
                      <span className="text-slate-300">{feature}</span>
                    </div>
                  ))}
                  {plan.notIncluded.map((feature) => (
                    <div key={feature} className="flex items-start gap-3 text-sm opacity-50">
                      <div className="p-0.5 rounded-full bg-white/5 mt-0.5">
                        <span className="text-slate-500">-</span>
                      </div>
                      <span className="text-slate-500">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Comparison Table */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Compare Plans</h2>
            <p className="text-slate-400">See exactly what's included in each plan.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card overflow-hidden"
          >
            <div className="grid grid-cols-4 gap-4 p-4 border-b border-white/10 bg-white/5">
              <div className="font-semibold text-slate-400">Feature</div>
              <div className="font-semibold text-center text-white">Free</div>
              <div className="font-semibold text-center text-[#6366f1]">Pro</div>
              <div className="font-semibold text-center text-white">Enterprise</div>
            </div>

            {comparisons.map((group) => (
              <div key={group.category}>
                <div className="p-4 bg-white/[0.02] font-semibold text-sm text-slate-400 border-b border-white/5">
                  {group.category}
                </div>
                {group.items.map((item) => (
                  <div key={item.feature} className="grid grid-cols-4 gap-4 p-4 border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <div className="text-sm text-slate-300">{item.feature}</div>
                    <div className="text-sm text-center">
                      {typeof item.free === "boolean" ? (
                        item.free ? (
                          <Check size={18} className="mx-auto text-emerald-400" />
                        ) : (
                          <span className="text-slate-600">-</span>
                        )
                      ) : (
                        <span className="text-slate-400">{item.free}</span>
                      )}
                    </div>
                    <div className="text-sm text-center">
                      {typeof item.pro === "boolean" ? (
                        item.pro ? (
                          <Check size={18} className="mx-auto text-emerald-400" />
                        ) : (
                          <span className="text-slate-600">-</span>
                        )
                      ) : (
                        <span className="text-slate-400">{item.pro}</span>
                      )}
                    </div>
                    <div className="text-sm text-center">
                      {typeof item.enterprise === "boolean" ? (
                        item.enterprise ? (
                          <Check size={18} className="mx-auto text-emerald-400" />
                        ) : (
                          <span className="text-slate-600">-</span>
                        )
                      ) : (
                        <span className="text-slate-400">{item.enterprise}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </motion.div>
        </section>

        {/* Features Highlight */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Everything you need to build AI agents</h2>
            <p className="text-slate-400">Powerful features included in every plan.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Bot, title: "Visual Agent Studio", desc: "Build complex workflows with drag-and-drop node editor" },
              { icon: Zap, title: "Real-Time Monitoring", desc: "Live streaming logs and execution traces" },
              { icon: Code, title: "Multi-Provider AI", desc: "Switch between GPT-4o, Claude, Gemini, and more" },
              { icon: Shield, title: "Enterprise Security", desc: "SOC2 compliant with OAuth and API key management" },
              { icon: Clock, title: "Scheduled Runs", desc: "Set up cron-based agent execution" },
              { icon: Database, title: "Memory & Context", desc: "Built-in short-term and long-term memory" },
              { icon: Mail, title: "Output Delivery", desc: "Send results via email, webhooks, or APIs" },
              { icon: Users, title: "Team Collaboration", desc: "Share agents and manage team access" },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="glass-card p-5"
              >
                <div className="p-3 rounded-xl bg-[#6366f1]/10 border border-[#6366f1]/20 text-[#6366f1] w-fit mb-4">
                  <feature.icon size={20} />
                </div>
                <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-slate-400">Got questions? We've got answers.</p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="glass-card p-6"
              >
                <h3 className="font-semibold text-white mb-2">{faq.question}</h3>
                <p className="text-sm text-slate-400">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card p-12"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center mx-auto mb-6">
              <Cpu size={32} className="text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Ready to build your first AI agent?</h2>
            <p className="text-lg text-slate-400 mb-8 max-w-xl mx-auto">
              Join thousands of developers using AgentBuilder to design, deploy, and monitor autonomous AI agents.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth/register">
                <Button size="lg" className="gap-2">
                  Start Building Free
                  <ArrowRight size={18} />
                </Button>
              </Link>
              <Link to="/support">
                <Button size="lg" variant="secondary" className="gap-2">
                  Talk to Sales
                </Button>
              </Link>
            </div>
          </motion.div>
        </section>

        {/* Footer CTA */}
        <footer className="border-t border-white/5 py-8 px-4 text-center">
          <p className="text-sm text-slate-500">
            All prices in USD. Taxes may apply.{" "}
            <Link to="/terms" className="text-[#6366f1] hover:underline">Terms of Service</Link>
            {" "}and{" "}
            <Link to="/privacy" className="text-[#6366f1] hover:underline">Privacy Policy</Link>.
          </p>
        </footer>
      </div>
    </div>
  );
}