import { Bot, Play, Edit, Trash2, Wrench } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/Card";
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
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="h-full flex flex-col group overflow-hidden border-border/50 hover:border-primary/50 transition-all duration-300">
        <CardHeader className="pb-3 relative">
          <div className="flex justify-between items-start mb-2">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm shadow-primary/10">
              <Bot size={24} />
            </div>
            <Badge variant={agent.status === "ACTIVE" ? "success" : "secondary"}>
              {agent.status}
            </Badge>
          </div>
          <CardTitle className="line-clamp-1">{agent.name}</CardTitle>
          <div className="flex gap-2 mt-2">
            <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-wider opacity-70">
              {agent.purpose.replace("_", " ")}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 pb-4">
          <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">
            {agent.description || "No description provided."}
          </p>
          
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Wrench size={14} className="text-primary" />
              <span>{agent._count?.tools || 0} Tools</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Play size={14} className="text-primary" />
              <span>{agent._count?.runs || 0} Runs</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-4 border-t border-border/50 bg-muted/30 flex gap-2">
          <Button size="sm" className="flex-1 gap-2" onClick={() => onRun(agent)}>
            <Play size={14} />
            Run
          </Button>
          <Link to={`/agents/${agent.id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full gap-2">
              <Edit size={14} />
              Edit
            </Button>
          </Link>
          <Button 
            variant="danger" 
            size="sm" 
            className="px-2 border-transparent"
            onClick={() => onDelete(agent.id)}
          >
            <Trash2 size={14} />
          </Button>
        </CardFooter>
        
        <div className="px-6 py-2 bg-muted/50 border-t border-border/30">
          <p className="text-[10px] text-muted-foreground text-center">
            Updated {formatDistanceToNow(new Date(agent.updatedAt))} ago
          </p>
        </div>
      </Card>
    </motion.div>
  );
}
