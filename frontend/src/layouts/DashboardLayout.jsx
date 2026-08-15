import { LogOut, Menu } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { navItems } from "../data/navItems";
import { useAuth } from "../context/AuthContext";
import Button from "../components/common/Button";

const DashboardLayout = () => {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[280px_1fr]">
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-white/10 bg-slate-950/95 p-6 backdrop-blur-xl transition lg:static lg:w-auto ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.25em] text-brand-300">FlowPilot AI</p>
          <h1 className="mt-3 font-display text-2xl font-semibold text-white">Plan beautifully. Execute clearly.</h1>
        </div>
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/app"}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition ${
                    isActive ? "bg-brand-500 text-white" : "text-slate-300 hover:bg-white/5"
                  }`
                }
                onClick={() => setOpen(false)}
              >
                <Icon size={18} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
        <div className="mt-8 rounded-[24px] border border-white/10 bg-white/5 p-4">
          <div className="text-sm text-slate-400">Signed in as</div>
          <div className="mt-1 font-medium text-white">{user?.name}</div>
          <div className="text-sm text-brand-300">{user?.role}</div>
          <Button variant="ghost" className="mt-4 w-full justify-start" onClick={logout}>
            <LogOut size={16} />
            Logout
          </Button>
        </div>
      </aside>

      <div className="relative">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-slate-950/80 px-4 py-4 backdrop-blur-xl md:px-8">
          <Button variant="ghost" className="lg:hidden" onClick={() => setOpen((value) => !value)}>
            <Menu size={18} />
          </Button>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="ml-auto flex items-center gap-3">
            <div className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300">
              Level {user?.level} • {user?.streak} day streak
            </div>
          </motion.div>
        </header>
        <main className="space-y-6 px-4 py-6 md:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
