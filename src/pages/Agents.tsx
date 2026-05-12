import { useEffect, useState } from "react";
import { Plus, Search, Filter, Loader2, Bot } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { agentApi } from "../api/agent";
import type { Agent, AgentStatus, AgentPurpose } from "../types";
import AgentCard from "../components/agents/AgentCard";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";

export default function Agents() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<AgentStatus | "ALL">("ALL");
  const [purposeFilter, setPurposeFilter] = useState<AgentPurpose | "ALL">("ALL");
  const navigate = useNavigate();

  const fetchAgents = async () => {
    setIsLoading(true);
    try {
      const response = await agentApi.list({
        search: search || undefined,
        status: statusFilter === "ALL" ? undefined : statusFilter,
        purpose: purposeFilter === "ALL" ? undefined : purposeFilter,
      });
      if (response.success) {
        setAgents(response.data.agents);
      }
    } catch (error) {
      toast.error("Failed to fetch agents");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAgents();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, statusFilter, purposeFilter]);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this agent?")) {
      try {
        const response = await agentApi.delete(id);
        if (response.success) {
          toast.success("Agent deleted");
          setAgents(agents.filter(a => a.id !== id));
        }
      } catch (error) {
        toast.error("Failed to delete agent");
      }
    }
  };

  const handleRun = (agent: Agent) => {
    navigate(`/agents/${agent.id}?run=true`);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-[#6366f1]/20 to-[#8b5cf6]/10 border border-[#6366f1]/20">
            <Bot size={24} className="text-[#6366f1]" />
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white">My Agents</h2>
            <p className="text-slate-400 mt-1">Manage and monitor your AI agents</p>
          </div>
        </div>

        <Link to="/agents/new">
          <Button className="gap-2">
            <Plus size={18} />
            New Agent
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
        {/* Search */}
        <div className="flex-1 max-w-sm relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input
            placeholder="Search agents by name..."
            className="pl-10 bg-[#16161d] border-white/10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 glass-card px-3 py-2">
            <Filter size={14} className="text-slate-500" />
            <Select
              className="border-none bg-transparent focus-visible:ring-0 h-9 w-32 text-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="DRAFT">Draft</option>
            </Select>
          </div>

          <div className="flex items-center gap-2 glass-card px-3 py-2">
            <Filter size={14} className="text-slate-500" />
            <Select
              className="border-none bg-transparent focus-visible:ring-0 h-9 w-40 text-sm"
              value={purposeFilter}
              onChange={(e) => setPurposeFilter(e.target.value as any)}
            >
              <option value="ALL">All Purposes</option>
              <option value="BUSINESS">Business</option>
              <option value="RESEARCH">Research</option>
              <option value="CODING">Coding</option>
              <option value="GENERAL">General</option>
            </Select>
          </div>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-16 h-16 rounded-2xl glass-card flex items-center justify-center">
            <Loader2 size={32} className="animate-spin text-[#6366f1]" />
          </div>
          <p className="text-slate-400 animate-pulse">Loading agents...</p>
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {agents.length > 0 ? (
              agents.map((agent) => (
                <AgentCard
                  key={agent.id}
                  agent={agent}
                  onDelete={handleDelete}
                  onRun={handleRun}
                />
              ))
            ) : (
              <div className="col-span-full py-20 text-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-20 h-20 rounded-2xl glass-card flex items-center justify-center mx-auto mb-4"
                >
                  <Bot size={32} className="text-slate-500" />
                </motion.div>
                <h3 className="text-xl font-semibold text-white">No agents found</h3>
                <p className="text-slate-400 mt-2">Try adjusting your search or filters.</p>
                <Button
                  variant="secondary"
                  className="mt-6"
                  onClick={() => { setSearch(""); setStatusFilter("ALL"); setPurposeFilter("ALL"); }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}