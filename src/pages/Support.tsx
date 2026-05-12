import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MessageSquare, Mail, BookOpen, Search, Send, CheckCircle2, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import { Textarea } from "../components/ui/Textarea";
import { toast } from "sonner";
import { contactApi } from "../api/contact";
import { useAuthStore } from "../stores/authStore";

export default function Support() {
  const { user } = useAuthStore();
  const [sent, setSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: user?.email || "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await contactApi.submit(formData);
      if (response.success) {
        setSent(true);
        toast.success("Message sent! We'll get back to you soon.");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#6366f1]/10 rounded-full blur-[150px] opacity-50" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#8b5cf6]/10 rounded-full blur-[120px] opacity-40" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-[#6366f1]/10 border border-[#6366f1]/20">
              <MessageSquare size={20} className="text-[#6366f1]" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#6366f1]">Support</span>
          </div>
          <h1 className="text-4xl font-bold mb-2">We're Here to Help</h1>
          <p className="text-slate-400 mb-12">Get in touch or browse our resources.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Options */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl bg-[#6366f1]/10 border border-[#6366f1]/20">
                  <Mail size={20} className="text-[#6366f1]" />
                </div>
                <div>
                  <p className="font-semibold text-white">Email Us</p>
                  <p className="text-xs text-slate-500">We respond within 24 hours</p>
                </div>
              </div>
              <a href="mailto:support@agentbuilder.dev" className="text-sm text-[#6366f1] hover:text-[#8b5cf6] transition-colors">
                support@agentbuilder.dev
              </a>
            </div>

            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <BookOpen size={20} className="text-emerald-400" />
                </div>
                <div>
                  <p className="font-semibold text-white">Documentation</p>
                  <p className="text-xs text-slate-500">Check our guides and API reference</p>
                </div>
              </div>
              <Link to="/docs" className="text-sm text-[#6366f1] hover:text-[#8b5cf6] transition-colors inline-flex items-center gap-1">
                Browse Docs <ArrowRight size={14} />
              </Link>
            </div>

            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <Search size={20} className="text-amber-400" />
                </div>
                <div>
                  <p className="font-semibold text-white">Guides</p>
                  <p className="text-xs text-slate-500">Step-by-step tutorials</p>
                </div>
              </div>
              <Link to="/guides" className="text-sm text-[#6366f1] hover:text-[#8b5cf6] transition-colors inline-flex items-center gap-1">
                View Guides <ArrowRight size={14} />
              </Link>
            </div>

            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                  <Sparkles size={20} className="text-purple-400" />
                </div>
                <div>
                  <p className="font-semibold text-white">API Reference</p>
                  <p className="text-xs text-slate-500">Technical documentation</p>
                </div>
              </div>
              <Link to="/api-reference" className="text-sm text-[#6366f1] hover:text-[#8b5cf6] transition-colors inline-flex items-center gap-1">
                View API Reference <ArrowRight size={14} />
              </Link>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-white mb-1">Send us a message</h3>
              <p className="text-sm text-slate-500 mb-6">Fill out the form below and we'll get back to you shortly.</p>

              {sent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={32} className="text-emerald-400" />
                  </div>
                  <p className="text-lg font-semibold text-white">Message sent!</p>
                  <p className="text-sm text-slate-400 mt-2">We'll respond as soon as possible.</p>
                  <Button
                    variant="secondary"
                    className="mt-6"
                    onClick={() => {
                      setSent(false);
                      setFormData({ email: user?.email || "", subject: "", message: "" });
                    }}
                  >
                    Send another message
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label className="text-slate-300">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                      <Input
                        type="email"
                        placeholder="name@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="pl-10 bg-[#16161d] border-white/10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300">Subject</Label>
                    <Input
                      placeholder="How can we help?"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      required
                      className="bg-[#16161d] border-white/10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300">Message</Label>
                    <Textarea
                      placeholder="Describe your issue or question in detail..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      className="min-h-40 bg-[#16161d] border-white/10"
                    />
                  </div>

                  <Button type="submit" className="w-full gap-2" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        Send Message
                      </>
                    )}
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