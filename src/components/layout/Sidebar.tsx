import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FolderOpen,
  Mail,
  FileText,
  LineChart,
  Settings,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", to: "/" },
  { icon: FolderOpen, label: "Projects", to: "/projects" },
  { icon: Mail, label: "Messages", to: "/messages" },
  { icon: FileText, label: "Blog", to: "/blog" },
  { icon: LineChart, label: "Analytics", to: "/analytics" },
  { icon: Settings, label: "Settings", to: "/settings" },
];

export default function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 overflow-y-auto bg-surface-container-low flex flex-col py-6 z-50">
      <div className="px-8 mb-10">
        <h1 className="text-3xl font-black text-primary tracking-tighter font-headline">VAY</h1>
        <p className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-medium mt-1">
          Admin Console
        </p>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map(({ icon: Icon, label, to }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              isActive
                ? "flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-primary/10 to-transparent text-primary border-r-2 border-primary font-medium text-sm transition-all duration-200"
                : "flex items-center gap-3 px-8 py-3 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-all duration-200 font-medium text-sm"
            }
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="px-8 mt-auto pt-6 space-y-4">
        <div className="p-4 bg-surface-container rounded-xl border border-outline-variant/10">
          <p className="text-xs text-on-surface-variant mb-2">Storage Usage</p>
          <div className="h-1 w-full bg-surface-container-highest rounded-full overflow-hidden">
            <div className="h-full bg-primary w-[72%]" />
          </div>
          <p className="text-[10px] text-right mt-1 text-primary">72% Full</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-on-surface-variant hover:text-error hover:bg-error/5 rounded-lg transition-all duration-200 text-sm font-medium"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
}
