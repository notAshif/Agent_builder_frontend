import { cn } from "../../lib/utils";
import { format } from "date-fns";

interface Log {
  id: string;
  level: "INFO" | "WARN" | "ERROR" | "DEBUG";
  message: string;
  createdAt: string;
  meta?: any;
}

export default function LogTimeline({ logs }: { logs: Log[] }) {
  return (
    <div className="space-y-4 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-border">
      {logs.map((log) => (
        <div key={log.id} className="relative pl-8 group">
          <div className={cn(
            "absolute left-0 top-1.5 w-6 h-6 rounded-full border-4 border-background z-10 flex items-center justify-center",
            log.level === "ERROR" ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" :
            log.level === "WARN" ? "bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]" :
            log.level === "DEBUG" ? "bg-blue-400" : "bg-primary shadow-[0_0_8px_rgba(99,102,241,0.5)]"
          )} />
          
          <div className="p-4 rounded-xl border border-border/50 bg-muted/20 group-hover:bg-muted/40 transition-colors">
            <div className="flex items-center justify-between mb-1">
              <span className={cn(
                "text-[10px] font-bold uppercase tracking-widest",
                log.level === "ERROR" ? "text-red-500" :
                log.level === "WARN" ? "text-yellow-500" :
                log.level === "DEBUG" ? "text-blue-400" : "text-primary"
              )}>
                {log.level}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {format(new Date(log.createdAt), "HH:mm:ss.SSS")}
              </span>
            </div>
            <p className="text-sm font-mono leading-relaxed">{log.message}</p>
            {log.meta && Object.keys(log.meta).length > 0 && (
              <pre className="mt-2 p-2 rounded bg-black/40 text-[10px] overflow-x-auto text-muted-foreground">
                {JSON.stringify(log.meta, null, 2)}
              </pre>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
