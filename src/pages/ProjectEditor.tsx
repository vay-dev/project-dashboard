import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Info,
  Code2,
  Link2,
  ExternalLink,
  Coffee,
  BrainCircuit,
  ImagePlus,
  Save,
  Sparkles,
  Plus,
  X,
  Settings2,
  CloudUpload,
  Wand2,
} from "lucide-react";

const TECH_SUGGESTIONS = ["React", "Next.js", "TypeScript", "Node.js", "Flutter", "Django", "PostgreSQL", "Tailwind", "GraphQL", "Redis"];

export default function ProjectEditor() {
  const navigate = useNavigate();
  const [techStack, setTechStack] = useState<string[]>(["React", "TypeScript"]);
  const [techInput, setTechInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [featured, setFeatured] = useState(false);

  function addTech(tech: string) {
    const t = tech.trim().toUpperCase();
    if (t && !techStack.includes(t)) setTechStack((p) => [...p, t]);
    setTechInput("");
  }

  function removeTech(tech: string) {
    setTechStack((p) => p.filter((t) => t !== tech));
  }

  function handleTechKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTech(techInput);
    }
  }

  async function handleAiGenerate() {
    setAiLoading(true);
    await new Promise((r) => setTimeout(r, 2000));
    setAiLoading(false);
  }

  return (
    <div className="max-w-7xl mx-auto px-8 py-10">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/projects")}
            className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-surface-container-high transition-colors group"
          >
            <ArrowLeft size={18} className="text-on-surface-variant group-hover:text-primary transition-colors" />
          </button>
          <div>
            <h2 className="text-3xl font-extrabold font-headline tracking-tight text-on-surface">
              New Project
            </h2>
            <p className="text-on-surface-variant text-sm mt-1">
              Initialize a new venture in the VAY Ecosystem.
            </p>
          </div>
        </div>
        <span className="px-3 py-1 bg-surface-container-highest text-[10px] font-bold tracking-widest uppercase border border-outline-variant/20 rounded-lg text-on-surface-variant">
          Draft Mode
        </span>
      </div>

      {/* Form Grid */}
      <form className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ── LEFT COLUMN ── */}
        <div className="lg:col-span-7 space-y-6">

          {/* Basic Info */}
          <section className="bg-surface-container-high rounded-xl p-8 border border-outline-variant/10">
            <div className="flex items-center gap-2 mb-6">
              <Info size={18} className="text-primary" />
              <h3 className="font-headline font-bold text-lg">Basic Info</h3>
            </div>
            <div className="space-y-6">

              <Field label="Project Title">
                <input
                  type="text"
                  placeholder="e.g. Project Neon X"
                  className="w-full bg-transparent border-0 border-b border-outline-variant/20 focus:border-primary focus:outline-none text-on-surface py-3 transition-all placeholder:text-outline/40 text-sm"
                />
              </Field>

              <Field label="Slug">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="project-neon-x"
                    className="w-full bg-transparent border-0 border-b border-outline-variant/20 focus:border-primary focus:outline-none text-on-surface py-3 pr-32 transition-all placeholder:text-outline/40 text-sm"
                  />
                  <button
                    type="button"
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-[10px] font-bold text-primary hover:text-primary-dim transition-colors flex items-center gap-1 uppercase tracking-tight"
                  >
                    <Wand2 size={11} />
                    auto-generate
                  </button>
                </div>
              </Field>

              <Field label="Short Description">
                <textarea
                  rows={2}
                  placeholder="Brief summary for list views..."
                  className="w-full bg-transparent border-0 border-b border-outline-variant/20 focus:border-primary focus:outline-none text-on-surface py-3 transition-all placeholder:text-outline/40 resize-none text-sm"
                />
              </Field>

              <Field label="Full Description">
                <textarea
                  rows={6}
                  placeholder="Detailed project breakdown..."
                  className="w-full bg-transparent border-0 border-b border-outline-variant/20 focus:border-primary focus:outline-none text-on-surface py-3 transition-all placeholder:text-outline/40 resize-none text-sm"
                />
                <button
                  type="button"
                  onClick={handleAiGenerate}
                  className="mt-3 px-4 py-2 bg-surface-container-highest border border-outline-variant/30 text-xs font-bold rounded-lg flex items-center gap-2 hover:bg-surface-bright transition-colors text-primary"
                >
                  {aiLoading ? (
                    <>
                      <Sparkles size={13} className="animate-pulse" />
                      Generating…
                    </>
                  ) : (
                    <>
                      <Sparkles size={13} />
                      AI Generate
                    </>
                  )}
                </button>
              </Field>
            </div>
          </section>

          {/* Project Status */}
          <section className="bg-surface-container-high rounded-xl p-8 border border-outline-variant/10">
            <div className="flex items-center gap-2 mb-6">
              <Settings2 size={18} className="text-primary" />
              <h3 className="font-headline font-bold text-lg">Project Status</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <Field label="Role">
                <input
                  type="text"
                  placeholder="Solo / Lead / Contributor"
                  className="w-full bg-transparent border-0 border-b border-outline-variant/20 focus:border-primary focus:outline-none text-on-surface py-3 transition-all placeholder:text-outline/40 text-sm"
                />
              </Field>

              <Field label="Status">
                <select className="w-full bg-transparent border-0 border-b border-outline-variant/20 focus:border-primary focus:outline-none text-on-surface py-3 transition-all cursor-pointer text-sm appearance-none">
                  <option value="development">In Development</option>
                  <option value="live">Live</option>
                  <option value="archived">Archived</option>
                </select>
              </Field>

              <Field label="Display Order">
                <input
                  type="number"
                  defaultValue={0}
                  className="w-full bg-transparent border-0 border-b border-outline-variant/20 focus:border-primary focus:outline-none text-on-surface py-3 transition-all text-sm"
                />
              </Field>

              <div className="flex items-center justify-between pt-6">
                <span className="text-sm font-medium text-on-surface">Featured Project</span>
                <button
                  type="button"
                  onClick={() => setFeatured((f) => !f)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${featured ? "bg-primary/40" : "bg-surface-container-highest"}`}
                >
                  <span
                    className={`inline-block h-5 w-5 rounded-full transition-transform duration-200 ${featured ? "translate-x-5 bg-primary" : "translate-x-0.5 bg-outline"}`}
                  />
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className="lg:col-span-5 space-y-6">

          {/* Technical Details */}
          <section className="bg-surface-container-high rounded-xl p-8 border border-outline-variant/10">
            <div className="flex items-center gap-2 mb-6">
              <Code2 size={18} className="text-primary" />
              <h3 className="font-headline font-bold text-lg">Technical Details</h3>
            </div>
            <div className="space-y-6">

              {/* Tech Stack */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                  Tech Stack
                </label>
                <div className="flex flex-wrap gap-2">
                  {techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded-lg flex items-center gap-1 border border-primary/20"
                    >
                      {tech}
                      <button type="button" onClick={() => removeTech(tech)} className="hover:text-white transition-colors">
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={handleTechKeyDown}
                    placeholder="Add tech, press Enter…"
                    className="flex-1 bg-transparent border-0 border-b border-outline-variant/20 focus:border-primary focus:outline-none text-on-surface py-2 text-xs transition-all placeholder:text-outline/40"
                  />
                  <button
                    type="button"
                    onClick={() => addTech(techInput)}
                    className="px-3 py-1 bg-surface-container-highest border border-outline-variant/20 text-on-surface-variant text-[10px] font-bold rounded-lg flex items-center gap-1 hover:text-primary transition-colors"
                  >
                    <Plus size={11} /> ADD
                  </button>
                </div>
                {/* Suggestions */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {TECH_SUGGESTIONS.filter((t) => !techStack.includes(t)).slice(0, 6).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => addTech(t)}
                      className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-tight border border-outline-variant/20 rounded text-on-surface-variant hover:text-primary hover:border-primary/30 transition-colors"
                    >
                      + {t}
                    </button>
                  ))}
                </div>
              </div>

              <UrlField label="GitHub URL" icon={<Link2 size={14} />} placeholder="https://github.com/vay/..." />
              <UrlField label="Demo URL" icon={<ExternalLink size={14} />} placeholder="https://preview.vay.dev/..." />
              <UrlField label="Buy Me Coffee URL" icon={<Coffee size={14} />} placeholder="https://buymeacoffee.com/..." />
            </div>
          </section>

          {/* AI & Notes */}
          <section className="bg-surface-container-high rounded-xl p-8 border border-outline-variant/10">
            <div className="flex items-center gap-2 mb-6">
              <BrainCircuit size={18} className="text-primary" />
              <h3 className="font-headline font-bold text-lg">AI &amp; Notes</h3>
            </div>
            <div className="space-y-6">
              <Field label="Architecture Notes">
                <textarea
                  rows={3}
                  placeholder="Core stack logic, scalability notes..."
                  className="w-full bg-transparent border-0 border-b border-outline-variant/20 focus:border-primary focus:outline-none text-on-surface py-3 transition-all placeholder:text-outline/40 resize-none text-sm"
                />
              </Field>
              <Field label="Raw context for AI description generation">
                <textarea
                  rows={3}
                  placeholder="Input raw bullet points for AI to process..."
                  className="w-full bg-transparent border-0 border-b border-outline-variant/20 focus:border-primary focus:outline-none text-on-surface py-3 transition-all placeholder:text-outline/40 resize-none text-sm"
                />
              </Field>
            </div>
          </section>

          {/* Media */}
          <section className="bg-surface-container-high rounded-xl p-8 border border-outline-variant/10">
            <div className="flex items-center gap-2 mb-6">
              <ImagePlus size={18} className="text-primary" />
              <h3 className="font-headline font-bold text-lg">Media</h3>
            </div>
            <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant block mb-4">
              Screenshots
            </label>
            <div className="border-2 border-dashed border-outline-variant/30 rounded-xl p-10 flex flex-col items-center justify-center bg-surface-container-lowest hover:border-primary/50 transition-colors group cursor-pointer">
              <CloudUpload size={36} className="text-outline group-hover:text-primary transition-colors mb-4" />
              <p className="text-sm font-medium text-on-surface-variant text-center">
                Drag and drop screenshots here or{" "}
                <span className="text-primary font-bold">browse</span>
              </p>
              <p className="text-[10px] text-outline mt-2">PNG, JPG or WebP (Max 10MB)</p>
            </div>
          </section>
        </div>
      </form>

      {/* Bottom Actions */}
      <div className="mt-12 flex items-center justify-end gap-4 pb-10">
        <button
          type="button"
          onClick={() => navigate("/projects")}
          className="px-8 py-3 rounded-xl text-sm font-bold border border-outline-variant/30 hover:bg-surface-container-highest hover:text-on-surface transition-all active:scale-95 text-on-surface-variant"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-10 py-3 rounded-xl text-sm font-bold bg-gradient-to-br from-primary to-primary-dim text-on-primary shadow-[0px_10px_20px_-5px_rgba(0,245,160,0.3)] hover:shadow-[0px_15px_25px_-5px_rgba(0,245,160,0.5)] transition-all active:scale-[0.98] flex items-center gap-2"
        >
          <Save size={15} />
          Create Project
        </button>
      </div>
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant block">
        {label}
      </label>
      {children}
    </div>
  );
}

function UrlField({ label, icon, placeholder }: { label: string; icon: React.ReactNode; placeholder: string }) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant block">
        {label}
      </label>
      <div className="flex items-center border-b border-outline-variant/20 focus-within:border-primary gap-2 py-2.5 transition-all group">
        <span className="text-outline group-focus-within:text-primary transition-colors">{icon}</span>
        <input
          type="text"
          placeholder={placeholder}
          className="flex-1 bg-transparent border-0 focus:outline-none text-on-surface text-sm placeholder:text-outline/40"
        />
      </div>
    </div>
  );
}
