import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, Star, Rocket, Clock, Archive, MoreHorizontal, EyeOff, Eye } from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface Project {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  techStack: string[];
  status: "live" | "in-development" | "archived";
  featured: boolean;
  isHidden: boolean;
  displayOrder: number;
  createdAt: string;
  screenshots?: string[];
}

const STATUS_META = {
  live:             { icon: Rocket,  label: "Live",     cls: "bg-primary/10 text-primary border-primary/20" },
  "in-development": { icon: Clock,   label: "In Dev",   cls: "bg-yellow-400/10 text-yellow-400 border-yellow-400/20" },
  archived:         { icon: Archive, label: "Archived", cls: "bg-surface-container text-outline border-outline-variant/20" },
} as const;

// ── Context menu ──────────────────────────────────────────────────────────────
function CardMenu({
  isHidden,
  onEdit,
  onToggleHidden,
  onDelete,
}: {
  isHidden: boolean;
  onEdit: () => void;
  onToggleHidden: () => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }}
        className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-all"
      >
        <MoreHorizontal size={16} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -4 }}
            transition={{ duration: 0.12 }}
            className="absolute right-0 top-full mt-1 z-50 w-40 rounded-xl border border-outline-variant/20 bg-surface-container-high shadow-xl overflow-hidden"
          >
            <button
              onClick={(e) => { e.stopPropagation(); setOpen(false); onEdit(); }}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container-highest transition-colors"
            >
              <Pencil size={14} className="text-primary" />
              Edit
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setOpen(false); onToggleHidden(); }}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container-highest transition-colors"
            >
              {isHidden
                ? <><Eye size={14} className="text-yellow-400" />Show project</>
                : <><EyeOff size={14} className="text-yellow-400" />Hide project</>
              }
            </button>
            <div className="mx-3 border-t border-outline-variant/10" />
            <button
              onClick={(e) => { e.stopPropagation(); setOpen(false); onDelete(); }}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-error hover:bg-error/10 transition-colors"
            >
              <Trash2 size={14} />
              Delete
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Project card ──────────────────────────────────────────────────────────────
function ProjectCard({
  project,
  index,
  onEdit,
  onToggleHidden,
  onDelete,
  deleting,
}: {
  project: Project;
  index: number;
  onEdit: () => void;
  onToggleHidden: () => void;
  onDelete: () => void;
  deleting: boolean;
}) {
  const thumbnail = project.screenshots?.[0] ?? null;
  const { icon: StatusIcon, label, cls } = STATUS_META[project.status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.35, ease: "easeOut" }}
      className={`relative flex flex-col rounded-xl border bg-surface-container-high overflow-hidden transition-all ${
        project.isHidden
          ? "border-outline-variant/10 opacity-60"
          : project.featured
            ? "border-primary/30 shadow-[0_0_24px_-8px_rgba(158,255,200,0.25)]"
            : "border-outline-variant/10 hover:border-outline-variant/30"
      } ${deleting ? "opacity-40 pointer-events-none" : ""}`}
    >
      {/* Thumbnail */}
      <div className="relative h-52 bg-surface-container overflow-hidden flex-shrink-0">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-7xl font-black tracking-tighter text-outline/30 select-none">
            {project.title.slice(0, 2).toUpperCase()}
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-surface-container-high to-transparent" />

        {/* Status badge */}
        <span className={`absolute top-2.5 left-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border backdrop-blur-md ${cls}`}>
          <StatusIcon size={10} />
          {label}
        </span>

        {/* Featured star */}
        {project.featured && !project.isHidden && (
          <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center">
            <Star size={11} className="text-primary fill-primary" />
          </div>
        )}

        {/* Hidden overlay banner */}
        {project.isHidden && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] z-10">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/70 border border-yellow-400/30 text-yellow-400 text-xs font-bold">
              <EyeOff size={12} />
              Hidden from portfolio
            </div>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col gap-3 p-5 flex-1">
        {/* Title row */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-extrabold text-on-surface text-lg leading-tight line-clamp-1">
            {project.title}
          </h3>
          <CardMenu isHidden={project.isHidden} onEdit={onEdit} onToggleHidden={onToggleHidden} onDelete={onDelete} />
        </div>

        {/* Description */}
        <p className="text-on-surface-variant text-sm leading-relaxed line-clamp-2">
          {project.shortDescription}
        </p>

        {/* Stack */}
        <div className="flex flex-wrap gap-1 mt-auto pt-1">
          {project.techStack.slice(0, 4).map((t) => (
            <span
              key={t}
              className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded border border-primary/20 uppercase tracking-wide"
            >
              {t}
            </span>
          ))}
          {project.techStack.length > 4 && (
            <span className="text-[10px] text-outline self-center">
              +{project.techStack.length - 4}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Projects() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/projects/admin", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => setProjects(data.data ?? []))
      .catch(() => setError("Could not load projects. Is the backend running?"))
      .finally(() => setLoading(false));
  }, [token]);

  async function handleToggleHidden(id: string, currentlyHidden: boolean) {
    const res = await fetch(`http://localhost:5000/api/projects/${id}/visibility`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ isHidden: !currentlyHidden }),
    });
    if (res.ok) {
      setProjects((p) =>
        p.map((proj) => (proj.id === id ? { ...proj, isHidden: !currentlyHidden } : proj))
      );
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this project? This cannot be undone.")) return;
    setDeleting(id);
    try {
      const res = await fetch(`http://localhost:5000/api/projects/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok || res.status === 204) {
        setProjects((p) => p.filter((proj) => proj.id !== id));
      }
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-8 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-3xl font-extrabold font-headline tracking-tight text-on-surface">
            Projects
          </h2>
          <p className="text-on-surface-variant text-sm mt-1">
            {projects.length} total · manage your portfolio entries
          </p>
        </div>
        <button
          onClick={() => navigate("/projects/new")}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-br from-primary to-primary-dim text-on-primary text-sm font-bold rounded-xl shadow-[0_0_20px_rgba(158,255,200,0.2)] hover:shadow-[0_0_30px_rgba(158,255,200,0.4)] transition-all active:scale-95"
        >
          <Plus size={16} />
          New Project
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-32 text-on-surface-variant text-sm gap-3">
          <span className="w-4 h-4 rounded-full border-2 border-outline-variant border-t-primary animate-spin" />
          Loading projects…
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="py-10 text-center text-error text-sm">{error}</div>
      )}

      {/* Empty */}
      {!loading && !error && projects.length === 0 && (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <p className="text-on-surface-variant text-sm">No projects yet.</p>
          <button
            onClick={() => navigate("/projects/new")}
            className="flex items-center gap-2 px-5 py-2.5 border border-outline-variant/30 text-on-surface-variant hover:text-primary hover:border-primary/30 rounded-xl text-sm font-bold transition-all"
          >
            <Plus size={15} /> Add your first project
          </button>
        </div>
      )}

      {/* Card grid */}
      {!loading && !error && projects.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={i}
              onEdit={() => navigate(`/projects/${project.id}/edit`)}
              onToggleHidden={() => handleToggleHidden(project.id, project.isHidden)}
              onDelete={() => handleDelete(project.id)}
              deleting={deleting === project.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
