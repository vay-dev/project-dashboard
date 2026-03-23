import { useLocation } from "react-router-dom";
import { Search, Bell, ChevronRight } from "lucide-react";

function getCrumb(pathname: string): string {
  if (pathname === "/") return "Dashboard";
  if (pathname === "/projects") return "Projects";
  if (pathname === "/projects/new") return "New Project";
  if (/^\/projects\/.+\/edit$/.test(pathname)) return "Edit Project";
  if (pathname === "/messages") return "Messages";
  if (pathname === "/blog") return "Blog";
  if (pathname === "/analytics") return "Analytics";
  if (pathname === "/settings") return "Settings";
  return "Dashboard";
}

export default function TopHeader() {
  const { pathname } = useLocation();
  const crumb = getCrumb(pathname);

  return (
    <header className="h-16 sticky top-0 bg-surface/70 backdrop-blur-xl flex justify-between items-center px-8 z-40 border-b border-outline-variant/10">
      <div className="flex items-center gap-2 text-sm">
        <span className="text-on-surface-variant">Console</span>
        <ChevronRight size={14} className="text-outline" />
        <span className="text-on-surface font-semibold">{crumb}</span>
      </div>

      <div className="flex items-center gap-6">
        <button className="text-on-surface-variant hover:text-primary transition-colors">
          <Search size={18} />
        </button>
        <button className="text-on-surface-variant hover:text-primary transition-colors relative">
          <Bell size={18} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
        </button>
        <div className="h-8 w-8 rounded-full bg-primary-container flex items-center justify-center">
          <span className="text-on-primary text-xs font-black font-headline">V</span>
        </div>
      </div>
    </header>
  );
}
