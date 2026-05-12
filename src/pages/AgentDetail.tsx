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
  Share2,
  MessageSquare,
  GitBranch,
  Network,
  CheckCircle2,
  Wrench,
  Check
} from "lucide-react";
import { agentApi } from "../api/agent";
import { toolApi } from "../api/tool";
import type { Agent, AgentRun } from "../types";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { apiClient } from "../api/client";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Label } from "../components/ui/Label";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../lib/utils";
import { Textarea } from "../components/ui/Textarea";
import SchedulePanel from "../components/agents/SchedulePanel";
import OutputDestinations from "../components/agents/OutputDestinations";
import ConversationChat from "../components/agents/ConversationChat";
import WorkflowBuilder from "../components/agents/WorkflowBuilder";
import AgentLogicGraph from "../components/agents/AgentLogicGraph";
import { MODEL_OPTIONS, getModelInfo } from "../lib/models";

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
  const [workflowResult, setWorkflowResult] = useState<any>(null);
  const [workflowExecuting, setWorkflowExecuting] = useState(false);

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
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      toast.success("Agent link copied to clipboard!");
    } else {
      prompt("Copy this agent link:", url);
    }
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
          { id: "chat", label: "Chat", icon: MessageSquare },
          { id: "workflows", label: "Workflows", icon: GitBranch },
          { id: "logic-graph", label: "Logic Graph", icon: Network },
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
                    {agent.tools && agent.tools.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {agent.tools.map((t: any) => (
                          <Badge key={t.tool.id} variant="secondary" className="px-3 py-1">
                            {t.tool.name}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground italic">No tools assigned. Add tools in the Config tab.</p>
                    )}
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
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{getModelInfo(agent.config.model).label}</p>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                          getModelInfo(agent.config.model).provider === "openai" ? "bg-green-500/10 text-green-500" :
                          getModelInfo(agent.config.model).provider === "anthropic" ? "bg-orange-500/10 text-orange-500" :
                          getModelInfo(agent.config.model).provider === "gemini" ? "bg-blue-500/10 text-blue-500" :
                          getModelInfo(agent.config.model).provider === "openrouter" ? "bg-purple-500/10 text-purple-500" :
                          "bg-gray-500/10 text-gray-500"
                        }`}>
                          {getModelInfo(agent.config.model).badge}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] text-muted-foreground uppercase font-bold">Temperature</p>
                      <p className="text-sm font-medium">{agent.config.temperature ?? 0.7}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] text-muted-foreground uppercase font-bold">Max Tokens</p>
                      <p className="text-sm font-medium">{agent.config.maxToken ?? 4096}</p>
                    </div>
                  </CardContent>
                </Card>

                <SchedulePanel agentId={agent.id} />
              </div>
            </div>
          )}

          {activeTab === "chat" && (
            <div className="max-w-2xl mx-auto">
              <ConversationChat agentId={agent.id} agentName={agent.name} />
            </div>
          )}

          {activeTab === "workflows" && (
            <div className="max-w-3xl mx-auto">
                  <WorkflowBuilder
                agents={[{ id: agent.id, name: agent.name }]}
                onExecute={async (workflow) => {
                  setWorkflowExecuting(true);
                  setWorkflowResult(null);
                  try {
                    const { data } = await apiClient.post("/workflows/execute", { workflow, input: "Execute workflow" });
                    if (data.success) {
                      setWorkflowResult(data.data);
                      toast.success("Workflow completed");
                    } else {
                      toast.error(data.message || "Workflow failed");
                    }
                  } catch {
                    toast.error("Failed to execute workflow");
                  } finally {
                    setWorkflowExecuting(false);
                  }
                }}
              />

              {workflowExecuting && (
                <div className="flex items-center justify-center gap-2 py-8 text-muted-foreground">
                  <Loader2 size={16} className="animate-spin" />
                  <span className="text-sm">Executing workflow...</span>
                </div>
              )}

              {workflowResult && (
                <Card className="mt-6 border-green-500/20 bg-green-500/5">
                  <CardHeader className="py-3 border-b border-green-500/10">
                    <CardTitle className="text-sm flex items-center gap-2 text-green-600">
                      <CheckCircle2 size={16} />
                      Workflow Result
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Status:</span>
                      <Badge variant={workflowResult.status === "COMPLETED" ? "success" : "default"}>
                        {workflowResult.status}
                      </Badge>
                    </div>
                    {workflowResult.finalOutput && (
                      <div className="space-y-1">
                        <p className="text-[10px] text-muted-foreground uppercase font-bold">Final Output</p>
                        <div className="p-3 rounded-lg bg-muted/30 text-sm whitespace-pre-wrap leading-relaxed">
                          {workflowResult.finalOutput}
                        </div>
                      </div>
                    )}
                    {workflowResult.results && (
                      <div className="space-y-1">
                        <p className="text-[10px] text-muted-foreground uppercase font-bold">Step Results</p>
                        <div className="space-y-2">
                          {Object.entries(workflowResult.results).map(([stepId, step]: [string, any]) => (
                            <div key={stepId} className="p-2 rounded bg-muted/20 text-xs flex items-center justify-between">
                              <span className="font-mono">{stepId}</span>
                              <Badge variant={step.status === "COMPLETED" ? "success" : step.status === "FAILED" ? "danger" : "default"}>
                                {step.status}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
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

          {activeTab === "logic-graph" && (
            <AgentLogicGraph agent={agent} />
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
            <SettingsTab agent={agent} onUpdate={(updated) => setAgent(updated)} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function SettingsTab({ agent, onUpdate }: { agent: Agent; onUpdate: (a: Agent) => void }) {
  const [model, setModel] = useState(agent.config.model ?? "gpt-4o");
  const [temperature, setTemperature] = useState(agent.config.temperature ?? 0.7);
  const [maxToken, setMaxToken] = useState(agent.config.maxToken ?? 4096);
  const [saving, setSaving] = useState(false);
  const [allTools, setAllTools] = useState<any[]>([]);
  const [toolsLoading, setToolsLoading] = useState(true);
  const [assigningTool, setAssigningTool] = useState<string | null>(null);

  useEffect(() => {
    const fetchTools = async () => {
      try {
        const res = await toolApi.list();
        if (res.success) setAllTools(res.data.tools);
      } catch {
      } finally {
        setToolsLoading(false);
      }
    };
    fetchTools();
  }, []);

  const assignedToolIds = new Set((agent.tools ?? []).map((t: any) => t.tool.id));

  const handleAssignTool = async (toolId: string) => {
    setAssigningTool(toolId);
    try {
      const res = await apiClient.post(`/agents/${agent.id}/tools`, { toolId });
      if (res.data.success) {
        const agentRes = await agentApi.getById(agent.id);
        if (agentRes.success) onUpdate(agentRes.data.agent);
        toast.success("Tool assigned");
      }
    } catch {
      toast.error("Failed to assign tool");
    } finally {
      setAssigningTool(null);
    }
  };

  const handleRemoveTool = async (toolId: string) => {
    try {
      const res = await apiClient.delete(`/agents/${agent.id}/tools/${toolId}`);
      if (res.data.success) {
        const agentRes = await agentApi.getById(agent.id);
        if (agentRes.success) onUpdate(agentRes.data.agent);
        toast.success("Tool removed");
      }
    } catch {
      toast.error("Failed to remove tool");
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await agentApi.update(agent.id, {
        config: { ...agent.config, model, temperature, maxToken },
      });
      if (res.success) {
        onUpdate(res.data.agent);
        toast.success("Configuration saved");
      }
    } catch {
      toast.error("Failed to save configuration");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Agent Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label className="text-muted-foreground">Model</Label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
            >
              <optgroup label="OpenAI">
                {MODEL_OPTIONS.filter((m) => m.provider === "openai").map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </optgroup>
              <optgroup label="Anthropic">
                {MODEL_OPTIONS.filter((m) => m.provider === "anthropic").map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </optgroup>
              <optgroup label="Google (Free)">
                {MODEL_OPTIONS.filter((m) => m.provider === "gemini").map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </optgroup>
              <optgroup label="OpenRouter (Free)">
                {MODEL_OPTIONS.filter((m) => m.provider === "openrouter").map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </optgroup>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-muted-foreground">Temperature ({temperature})</Label>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground">Max Tokens ({maxToken})</Label>
              <input
                type="range"
                min="256"
                max="16000"
                step="256"
                value={maxToken}
                onChange={(e) => setMaxToken(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
          <Button className="w-full" onClick={handleSave} disabled={saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm uppercase tracking-wider text-muted-foreground">
            <Wrench size={16} />
            Tools
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {toolsLoading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 size={14} className="animate-spin" />
              Loading tools...
            </div>
          ) : allTools.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">No tools available.</p>
          ) : (
            allTools.map((tool: any) => {
              const assigned = assignedToolIds.has(tool.id);
              return (
                <div key={tool.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                  <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded ${assigned ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                      <Wrench size={14} />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{tool.name}</p>
                      <p className="text-[10px] text-muted-foreground">{tool.description}</p>
                    </div>
                  </div>
                  {assigned ? (
                    <Button size="sm" variant="ghost" onClick={() => handleRemoveTool(tool.id)} className="text-red-500 hover:text-red-600 shrink-0">
                      <Trash2 size={14} />
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => handleAssignTool(tool.id)} disabled={assigningTool === tool.id} className="shrink-0">
                      {assigningTool === tool.id ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                      Add
                    </Button>
                  )}
                </div>
              );
            })
          )}
        </CardContent>
      </Card>

      <OutputDestinations agent={agent} onUpdate={onUpdate} />
    </div>
  );
}
