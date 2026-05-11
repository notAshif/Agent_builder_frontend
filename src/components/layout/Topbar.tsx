import { useLocation } from "react-router-dom";
import { Bell, Search } from "lucide-react";
import { Input } from "../ui/Input";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard Overview",
  "/agents": "My Agents",
  "/agents/new": "Create New Agent",
  "/tools": "Tool Library",
  "/settings": "Settings & Account",
};

export default function Topbar() {
  const location = useLocation();
  const title = pageTitles[location.pathname] || "Agent Details";

  return (
    <header className="h-16 border-b border-border bg-background/50 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-10">
      <h1 className="font-semibold text-lg">{title}</h1>

      <div className="flex items-center gap-6">
        <div className="relative w-64 hidden md:block">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search agents, runs..." 
            className="pl-10 h-10 bg-muted/50 border-transparent focus:bg-background focus:border-border"
          />
        </div>

        <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors rounded-xl hover:bg-muted">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-background"></span>
        </button>
      </div>
    </header>
  );
}
