import type { LucideIcon } from "lucide-react";
import { cn } from "../../lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

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
    <div className={cn("glass-card p-6 group relative overflow-hidden", className)}>
      {/* Background Glow */}
      <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-gradient-to-br from-[#6366f1]/10 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="flex items-start justify-between relative z-10">
        <div className="flex-1">
          <p className="text-sm text-slate-400 font-medium mb-2">{label}</p>
          <h3 className="text-4xl font-bold tracking-tight text-white">{value}</h3>

          {trend && (
            <div className={cn(
              "flex items-center gap-1.5 mt-3 text-xs font-medium px-2 py-1 rounded-full w-fit",
              trend.isUp ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20" : "text-red-400 bg-red-500/10 border border-red-500/20"
            )}>
              {trend.isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              <span>{trend.value}%</span>
              <span className="text-slate-500 ml-1">vs last week</span>
            </div>
          )}
        </div>

        <div className={cn(
          "p-3 rounded-xl transition-all duration-300 group-hover:scale-110",
          iconClassName || "bg-[#6366f1]/10 border border-[#6366f1]/20"
        )}>
          <Icon className="text-[#6366f1] group-hover:text-[#8b5cf6]" size={22} />
        </div>
      </div>
    </div>
  );
}