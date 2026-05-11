import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Cpu, MessageSquare, Mail, BookOpen, Search, Send, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Textarea } from "../components/ui/Textarea";
import { toast } from "sonner";

export default function Support() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    toast.success("Message sent! We'll get back to you soon.");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-2 text-primary mb-4">
            <MessageSquare size={20} />
            <span className="text-xs font-bold uppercase tracking-widest">Support</span>
          </div>
          <h1 className="text-4xl font-bold mb-2">We're Here to Help</h1>
          <p className="text-muted-foreground mb-12">Get in touch or browse our resources.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="font-semibold">Email Us</p>
                  <p className="text-xs text-muted-foreground">We respond within 24 hours</p>
                </div>
              </div>
              <a href="mailto:support@agentbuilder.dev" className="text-sm text-primary hover:underline">support@agentbuilder.dev</a>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                  <BookOpen size={20} />
                </div>
                <div>
                  <p className="font-semibold">Documentation</p>
                  <p className="text-xs text-muted-foreground">Check our guides and API reference</p>
                </div>
              </div>
              <Link to="/docs" className="text-sm text-primary hover:underline inline-flex items-center gap-1">
                Browse Docs <ArrowRight size={14} />
              </Link>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                  <Search size={20} />
                </div>
                <div>
                  <p className="font-semibold">Guides</p>
                  <p className="text-xs text-muted-foreground">Step-by-step tutorials</p>
                </div>
              </div>
              <Link to="/guides" className="text-sm text-primary hover:underline inline-flex items-center gap-1">
                View Guides <ArrowRight size={14} />
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="font-bold mb-4">Send us a message</h3>
              {sent ? (
                <div className="text-center py-8">
                  <CheckCircle2 size={40} className="text-emerald-400 mx-auto mb-3" />
                  <p className="font-semibold">Message sent!</p>
                  <p className="text-xs text-muted-foreground mt-1">We'll respond as soon as possible.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input placeholder="Your email" type="email" required />
                  <Input placeholder="Subject" required />
                  <Textarea placeholder="Describe your issue..." className="min-h-32" required />
                  <Button type="submit" className="w-full gap-2">
                    <Send size={16} />
                    Send Message
                  </Button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
