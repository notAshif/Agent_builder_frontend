import { useEffect, useState } from "react";
import { useParams, Link, useSearchParams, useNavigate } from "react-router-dom";
import { 
  Bot, 
  Settings as SettingsIcon, 
  Play, 
  History, 
  Trash2, 
  ChevronLeft,
  Loader2,
  Terminal,
  Cpu,
  Share2
} from "lucide-react";
import { agentApi } from "../api/agent";
import type { Agent, AgentRun } from "../types";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Label } from "../components/ui/Label";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../lib/utils";
import { Textarea } from "../components/ui/Textarea";

export default function AgentDetail() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [runs, setRuns] = useState<AgentRun[]>([]);
  const [activeTab, setActiveTab] = useState(searchParams.get("run") ? "run" : "overview");
  const [isLoading, setIsLoading] = useState(true);
  const [runInput, setRunInput] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const [agentRes, runsRes] = await Promise.all([
          agentApi.getById(id),
          agentApi.getRuns(id)
        ]);
        if (agentRes.success) setAgent(agentRes.data.agent);
        if (runsRes.success) setRuns(runsRes.data.runs);
      } catch (error) {
        toast.error("Failed to fetch agent details");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast.success("Agent link copied to clipboard!");
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      const response = await agentApi.delete(id);
      if (response.success) {
        toast.success("Agent deleted!");
        navigate("/agents");
      }
    } catch (error) {
      toast.error("Failed to delete agent");
    }
  };

  const handleRunAgent = async () => {
    if (!id || !runInput.trim()) return;
    setIsRunning(true);
    try {
      const response = await agentApi.run(id, { input: runInput });
      if (response.success) {
        toast.success("Agent run started!");
        setRunInput("");
        navigate(`/runs/${response.data.run.id}`);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to start agent run");
    } finally {
      setIsRunning(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <Loader2 className="animate-spin text-primary" size={40} />
        <p className="text-muted-foreground">Loading agent details...</p>
      </div>
    );
  }

  if (!agent) {
    return <div className="text-center py-20">Agent not found.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-2">
        <Link to="/agents">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ChevronLeft size={20} />
          </Button>
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <Bot size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{agent.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={agent.status === "ACTIVE" ? "success" : "secondary"}>{agent.status}</Badge>
              <span className="text-xs text-muted-foreground">• Created {formatDistanceToNow(new Date(agent.createdAt))} ago</span>
            </div>
          </div>
        </div>
        <div className="ml-auto flex gap-2">
          <Button variant="outline" size="sm" className="gap-2" onClick={handleShare}>
            <Share2 size={14} />
            Share
          </Button>
          <Button variant="outline" size="sm" className="gap-2 text-red-500 hover:bg-red-500/10 border-red-500/20" onClick={handleDelete}>
            <Trash2 size={14} />
            Delete
          </Button>
        </div>
      </div>

      <div className="flex border-b border-border gap-8 overflow-x-auto no-scrollbar">
        {[
          { id: "overview", label: "Overview", icon: Cpu },
          { id: "run", label: "Run Agent", icon: Play },
          { id: "runs", label: "History", icon: History },
          { id: "settings", label: "Config", icon: SettingsIcon },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 py-4 px-2 text-sm font-medium border-b-2 transition-all",
              activeTab === tab.id 
                ? "border-primary text-primary" 
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>System Instructions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-6 bg-muted/30 rounded-xl border border-border/50 italic text-muted-foreground">
                    {agent.prompt}
                  </div>
                  <div className="pt-4">
                    <h4 className="text-sm font-semibold mb-3">Capabilities</h4>
                    <div className="flex flex-wrap gap-2">
                      {agent.tools?.map((t: any) => (
                        <Badge key={t.tool.id} variant="secondary" className="px-3 py-1">
                          {t.tool.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground">Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total Runs</span>
                      <span className="font-semibold">{agent._count?.runs || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Success Rate</span>
                      <span className="font-semibold text-green-500">
                        {runs.length > 0
                          ? Math.round((runs.filter(r => r.status === "COMPLETED").length / runs.length) * 100) + "%"
                          : "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Avg. Runtime</span>
                      <span className="font-semibold">
                        {runs.length > 0
                          ? (() => {
                              const completed = runs.filter(r => r.status === "COMPLETED" && r.startedAt && r.completedAt);
                              if (completed.length === 0) return "N/A";
                              const totalMs = completed.reduce((acc, r) => acc + (new Date(r.completedAt!).getTime() - new Date(r.startedAt!).getTime()), 0);
                              return (totalMs / completed.length / 1000).toFixed(1) + "s";
                            })()
                          : "N/A"}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground">Configuration</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-1">
                      <p className="text-[10px] text-muted-foreground uppercase font-bold">Model</p>
                      <p className="text-sm font-medium">{agent.config.model || "gpt-4o"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] text-muted-foreground uppercase font-bold">Temperature</p>
                      <p className="text-sm font-medium">{agent.config.temperature || 0.7}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] text-muted-foreground uppercase font-bold">Max Tokens</p>
                      <p className="text-sm font-medium">{agent.config.maxToken || 4096}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "run" && (
            <div className="max-w-2xl mx-auto space-y-6">
              <Card className="glass border-primary/20 overflow-hidden">
                <CardHeader className="bg-primary/5 border-b border-primary/10">
                  <div className="flex items-center gap-2 text-primary">
                    <Terminal size={18} />
                    <CardTitle className="text-base font-semibold">Terminal Execution</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Prompt Agent</Label>
                    <Textarea 
                      placeholder="Enter a task or question for the agent..."
                      className="min-h-37.5 bg-background/50 focus:bg-background transition-all border-border/50"
                      value={runInput}
                      onChange={(e) => setRunInput(e.target.value)}
                    />
                  </div>
                  <Button 
                    className="w-full h-12 text-lg font-bold shadow-xl shadow-primary/20" 
                    onClick={handleRunAgent}
                    disabled={isRunning || !runInput.trim()}
                  >
                    {isRunning ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Initializing...
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-5 w-5 fill-current" />
                        Execute Task
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
              
              <div className="p-4 rounded-xl bg-muted/30 border border-border flex items-start gap-4">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Cpu size={20} />
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p className="font-semibold text-foreground">Usage Tip</p>
                  <p>Provide specific, clear instructions to get the best performance from this agent. You can include data snippets or explicit constraints.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "runs" && (
            <div className="space-y-4">
              {runs.length > 0 ? (
                runs.map((run) => (
                  <Link key={run.id} to={`/runs/${run.id}`}>
                    <Card className="hover:bg-muted/30 transition-colors border-border/50 mb-4">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "w-2 h-2 rounded-full",
                            run.status === "COMPLETED" ? "bg-green-500" :
                            run.status === "FAILED" ? "bg-red-500" : "bg-blue-500 animate-pulse"
                          )} />
                          <div>
                            <p className="font-medium text-sm line-clamp-1">{run.input}</p>
                            <p className="text-[10px] text-muted-foreground mt-1">
                              {formatDistanceToNow(new Date(run.createdAt))} ago • {run._count?.toolExecution || 0} tool calls
                            </p>
                          </div>
                        </div>
                        <Badge variant={
                          run.status === "COMPLETED" ? "success" :
                          run.status === "FAILED" ? "danger" : "default"
                        }>
                          {run.status}
                        </Badge>
                      </CardContent>
                    </Card>
                  </Link>
                ))
              ) : (
                <div className="py-20 text-center text-muted-foreground italic">No execution history found for this agent.</div>
              )}
            </div>
          )}

          {activeTab === "settings" && (
            <div className="max-w-2xl mx-auto space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Agent Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1">
                    <Label className="text-muted-foreground">System Prompt</Label>
                    <Textarea
                      className="min-h-32"
                      value={agent.prompt}
                      onChange={() => {}}
                      placeholder="Agent system instructions..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label className="text-muted-foreground">Model</Label>
                      <select className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm">
                        <option>gpt-4o</option>
                        <option>gpt-4-turbo</option>
                        <option>claude-sonnet-4</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-muted-foreground">Temperature</Label>
                      <Input type="number" step="0.1" min="0" max="2" defaultValue={0.7} />
                    </div>
                  </div>
                  <Button className="w-full" disabled>Save Changes (Coming Soon)</Button>
                </CardContent>
              </Card>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
