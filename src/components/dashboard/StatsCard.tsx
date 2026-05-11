import type { LucideIcon } from "lucide-react";
import { Card } from "../ui/Card";
import { cn } from "../../lib/utils";

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isUp: boolean;
  };
  className?: string;
  iconClassName?: string;
}

export default function StatsCard({ label, value, icon: Icon, trend, className, iconClassName }: StatsCardProps) {
  return (
    <Card className={cn("p-6 overflow-hidden relative group hover:border-primary/30 transition-all", className)}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground font-medium mb-1">{label}</p>
          <h3 className="text-3xl font-bold tracking-tight">{value}</h3>
          
          {trend && (
            <p className={cn(
              "text-xs mt-2 flex items-center gap-1",
              trend.isUp ? "text-green-500" : "text-red-500"
            )}>
              <span>{trend.isUp ? "↑" : "↓"}</span>
              <span className="font-medium">{trend.value}%</span>
              <span className="text-muted-foreground">vs last week</span>
            </p>
          )}
        </div>

        <div className={cn("p-4 rounded-2xl bg-muted group-hover:scale-110 transition-transform", iconClassName)}>
          <Icon className="text-foreground" size={24} />
        </div>
      </div>
      
      {/* Subtle background decoration */}
      <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
    </Card>
  );
}
