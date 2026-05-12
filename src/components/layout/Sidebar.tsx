import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Bot,
  Wrench,
  Settings,
  LogOut,
  PlusCircle,
  Cpu,
  Globe,
  ChevronRight
} from "lucide-react";
import { cn } from "../../lib/utils";
import { useAuthStore } from "../../stores/authStore";
import { Button } from "../ui/Button";
import { motion } from "framer-motion";

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

  const avatarUrl = user?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || user?.email || "U")}&background=6366f1&color=fff&size=200`;

  return (
    <aside className="w-[280px] h-full flex flex-col relative overflow-hidden">
      {/* Background Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#6366f1]/5 via-transparent to-transparent pointer-events-none" />

      {/* Glass Overlay */}
      <div className="absolute inset-0 glass pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full p-6">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-3 mb-8 group">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center text-white shadow-lg shadow-primary/30 group-hover:shadow-primary/50 transition-all group-hover:scale-105">
            <Cpu size={22} />
          </div>
          <div>
            <span className="font-bold text-lg text-white tracking-tight">AgentBuilder</span>
            <span className="block text-[10px] text-slate-500 uppercase tracking-widest">AI Platform</span>
          </div>
        </Link>

        {/* Create Agent Button */}
        <Link to="/agents/new" className="mb-6 block">
          <Button className="w-full justify-start gap-3 group" variant="primary">
            <PlusCircle size={18} className="group-hover:scale-110 transition-transform" />
            Create New Agent
          </Button>
        </Link>

        {/* Navigation */}
        <nav className="space-y-1 flex-1">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + "/");
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative group",
                    isActive
                      ? "bg-gradient-to-r from-[#6366f1]/20 to-transparent text-white"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  )}
                >
                  {/* Active Indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-[#6366f1] to-[#8b5cf6] rounded-r-full"
                    />
                  )}

                  <item.icon
                    size={20}
                    className={cn(
                      "transition-colors",
                      isActive ? "text-[#6366f1]" : "group-hover:text-white"
                    )}
                  />

                  <span className={cn(
                    "font-medium flex-1",
                    isActive && "text-white"
                  )}>
                    {item.label}
                  </span>

                  {isActive && (
                    <ChevronRight size={16} className="text-[#6366f1] opacity-60" />
                  )}
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="mt-auto pt-6 border-t border-white/5 space-y-3">
          {/* Landing Page Link */}
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:text-white hover:bg-white/5 transition-all"
          >
            <Globe size={18} />
            <span className="text-sm">Landing Page</span>
          </Link>

          {/* User Profile */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#6366f1]/30 bg-[#16161d] shrink-0">
              <img
                src={avatarUrl}
                alt="Profile"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=U&background=6366f1&color=fff&size=200`;
                }}
              />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{user?.name || "User"}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
            </div>
          </div>

          {/* Logout Button */}
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-slate-400 hover:text-red-400 hover:bg-red-500/10"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            Logout
          </Button>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-[#6366f1]/10 to-transparent rounded-full blur-2xl pointer-events-none" />
    </aside>
  );
}