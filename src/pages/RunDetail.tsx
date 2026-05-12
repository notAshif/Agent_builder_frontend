import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  ChevronLeft, 
  Loader2, 
  Clock, 
  Terminal, 
  CheckCircle2, 
  AlertCircle,
  Network,
  ListOrdered,
  XCircle,
  RefreshCw,
  Cpu
} from "lucide-react";
import { runApi } from "../api/run";
import type { AgentRun } from "../types";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { toast } from "sonner";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../lib/utils";
import LogTimeline from "../components/runs/LogTimeline";
import FlowVisualization from "../components/runs/FlowVisualization";
import RichOutput from "../components/runs/RichOutput";
import { useEventStream } from "../hooks/useEventStream";
import { getRunStreamUrl } from "../api/events";

export default function RunDetail() {
  const { id } = useParams();
  const [run, setRun] = useState<AgentRun | null>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [executions, setExecutions] = useState<any[]>([]);
  const [flowData, setFlowData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("logs");
  const [isLoading, setIsLoading] = useState(true);
  const initialFetchDone = useRef(false);

  const fetchRunData = async (silent = false) => {
    if (!id) return;
    if (!silent) setIsLoading(true);
    try {
      const [statusRes, logsRes, execRes, flowRes] = await Promise.all([
          runApi.getStatus(id),
          runApi.getLogs(id),
          runApi.getExecutions(id),
          runApi.getFlow(id).catch(() => null),
        ]);
        
        if (statusRes.success) setRun(statusRes.data.run);
        if (logsRes.success) setLogs(logsRes.data.logs);
        if (execRes.success) setExecutions(execRes.data.executions);
        if (flowRes?.success && flowRes.data.flow) setFlowData(flowRes.data.flow);
    } catch (error) {
      if (!silent) toast.error("Failed to fetch run details");
    } finally {
      if (!silent) setIsLoading(false);
      initialFetchDone.current = true;
    }
  };

  useEffect(() => {
    initialFetchDone.current = false;
    fetchRunData();
  }, [id]);

  useEventStream({
    url: id ? getRunStreamUrl(id) : "",
    enabled: !!id && initialFetchDone.current,
    handlers: {
      "run:updated": (data: any) => {
        setRun(prev => prev ? { ...prev, status: data.status, startedAt: data.startedAt } : prev);
      },
      "run:completed": (data: any) => {
        setRun(prev => prev ? { ...prev, ...data } : prev);
        toast.success("Agent run completed");
      },
      "run:failed": (data: any) => {
        setRun(prev => prev ? { ...prev, ...data } : prev);
        toast.error("Agent run failed");
      },
      "log:created": (log: any) => {
        setLogs(prev => [...prev, log]);
      },
      "execution:created": (exec: any) => {
        setExecutions(prev => [...prev, exec]);
      },
      "execution:completed": (exec: any) => {
        setExecutions(prev => prev.map(e => e.id === exec.id ? { ...e, ...exec } : e));
      },
      "run:cancelled": (_data: any) => {
        setRun(prev => prev ? { ...prev, status: "CANCELLED" } : prev);
      },
    },
  });

  const handleCancel = async () => {
    if (!id) return;
    try {
      const response = await runApi.cancel(id);
      if (response.success) {
        toast.success("Run cancellation requested");
        fetchRunData(true);
      }
    } catch (error) {
      toast.error("Failed to cancel run");
    }
  };

  if (isLoading && !run) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <Loader2 className="animate-spin text-primary" size={40} />
        <p className="text-muted-foreground">Analysing run data...</p>
      </div>
    );
  }

  if (!run) return <div className="text-center py-20">Run not found.</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-2">
        <Link to={`/agents/${run.agentId}?run=true`}>
          <Button variant="ghost" size="icon" className="rounded-full">
            <ChevronLeft size={20} />
          </Button>
        </Link>
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors",
            run.status === "COMPLETED" ? "bg-green-500/10 text-green-500" :
            run.status === "FAILED" ? "bg-red-500/10 text-red-500" : "bg-blue-500/10 text-blue-500"
          )}>
            {run.status === "COMPLETED" ? <CheckCircle2 size={28} /> : 
             run.status === "FAILED" ? <AlertCircle size={28} /> : 
             run.status === "CANCELLED" ? <XCircle size={28} /> :
             <RefreshCw size={28} className="animate-spin" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold">Execution Run</h2>
              <Badge variant={
                run.status === "COMPLETED" ? "success" :
                run.status === "FAILED" ? "danger" : "default"
              }>
                {run.status}
              </Badge>
              {(run.status === "RUNNING" || run.status === "PENDING") && (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1 font-mono">{run.id}</p>
          </div>
        </div>
        <div className="ml-auto flex gap-2">
          {(run.status === "RUNNING" || run.status === "PENDING") && (
            <Button variant="danger" size="sm" className="gap-2" onClick={handleCancel}>
              <XCircle size={14} />
              Cancel Run
            </Button>
          )}
          <Button variant="outline" size="sm" className="gap-2" onClick={() => fetchRunData()}>
            <RefreshCw size={14} />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-4">
            <Card className="border-border/50">
              <CardHeader className="py-4 bg-muted/20">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Terminal size={16} className="text-primary" />
                  User Input
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-sm leading-relaxed">{run.input}</p>
              </CardContent>
            </Card>

            <AnimatePresence>
              {run.output && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <Card className="border-primary/20 bg-primary/5 shadow-lg shadow-primary/5">
                    <CardHeader className="py-4 bg-primary/10 border-b border-primary/10">
                      <div className="flex items-center gap-2 text-sm font-bold text-primary">
                        <CheckCircle2 size={16} />
                        Final Agent Response
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <RichOutput text={run.output} />
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
            
            {run.error && (
              <Card className="border-red-500/20 bg-red-500/5">
                <CardHeader className="py-4 bg-red-500/10">
                  <div className="flex items-center gap-2 text-sm font-bold text-red-500">
                    <AlertCircle size={16} />
                    Error Encountered
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-sm text-red-500/80 font-mono italic">{run.error}</p>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex border-b border-border gap-6">
              {[
                { id: "flow", label: "Logic Graph", icon: Network },
                { id: "logs", label: "System Logs", icon: Terminal },
                { id: "executions", label: "Tool Usage", icon: ListOrdered },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 py-3 px-1 text-xs font-bold uppercase tracking-wider border-b-2 transition-all",
                    activeTab === tab.id 
                      ? "border-primary text-primary" 
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
                >
                  <tab.icon size={14} />
                  {tab.label}
                  {tab.id === "logs" && logs.length > 0 && (
                    <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded-full ml-1">{logs.length}</span>
                  )}
                  {tab.id === "executions" && executions.length > 0 && (
                    <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded-full ml-1">{executions.length}</span>
                  )}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {activeTab === "flow" && (
                  <FlowVisualization data={flowData} runStatus={run?.status} executions={executions} />
                )}
                
                {activeTab === "logs" && (
                  <LogTimeline logs={logs} />
                )}

                {activeTab === "executions" && (
                  <div className="space-y-4">
                    {executions.length === 0 ? (
                      <p className="text-center text-muted-foreground italic py-8">No tool executions yet.</p>
                    ) : (
                      executions.map((exec) => (
                        <Card key={exec.id} className="border-border/50 bg-muted/10">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                  <Cpu size={16} />
                                </div>
                                <span className="font-bold text-sm">{exec.tool?.name || exec.toolName || "Tool"}</span>
                                <Badge variant={
                                  exec.status === "COMPLETED" ? "success" :
                                  exec.status === "FAILED" ? "danger" : "default"
                                } className="text-[10px]">
                                  {exec.status}
                                </Badge>
                              </div>
                              {exec.durationMs && (
                                <Badge variant="outline">{exec.durationMs}ms</Badge>
                              )}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <p className="text-[10px] text-muted-foreground uppercase font-bold">Input</p>
                                <pre className="p-2 rounded bg-black/40 text-[10px] overflow-x-auto">
                                  {JSON.stringify(exec.input, null, 2)}
                                </pre>
                              </div>
                              <div className="space-y-1">
                                <p className="text-[10px] text-muted-foreground uppercase font-bold">Output</p>
                                <pre className="p-2 rounded bg-black/40 text-[10px] overflow-x-auto">
                                  {JSON.stringify(exec.output, null, 2)}
                                </pre>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground">Execution Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Clock size={14} />
                  <span className="text-xs font-medium">Timeline</span>
                </div>
                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground text-xs">Created</span>
                    <span className="font-medium text-xs">{format(new Date(run.createdAt), "MMM d, HH:mm:ss")}</span>
                  </div>
                  {run.startedAt && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground text-xs">Started</span>
                      <span className="font-medium text-xs">{format(new Date(run.startedAt), "HH:mm:ss")}</span>
                    </div>
                  )}
                  {run.completedAt && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground text-xs">Completed</span>
                      <span className="font-medium text-xs">{format(new Date(run.completedAt), "HH:mm:ss")}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <div className="flex items-center gap-2 text-muted-foreground mb-3">
                  <Terminal size={14} />
                  <span className="text-xs font-medium">Resource Usage</span>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Tool Calls</span>
                    <Badge variant="secondary">{executions.length || run._count?.toolExecution || 0}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Logs Generated</span>
                    <Badge variant="secondary">{logs.length || run._count?.logs || 0}</Badge>
                  </div>
                  {(run.status === "RUNNING" || run.status === "PENDING") && (
                    <div className="flex items-center gap-2 text-xs text-green-500 mt-2">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                      </span>
                      Live updates active
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/10">
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-12 h-12 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto">
                <Cpu size={24} />
              </div>
              <div>
                <p className="text-sm font-bold">Need more power?</p>
                <p className="text-xs text-muted-foreground mt-1">Upgrade your compute plan to reduce latency and increase token limits.</p>
              </div>
              <Link to="/pricing" className="w-full">
                <Button size="sm" className="w-full" variant="outline">Learn More</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
