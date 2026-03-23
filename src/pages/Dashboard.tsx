import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  GitBranch, Rocket, MessageSquare, Eye,
  TrendingUp, User, Sparkles,
} from "lucide-react";

function useCountUp(target: number, duration = 1200) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

const stats = [
  { label: "Total Projects", Icon: GitBranch, value: 7, trend: "+2 this month" },
  { label: "Live Projects", Icon: Rocket, value: 5, trend: "+1 new" },
  { label: "Unread Messages", Icon: MessageSquare, value: 3, trend: "3 new" },
  { label: "Total Views", Icon: Eye, value: 1200, trend: "+8%" },
];

function StatCard({ label, Icon, value, trend, delay }: typeof stats[0] & { delay: number }) {
  const count = useCountUp(value);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="bg-surface-container-high p-6 rounded-xl hover:bg-surface-container-highest transition-all duration-300"
    >
      <div className="flex justify-between items-start mb-4">
        <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">{label}</span>
        <Icon size={18} className="text-primary-dim" />
      </div>
      <div className="flex items-end justify-between">
        <h2 className="text-4xl font-extrabold font-headline leading-none">
          {value >= 1000 ? `${(count / 1000).toFixed(1)}k` : count}
        </h2>
        <div className="flex items-center gap-1 text-primary text-xs font-bold">
          <TrendingUp size={13} />
          {trend}
        </div>
      </div>
    </motion.div>
  );
}

const recentProjects = [
  { name: "Pendu", updated: "2h ago", status: "live", stack: ["Flutter", "Socket.IO"] },
  { name: "BistroPulse", updated: "1d ago", status: "live", stack: ["Angular", "SCSS"] },
  { name: "StockPilot", updated: "3d ago", status: "in-development", stack: ["React", "Node.js"] },
];

const messages = [
  { name: "Recruiter — TechCorp", preview: "Interested in your portfolio...", time: "12:45 PM", unread: true },
  { name: "Collaborator", preview: "Can you check the API endpoints?", time: "Yesterday", unread: true },
  { name: "Client", preview: "Meeting scheduled for Monday 9AM", time: "2d ago", unread: false },
];

const stagger = {
  container: { animate: { transition: { staggerChildren: 0.08 } } },
  item: { initial: { opacity: 0, x: -10 }, animate: { opacity: 1, x: 0 } },
};

export default function Dashboard() {
  const [aiLoading, setAiLoading] = useState<string | null>(null);

  function handleAiGenerate(name: string) {
    setAiLoading(name);
    setTimeout(() => setAiLoading(null), 2500);
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto w-full">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => <StatCard key={s.label} {...s} delay={i * 0.1} />)}
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Projects */}
        <div className="lg:col-span-2">
          <div className="bg-surface-container-high rounded-xl overflow-hidden">
            <div className="px-6 py-5 flex justify-between items-center border-b border-outline-variant/10">
              <h3 className="font-headline font-bold text-lg">Recent Projects</h3>
              <button className="text-xs text-primary font-bold hover:underline">View All</button>
            </div>
            <table className="w-full text-left">
              <thead className="bg-surface-container/50">
                <tr className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                  <th className="px-6 py-4">Project</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Stack</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <motion.tbody
                variants={stagger.container}
                initial="initial"
                animate="animate"
                className="divide-y divide-outline-variant/5"
              >
                {recentProjects.map((p) => (
                  <motion.tr key={p.name} variants={stagger.item} className="hover:bg-surface-container-highest/50 transition-colors">
                    <td className="px-6 py-5">
                      <div className="font-semibold text-sm">{p.name}</div>
                      <div className="text-[10px] text-on-surface-variant">Updated {p.updated}</div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${p.status === "live" ? "bg-primary/10 text-primary" : "bg-yellow-500/10 text-yellow-400"}`}>
                        <span className={`w-1 h-1 rounded-full mr-1.5 ${p.status === "live" ? "bg-primary animate-pulse" : "bg-yellow-400"}`} />
                        {p.status}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex gap-2 flex-wrap">
                        {p.stack.map((t) => (
                          <span key={t} className="text-[10px] bg-surface-container px-2 py-1 rounded text-on-surface-variant">{t}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button
                        onClick={() => handleAiGenerate(p.name)}
                        disabled={aiLoading === p.name}
                        className={`inline-flex items-center gap-1.5 text-on-primary text-[10px] font-bold px-3 py-1.5 rounded transition-all active:scale-95 glow-accent ${aiLoading === p.name ? "bg-primary-dim animate-pulse cursor-wait" : "bg-primary hover:bg-primary-dim"}`}
                      >
                        <Sparkles size={11} />
                        {aiLoading === p.name ? "Generating..." : "AI Generate"}
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </motion.tbody>
            </table>
          </div>
        </div>

        {/* Messages */}
        <div className="bg-surface-container-high rounded-xl flex flex-col">
          <div className="px-6 py-5 flex justify-between items-center border-b border-outline-variant/10">
            <h3 className="font-headline font-bold text-lg">Messages</h3>
            <span className="bg-primary text-on-primary text-[10px] font-black px-1.5 py-0.5 rounded-sm">
              {messages.filter(m => m.unread).length} NEW
            </span>
          </div>
          <div className="p-2 flex-1 space-y-1">
            {messages.map((m) => (
              <div key={m.name} className="p-4 hover:bg-surface-container-highest rounded-lg transition-all cursor-pointer flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center shrink-0">
                  <User size={16} className="text-on-surface-variant" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h4 className="text-sm font-bold truncate">{m.name}</h4>
                    <span className="text-[9px] text-on-surface-variant shrink-0 ml-2">{m.time}</span>
                  </div>
                  <p className="text-xs text-on-surface-variant truncate">{m.preview}</p>
                </div>
                {m.unread && <div className="w-2 h-2 bg-primary rounded-full shrink-0" />}
              </div>
            ))}
          </div>
          <button className="m-4 py-3 border border-outline-variant/10 rounded-lg text-xs font-bold text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-colors">
            View All Messages
          </button>
        </div>
      </div>
    </div>
  );
}
