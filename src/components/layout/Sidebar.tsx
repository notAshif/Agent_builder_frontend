import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Bot, 
  Wrench, 
  Settings, 
  LogOut, 
  PlusCircle,
  Cpu
} from "lucide-react";
import { cn } from "../../lib/utils";
import { useAuthStore } from "../../stores/authStore";
import { Button } from "../ui/Button";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Bot, label: "Agents", href: "/agents" },
  { icon: Wrench, label: "Tools", href: "/tools" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };

  return (
    <aside className="w-64 border-r border-border bg-card flex flex-col h-full overflow-hidden">
      <Link to="/dashboard" className="p-6 flex items-center gap-3 hover:opacity-80 transition-opacity">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
          <Cpu size={24} />
        </div>
        <span className="font-bold text-xl tracking-tight">AgentBuilder</span>
      </Link>

      <div className="px-4 py-4">
        <Link to="/agents/new">
          <Button className="w-full justify-start gap-2 mb-6" variant="primary">
            <PlusCircle size={18} />
            Create New Agent
          </Button>
        </Link>

        <nav className="space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                location.pathname === item.href
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon 
                size={20} 
                className={cn(
                  "transition-colors",
                  location.pathname === item.href ? "text-primary" : "group-hover:text-foreground"
                )} 
              />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-4 border-t border-border">
        <div className="flex items-center gap-3 px-2 py-2 mb-2">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-bold text-primary border border-border overflow-hidden">
            {user?.name?.[0] || user?.email[0].toUpperCase()}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium truncate">{user?.name || "User"}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
          onClick={handleLogout}
        >
          <LogOut size={18} />
          Logout
        </Button>
      </div>
    </aside>
  );
}
