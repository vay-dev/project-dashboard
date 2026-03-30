import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  Camera,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { apiUrl } from "../lib/api";

const TECH_SUGGESTIONS = [
  "React",
  "Next.js",
  "TypeScript",
  "Node.js",
  "Flutter",
  "Django",
  "PostgreSQL",
  "Tailwind",
  "GraphQL",
  "Redis",
  "SCSS",
  "Angular",
  "Socket.IO",
  "Prisma",
];

export default function ProjectEditor() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);

  const [loadingProject, setLoadingProject] = useState(isEdit);
  const [techStack, setTechStack] = useState<string[]>([]);
  const [techInput, setTechInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [featured, setFeatured] = useState(false);
  const [screenshots, setScreenshots] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [screenshotting, setScreenshotting] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [fullDesc, setFullDesc] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("in-development");
  const [displayOrder, setDisplayOrder] = useState(0);
  const [githubUrl, setGithubUrl] = useState("");
  const [demoUrl, setDemoUrl] = useState("");
  const [coffeeUrl, setCoffeeUrl] = useState("");
  const [archNotes, setArchNotes] = useState("");
  const [aiContext, setAiContext] = useState("");
  const [partnerName, setPartnerName] = useState("");
  const [partnerGithub, setPartnerGithub] = useState("");
  const [partnerPortfolio, setPartnerPortfolio] = useState("");

  // Load existing project when editing.
  // GET /api/projects returns all projects; we find by id since there's no GET-by-id route.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!isEdit || !id) return;
    const currentToken = localStorage.getItem("vay_admin_token");
    fetch(apiUrl("/api/projects"), {
      headers: currentToken ? { Authorization: `Bearer ${currentToken}` } : {},
    })
      .then((r) => r.json())
      .then((data) => {
        const list: Record<string, unknown>[] = data.data ?? [];
        const p = list.find((proj) => proj["id"] === id);
        if (!p) {
          setSaveError(`Project not found (id: ${id}).`);
          return;
        }
        // Batch all state updates — React 18 batches these automatically
        setTitle((p["title"] as string) || "");
        setSlug((p["slug"] as string) || "");
        setShortDesc((p["shortDescription"] as string) || "");
        setFullDesc((p["fullDescription"] as string) || "");
        setRole((p["role"] as string) || "");
        setStatus((p["status"] as string) || "in-development");
        setDisplayOrder(Number(p["displayOrder"]) || 0);
        setFeatured(Boolean(p["featured"]));
        setTechStack((p["techStack"] as string[]) || []);
        setScreenshots((p["screenshots"] as string[]) || []);
        setGithubUrl((p["githubUrl"] as string) || "");
        setDemoUrl((p["demoUrl"] as string) || "");
        setCoffeeUrl((p["buyMeCoffeeUrl"] as string) || "");
        setArchNotes((p["architectureNotes"] as string) || "");
        setAiContext((p["aiContext"] as string) || "");
        setPartnerName((p["partnerName"] as string) || "");
        setPartnerGithub((p["partnerGithubUrl"] as string) || "");
        setPartnerPortfolio((p["partnerPortfolioUrl"] as string) || "");
      })
      .catch((err) => setSaveError(`Could not load project: ${err.message}`))
      .finally(() => setLoadingProject(false));
  }, [id]); // only re-run if the id changes — token is stable

  function autoSlug(val: string) {
    return val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  function handleTitleChange(val: string) {
    setTitle(val);
    if (!slug || slug === autoSlug(title)) setSlug(autoSlug(val));
  }

  function addTech(tech: string) {
    const t = tech.trim();
    if (t && !techStack.find((x) => x.toLowerCase() === t.toLowerCase())) {
      setTechStack((p) => [...p, t]);
    }
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

  async function uploadFiles(files: FileList | File[]) {
    const list = Array.from(files);
    if (!list.length) return;
    setUploading(true);
    try {
      const urls: string[] = [];
      for (const file of list) {
        const form = new FormData();
        form.append("file", file);
        const res = await fetch(apiUrl("/api/media/upload"), {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: form,
        });
        const data = await res.json();
        if (res.ok) urls.push(data.url);
      }
      setScreenshots((prev) => [...prev, ...urls]);
    } finally {
      setUploading(false);
    }
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) uploadFiles(e.target.files);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files) uploadFiles(e.dataTransfer.files);
  }

  async function handleAutoScreenshot() {
    if (!demoUrl.trim()) {
      setSaveError("Add a Demo URL first to auto-screenshot.");
      return;
    }
    setSaveError("");
    setScreenshotting(true);
    try {
      const res = await fetch(apiUrl("/api/media/screenshot"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ url: demoUrl.trim(), fullPage: false }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSaveError(data.error || "Screenshot failed");
        return;
      }
      setScreenshots((prev) => [...prev, data.url]);
    } catch {
      setSaveError("Could not reach the server.");
    } finally {
      setScreenshotting(false);
    }
  }

  async function handleAiGenerate() {
    if (!aiContext.trim()) {
      setSaveError("Paste your raw context in the AI & Notes section first.");
      return;
    }
    if (!title.trim()) {
      setSaveError("Add a project title first.");
      return;
    }
    setSaveError("");
    setAiLoading(true);
    try {
      const res = await fetch(apiUrl("/api/projects/generate-descriptions"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          aiContext,
          techStack,
          role,
          status,
          architectureNotes: archNotes,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSaveError(data.message || "AI generation failed");
        return;
      }
      if (data.data.shortDescription) setShortDesc(data.data.shortDescription);
      if (data.data.fullDescription) setFullDesc(data.data.fullDescription);
      if (data.data.role) setRole(data.data.role);
      if (data.data.status) setStatus(data.data.status);
      if (typeof data.data.featured === "boolean")
        setFeatured(data.data.featured);
    } catch {
      setSaveError("Could not reach the server.");
    } finally {
      setAiLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaveError("");

    if (!title.trim() || !slug.trim() || !shortDesc.trim()) {
      setSaveError("Title, slug and short description are required.");
      return;
    }
    if (techStack.length === 0) {
      setSaveError("Add at least one technology.");
      return;
    }

    const body = {
      title: title.trim(),
      slug: slug.trim(),
      shortDescription: shortDesc.trim(),
      fullDescription: fullDesc.trim() || null,
      role: role.trim() || null,
      status,
      featured,
      displayOrder,
      techStack,
      screenshots,
      githubUrl: githubUrl.trim() || null,
      demoUrl: demoUrl.trim() || null,
      buyMeCoffeeUrl: coffeeUrl.trim() || null,
      architectureNotes: archNotes.trim() || null,
      aiContext: aiContext.trim() || null,
      partnerName: partnerName.trim() || null,
      partnerGithubUrl: partnerGithub.trim() || null,
      partnerPortfolioUrl: partnerPortfolio.trim() || null,
    };

    setSaving(true);
    try {
      const url = isEdit ? apiUrl(`/api/projects/${id}`) : apiUrl("/api/projects");
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        setSaveError(
          data.error ||
            data.message ||
            `Failed to ${isEdit ? "update" : "create"} project.`,
        );
        return;
      }

      navigate("/projects");
    } catch {
      setSaveError("Could not reach the server. Is the backend running?");
    } finally {
      setSaving(false);
    }
  }

  if (loadingProject) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-on-surface-variant text-sm gap-3">
        <span className="w-4 h-4 border-2 border-outline border-t-primary rounded-full animate-spin" />
        Loading project…
      </div>
    );
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
            <ArrowLeft
              size={18}
              className="text-on-surface-variant group-hover:text-primary transition-colors"
            />
          </button>
          <div>
            <h2 className="text-3xl font-extrabold font-headline tracking-tight text-on-surface">
              {isEdit ? "Edit Project" : "New Project"}
            </h2>
            <p className="text-on-surface-variant text-sm mt-1">
              {isEdit
                ? `Editing "${title || "…"}"`
                : "Initialize a new venture in the VAY Ecosystem."}
            </p>
          </div>
        </div>
        <span className="px-3 py-1 bg-surface-container-highest text-[10px] font-bold tracking-widest uppercase border border-outline-variant/20 rounded-lg text-on-surface-variant">
          {isEdit ? "Edit Mode" : "Draft Mode"}
        </span>
      </div>

      {saveError && (
        <div className="mb-6 px-4 py-3 bg-error/10 border border-error/20 rounded-xl text-error text-sm font-medium">
          {saveError}
        </div>
      )}

      {/* Form Grid */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
      >
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
                  placeholder="e.g. Pendu Chat"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full bg-transparent border-0 border-b border-outline-variant/20 focus:border-primary focus:outline-none text-on-surface py-3 transition-all placeholder:text-outline/40 text-sm"
                />
              </Field>

              <Field label="Slug">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="pendu-chat"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full bg-transparent border-0 border-b border-outline-variant/20 focus:border-primary focus:outline-none text-on-surface py-3 pr-32 transition-all placeholder:text-outline/40 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setSlug(autoSlug(title))}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-[10px] font-bold text-primary hover:text-primary-dim transition-colors flex items-center gap-1 uppercase tracking-tight"
                  >
                    <Wand2 size={11} /> auto-generate
                  </button>
                </div>
              </Field>

              <Field label="Short Description">
                <textarea
                  rows={2}
                  placeholder="Brief summary for list views..."
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  className="w-full bg-transparent border-0 border-b border-outline-variant/20 focus:border-primary focus:outline-none text-on-surface py-3 transition-all placeholder:text-outline/40 resize-none text-sm"
                />
              </Field>

              <Field label="Full Description">
                <textarea
                  rows={6}
                  placeholder="Detailed project breakdown — or fill via AI Generate below…"
                  value={fullDesc}
                  onChange={(e) => setFullDesc(e.target.value)}
                  className="w-full bg-transparent border-0 border-b border-outline-variant/20 focus:border-primary focus:outline-none text-on-surface py-3 transition-all placeholder:text-outline/40 resize-none text-sm"
                />
              </Field>
            </div>
          </section>

          {/* Project Status */}
          <section className="bg-surface-container-high rounded-xl p-8 border border-outline-variant/10">
            <div className="flex items-center gap-2 mb-6">
              <Settings2 size={18} className="text-primary" />
              <h3 className="font-headline font-bold text-lg">
                Project Status
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <Field label="Role">
                <input
                  type="text"
                  placeholder="Solo / Lead / Contributor"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-transparent border-0 border-b border-outline-variant/20 focus:border-primary focus:outline-none text-on-surface py-3 transition-all placeholder:text-outline/40 text-sm"
                />
              </Field>

              <Field label="Status">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-surface-container-high border-0 border-b border-outline-variant/20 focus:border-primary focus:outline-none text-on-surface py-3 transition-all cursor-pointer text-sm appearance-none"
                >
                  <option value="in-development">In Development</option>
                  <option value="live">Live</option>
                  <option value="archived">Archived</option>
                </select>
              </Field>

              <Field label="Display Order">
                <input
                  type="number"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(Number(e.target.value))}
                  className="w-full bg-transparent border-0 border-b border-outline-variant/20 focus:border-primary focus:outline-none text-on-surface py-3 transition-all text-sm"
                />
              </Field>

              <div className="flex items-center justify-between pt-6">
                <span className="text-sm font-medium text-on-surface">
                  Featured Project
                </span>
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
              <h3 className="font-headline font-bold text-lg">
                Technical Details
              </h3>
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
                      <button
                        type="button"
                        onClick={() => removeTech(tech)}
                        className="hover:text-white transition-colors"
                      >
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
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {TECH_SUGGESTIONS.filter(
                    (t) =>
                      !techStack.find(
                        (x) => x.toLowerCase() === t.toLowerCase(),
                      ),
                  )
                    .slice(0, 7)
                    .map((t) => (
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

              <UrlField
                label="GitHub URL"
                icon={<Link2 size={14} />}
                placeholder="https://github.com/vay/..."
                value={githubUrl}
                onChange={setGithubUrl}
              />
              <UrlField
                label="Demo URL"
                icon={<ExternalLink size={14} />}
                placeholder="https://..."
                value={demoUrl}
                onChange={setDemoUrl}
              />
              <UrlField
                label="Buy Me Coffee URL"
                icon={<Coffee size={14} />}
                placeholder="https://buymeacoffee.com/..."
                value={coffeeUrl}
                onChange={setCoffeeUrl}
              />

              {/* Partner */}
              <div className="pt-4 border-t border-outline-variant/10">
                <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-4">
                  Collaborator{" "}
                  <span className="text-outline font-normal normal-case tracking-normal ml-1">
                    (optional)
                  </span>
                </p>
                <div className="space-y-4">
                  <Field label="Partner Name">
                    <input
                      type="text"
                      placeholder="e.g. John Doe"
                      value={partnerName}
                      onChange={(e) => setPartnerName(e.target.value)}
                      className="w-full bg-transparent border-0 border-b border-outline-variant/20 focus:border-primary focus:outline-none text-on-surface py-2.5 transition-all placeholder:text-outline/40 text-sm"
                    />
                  </Field>
                  <UrlField
                    label="Partner GitHub"
                    icon={<Link2 size={14} />}
                    placeholder="https://github.com/partner"
                    value={partnerGithub}
                    onChange={setPartnerGithub}
                  />
                  <UrlField
                    label="Partner Portfolio"
                    icon={<ExternalLink size={14} />}
                    placeholder="https://partner.dev"
                    value={partnerPortfolio}
                    onChange={setPartnerPortfolio}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* AI & Notes */}
          <section className="bg-surface-container-high rounded-xl p-8 border border-outline-variant/10">
            <div className="flex items-center gap-2 mb-6">
              <BrainCircuit size={18} className="text-primary" />
              <h3 className="font-headline font-bold text-lg">
                AI &amp; Notes
              </h3>
            </div>
            <div className="space-y-6">
              <Field label="Architecture Notes">
                <textarea
                  rows={3}
                  placeholder="Core stack logic, scalability notes..."
                  value={archNotes}
                  onChange={(e) => setArchNotes(e.target.value)}
                  className="w-full bg-transparent border-0 border-b border-outline-variant/20 focus:border-primary focus:outline-none text-on-surface py-3 transition-all placeholder:text-outline/40 resize-none text-sm"
                />
              </Field>
              <Field label="Raw context for AI generation">
                <textarea
                  rows={5}
                  placeholder="Paste raw notes, bullet points, features, decisions — anything. The AI will generate both the short and full description from this."
                  value={aiContext}
                  onChange={(e) => setAiContext(e.target.value)}
                  className="w-full bg-transparent border-0 border-b border-outline-variant/20 focus:border-primary focus:outline-none text-on-surface py-3 transition-all placeholder:text-outline/40 resize-none text-sm"
                />
              </Field>
              <button
                type="button"
                onClick={handleAiGenerate}
                disabled={aiLoading || !aiContext.trim()}
                className="w-full py-3 bg-surface-container-highest border border-primary/20 text-sm font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-surface-bright hover:border-primary/40 transition-all text-primary disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {aiLoading ? (
                  <>
                    <Sparkles size={14} className="animate-pulse" /> Generating…
                  </>
                ) : (
                  <>
                    <Sparkles size={14} /> AI Generate Descriptions
                  </>
                )}
              </button>
              {aiLoading && (
                <p className="text-[10px] text-on-surface-variant text-center">
                  Calling OpenRouter — this takes 5–15 seconds…
                </p>
              )}
            </div>
          </section>

          {/* Media */}
          <section className="bg-surface-container-high rounded-xl p-8 border border-outline-variant/10">
            <div className="flex items-center gap-2 mb-6">
              <ImagePlus size={18} className="text-primary" />
              <h3 className="font-headline font-bold text-lg">Media</h3>
            </div>
            <div className="flex items-center justify-between mb-4">
              <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant block">
                Screenshots
              </label>
              <button
                type="button"
                onClick={handleAutoScreenshot}
                disabled={screenshotting || !demoUrl.trim()}
                className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg border border-primary/20 text-primary hover:bg-primary/5 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Camera size={12} />
                {screenshotting ? "Capturing…" : "Auto Screenshot"}
              </button>
            </div>

            <label
              onDrop={handleDrop}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer transition-colors ${dragOver ? "border-primary bg-primary/5" : "border-outline-variant/30 hover:border-primary/50 bg-surface-container-lowest"}`}
            >
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileInput}
              />
              <CloudUpload
                size={36}
                className={`transition-colors mb-4 ${dragOver ? "text-primary" : "text-outline"}`}
              />
              {uploading ? (
                <p className="text-sm font-medium text-primary">Uploading…</p>
              ) : (
                <>
                  <p className="text-sm font-medium text-on-surface-variant text-center">
                    Drag and drop screenshots here or{" "}
                    <span className="text-primary font-bold">browse</span>
                  </p>
                  <p className="text-[10px] text-outline mt-2">
                    PNG, JPG or WebP · Max 10MB each
                  </p>
                </>
              )}
            </label>

            {screenshots.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-3">
                {screenshots.map((url, i) => (
                  <div
                    key={url}
                    className="relative group rounded-lg overflow-hidden border border-outline-variant/20"
                  >
                    <img
                      src={url}
                      alt={`screenshot ${i + 1}`}
                      className="w-full h-28 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setScreenshots((p) => p.filter((_, idx) => idx !== i))
                      }
                      className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-surface-container/80 backdrop-blur-sm flex items-center justify-center text-on-surface-variant hover:text-error hover:bg-error/10 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
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
          type="button"
          onClick={handleSubmit}
          disabled={saving}
          className="px-10 py-3 rounded-xl text-sm font-bold bg-gradient-to-br from-primary to-primary-dim text-on-primary shadow-[0px_10px_20px_-5px_rgba(0,245,160,0.3)] hover:shadow-[0px_15px_25px_-5px_rgba(0,245,160,0.5)] transition-all active:scale-[0.98] flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <Save size={15} />
          {saving ? "Saving…" : isEdit ? "Save Changes" : "Create Project"}
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant block">
        {label}
      </label>
      {children}
    </div>
  );
}

function UrlField({
  label,
  icon,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  icon: React.ReactNode;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant block">
        {label}
      </label>
      <div className="flex items-center border-b border-outline-variant/20 focus-within:border-primary gap-2 py-2.5 transition-all group">
        <span className="text-outline group-focus-within:text-primary transition-colors">
          {icon}
        </span>
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-transparent border-0 focus:outline-none text-on-surface text-sm placeholder:text-outline/40"
        />
      </div>
    </div>
  );
}
