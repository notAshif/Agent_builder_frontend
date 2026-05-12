import { Bot, Play, Edit, Trash2, Wrench } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import type { Agent } from "../../types";
import { formatDistanceToNow } from "date-fns";

interface AgentCardProps {
  agent: Agent;
  onDelete: (id: string) => void;
  onRun: (agent: Agent) => void;
}

export default function AgentCard({ agent, onDelete, onRun }: AgentCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <div className="glass-card p-5 h-full flex flex-col group relative overflow-hidden">
        {/* Background Glow on Hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#6366f1]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        <div className="relative z-10 flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-start mb-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#6366f1]/20 to-[#8b5cf6]/10 border border-[#6366f1]/20 flex items-center justify-center text-[#6366f1] group-hover:from-[#6366f1] group-hover:to-[#8b5cf6] group-hover:text-white group-hover:border-[#6366f1] transition-all duration-300">
              <Bot size={22} />
            </div>
            <Badge variant={agent.status === "ACTIVE" ? "success" : "secondary"}>
              {agent.status}
            </Badge>
          </div>

          {/* Title & Purpose */}
          <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1">{agent.name}</h3>
          <div className="flex gap-2 mb-3">
            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold bg-white/5 px-2 py-1 rounded-full border border-white/5">
              {agent.purpose.replace("_", " ")}
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-slate-400 line-clamp-2 min-h-[40px] flex-1">
            {agent.description || "No description provided."}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mt-5 py-4 border-t border-white/5">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <div className="p-1.5 rounded-lg bg-[#6366f1]/10 border border-[#6366f1]/20">
                <Wrench size={12} className="text-[#6366f1]" />
              </div>
              <span>{agent._count?.tools || 0} Tools</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <Play size={12} className="text-emerald-400" />
              </div>
              <span>{agent._count?.runs || 0} Runs</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-4">
            <Button size="sm" className="flex-1 gap-2" onClick={() => onRun(agent)}>
              <Play size={14} />
              Run
            </Button>
            <Link to={`/agents/${agent.id}`} className="flex-1">
              <Button variant="secondary" size="sm" className="w-full gap-2">
                <Edit size={14} />
                Edit
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              className="px-3 text-slate-500 hover:text-red-400 hover:bg-red-500/10"
              onClick={() => onDelete(agent.id)}
            >
              <Trash2 size={14} />
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-white/5 relative z-10">
          <p className="text-[10px] text-slate-600 text-center">
            Updated {formatDistanceToNow(new Date(agent.updatedAt))} ago
          </p>
        </div>

        {/* Animated Border */}
        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-0 rounded-xl p-[1px] bg-gradient-to-br from-[#6366f1]/50 to-[#8b5cf6]/50" />
        </div>
      </div>
    </motion.div>
  );
}