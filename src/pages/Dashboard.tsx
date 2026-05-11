import { useEffect, useState } from "react";
import { 
  Users, 
  Play, 
  CheckCircle2, 
  Activity,
  Plus,
  ArrowRight,
  Bot
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import StatsCard from "../components/dashboard/StatsCard";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { agentApi } from "../api/agent";
import type { Agent } from "../types";
import { Badge } from "../components/ui/Badge";
import { formatDistanceToNow } from "date-fns";

export default function Dashboard() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [stats, setStats] = useState({
    totalAgents: 0,
    activeAgents: 0,
    totalRuns: 0,
    successRate: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await agentApi.list({ limit: 5 });
        if (response.success) {
          setAgents(response.data.agents);
          // Mocking stats for now based on data
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

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
          <p className="text-muted-foreground mt-1">Welcome back! Here's what's happening with your agents.</p>
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
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <motion.div variants={item}>
          <StatsCard 
            label="Total Agents" 
            value={stats.totalAgents} 
            icon={Users} 
            iconClassName="bg-primary/10"
            trend={{ value: 12, isUp: true }}
          />
        </motion.div>
        <motion.div variants={item}>
          <StatsCard 
            label="Active Agents" 
            value={stats.activeAgents} 
            icon={Activity} 
            iconClassName="bg-green-500/10"
            trend={{ value: 5, isUp: true }}
          />
        </motion.div>
        <motion.div variants={item}>
          <StatsCard 
            label="Total Runs" 
            value={stats.totalRuns} 
            icon={Play} 
            iconClassName="bg-blue-500/10"
            trend={{ value: 18, isUp: true }}
          />
        </motion.div>
        <motion.div variants={item}>
          <StatsCard 
            label="Success Rate" 
            value={`${stats.successRate}%`} 
            icon={CheckCircle2} 
            iconClassName="bg-purple-500/10"
            trend={{ value: 2, isUp: true }}
          />
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Agents */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Agents</CardTitle>
            <Link to="/agents" className="text-sm text-primary hover:underline flex items-center gap-1">
              View all <ArrowRight size={14} />
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? (
                Array(3).fill(0).map((_, i) => (
                  <div key={i} className="h-16 w-full bg-muted/50 animate-pulse rounded-xl" />
                ))
              ) : agents.length > 0 ? (
                agents.map((agent) => (
                  <Link key={agent.id} to={`/agents/${agent.id}`} className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-primary/30 hover:bg-primary/5 transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                        <Bot size={20} className="text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <div>
                        <p className="font-medium">{agent.name}</p>
                        <p className="text-xs text-muted-foreground">{agent.purpose}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right hidden sm:block">
                        <p className="text-xs font-medium">{agent._count?.runs || 0} runs</p>
                        <p className="text-[10px] text-muted-foreground">{formatDistanceToNow(new Date(agent.updatedAt))} ago</p>
                      </div>
                      <Badge variant={agent.status === "ACTIVE" ? "success" : "secondary"}>
                        {agent.status}
                      </Badge>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="py-8 text-center text-muted-foreground italic">No agents created yet.</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Tips / Info */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="relative pl-6 pb-6 border-l border-border last:pb-0">
                <div className="absolute left-[-5px] top-0 w-2.5 h-2.5 rounded-full bg-primary" />
                <p className="text-xs text-muted-foreground mb-1">Yesterday, 4:20 PM</p>
                <p className="text-sm font-medium">New tool "Web Search" integrated</p>
                <p className="text-xs text-muted-foreground mt-1">Available for all research agents.</p>
              </div>
              <div className="relative pl-6 pb-6 border-l border-border last:pb-0">
                <div className="absolute left-[-5px] top-0 w-2.5 h-2.5 rounded-full bg-green-500" />
                <p className="text-xs text-muted-foreground mb-1">Today, 10:15 AM</p>
                <p className="text-sm font-medium">System Update v1.2.0</p>
                <p className="text-xs text-muted-foreground mt-1">Performance improvements for Claude-3 models.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
