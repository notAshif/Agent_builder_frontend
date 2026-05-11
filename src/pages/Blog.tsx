import { motion } from "framer-motion";
import { Cpu, Calendar, ArrowRight, Clock, Sparkles } from "lucide-react";
import { Badge } from "../components/ui/Badge";

const posts = [
  {
    title: "Introducing Prompt-to-Agent Generation",
    excerpt: "Describe what you need in plain English and watch the platform build your agent — tools, workflow, and all.",
    date: "May 8, 2026",
    readTime: "4 min read",
    tag: "Product",
  },
  {
    title: "Under the Hood: Agent Execution Engine",
    excerpt: "A deep dive into how agents reason, select tools, and execute workflows with Claude and GPT-4o.",
    date: "April 28, 2026",
    readTime: "7 min read",
    tag: "Engineering",
  },
  {
    title: "Building Reliable Tool Executors",
    excerpt: "How we handle retries, errors, and timeouts in the tool execution pipeline.",
    date: "April 15, 2026",
    readTime: "5 min read",
    tag: "Engineering",
  },
  {
    title: "Best Practices for Agent Prompts",
    excerpt: "Write better system prompts that produce reliable, structured agent outputs.",
    date: "April 5, 2026",
    readTime: "6 min read",
    tag: "Guides",
  },
];

export default function Blog() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-2 text-primary mb-4">
            <Sparkles size={20} />
            <span className="text-xs font-bold uppercase tracking-widest">Blog</span>
          </div>
          <h1 className="text-4xl font-bold mb-2">Latest Updates</h1>
          <p className="text-muted-foreground mb-12">Product launches, engineering deep dives, and guides.</p>
        </motion.div>

        <div className="space-y-6">
          {posts.map((post, i) => (
            <motion.article
              key={post.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="group rounded-2xl border border-border bg-card p-6 hover:border-primary/20 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3 mb-3">
                <Badge variant="secondary" className="text-[10px]">{post.tag}</Badge>
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                  <Calendar size={12} />
                  {post.date}
                </div>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Clock size={12} />
                  {post.readTime}
                </div>
              </div>
              <h2 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">{post.title}</h2>
              <p className="text-sm text-muted-foreground leading-6">{post.excerpt}</p>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-10 p-6 rounded-2xl border border-dashed border-border bg-muted/20 text-center"
        >
          <p className="text-xs text-muted-foreground">More posts coming soon.</p>
        </motion.div>
      </div>
    </div>
  );
}
