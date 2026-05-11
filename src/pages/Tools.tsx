import { useEffect, useState } from "react";
import { Wrench, ShieldCheck, Box, Search, Loader2, Plus, X, Check, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toolApi } from "../api/tool";
import type { Tool } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
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
  const [form, setForm] = useState({ name: "", description: "", category: "API_CALLS" });

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
      const response = await toolApi.create({
        name: form.name.trim(),
        description: form.description.trim(),
        category: form.category,
      });
      if (response.success) {
        toast.success(`Custom tool "${response.data.tool.name}" created!`);
        setTools(prev => [...prev, response.data.tool]);
        setShowCreate(false);
        setForm({ name: "", description: "", category: "API_CALLS" });
      }
    } catch {
      toast.error("Failed to create tool");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Tool Library</h2>
          <p className="text-muted-foreground text-sm">Explore built-in tools and create your own integrations.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search tools..." 
              className="pl-10"
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

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="animate-spin text-primary" size={40} />
          <p className="text-muted-foreground">Syncing tool repository...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.length > 0 ? filteredTools.map((tool) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="h-full border-border/50 hover:border-primary/50 transition-all group overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all">
                      {tool.isBuiltin ? <Wrench size={20} /> : <ExternalLink size={20} />}
                    </div>
                    {tool.isBuiltin ? (
                      <Badge variant="outline" className="gap-1 text-[10px] bg-primary/5 border-primary/20 text-primary">
                        <ShieldCheck size={10} />
                        Built-in
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px] border-violet-500/30 text-violet-400 bg-violet-500/10">
                        Custom
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg">{tool.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-6">
                    {tool.description}
                  </p>
                  <div className="flex items-center gap-2">
                    <Box size={14} className="text-muted-foreground" />
                    <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{tool.category}</span>
                  </div>
                </CardContent>
                <div className="h-1 w-0 bg-primary group-hover:w-full transition-all duration-500" />
              </Card>
            </motion.div>
          )) : (
            <div className="col-span-full rounded-xl border border-border bg-muted/30 p-16 text-center">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                <Wrench size={28} className="text-muted-foreground" />
              </div>
              <p className="text-base font-medium mb-1">No tools found</p>
              <p className="text-sm text-muted-foreground max-w-md mx-auto mb-4">
                Create your first custom tool or restart the backend to seed built-in tools.
              </p>
              <Button variant="outline" onClick={() => setShowCreate(true)} className="gap-2">
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
              className="max-w-lg w-full rounded-2xl border border-border bg-card p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-primary/10 text-primary">
                    <Plus size={20} />
                  </div>
                  <h3 className="font-bold text-lg">Create Custom Tool</h3>
                </div>
                <button onClick={() => setShowCreate(false)} className="p-1 rounded-lg hover:bg-muted transition-colors">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Tool Name</Label>
                  <Input
                    placeholder="e.g. Slack Messenger"
                    value={form.name}
                    onChange={e => setForm({...form, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Describe what this tool does..."
                    className="min-h-24"
                    value={form.description}
                    onChange={e => setForm({...form, description: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={form.category}
                    onChange={e => setForm({...form, category: e.target.value})}
                  >
                    {CATEGORY_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </Select>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-border">
                <Button variant="outline" onClick={() => setShowCreate(false)}>
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
