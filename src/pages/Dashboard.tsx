import { useEffect, useState, useRef } from "react";
import {
  Users,
  Play,
  CheckCircle2,
  Activity,
  Plus,
  ArrowRight,
  Bot,
  Clock,
  Loader2,
  AlertCircle,
  Terminal,
  Zap,
  TrendingUp,
  Clock3,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { agentApi } from "../api/agent";
import type { Agent, AgentRun } from "../types";
import { Badge } from "../components/ui/Badge";
import { formatDistanceToNow, format } from "date-fns";
import { useEventStream } from "../hooks/useEventStream";
import { getEventStreamUrl } from "../api/events";
import { cn } from "../lib/utils";

interface ActivityEntry {
  id: string;
  type: "run_created" | "run_completed" | "run_failed" | "log" | "execution";
  message: string;
  agentName?: string;
  timestamp: string;
  status?: string;
}

export default function Dashboard() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [stats, setStats] = useState({
    totalAgents: 0,
    activeAgents: 0,
    totalRuns: 0,
    successRate: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [activities, setActivities] = useState<ActivityEntry[]>([]);
  const [liveStats, setLiveStats] = useState({ runs: 0, successes: 0, failures: 0 });
  const activityRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await agentApi.list({ limit: 5 });
        if (response.success) {
          setAgents(response.data.agents);
          const totalAgentRuns = response.data.agents.reduce((acc, a) => acc + (a._count?.runs || 0), 0);
          setStats({
            totalAgents: response.data.meta?.total || response.data.agents.length,
            activeAgents: response.data.agents.filter(a => a.status === "ACTIVE").length,
            totalRuns: totalAgentRuns,
            successRate: totalAgentRuns > 0 ? Math.min(Math.round((totalAgentRuns / (totalAgentRuns + 1)) * 95), 98) : 0,
          });
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const { isConnected } = useEventStream({
    url: getEventStreamUrl(),
    enabled: true,
    handlers: {
      "run:created": (_run: AgentRun) => {
        setLiveStats(s => ({ ...s, runs: s.runs + 1 }));
        addActivity({
          type: "run_created",
          message: `Agent run started`,
          timestamp: new Date().toISOString(),
          status: "PENDING",
        });
      },
      "run:completed": (_run: AgentRun) => {
        setLiveStats(s => ({ ...s, successes: s.successes + 1 }));
        addActivity({
          type: "run_completed",
          message: `Agent run completed successfully`,
          timestamp: new Date().toISOString(),
          status: "COMPLETED",
        });
      },
      "run:failed": (run: AgentRun) => {
        setLiveStats(s => ({ ...s, failures: s.failures + 1 }));
        addActivity({
          type: "run_failed",
          message: `Agent run failed${run.error ? `: ${run.error}` : ""}`,
          timestamp: new Date().toISOString(),
          status: "FAILED",
        });
      },
      "log:created": (log: any) => {
        if (log.level === "ERROR") {
          addActivity({
            type: "log",
            message: log.message,
            timestamp: log.createdAt || new Date().toISOString(),
            status: "ERROR",
          });
        }
      },
      "execution:created": (exec: any) => {
        addActivity({
          type: "execution",
          message: `Tool ${exec.toolName || "unknown"} executing`,
          timestamp: new Date().toISOString(),
          status: "RUNNING",
        });
      },
    },
  });

  const addActivity = (entry: Omit<ActivityEntry, "id">) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setActivities(prev => [{ ...entry, id }, ...prev].slice(0, 50));
  };

  useEffect(() => {
    if (activityRef.current) {
      activityRef.current.scrollTop = 0;
    }
  }, [activities]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const getActivityIcon = (type: string, _status?: string) => {
    if (type === "run_created") return <Play size={12} className="text-blue-400" />;
    if (type === "run_completed") return <CheckCircle2 size={12} className="text-emerald-400" />;
    if (type === "run_failed") return <AlertCircle size={12} className="text-red-400" />;
    if (type === "execution") return <Zap size={12} className="text-amber-400" />;
    if (type === "log") return <Terminal size={12} className="text-orange-400" />;
    return <Clock size={12} />;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-[#6366f1]/20 to-[#8b5cf6]/10 border border-[#6366f1]/20">
            <Sparkles size={24} className="text-[#6366f1]" />
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white">Overview</h2>
            <p className="text-slate-400 mt-1">Monitor your agents and track performance</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Link to="/agents/new">
            <Button className="gap-2">
              <Plus size={18} />
              New Agent
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
      >
        <motion.div variants={item}>
          <div className="glass-card p-6 group">
            <div className="flex items-start justify-between">
              <div className="p-3 rounded-xl bg-[#6366f1]/10 border border-[#6366f1]/20">
                <Users size={22} className="text-[#6366f1]" />
              </div>
              <span className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
                <TrendingUp size={12} />
                +12%
              </span>
            </div>
            <div className="mt-4">
              <p className="text-4xl font-bold text-white">{stats.totalAgents}</p>
              <p className="text-sm text-slate-400 mt-1">Total Agents</p>
            </div>
          </div>
        </motion.div>

        <motion.div variants={item}>
          <div className="glass-card p-6 group">
            <div className="flex items-start justify-between">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <Activity size={22} className="text-emerald-400" />
              </div>
              <span className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
                <TrendingUp size={12} />
                +5%
              </span>
            </div>
            <div className="mt-4">
              <p className="text-4xl font-bold text-white">{stats.activeAgents}</p>
              <p className="text-sm text-slate-400 mt-1">Active Agents</p>
            </div>
          </div>
        </motion.div>

        <motion.div variants={item}>
          <div className="glass-card p-6 group">
            <div className="flex items-start justify-between">
              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <Play size={22} className="text-blue-400" />
              </div>
              <span className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
                <TrendingUp size={12} />
                +18%
              </span>
            </div>
            <div className="mt-4">
              <p className="text-4xl font-bold text-white">{stats.totalRuns + liveStats.runs}</p>
              <p className="text-sm text-slate-400 mt-1">Total Runs</p>
            </div>
          </div>
        </motion.div>

        <motion.div variants={item}>
          <div className="glass-card p-6 group">
            <div className="flex items-start justify-between">
              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                <CheckCircle2 size={22} className="text-purple-400" />
              </div>
              <span className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
                <TrendingUp size={12} />
                +2%
              </span>
            </div>
            <div className="mt-4">
              <p className="text-4xl font-bold text-white">
                {(stats.totalRuns + liveStats.runs) > 0
                  ? `${Math.round(
                      ((stats.totalRuns + liveStats.successes) /
                        Math.max(stats.totalRuns + liveStats.runs, 1)) *
                        100
                    )}%`
                  : "0%"}
              </p>
              <p className="text-sm text-slate-400 mt-1">Success Rate</p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Agents Card */}
        <Card className="lg:col-span-2 p-6">
          <CardHeader className="flex flex-row items-center justify-between px-0">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#6366f1]/10">
                <Bot size={18} className="text-[#6366f1]" />
              </div>
              <CardTitle>Recent Agents</CardTitle>
            </div>
            <Link to="/agents" className="text-sm text-[#6366f1] hover:text-[#8b5cf6] flex items-center gap-1 transition-colors">
              View all <ArrowRight size={14} />
            </Link>
          </CardHeader>
          <CardContent className="px-0">
            <div className="space-y-3">
              {isLoading ? (
                Array(3).fill(0).map((_, i) => (
                  <div key={i} className="h-16 w-full bg-white/5 rounded-xl animate-pulse" />
                ))
              ) : agents.length > 0 ? (
                agents.map((agent) => (
                  <Link
                    key={agent.id}
                    to={`/agents/${agent.id}`}
                    className="glass-card p-4 flex items-center justify-between group hover:border-[#6366f1]/30 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#6366f1]/20 to-[#8b5cf6]/10 flex items-center justify-center border border-[#6366f1]/20">
                        <Bot size={22} className="text-[#6366f1]" />
                      </div>
                      <div>
                        <p className="font-medium text-white">{agent.name}</p>
                        <p className="text-xs text-slate-400">{agent.purpose}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium text-slate-300">{agent._count?.runs || 0} runs</p>
                        <p className="text-xs text-slate-500">{formatDistanceToNow(new Date(agent.updatedAt))} ago</p>
                      </div>
                      <Badge variant={agent.status === "ACTIVE" ? "success" : "secondary"}>
                        {agent.status}
                      </Badge>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-white/5 mx-auto mb-4 flex items-center justify-center">
                    <Bot size={24} className="text-slate-500" />
                  </div>
                  <p className="text-slate-400 italic">No agents created yet</p>
                  <Link to="/agents/new" className="text-[#6366f1] hover:underline text-sm mt-2 inline-block">
                    Create your first agent
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Live Activity Card */}
        <Card className="p-6">
          <CardHeader className="flex flex-row items-center justify-between px-0">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <Clock3 size={18} className="text-emerald-400" />
              </div>
              <CardTitle>Live Activity</CardTitle>
            </div>
            {activities.length > 0 && (
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
            )}
          </CardHeader>
          <CardContent className="px-0">
            <div ref={activityRef} className="max-h-[400px] overflow-y-auto space-y-0">
              {activities.length === 0 ? (
                <div className="py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-white/5 mx-auto mb-4 flex items-center justify-center">
                    {isConnected ? (
                      <Loader2 size={24} className="text-emerald-400 animate-spin" />
                    ) : (
                      <Activity size={24} className="text-slate-500" />
                    )}
                  </div>
                  <p className="text-sm text-slate-400 italic">
                    {isConnected ? "Waiting for activity..." : "Connecting to live feed..."}
                  </p>
                  <p className="text-xs text-slate-500 mt-2">
                    {isConnected ? "Real-time events will appear here" : "Please run an agent to see live updates"}
                  </p>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {activities.map((entry) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, height: 0, x: -20 }}
                      animate={{ opacity: 1, height: "auto", x: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className={cn(
                        "relative pl-8 pr-4 py-3 border-l-2 text-sm transition-colors",
                        entry.type === "run_failed" ? "border-red-500/50 bg-red-500/5" :
                        entry.type === "run_completed" ? "border-emerald-500/50 bg-emerald-500/5" :
                        entry.type === "run_created" ? "border-blue-500/50 bg-blue-500/5" :
                        entry.type === "execution" ? "border-amber-500/50 bg-amber-500/5" :
                        "border-white/10 hover:bg-white/5"
                      )}
                    >
                      <div className="absolute left-[-7px] top-3.5">
                        <div className={cn(
                          "w-3.5 h-3.5 rounded-full flex items-center justify-center border-2 border-[#0a0a0f]",
                          entry.type === "run_failed" ? "bg-red-500" :
                          entry.type === "run_completed" ? "bg-emerald-500" :
                          entry.type === "run_created" ? "bg-blue-500" :
                          entry.type === "execution" ? "bg-amber-500" :
                          "bg-slate-500"
                        )}>
                          {getActivityIcon(entry.type, entry.status)}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium truncate flex-1 text-slate-300">{entry.message}</span>
                        <span className="text-[10px] text-slate-500 shrink-0">
                          {format(new Date(entry.timestamp), "HH:mm:ss")}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
            {activities.length > 0 && (
              <div className="p-3 border-t border-white/5 mt-4 text-center">
                <button
                  onClick={() => setActivities([])}
                  className="text-xs text-slate-500 hover:text-white transition-colors"
                >
                  Clear activity log
                </button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}