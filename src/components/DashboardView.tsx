import React from 'react';
import {
  Sparkles,
  Lightbulb,
  Gauge,
  Network,
  GitFork,
  Cpu,
  Scale,
  TrendingUp,
  Award,
  Layers,
  ArrowRight,
  Clock,
  Compass,
  CheckCircle2,
  Activity,
  Terminal,
  ShieldCheck,
  Zap,
  Server
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { DashboardStats, ProjectIdea, ActiveTab } from '../types';
import { getDifficultyColor } from '../lib/utils';

interface DashboardViewProps {
  stats: DashboardStats | null;
  loading: boolean;
  onNavigate: (tab: ActiveTab) => void;
  onSelectProject: (project: ProjectIdea) => void;
}

const COLORS = ['#38BDF8', '#818CF8', '#34D399', '#FBBF24', '#F472B6', '#A78BFA', '#2DD4BF', '#FB7185'];

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  loading,
  onNavigate,
  onSelectProject
}) => {
  if (loading || !stats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-sky-500/20 border-t-sky-400 rounded-full animate-spin" />
        <p className="text-xs text-slate-400 font-mono">AGGREGATING SYSTEM TELEMETRY & PROJECT REPOSITORIES...</p>
      </div>
    );
  }

  const radarData = [
    { metric: 'Innovation', value: (stats.avgInnovationScore * 10) || 85 },
    { metric: 'Feasibility', value: stats.avgReadinessScore || 80 },
    { metric: 'Scalability', value: 82 },
    { metric: 'Complexity', value: 76 },
    { metric: 'Market Fit', value: 88 },
    { metric: 'Architecture', value: 84 }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Technical Hero Banner */}
      <div className="relative overflow-hidden rounded-xl bg-[#151921]/90 border border-[#2D3748] p-6 sm:p-7 shadow-2xl">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-mono font-semibold">
              <Terminal className="w-3.5 h-3.5" />
              <span>PROJECT ANALYSIS & ARCHITECTURE STUDIO</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-sans">
              System Telemetry & <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-300 to-sky-200">Innovation Analysis</span>
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed font-sans">
              Evaluate multidimensional project complexity, synthesize 6-tier architectures, generate actionable 8-phase implementation roadmaps, and benchmark feasibility with Gemini AI.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              id="dash-hero-generate-btn"
              onClick={() => onNavigate('generate')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-md bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold font-mono shadow-[0_0_20px_rgba(56,189,248,0.25)] transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Lightbulb className="w-4 h-4" />
              <span>+ Generate 5 Ideas</span>
            </button>
            <button
              id="dash-hero-eval-btn"
              onClick={() => onNavigate('evaluate')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-md bg-[#1E2633] hover:bg-[#2A3445] text-slate-200 border border-[#2D3748] text-xs font-mono font-medium transition-all"
            >
              <Gauge className="w-4 h-4 text-sky-400" />
              <span>Evaluate Idea</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="glass rounded-xl p-4 space-y-2 hover:border-sky-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase text-slate-400 font-semibold">Total Projects</span>
            <div className="w-6 h-6 rounded bg-sky-500/10 flex items-center justify-center text-sky-400">
              <Lightbulb className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight font-mono">{stats.totalGenerated}</div>
          <p className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-emerald-400" />
            <span>Store repository</span>
          </p>
        </div>

        <div className="glass rounded-xl p-4 space-y-2 hover:border-indigo-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase text-slate-400 font-semibold">Evaluated</span>
            <div className="w-6 h-6 rounded bg-indigo-500/10 flex items-center justify-center text-indigo-400">
              <Gauge className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight font-mono">{stats.totalEvaluated}</div>
          <p className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-indigo-400" />
            <span>Feasibility analyzed</span>
          </p>
        </div>

        <div className="glass rounded-xl p-4 space-y-2 hover:border-pink-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase text-slate-400 font-semibold">Innovation</span>
            <div className="w-6 h-6 rounded bg-pink-500/10 flex items-center justify-center text-pink-400">
              <Award className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-pink-400 tracking-tight font-mono">
            {stats.avgInnovationScore} <span className="text-xs text-slate-500 font-normal">/ 10</span>
          </div>
          <p className="text-[10px] font-mono text-slate-500">Benchmark index</p>
        </div>

        <div className="glass rounded-xl p-4 space-y-2 hover:border-emerald-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase text-slate-400 font-semibold">Readiness</span>
            <div className="w-6 h-6 rounded bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-400 tracking-tight font-mono">
            {stats.avgReadinessScore}%
          </div>
          <p className="text-[10px] font-mono text-slate-500">Production ready</p>
        </div>

        <div className="glass rounded-xl p-4 space-y-2 hover:border-sky-500/40 transition-colors col-span-2 sm:col-span-1 lg:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase text-slate-400 font-semibold">Top Domain</span>
            <div className="w-6 h-6 rounded bg-sky-500/10 flex items-center justify-center text-sky-400">
              <Compass className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xs font-bold text-white truncate font-mono" title={stats.mostPopularDomain}>
            {stats.mostPopularDomain}
          </div>
          <p className="text-[10px] font-mono text-slate-500">Highest volume</p>
        </div>

        <div className="glass rounded-xl p-4 space-y-2 hover:border-amber-500/40 transition-colors col-span-2 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase text-slate-400 font-semibold">Core Library</span>
            <div className="w-6 h-6 rounded bg-amber-500/10 flex items-center justify-center text-amber-400">
              <Layers className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xs font-bold text-amber-300 truncate font-mono" title={stats.mostSelectedTech}>
            {stats.mostSelectedTech}
          </div>
          <p className="text-[10px] font-mono text-slate-500">Primary stack tag</p>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Domain Distribution Pie Chart */}
        <div className="glass rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xs font-mono uppercase font-bold text-slate-200 tracking-wider">Vertical Distribution</h2>
              <p className="text-[11px] text-slate-400">Projects grouped by engineering domain</p>
            </div>
            <span className="pill text-[10px] font-mono">
              {stats.domainCounts.length} DOMAINS
            </span>
          </div>

          <div className="h-52 w-full">
            {stats.domainCounts.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.domainCounts}
                    dataKey="count"
                    nameKey="domain"
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={4}
                  >
                    {stats.domainCounts.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#151921', borderColor: '#2D3748', borderRadius: '6px', color: '#E2E8F0', fontSize: '11px', fontFamily: 'monospace' }}
                    itemStyle={{ color: '#38BDF8' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-500 font-mono">NO DATA IN REPOSITORY</div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            {stats.domainCounts.slice(0, 4).map((d, i) => (
              <div key={d.domain} className="flex items-center gap-1.5 truncate">
                <div className="w-2 h-2 rounded flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <span className="text-slate-400 truncate text-[11px]">{d.domain}:</span>
                <span className="font-semibold text-white text-[11px]">{d.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Readiness Tiers Bar Chart */}
        <div className="glass rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xs font-mono uppercase font-bold text-slate-200 tracking-wider">Feasibility Tiers</h2>
              <p className="text-[11px] text-slate-400">Readiness score categorization</p>
            </div>
            <span className="pill-emerald text-[10px] font-mono">
              AVG {stats.avgReadinessScore}%
            </span>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.readinessTiers} layout="vertical" margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis type="number" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis dataKey="tier" type="category" stroke="#94a3b8" fontSize={10} width={110} tickFormatter={(v) => v.split(' ')[0]} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#151921', borderColor: '#2D3748', borderRadius: '6px', color: '#E2E8F0', fontSize: '11px', fontFamily: 'monospace' }}
                />
                <Bar dataKey="count" fill="#38BDF8" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="text-[11px] font-mono text-slate-400 bg-[#0B0E14] p-2.5 rounded border border-[#2D3748]">
            <span className="text-sky-400 font-bold">[INFO]</span> 85%+ readiness indicates complete system topology and zero-barrier deployment.
          </div>
        </div>

        {/* Holistic Innovation Radar Chart */}
        <div className="glass rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xs font-mono uppercase font-bold text-slate-200 tracking-wider">Innovation Footprint</h2>
              <p className="text-[11px] text-slate-400">Multi-axis capability metrics</p>
            </div>
            <span className="pill-indigo text-[10px] font-mono">
              COMPOSITE
            </span>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius={68} data={radarData}>
                <PolarGrid stroke="#2D3748" />
                <PolarAngleAxis dataKey="metric" stroke="#94a3b8" fontSize={9} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" fontSize={8} />
                <Radar name="Lab Average" dataKey="value" stroke="#38BDF8" fill="#38BDF8" fillOpacity={0.35} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
            <span>Index: <strong className="text-sky-400">CLASS A</strong></span>
            <span>Target: <strong className="text-slate-300">CI/CD DEPLOY</strong></span>
          </div>
        </div>
      </div>

      {/* Feature Exploration Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#2D3748] pb-3">
          <div>
            <h2 className="text-sm font-mono uppercase font-bold text-white tracking-wider">Laboratory Engines & Modules</h2>
            <p className="text-xs text-slate-400">AI generation, system topology design, and roadmap automation</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Card 1 */}
          <div
            id="tool-idea-generator"
            onClick={() => onNavigate('generate')}
            className="group glass hover:border-sky-500/50 rounded-xl p-5 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 shadow-md hover:shadow-sky-500/10"
          >
            <div className="w-9 h-9 rounded bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 mb-3 group-hover:scale-105 transition-transform">
              <Lightbulb className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white group-hover:text-sky-400 transition-colors flex items-center justify-between font-mono">
              <span>AI Idea Generator</span>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-sky-400 group-hover:translate-x-1 transition-all" />
            </h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Generate 5 multi-domain project specs with tech stacks, database architectures, and innovation ratings.
            </p>
          </div>

          {/* Card 2 */}
          <div
            id="tool-project-evaluator"
            onClick={() => onNavigate('evaluate')}
            className="group glass hover:border-indigo-500/50 rounded-xl p-5 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 shadow-md hover:shadow-indigo-500/10"
          >
            <div className="w-9 h-9 rounded bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-3 group-hover:scale-105 transition-transform">
              <Gauge className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors flex items-center justify-between font-mono">
              <span>Feasibility Evaluator</span>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
            </h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Audit concepts for a 0-100 Readiness Score, security risk modeling, and missing architectural features.
            </p>
          </div>

          {/* Card 3 */}
          <div
            id="tool-architecture-generator"
            onClick={() => onNavigate('architecture')}
            className="group glass hover:border-cyan-500/50 rounded-xl p-5 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 shadow-md hover:shadow-cyan-500/10"
          >
            <div className="w-9 h-9 rounded bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-3 group-hover:scale-105 transition-transform">
              <Network className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors flex items-center justify-between font-mono">
              <span>6-Tier Architecture</span>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
            </h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Synthesize 6-layer system topologies with interactive data flow visualizers and protocol mappings.
            </p>
          </div>

          {/* Card 4 */}
          <div
            id="tool-roadmap-builder"
            onClick={() => onNavigate('roadmap')}
            className="group glass hover:border-emerald-500/50 rounded-xl p-5 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 shadow-md hover:shadow-emerald-500/10"
          >
            <div className="w-9 h-9 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3 group-hover:scale-105 transition-transform">
              <GitFork className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors flex items-center justify-between font-mono">
              <span>8-Phase Roadmap</span>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
            </h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Step-by-step task breakdown with hours estimates, dependencies, and interactive milestone tracking.
            </p>
          </div>

          {/* Card 5 */}
          <div
            id="tool-tech-advisor"
            onClick={() => onNavigate('tech-stack')}
            className="group glass hover:border-amber-500/50 rounded-xl p-5 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 shadow-md hover:shadow-amber-500/10"
          >
            <div className="w-9 h-9 rounded bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3 group-hover:scale-105 transition-transform">
              <Cpu className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors flex items-center justify-between font-mono">
              <span>Tech Stack Advisor</span>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
            </h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Optimal framework and library selection with trade-offs, pros/cons, and curated alternatives.
            </p>
          </div>

          {/* Card 6 */}
          <div
            id="tool-project-compare"
            onClick={() => onNavigate('compare')}
            className="group glass hover:border-pink-500/50 rounded-xl p-5 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 shadow-md hover:shadow-pink-500/10"
          >
            <div className="w-9 h-9 rounded bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400 mb-3 group-hover:scale-105 transition-transform">
              <Scale className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white group-hover:text-pink-400 transition-colors flex items-center justify-between font-mono">
              <span>Comparison Matrix</span>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-pink-400 group-hover:translate-x-1 transition-all" />
            </h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Side-by-side benchmarking of 2 to 4 project ideas across complexity, timelines, and technical footprints.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Projects Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#2D3748] pb-3">
          <div>
            <h2 className="text-sm font-mono uppercase font-bold text-white tracking-wider">Repository Project Records</h2>
            <p className="text-xs text-slate-400">Recent active specifications stored in database</p>
          </div>
          <button
            id="view-all-projects-btn"
            onClick={() => onNavigate('history')}
            className="text-xs font-mono font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1"
          >
            <span>VIEW ALL ARCHIVE</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.recentProjects.map((project) => {
            const diffStyle = getDifficultyColor(project.difficultyLevel);
            return (
              <div
                key={project.id}
                id={`recent-project-${project.id}`}
                onClick={() => onSelectProject(project)}
                className="glass hover:border-sky-500/40 rounded-xl p-4 flex flex-col justify-between cursor-pointer group transition-all duration-150"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono font-medium text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20 truncate max-w-[140px]">
                      {project.domain}
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${diffStyle.bg} ${diffStyle.text} ${diffStyle.border}`}>
                      {project.difficultyLevel} ({project.difficultyScore}/10)
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white group-hover:text-sky-300 transition-colors line-clamp-2 font-mono">
                    {project.title}
                  </h4>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-[#2D3748] flex items-center justify-between text-xs font-mono text-slate-400">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>{project.estimatedTime}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sky-400 font-medium">
                    <Award className="w-3.5 h-3.5" />
                    <span>★ {project.innovationScore}/10</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
