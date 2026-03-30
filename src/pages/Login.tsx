import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { apiUrl } from "../lib/api";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(apiUrl("/api/auth/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Invalid credentials");
        return;
      }

      login(data.data.token);
      navigate("/");
    } catch {
      setError("Could not reach the server. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Dot pattern bg */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(rgba(72,71,77,0.2) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Header */}
      <header className="fixed top-0 w-full h-16 z-40 flex justify-center items-center px-8">
        <img src="/images/logo.png" alt="VAY logo" className="h-9 w-9 object-contain" />
      </header>

      {/* Card */}
      <main className="w-full max-w-md z-10">
        <div className="bg-surface-container-high p-8 shadow-2xl rounded-lg border border-outline-variant/10 relative overflow-hidden">
          {/* top accent */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary-dim opacity-50" />

          <div className="mb-10 flex flex-col items-center gap-3">
            <img src="/images/logo.png" alt="VAY logo" className="h-14 w-14 object-contain" />
            <p className="text-on-surface-variant text-xs tracking-widest uppercase">
              Admin Console
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email — display only, single admin */}
            <div className="space-y-1">
              <label className="block text-xs font-medium text-on-surface-variant uppercase tracking-wider px-1">
                Email Address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
                <input
                  type="email"
                  defaultValue="admin@vay.systems"
                  readOnly
                  className="w-full bg-surface-container-lowest border-b border-outline-variant/20 text-on-surface/50 pl-10 py-3 text-sm outline-none cursor-not-allowed"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="block text-xs font-medium text-on-surface-variant uppercase tracking-wider px-1">
                Security Key
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-surface-container-lowest border-b border-outline-variant/20 focus:border-primary text-on-surface placeholder-outline/50 pl-10 py-3 text-sm outline-none transition-colors"
                />
              </div>
            </div>

            {error && (
              <p className="text-error text-xs font-medium px-1">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-br from-primary to-primary-dim text-on-primary font-headline font-bold py-4 rounded-md shadow-lg shadow-primary/10 hover:shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
            >
              {loading ? "AUTHENTICATING…" : "SIGN IN"}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-outline-variant/5 text-center">
            <div className="flex items-center justify-center gap-2 text-[10px] text-outline uppercase tracking-[0.2em]">
              <ShieldCheck size={12} />
              Secured with JWT
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <div className="flex justify-center items-center gap-6">
            <div className="h-px w-8 bg-outline-variant/20" />
            <div className="text-[10px] text-outline tracking-widest uppercase">
              System Status: Nominal
            </div>
            <div className="h-px w-8 bg-outline-variant/20" />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-8 w-full flex flex-col items-center gap-2">
        <div className="text-xs tracking-wider uppercase text-outline/50">
          © 2025 VAY SYSTEMS. SECURED ENVIRONMENT.
        </div>
      </footer>
    </div>
  );
}
