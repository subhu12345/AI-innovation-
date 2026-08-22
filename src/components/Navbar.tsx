import React from 'react';
import {
  Sparkles,
  LayoutDashboard,
  Lightbulb,
  Gauge,
  Network,
  GitFork,
  Cpu,
  Scale,
  FolderHeart,
  Terminal,
  Activity
} from 'lucide-react';
import { ActiveTab } from '../types';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  savedCount: number;
  hasGeminiKey: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  savedCount,
  hasGeminiKey
}) => {
  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-3.5 h-3.5" /> },
    { id: 'generate', label: 'Idea Generator', icon: <Lightbulb className="w-3.5 h-3.5" /> },
    { id: 'evaluate', label: 'Evaluator', icon: <Gauge className="w-3.5 h-3.5" /> },
    { id: 'architecture', label: 'Architecture', icon: <Network className="w-3.5 h-3.5" /> },
    { id: 'roadmap', label: 'Roadmap', icon: <GitFork className="w-3.5 h-3.5" /> },
    { id: 'tech-stack', label: 'Tech Stack', icon: <Cpu className="w-3.5 h-3.5" /> },
    { id: 'compare', label: 'Compare Matrix', icon: <Scale className="w-3.5 h-3.5" /> },
    { id: 'history', label: 'Archive', icon: <FolderHeart className="w-3.5 h-3.5" />, badge: savedCount }
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#2D3748] bg-[#0B0E14]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div
            id="brand-logo-btn"
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-9 h-9 bg-sky-500 rounded-md flex items-center justify-center font-extrabold text-slate-950 shadow-[0_0_15px_rgba(56,189,248,0.3)] group-hover:scale-105 transition-transform duration-150 font-mono text-sm">
              AI
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-black tracking-wider text-white font-mono group-hover:text-sky-400 transition-colors">
                  INNOV-LAB
                </span>
                <span className="text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/25">
                  SYS v2.5
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono hidden sm:block">
                TECHNICAL ARCHITECTURE & ROADMAPPING STUDIO
              </p>
            </div>
          </div>

          {/* Center Navigation */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#151921] p-1.5 rounded-lg border border-[#2D3748] shadow-inner">
            {navItems.map(item => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}-btn`}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150 whitespace-nowrap font-mono ${
                    isActive
                      ? 'bg-sky-500/15 text-sky-300 border border-sky-500/40 shadow-[0_0_12px_rgba(56,189,248,0.15)] font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-[#1A202C]'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        isActive ? 'bg-sky-400 text-slate-950' : 'bg-[#2D3748] text-sky-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Status Badge & Actions */}
          <div className="flex items-center gap-3">
            <div
              className={`hidden sm:flex items-center gap-2 px-3 py-1 rounded-md text-xs border font-mono ${
                hasGeminiKey
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-sky-500/10 text-sky-400 border-sky-500/30'
              }`}
              title={hasGeminiKey ? 'Gemini 3.7 Flash Engine Online' : 'Gemini Engine Active'}
            >
              <div className={`w-2 h-2 rounded-full ${hasGeminiKey ? 'bg-emerald-400 animate-pulse' : 'bg-sky-400'}`} />
              <span className="text-[11px] font-semibold">Gemini API: Online</span>
            </div>

            <button
              id="header-quick-generate-btn"
              onClick={() => setActiveTab('generate')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold font-mono shadow-[0_0_15px_rgba(56,189,248,0.25)] transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>+ New Project</span>
            </button>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="lg:hidden flex items-center gap-1 overflow-x-auto py-2.5 scrollbar-none border-t border-[#2D3748]">
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`mobile-nav-${item.id}-btn`}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 font-bold'
                    : 'text-slate-400 hover:text-slate-200 bg-[#151921] border border-[#2D3748]'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="text-[10px] px-1 py-0.2 rounded-full bg-[#2D3748] text-sky-300">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
