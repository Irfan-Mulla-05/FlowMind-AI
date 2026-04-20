import { ArrowRight, BrainCircuit, CalendarRange, Sparkles, SquareCheckBig } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "../components/common/Button";

const features = [
  { icon: BrainCircuit, title: "AI planning engine", copy: "Turn goals into tasks, balanced schedules, and adaptive next steps." },
  { icon: SquareCheckBig, title: "Fast to-do flow", copy: "Quick add, reorder, complete, and move on without friction." },
  { icon: CalendarRange, title: "Smart planning horizons", copy: "Daily to yearly planning views with role-aware suggestions." }
];

const LandingPage = () => (
  <div className="min-h-screen bg-hero-grid">
    <div className="mx-auto max-w-7xl px-6 py-8">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-cyan-500 shadow-glow animate-pulse">
            <Sparkles size={16} className="text-white" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] bg-clip-text text-transparent bg-gradient-to-r from-brand-300 to-cyan-400 font-bold">Powered by Antigravity</p>
            <h1 className="mt-1 font-display text-2xl text-white font-bold tracking-wide">FlowMind AI</h1>
          </div>
        </div>
        <div className="flex gap-3">
          <Link to="/login">
            <Button variant="ghost" className="hover:bg-brand-500/20 text-brand-100">Login</Button>
          </Link>
          <Link to="/register">
            <Button className="bg-brand-600 hover:bg-brand-500 shadow-glow font-medium text-white border-0">Start free</Button>
          </Link>
        </div>
      </header>

      <section className="grid min-h-[80vh] items-center gap-12 py-16 lg:grid-cols-[1.2fr_0.8fr]">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-400/30 bg-brand-900/40 px-4 py-2 text-sm text-brand-200 shadow-[0_0_15px_rgba(168,85,247,0.2)] backdrop-blur-md">
            <Sparkles size={16} className="text-cyan-400" />
            Zero-Gravity Productivity OS
          </div>
          <h2 className="max-w-4xl font-display text-6xl font-bold leading-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-brand-100 to-brand-500 md:text-7xl pb-2 tracking-tight">
            Elevate your workflow to the cosmic level.
          </h2>
          <p className="max-w-2xl text-lg leading-8 text-brand-100/80 font-light">
            Defy the gravity of manual work. Notion-inspired depth infused with Antigravity AI logic.
            Role-based planning, dynamic roadmaps, and execution that feels weightless.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <Link to="/register">
              <Button className="px-8 py-4 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white shadow-glow rounded-2xl flex items-center gap-2 font-medium text-lg border-0 transition-all hover:scale-105">
                Launch Workspace
                <ArrowRight size={18} />
              </Button>
            </Link>
            <Link to="/login">
               <Button variant="secondary" className="px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-2xl font-medium text-lg backdrop-blur-lg transition-all hover:scale-105">
                Explore Core
               </Button>
            </Link>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="glass-panel rounded-[32px] p-1 bg-gradient-to-b from-brand-500/20 to-transparent animate-float shadow-soft">
          <div className="rounded-[30px] bg-[#0A0510]/80 p-6 backdrop-blur-xl border border-white/5">
            <div className="grid gap-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5">
                  <Icon className="text-brand-300" />
                  <h3 className="mt-4 text-xl font-semibold text-white">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{feature.copy}</p>
                </div>
              );
            })}
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  </div>
);

export default LandingPage;
