import React, { useState } from 'react';
import {
  Gauge,
  Sparkles,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  DollarSign,
  Layers,
  ArrowRight,
  Plus,
  Zap,
  RefreshCw,
  Lightbulb,
  FileCheck2,
  FolderOpen,
  Terminal,
  Activity,
  ShieldCheck
} from 'lucide-react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';
import { ProjectIdea, ProjectEvaluation, RecommendedFeature } from '../types';
import { api } from '../lib/api';
import { triggerCelebration } from '../lib/utils';

interface EvaluatorViewProps {
  initialProject?: ProjectIdea | null;
  savedProjects: ProjectIdea[];
  onSaveEvaluation?: (projectId: string, evaluation: ProjectEvaluation) => void;
  onNavigateToArchitecture?: (project: ProjectIdea) => void;
  onNavigateToRoadmap?: (project: ProjectIdea) => void;
}

export const EvaluatorView: React.FC<EvaluatorViewProps> = ({
  initialProject,
  savedProjects,
  onSaveEvaluation,
  onNavigateToArchitecture,
  onNavigateToRoadmap
}) => {
  const [title, setTitle] = useState(initialProject?.title || '');
  const [domain, setDomain] = useState(initialProject?.domain || 'Artificial Intelligence');
  const [problemStatement, setProblemStatement] = useState(initialProject?.problemStatement || '');
  const [description, setDescription] = useState(initialProject?.description || '');
  const [technologies, setTechnologies] = useState(initialProject?.technologiesRequired?.join(', ') || 'React, Python, FastAPI, PostgreSQL');
  const [targetUsers, setTargetUsers] = useState(initialProject?.targetUsers?.join(', ') || 'Students, Developers, Researchers');

  const [loading, setLoading] = useState(false);
  const [evaluation, setEvaluation] = useState<ProjectEvaluation | null>(initialProject?.evaluation || null);
  const [error, setError] = useState<string | null>(null);

  // Advanced Feature Recommender State
  const [recommendingFeatures, setRecommendingFeatures] = useState(false);
  const [recommendedFeatures, setRecommendedFeatures] = useState<RecommendedFeature[]>(initialProject?.recommendedFeatures || []);
  const [addedFeatureIds, setAddedFeatureIds] = useState<Set<string>>(new Set());

  // Load from saved project dropdown
  const handleSelectSavedProject = (projId: string) => {
    const proj = savedProjects.find(p => p.id === projId);
    if (proj) {
      setTitle(proj.title);
      setDomain(proj.domain);
      setProblemStatement(proj.problemStatement);
      setDescription(proj.description);
      setTechnologies(proj.technologiesRequired.join(', '));
      setTargetUsers(proj.targetUsers.join(', '));
      if (proj.evaluation) {
        setEvaluation(proj.evaluation);
      }
      if (proj.recommendedFeatures) {
        setRecommendedFeatures(proj.recommendedFeatures);
      }
    }
  };

  const handleEvaluate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError('Please provide at least a Project Title and Project Description.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const techArray = technologies.split(',').map(t => t.trim()).filter(Boolean);
      const userArray = targetUsers.split(',').map(u => u.trim()).filter(Boolean);

      const result = await api.evaluateProject({
        title,
        domain,
        problemStatement,
        description,
        technologiesRequired: techArray,
        targetUsers: userArray
      });

      setEvaluation(result);
      if (initialProject && onSaveEvaluation) {
        onSaveEvaluation(initialProject.id, result);
      }
      triggerCelebration();
    } catch (err: any) {
      console.error('Error evaluating project:', err);
      setError(err.message || 'Evaluation failed. Please verify API connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleFetchFeatureRecommendations = async () => {
    if (!title.trim() || !description.trim()) {
      setError('Please provide project details before requesting feature recommendations.');
      return;
    }

    setRecommendingFeatures(true);
    try {
      const techArray = technologies.split(',').map(t => t.trim()).filter(Boolean);
      const feats = await api.recommendFeatures({
        title,
        domain,
        description,
        technologiesRequired: techArray
      });
      setRecommendedFeatures(feats);
    } catch (err: any) {
      console.error('Error fetching feature recommendations:', err);
      setError(err.message || 'Failed to fetch feature recommendations.');
    } finally {
      setRecommendingFeatures(false);
    }
  };

  const handleToggleAddFeature = (feature: RecommendedFeature) => {
    setAddedFeatureIds(prev => {
      const next = new Set(prev);
      if (next.has(feature.id)) {
        next.delete(feature.id);
      } else {
        next.add(feature.id);
        setDescription(prevDesc => `${prevDesc}\n\n[Advanced Capability Added: ${feature.title}] - ${feature.description}`);
      }
      return next;
    });
  };

  const radarData = evaluation ? [
    { metric: 'Innovation', score: evaluation.innovationScore },
    { metric: 'Feasibility', score: evaluation.technicalFeasibilityScore },
    { metric: 'Usefulness', score: evaluation.usefulnessScore },
    { metric: 'Scalability', score: evaluation.scalabilityScore },
    { metric: 'Complexity', score: evaluation.complexityScore },
    { metric: 'Security / Risk', score: Math.max(20, 100 - evaluation.possibleChallenges.length * 15) }
  ] : [];

  const barData = evaluation ? [
    { name: 'Readiness', value: evaluation.overallReadinessScore, fill: '#34D399' },
    { name: 'Innovation', value: evaluation.innovationScore, fill: '#F472B6' },
    { name: 'Feasibility', value: evaluation.technicalFeasibilityScore, fill: '#38BDF8' },
    { name: 'Utility', value: evaluation.usefulnessScore, fill: '#818CF8' },
    { name: 'Scalability', value: evaluation.scalabilityScore, fill: '#A78BFA' },
    { name: 'Complexity', value: evaluation.complexityScore, fill: '#FBBF24' }
  ] : [];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#2D3748] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-mono font-semibold mb-2">
            <Gauge className="w-3.5 h-3.5" />
            <span>AI TECHNICAL FEASIBILITY & READINESS AUDITOR</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            System Feasibility & Technical Readiness Audit
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl">
            Evaluate concepts against production telemetry standards. Compute a 0-100 Project Readiness Score, examine cyber threat matrices, and discover cutting-edge architecture features.
          </p>
        </div>

        {/* Load From Saved */}
        {savedProjects.length > 0 && (
          <div className="flex items-center gap-2 font-mono">
            <span className="text-xs text-slate-400 whitespace-nowrap">LOAD SPEC:</span>
            <select
              id="load-saved-project-select"
              onChange={e => handleSelectSavedProject(e.target.value)}
              className="bg-[#151921] border border-[#2D3748] text-xs text-slate-200 rounded px-3 py-2 focus:outline-none focus:border-sky-500 max-w-[200px] truncate"
            >
              <option value="">-- Choose Repository --</option>
              {savedProjects.map(p => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Input Submission Form */}
      <form onSubmit={handleEvaluate} className="glass rounded-xl p-6 space-y-5 shadow-2xl">
        <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Terminal className="w-4 h-4 text-sky-400" />
          <span>Project Topology Parameters</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Project Title *</label>
            <input
              id="eval-title-input"
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. AI-Powered Autonomous Crop Blight Detection Drone"
              className="w-full bg-[#0B0E14] border border-[#2D3748] rounded px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Domain / Industry</label>
            <input
              id="eval-domain-input"
              type="text"
              value={domain}
              onChange={e => setDomain(e.target.value)}
              placeholder="e.g. Agriculture & IoT"
              className="w-full bg-[#0B0E14] border border-[#2D3748] rounded px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-1.5 font-mono">
          <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Problem Statement</label>
          <input
            id="eval-problem-input"
            type="text"
            value={problemStatement}
            onChange={e => setProblemStatement(e.target.value)}
            placeholder="e.g. Traditional chemical spraying wastes 70% of pesticide due to lack of localized pest segmentation..."
            className="w-full bg-[#0B0E14] border border-[#2D3748] rounded px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider">Description & Core Architectural Logic *</label>
          <textarea
            id="eval-description-input"
            required
            rows={3}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Describe the system architecture, data ingestion, ML models, and user workflow in detail..."
            className="w-full bg-[#0B0E14] border border-[#2D3748] rounded p-3 text-xs text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none resize-none font-mono"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Planned Technologies (Comma-separated)</label>
            <input
              id="eval-tech-input"
              type="text"
              value={technologies}
              onChange={e => setTechnologies(e.target.value)}
              placeholder="e.g. Python, PyTorch, FastAPI, React, OpenCV, MQTT"
              className="w-full bg-[#0B0E14] border border-[#2D3748] rounded px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Target Users & Beneficiaries</label>
            <input
              id="eval-users-input"
              type="text"
              value={targetUsers}
              onChange={e => setTargetUsers(e.target.value)}
              placeholder="e.g. Farmers, Agronomists, Co-op Managers"
              className="w-full bg-[#0B0E14] border border-[#2D3748] rounded px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none"
            />
          </div>
        </div>

        {error && (
          <div className="p-3 rounded bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs font-mono">
            [ERR] {error}
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            id="run-evaluation-submit-btn"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 rounded bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-mono font-extrabold shadow-[0_0_20px_rgba(56,189,248,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 uppercase tracking-wider"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Auditing with Gemini AI...</span>
              </>
            ) : (
              <>
                <Gauge className="w-4 h-4" />
                <span>Run Feasibility & Readiness Audit</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Evaluation Results Display */}
      {evaluation && (
        <div className="space-y-8 animate-fadeIn">
          {/* Readiness Score Hero Card */}
          <div className="glass rounded-xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              {/* Circular Gauge */}
              <div className="flex items-center gap-6">
                <div className="relative w-32 h-32 flex items-center justify-center rounded-full bg-[#0B0E14] border-4 border-emerald-500/50 shadow-inner font-mono">
                  <div className="text-center">
                    <div className="text-4xl font-extrabold text-emerald-400 tracking-tight">
                      {evaluation.overallReadinessScore}
                    </div>
                    <div className="text-[9px] font-bold uppercase text-slate-400 tracking-widest">
                      READINESS
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>STATUS: {evaluation.overallReadinessScore >= 80 ? 'HIGH READINESS' : 'FEASIBLE WITH R&D'}</span>
                  </div>
                  <h2 className="text-lg font-bold text-white tracking-tight font-mono">{title}</h2>
                  <p className="text-xs text-slate-400 font-mono">
                    Estimated Cost Tier: <strong className="text-amber-400">{evaluation.estimatedCostTier}</strong>
                  </p>
                </div>
              </div>

              {/* Executive Summary */}
              <div className="lg:max-w-md bg-[#0B0E14] p-4 rounded-lg border border-[#2D3748] text-xs text-slate-300 leading-relaxed font-sans">
                <strong className="text-sky-400 block mb-1 font-mono uppercase tracking-wider text-[10px]">
                  [SYS AUDITOR SUMMARY]
                </strong>
                {evaluation.executiveSummary}
              </div>
            </div>

            {/* Score Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-4 border-t border-[#2D3748] font-mono">
              <div className="bg-[#0B0E14] p-3 rounded-lg border border-[#2D3748] space-y-1">
                <span className="text-[10px] text-slate-400 uppercase">Innovation</span>
                <div className="text-xl font-bold text-pink-400">{evaluation.innovationScore}%</div>
                <div className="w-full bg-[#151921] h-1 rounded overflow-hidden">
                  <div className="h-full bg-pink-500" style={{ width: `${evaluation.innovationScore}%` }} />
                </div>
              </div>

              <div className="bg-[#0B0E14] p-3 rounded-lg border border-[#2D3748] space-y-1">
                <span className="text-[10px] text-slate-400 uppercase">Feasibility</span>
                <div className="text-xl font-bold text-sky-400">{evaluation.technicalFeasibilityScore}%</div>
                <div className="w-full bg-[#151921] h-1 rounded overflow-hidden">
                  <div className="h-full bg-sky-400" style={{ width: `${evaluation.technicalFeasibilityScore}%` }} />
                </div>
              </div>

              <div className="bg-[#0B0E14] p-3 rounded-lg border border-[#2D3748] space-y-1">
                <span className="text-[10px] text-slate-400 uppercase">Utility</span>
                <div className="text-xl font-bold text-indigo-400">{evaluation.usefulnessScore}%</div>
                <div className="w-full bg-[#151921] h-1 rounded overflow-hidden">
                  <div className="h-full bg-indigo-400" style={{ width: `${evaluation.usefulnessScore}%` }} />
                </div>
              </div>

              <div className="bg-[#0B0E14] p-3 rounded-lg border border-[#2D3748] space-y-1">
                <span className="text-[10px] text-slate-400 uppercase">Scalability</span>
                <div className="text-xl font-bold text-purple-400">{evaluation.scalabilityScore}%</div>
                <div className="w-full bg-[#151921] h-1 rounded overflow-hidden">
                  <div className="h-full bg-purple-400" style={{ width: `${evaluation.scalabilityScore}%` }} />
                </div>
              </div>

              <div className="bg-[#0B0E14] p-3 rounded-lg border border-[#2D3748] space-y-1 col-span-2 sm:col-span-1">
                <span className="text-[10px] text-slate-400 uppercase">Complexity</span>
                <div className="text-xl font-bold text-amber-400">{evaluation.complexityScore}%</div>
                <div className="w-full bg-[#151921] h-1 rounded overflow-hidden">
                  <div className="h-full bg-amber-400" style={{ width: `${evaluation.complexityScore}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Charts Row: Radar + Horizontal Bars */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Radar Chart */}
            <div className="glass rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Feasibility Radar Matrix</h3>
                  <p className="text-[11px] text-slate-400">Multi-axis technical quality analysis</p>
                </div>
                <span className="pill-indigo text-[10px] font-mono">
                  RADAR TOPOLOGY
                </span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius={85} data={radarData}>
                    <PolarGrid stroke="#2D3748" />
                    <PolarAngleAxis dataKey="metric" stroke="#94a3b8" fontSize={10} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" fontSize={8} />
                    <Radar name="Project Score" dataKey="score" stroke="#818CF8" fill="#818CF8" fillOpacity={0.35} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bar Chart */}
            <div className="glass rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Attribute Breakdown</h3>
                  <p className="text-[11px] text-slate-400">Individual score index</p>
                </div>
                <span className="pill text-[10px] font-mono">
                  TELEMETRY BARS
                </span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                    <YAxis domain={[0, 100]} stroke="#64748b" fontSize={10} tickLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#151921', borderColor: '#2D3748', borderRadius: '6px', color: '#E2E8F0', fontSize: '11px', fontFamily: 'monospace' }}
                    />
                    <Bar dataKey="value" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Strengths & Missing Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="glass rounded-xl p-5 space-y-3">
              <h3 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Identified Strengths & Competitive Moat</span>
              </h3>
              <ul className="space-y-2">
                {evaluation.strengths.map((s, i) => (
                  <li key={i} className="text-xs text-slate-300 bg-[#0B0E14] p-3 rounded border border-[#2D3748] flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass rounded-xl p-5 space-y-3">
              <h3 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                <span>Recommended Missing Capabilities</span>
              </h3>
              <ul className="space-y-2">
                {evaluation.missingFeatures.map((f, i) => (
                  <li key={i} className="text-xs text-slate-300 bg-[#0B0E14] p-3 rounded border border-[#2D3748] flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Possible Challenges & Mitigation Strategies */}
          <div className="glass rounded-xl p-5 space-y-4">
            <h3 className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              <span>Technical Bottlenecks & Engineered Mitigations</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {evaluation.possibleChallenges.map((c, i) => (
                <div key={i} className="bg-[#0B0E14] p-4 rounded-lg border border-[#2D3748] space-y-2 font-mono">
                  <div className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300">RISK #{i+1}</span>
                  </div>
                  <p className="text-xs text-slate-300 font-sans">{c.challenge}</p>
                  <div className="pt-2 border-t border-[#2D3748] text-[11px] text-emerald-400 leading-relaxed font-sans">
                    <strong>Mitigation:</strong> {c.mitigation}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Security Concerns & Threats */}
          <div className="glass rounded-xl p-5 space-y-4">
            <h3 className="text-xs font-mono font-bold text-sky-400 uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" />
              <span>Security Threat Matrix & Defenses</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {evaluation.securityConcerns.map((s, i) => (
                <div key={i} className="bg-[#0B0E14] p-4 rounded-lg border border-[#2D3748] space-y-2 font-mono">
                  <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                    <span>THREAT: {s.threat}</span>
                  </div>
                  <div className="text-xs text-emerald-300 bg-emerald-950/20 p-2.5 rounded border border-emerald-500/20 font-sans">
                    <strong>Defensive Action:</strong> {s.mitigation}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actionable Next Steps */}
          <div className="glass rounded-xl p-5 space-y-3">
            <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <FileCheck2 className="w-4 h-4" />
              <span>Immediate Implementation Protocol</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {evaluation.nextSteps.map((step, i) => (
                <div key={i} className="bg-[#0B0E14] p-3.5 rounded-lg border border-[#2D3748] flex items-start gap-2.5 text-xs text-slate-300">
                  <span className="w-5 h-5 rounded bg-cyan-500/20 text-cyan-300 font-mono font-bold flex items-center justify-center flex-shrink-0 text-[10px]">
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Feature Recommender Section */}
          <div className="glass rounded-xl p-6 space-y-6 shadow-2xl border border-sky-500/30">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-sky-500/15 text-sky-300 text-xs font-mono font-semibold mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>FEATURE INNOVATION ENGINE</span>
                </div>
                <h3 className="text-base font-bold text-white tracking-tight font-mono">
                  &quot;What advanced features can make this project more innovative?&quot;
                </h3>
                <p className="text-xs text-slate-400 font-sans">
                  Generate categorized suggestions (Agentic AI, IoT Sensor Arrays, ZK Proofs, RAG Docs) and add directly to your plan.
                </p>
              </div>

              <button
                type="button"
                onClick={handleFetchFeatureRecommendations}
                disabled={recommendingFeatures}
                className="flex items-center gap-2 px-4 py-2 rounded bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-mono font-bold shadow-[0_0_15px_rgba(56,189,248,0.25)] transition-all hover:scale-[1.02] whitespace-nowrap disabled:opacity-50 uppercase tracking-wider"
              >
                {recommendingFeatures ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing Innovations...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5" />
                    <span>Recommend Features</span>
                  </>
                )}
              </button>
            </div>

            {recommendedFeatures.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fadeIn">
                {recommendedFeatures.map(feat => {
                  const isAdded = addedFeatureIds.has(feat.id);
                  return (
                    <div
                      key={feat.id}
                      className={`p-4 rounded-lg border transition-all flex flex-col justify-between space-y-3 ${
                        isAdded
                          ? 'bg-emerald-950/25 border-emerald-500 shadow-md shadow-emerald-500/10'
                          : 'bg-[#0B0E14] border-[#2D3748] hover:border-slate-600'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2 font-mono">
                          <span className="text-[9px] font-bold uppercase text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                            {feat.category}
                          </span>
                          <span className="text-[9px] font-semibold text-pink-400 bg-pink-500/10 px-2 py-0.5 rounded border border-pink-500/20">
                            Impact: {feat.impactLevel}
                          </span>
                        </div>

                        <h4 className="text-xs font-bold text-white font-mono">{feat.title}</h4>
                        <p className="text-[11px] text-slate-400 leading-relaxed font-sans">{feat.description}</p>

                        <div className="text-[10px] text-slate-500 bg-[#151921] p-2 rounded border border-[#2D3748] font-mono">
                          <strong>Tip:</strong> {feat.implementationTip}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleToggleAddFeature(feat)}
                        className={`w-full flex items-center justify-center gap-1.5 py-1.5 rounded text-xs font-mono font-semibold transition-all ${
                          isAdded
                            ? 'bg-emerald-500 text-slate-950 font-bold'
                            : 'bg-[#151921] hover:bg-[#1E2633] text-slate-200 border border-[#2D3748]'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-slate-950" />
                            <span>ADDED TO PLAN</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>+ ADD TO PLAN</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
