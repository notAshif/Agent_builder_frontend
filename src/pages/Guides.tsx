import { motion } from "framer-motion";
import { BookOpen, Mail, Search, Code, Bot, Globe, Database } from "lucide-react";

const guides = [
  { icon: Mail, title: "Building an Email Assistant", desc: "Create an agent that drafts and sends emails from support tickets.", level: "Beginner", time: "10 min" },
  { icon: Search, title: "Web Research Agent", desc: "Build a research agent that searches the web and summarizes findings.", level: "Beginner", time: "8 min" },
  { icon: Code, title: "Code Review Agent", desc: "Automate code reviews with an agent that executes and analyzes code.", level: "Intermediate", time: "15 min" },
  { icon: Globe, title: "API Integration Agent", desc: "Connect external APIs and build agents that call them dynamically.", level: "Intermediate", time: "12 min" },
  { icon: Database, title: "Data Analysis Pipeline", desc: "Chain database queries, transformations, and reporting in one agent.", level: "Advanced", time: "20 min" },
  { icon: Bot, title: "Customer Support Bot", desc: "Deploy a support agent that checks CRM context and drafts replies.", level: "Advanced", time: "25 min" },
];

const levelColors: Record<string, string> = {
  Beginner: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  Intermediate: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  Advanced: "text-red-400 bg-red-400/10 border-red-400/20",
};

export default function Guides() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-2 text-primary mb-4">
            <BookOpen size={20} />
            <span className="text-xs font-bold uppercase tracking-widest">Guides</span>
          </div>
          <h1 className="text-4xl font-bold mb-2">Step-by-Step Guides</h1>
          <p className="text-muted-foreground mb-12">Practical tutorials to build real-world agents.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guides.map((guide, i) => (
            <motion.div
              key={guide.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ y: -4 }}
              className="rounded-2xl border border-border bg-card p-6 hover:border-primary/30 transition-all group"
            >
              <div className="p-3 rounded-xl bg-primary/10 text-primary w-fit mb-4 group-hover:bg-primary group-hover:text-white transition-all">
                <guide.icon size={22} />
              </div>
              <h3 className="font-bold mb-1">{guide.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{guide.desc}</p>
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${levelColors[guide.level]}`}>
                  {guide.level}
                </span>
                <span className="text-[10px] text-muted-foreground">{guide.time}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
