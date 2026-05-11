import { useEffect, useState } from "react";
import { Plus, Search, Filter, Loader2 } from "lucide-react";
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
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1 max-w-sm relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search agents by name..." 
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 bg-card border border-border px-3 rounded-xl">
            <Filter size={14} className="text-muted-foreground" />
            <Select 
              className="border-none bg-transparent focus-visible:ring-0 h-9 w-32"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="DRAFT">Draft</option>
            </Select>
          </div>

          <div className="flex items-center gap-2 bg-card border border-border px-3 rounded-xl">
            <Filter size={14} className="text-muted-foreground" />
            <Select 
              className="border-none bg-transparent focus-visible:ring-0 h-9 w-40"
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

          <Link to="/agents/new">
            <Button className="gap-2">
              <Plus size={18} />
              New Agent
            </Button>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 size={40} className="animate-spin text-primary" />
          <p className="text-muted-foreground animate-pulse">Loading agents...</p>
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
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
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search size={32} className="text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold">No agents found</h3>
                <p className="text-muted-foreground mt-2">Try adjusting your search or filters.</p>
                <Button variant="outline" className="mt-6" onClick={() => { setSearch(""); setStatusFilter("ALL"); setPurposeFilter("ALL"); }}>
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
