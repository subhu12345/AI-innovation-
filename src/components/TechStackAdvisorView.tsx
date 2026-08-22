import React, { useState } from 'react';
import {
  Cpu,
  Sparkles,
  Layers,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RefreshCw,
  Zap,
  Globe,
  Server,
  Database,
  ShieldCheck,
  Cloud,
  Code,
  Network,
  PackageCheck,
  Terminal
} from 'lucide-react';
import { ProjectIdea, TechStackAdvice, TechStackRecommendation } from '../types';
import { api } from '../lib/api';

interface TechStackAdvisorViewProps {
  activeProject?: ProjectIdea | null;
  savedProjects: ProjectIdea[];
}

export const TechStackAdvisorView: React.FC<TechStackAdvisorViewProps> = ({
  activeProject,
  savedProjects
}) => {
  const [title, setTitle] = useState(activeProject?.title || 'Decentralized Healthcare Telemetry System');
  const [domain, setDomain] = useState(activeProject?.domain || 'Healthcare & Biotech');
  const [description, setDescription] = useState(
    activeProject?.description ||
    'Real-time wearable ECG sensor telemetry with zero-knowledge consent verification, local encryption, and doctor dashboard.'
  );
  const [constraints, setConstraints] = useState('High data privacy compliance (HIPAA), sub-second latency, zero cloud vendor lock-in');

  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState<TechStackAdvice | null>(null);

  const handleSelectSaved = (projId: string) => {
    const p = savedProjects.find(item => item.id === projId);
    if (p) {
      setTitle(p.title);
      setDomain(p.domain);
      setDescription(p.description);
    }
  };

  const handleGetAdvice = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const res = await api.recommendTechStack({
        title,
        domain,
        description,
        constraints
      });
      setAdvice(res);
    } catch (err) {
      console.error('Error fetching tech stack advice:', err);
    } finally {
      setLoading(false);
    }
  };

  const getTierIcon = (category: string) => {
    const t = category.toLowerCase();
    if (t.includes('front')) return <Globe className="w-4 h-4 text-sky-400" />;
    if (t.includes('back')) return <Server className="w-4 h-4 text-purple-400" />;
    if (t.includes('data')) return <Database className="w-4 h-4 text-emerald-400" />;
    if (t.includes('ai') || t.includes('ml')) return <Cpu className="w-4 h-4 text-pink-400" />;
    if (t.includes('cloud') || t.includes('devops')) return <Cloud className="w-4 h-4 text-indigo-400" />;
    if (t.includes('auth')) return <ShieldCheck className="w-4 h-4 text-amber-400" />;
    if (t.includes('api')) return <Network className="w-4 h-4 text-cyan-400" />;
    return <PackageCheck className="w-4 h-4 text-teal-400" />;
  };

  const getTierList = (data: TechStackAdvice): TechStackRecommendation[] => {
    const list: TechStackRecommendation[] = [];
    if (data.frontend) list.push(data.frontend);
    if (data.backend) list.push(data.backend);
    if (data.database) list.push(data.database);
    if (data.aiMl) list.push(data.aiMl);
    if (data.cloud) list.push(data.cloud);
    if (data.auth) list.push(data.auth);
    if (data.api) list.push(data.api);
    if (data.deployment) list.push(data.deployment);
    return list;
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#2D3748] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-semibold mb-2">
            <Cpu className="w-3.5 h-3.5" />
            <span>AI ARCHITECTURE & STACK ADVISOR</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            AI Technology Stack Advisor
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl">
            Get framework comparisons, architectural rationale, pros/cons analysis, and vetted alternative libraries tailored specifically to your domain.
          </p>
        </div>

        {savedProjects.length > 0 && (
          <div className="flex items-center gap-2 font-mono">
            <span className="text-xs text-slate-400 whitespace-nowrap">LOAD SPEC:</span>
            <select
              onChange={e => handleSelectSaved(e.target.value)}
              className="bg-[#151921] border border-[#2D3748] text-xs text-slate-200 rounded px-3 py-2 focus:outline-none focus:border-sky-500 max-w-[200px] truncate"
            >
              <option value="">-- Choose Project --</option>
              {savedProjects.map(p => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleGetAdvice} className="glass rounded-xl p-6 space-y-4 shadow-2xl font-mono">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Project Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Distributed IoT Forest Fire Sentinel"
              className="w-full bg-[#0B0E14] border border-[#2D3748] rounded px-3.5 py-2 text-xs text-white focus:border-sky-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Domain</label>
            <input
              type="text"
              value={domain}
              onChange={e => setDomain(e.target.value)}
              placeholder="e.g. CleanTech & IoT"
              className="w-full bg-[#0B0E14] border border-[#2D3748] rounded px-3.5 py-2 text-xs text-white focus:border-sky-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Description & Goals</label>
          <textarea
            rows={2}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Describe the system throughput, user scale, hardware interfaces, or latency requirements..."
            className="w-full bg-[#0B0E14] border border-[#2D3748] rounded p-3 text-xs text-white focus:border-sky-500 focus:outline-none resize-none font-mono"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Special Constraints & Preferences (Optional)</label>
          <input
            type="text"
            value={constraints}
            onChange={e => setConstraints(e.target.value)}
            placeholder="e.g. Open-source only, Python ecosystem, low cost, microservices..."
            className="w-full bg-[#0B0E14] border border-[#2D3748] rounded px-3.5 py-2 text-xs text-white focus:border-sky-500 focus:outline-none"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 rounded bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 uppercase tracking-wider"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Evaluating Frameworks & Libraries...</span>
              </>
            ) : (
              <>
                <Cpu className="w-4 h-4" />
                <span>Recommend Optimal Stack</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Tech Stack Advice Output */}
      {advice && (
        <div className="space-y-6 animate-fadeIn">
          {/* Executive Overview */}
          <div className="glass rounded-xl p-6 space-y-3 shadow-xl">
            <div className="flex items-center gap-2 font-mono">
              <span className="pill text-[10px]">
                RECOMMENDED ARCHITECTURE SPEC
              </span>
            </div>
            <h3 className="text-base font-bold text-white tracking-tight font-mono">{advice.projectTitle}</h3>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">{advice.summary}</p>
          </div>

          {/* Tier Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
            {getTierList(advice).map((tier, idx) => (
              <div
                key={idx}
                className="glass rounded-xl p-5 flex flex-col justify-between space-y-4 shadow-lg hover:border-slate-600 transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded bg-[#0B0E14] border border-[#2D3748] flex items-center justify-center flex-shrink-0">
                      {getTierIcon(tier.category)}
                    </div>
                    <div>
                      <span className="text-[9px] font-bold uppercase text-slate-400 block">{tier.category}</span>
                      <h4 className="text-xs font-bold text-sky-300 leading-snug">{tier.recommended}</h4>
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-300 leading-relaxed bg-[#0B0E14] p-3 rounded border border-[#2D3748] font-sans">
                    {tier.rationale}
                  </p>

                  {/* Key Libraries */}
                  {tier.keyLibraries?.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold uppercase text-sky-400">Key Libraries:</span>
                      <div className="flex flex-wrap gap-1">
                        {tier.keyLibraries.map(lib => (
                          <span key={lib} className="text-[9px] px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-300 border border-sky-500/20">
                            {lib}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-2 pt-1 font-sans">
                    {/* Pros */}
                    <div>
                      <span className="text-[9px] font-mono font-bold uppercase text-emerald-400">Pros:</span>
                      <ul className="text-[10px] text-slate-300 space-y-1 mt-1">
                        {tier.pros.map((p, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400 mt-0.5 flex-shrink-0" />
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Cons */}
                    <div>
                      <span className="text-[9px] font-mono font-bold uppercase text-rose-400">Trade-offs:</span>
                      <ul className="text-[10px] text-slate-300 space-y-1 mt-1">
                        {tier.consOrConsiderations.map((c, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <XCircle className="w-3 h-3 text-rose-400 mt-0.5 flex-shrink-0" />
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#2D3748]">
                  <span className="text-[9px] font-bold uppercase text-slate-500 block mb-1">
                    Viable Alternatives:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {tier.alternatives.map(alt => (
                      <span key={alt} className="text-[9px] px-2 py-0.5 rounded bg-[#0B0E14] text-slate-400 border border-[#2D3748]">
                        {alt}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
