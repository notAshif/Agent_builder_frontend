import { useEffect, useState } from "react";
import { Wrench, ShieldCheck, Box, Search, Loader2, Plus, X, Check, ExternalLink, Webhook } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toolApi } from "../api/tool";
import type { Tool } from "../types";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import { Textarea } from "../components/ui/Textarea";
import { Select } from "../components/ui/Select";
import { toast } from "sonner";

const CATEGORY_OPTIONS = [
  { value: "WEB_SEARCH", label: "Web Search" },
  { value: "API_CALLS", label: "API Calls" },
  { value: "CODE_EXECUTIONS", label: "Code Execution" },
  { value: "EMAIL", label: "Email" },
  { value: "DATABASE", label: "Database" },
  { value: "FILE_PROCESSING", label: "File Processing" },
  { value: "NOTIFICATION", label: "Notification" },
  { value: "CUSTOM", label: "Custom" },
];

export default function Tools() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", category: "API_CALLS", webhookUrl: "", webhookMethod: "POST" });

  useEffect(() => {
    const fetchTools = async () => {
      try {
        const response = await toolApi.list();
        if (response.success) setTools(response.data.tools);
      } catch {
        toast.error("Failed to fetch tools");
      } finally {
        setIsLoading(false);
      }
    };
    fetchTools();
  }, []);

  const filteredTools = tools.filter(tool =>
    tool.name.toLowerCase().includes(search.toLowerCase()) ||
    tool.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = async () => {
    if (!form.name.trim() || !form.description.trim()) {
      toast.error("Name and description are required");
      return;
    }
    setCreating(true);
    try {
      const payload: any = {
        name: form.name.trim(),
        description: form.description.trim(),
        category: form.category,
      };
      if (form.webhookUrl.trim()) {
        payload.webhookUrl = form.webhookUrl.trim();
        payload.webhookMethod = form.webhookMethod;
      }
      const response = await toolApi.create(payload);
      if (response.success) {
        toast.success(`Custom tool "${response.data.tool.name}" created!`);
        setTools(prev => [...prev, response.data.tool]);
        setShowCreate(false);
        setForm({ name: "", description: "", category: "API_CALLS", webhookUrl: "", webhookMethod: "POST" });
      }
    } catch {
      toast.error("Failed to create tool");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-[#6366f1]/20 to-[#8b5cf6]/10 border border-[#6366f1]/20">
            <Wrench size={24} className="text-[#6366f1]" />
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white">Tool Library</h2>
            <p className="text-slate-400 mt-1">Explore built-in tools and create your own integrations</p>
          </div>
        </div>

        <div className="flex gap-3 items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <Input
              placeholder="Search tools..."
              className="pl-10 w-48 bg-[#16161d] border-white/10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button onClick={() => setShowCreate(true)} className="gap-2 whitespace-nowrap">
            <Plus size={18} />
            Create Tool
          </Button>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-16 h-16 rounded-2xl glass-card flex items-center justify-center">
            <Loader2 size={32} className="animate-spin text-[#6366f1]" />
          </div>
          <p className="text-slate-400 animate-pulse">Syncing tool repository...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTools.length > 0 ? filteredTools.map((tool) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="group"
            >
              <div className="glass-card p-5 h-full flex flex-col relative overflow-hidden">
                {/* Background Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#6366f1]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="relative z-10 flex flex-col h-full">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-[#6366f1]/10 to-[#8b5cf6]/5 border border-[#6366f1]/20 text-[#6366f1] group-hover:from-[#6366f1] group-hover:to-[#8b5cf6] group-hover:text-white group-hover:border-[#6366f1] transition-all duration-300">
                      {tool.isBuiltin ? <Wrench size={20} /> : <ExternalLink size={20} />}
                    </div>
                    {tool.isBuiltin ? (
                      <Badge variant="info" className="gap-1 text-[10px]">
                        <ShieldCheck size={10} />
                        Built-in
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-[10px] border-[#8b5cf6]/30 text-[#8b5cf6]">
                        Custom
                      </Badge>
                    )}
                  </div>

                  <h3 className="text-lg font-semibold text-white mb-3">{tool.name}</h3>

                  <p className="text-sm text-slate-400 line-clamp-3 mb-6 flex-1">
                    {tool.description}
                  </p>

                  <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                    <Box size={14} className="text-slate-500" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{tool.category}</span>
                    {(tool.config as any)?.webhookUrl && (
                      <span className="text-[10px] text-[#8b5cf6] flex items-center gap-1 ml-auto">
                        <Webhook size={10} />
                        Webhook
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] group-hover:w-full transition-all duration-500" />
              </div>
            </motion.div>
          )) : (
            <div className="col-span-full rounded-2xl glass-card p-16 text-center">
              <div className="w-16 h-16 rounded-2xl bg-white/5 mx-auto mb-4 flex items-center justify-center">
                <Wrench size={28} className="text-slate-500" />
              </div>
              <p className="text-lg font-semibold text-white mb-2">No tools found</p>
              <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
                Create your first custom tool or restart the backend to seed built-in tools.
              </p>
              <Button variant="secondary" onClick={() => setShowCreate(true)} className="gap-2">
                <Plus size={16} />
                Create Custom Tool
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Create Tool Modal */}
      <AnimatePresence>
        {showCreate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-lg w-full glass-card p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-[#6366f1]/10 border border-[#6366f1]/20">
                    <Plus size={20} className="text-[#6366f1]" />
                  </div>
                  <h3 className="font-bold text-lg text-white">Create Custom Tool</h3>
                </div>
                <button onClick={() => setShowCreate(false)} className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <Label className="text-slate-300">Tool Name</Label>
                  <Input
                    placeholder="e.g. Slack Messenger"
                    value={form.name}
                    onChange={e => setForm({...form, name: e.target.value})}
                    className="bg-[#16161d] border-white/10"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Description</Label>
                  <Textarea
                    placeholder="Describe what this tool does..."
                    className="min-h-24 bg-[#16161d] border-white/10"
                    value={form.description}
                    onChange={e => setForm({...form, description: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Category</Label>
                  <Select
                    value={form.category}
                    onChange={e => setForm({...form, category: e.target.value})}
                    className="bg-[#16161d] border-white/10"
                  >
                    {CATEGORY_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </Select>
                </div>

                <div className="rounded-xl border border-[#8b5cf6]/20 bg-[#8b5cf6]/5 p-4 space-y-3">
                  <div className="flex items-center gap-2 text-[#8b5cf6]">
                    <Webhook size={16} />
                    <span className="text-xs font-semibold uppercase tracking-wider">Webhook Integration</span>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-slate-400">Webhook URL (optional)</Label>
                    <Input
                      placeholder="https://your-service.com/webhook"
                      value={form.webhookUrl}
                      onChange={e => setForm({...form, webhookUrl: e.target.value})}
                      className="bg-[#16161d] border-white/10"
                    />
                  </div>
                  {form.webhookUrl.trim() && (
                    <div className="space-y-2">
                      <Label className="text-xs text-slate-400">HTTP Method</Label>
                      <Select
                        value={form.webhookMethod}
                        onChange={e => setForm({...form, webhookMethod: e.target.value})}
                        className="bg-[#16161d] border-white/10"
                      >
                        <option value="POST">POST</option>
                        <option value="GET">GET</option>
                        <option value="PUT">PUT</option>
                        <option value="PATCH">PATCH</option>
                      </Select>
                    </div>
                  )}
                  <p className="text-[10px] text-slate-500">
                    When this tool is executed by an agent, AgentBuilder will send an HTTP POST with the agent's input as JSON body to your webhook URL.
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-white/5">
                <Button variant="secondary" onClick={() => setShowCreate(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreate} disabled={creating} className="gap-2">
                  {creating ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Check size={16} />
                  )}
                  {creating ? "Creating..." : "Create Tool"}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}