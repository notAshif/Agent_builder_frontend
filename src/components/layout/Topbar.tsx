import { useLocation } from "react-router-dom";
import { Bell, Search } from "lucide-react";
import { Input } from "../ui/Input";
import { motion } from "framer-motion";
import { useState } from "react";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/agents": "My Agents",
  "/agents/new": "Create New Agent",
  "/tools": "Tool Library",
  "/settings": "Settings",
};

const pageDescriptions: Record<string, string> = {
  "/dashboard": "Monitor your agents and view activity",
  "/agents": "Manage and monitor your AI agents",
  "/agents/new": "Create a new AI agent",
  "/tools": "Browse available tools and integrations",
  "/settings": "Configure your account and preferences",
};

export default function Topbar() {
  const location = useLocation();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const title = pageTitles[location.pathname] || "Agent Details";
  const description = pageDescriptions[location.pathname] || "View agent details and run history";

  return (
    <header className="h-[72px] border-b border-white/5 glass sticky top-0 z-20 flex items-center px-6">
      {/* Left Section - Title & Description */}
      <div className="flex flex-col">
        <motion.h1
          key={location.pathname}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-semibold text-lg text-white"
        >
          {title}
        </motion.h1>
        <p className="text-xs text-slate-500 hidden sm:block">{description}</p>
      </div>

      {/* Right Section - Search & Actions */}
      <div className="ml-auto flex items-center gap-4">
        {/* Search */}
        <motion.div
          animate={{
            width: isSearchFocused ? 320 : 200,
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative"
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input
            placeholder="Search agents..."
            className="pl-10 h-10 bg-[#16161d] border-white/5 focus:bg-[#1c1c25] focus:border-[#6366f1]/30"
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          />
        </motion.div>

        {/* Notifications */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative p-2.5 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all"
        >
          <Bell size={20} />
          {/* Notification Badge */}
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] rounded-full border-2 border-[#0a0a0f]" />
        </motion.button>

        {/* Quick Actions */}
        <div className="h-8 w-px bg-white/10 hidden md:block" />

        <div className="hidden md:flex items-center gap-2">
          <span className="text-xs text-slate-500">Status:</span>
          <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            Online
          </span>
        </div>
      </div>
    </header>
  );
}