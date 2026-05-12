import { motion } from "framer-motion";
import { Shield } from "lucide-react";

const sections = [
  { title: "Information We Collect", content: "We collect information you provide when creating an account (name, email) and data generated through agent usage (prompts, outputs, execution logs)." },
  { title: "How We Use Your Data", content: "Your data is used to operate the platform, improve agent performance, and provide customer support. Execution logs are retained for run history and debugging." },
  { title: "Data Storage & Security", content: "All data is encrypted at rest and in transit. We use Supabase for authentication and database hosting with enterprise-grade security measures." },
  { title: "Third-Party Services", content: "The platform integrates with OpenAI, Anthropic, Tavily, Resend, and E2B for agent execution. Data sent to these services is limited to what's necessary for execution." },
  { title: "Your Rights", content: "You can request data export, account deletion, or correction at any time by contacting support." },
  { title: "Changes to This Policy", content: "We may update this policy from time to time. Significant changes will be communicated via email or platform notification." },
];

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-2 text-primary mb-4">
            <Shield size={20} />
            <span className="text-xs font-bold uppercase tracking-widest">Privacy</span>
          </div>
          <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-muted-foreground mb-2">Last updated: May 11, 2026</p>
          <p className="text-sm text-muted-foreground mb-12">Your privacy matters to us. This policy explains how we collect, use, and protect your information.</p>
        </motion.div>

        <div className="space-y-8">
          {sections.map((section, i) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <h2 className="text-lg font-bold mb-2">{section.title}</h2>
              <p className="text-sm text-muted-foreground leading-7">{section.content}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
