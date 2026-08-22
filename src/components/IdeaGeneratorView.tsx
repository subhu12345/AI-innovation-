import React, { useState } from 'react';
import {
  Sparkles,
  Lightbulb,
  Plus,
  X,
  ChevronDown,
  ChevronUp,
  Bookmark,
  BookmarkCheck,
  Network,
  GitFork,
  Gauge,
  Cpu,
  FileDown,
  Layers,
  CheckCircle2,
  Clock,
  Users,
  Target,
  ArrowRight,
  RefreshCw,
  Zap,
  Terminal,
  CpuIcon
} from 'lucide-react';
import { ProjectIdea, ActiveTab } from '../types';
import { DOMAINS, POPULAR_TECHS, DIFFICULTY_LEVELS, DURATION_OPTIONS, PROJECT_TYPES, SAMPLE_PRESETS } from '../data/domains';
import { getDifficultyColor, exportProjectAsMarkdown, exportProjectAsJSON, triggerCelebration } from '../lib/utils';
import { api } from '../lib/api';

interface IdeaGeneratorViewProps {
  onSaveProject: (project: ProjectIdea) => Promise<void>;
  onNavigateToArchitecture: (project: ProjectIdea) => void;
  onNavigateToRoadmap: (project: ProjectIdea) => void;
  onNavigateToEvaluate: (project: ProjectIdea) => void;
  onNavigateToTechStack: (project: ProjectIdea) => void;
  savedProjectIds: Set<string>;
}

export const IdeaGeneratorView: React.FC<IdeaGeneratorViewProps> = ({
  onSaveProject,
  onNavigateToArchitecture,
  onNavigateToRoadmap,
  onNavigateToEvaluate,
  onNavigateToTechStack,
  savedProjectIds
}) => {
  const [selectedDomain, setSelectedDomain] = useState<string>('Artificial Intelligence');
  const [selectedTechs, setSelectedTechs] = useState<string[]>(['Python', 'Gemini API', 'TypeScript', 'PostgreSQL']);
  const [techInput, setTechInput] = useState<string>('');
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [duration, setDuration] = useState<string>('1 Month (Mini Project)');
  const [teamType, setTeamType] = useState<'Individual' | 'Team'>('Individual');
  const [projectType, setProjectType] = useState<string>('Full-Stack Web & AI App');
  const [customRequirements, setCustomRequirements] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [generatedIdeas, setGeneratedIdeas] = useState<ProjectIdea[]>([]);
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAddTech = (techName: string) => {
    const trimmed = techName.trim();
    if (trimmed && !selectedTechs.includes(trimmed)) {
      setSelectedTechs([...selectedTechs, trimmed]);
      setTechInput('');
    }
  };

  const handleRemoveTech = (techToRemove: string) => {
    setSelectedTechs(selectedTechs.filter(t => t !== techToRemove));
  };

  const handleApplyPreset = (preset: typeof SAMPLE_PRESETS[0]) => {
    setSelectedDomain(preset.domain);
    setSelectedTechs(preset.tech);
    setDifficulty(preset.difficulty as any);
    setDuration(preset.duration);
    setProjectType(preset.type);
    setCustomRequirements(preset.custom);
  };

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    setLoading(true);

    // Progressive step updates while Gemini processes
    setLoadingStep('PARSING DOMAIN TOPOLOGY & NOVELTY CONSTRAINTS...');
    const stepTimer1 = setTimeout(() => {
      setLoadingStep('SYNTHESIZING HARDWARE, SOFTWARE & PERSISTENCE SCHEMAS...');
    }, 1200);
    const stepTimer2 = setTimeout(() => {
      setLoadingStep('FORMULATING 5 FORMAL SPECIFICATIONS VIA GEMINI FLASH...');
    }, 2400);

    try {
      const ideas = await api.generateIdeas({
        domain: selectedDomain,
        technologies: selectedTechs,
        difficulty,
        duration,
        teamType,
        projectType,
        customRequirements
      });

      setGeneratedIdeas(ideas);
      if (ideas.length > 0) {
        setExpandedCardId(ideas[0].id);
      }
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
    } catch (err: any) {
      console.error('Error generating ideas:', err);
      setError(err.message || 'Failed to generate ideas. Please check parameters and try again.');
    } finally {
      setLoading(false);
      setLoadingStep('');
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header & Presets */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#2D3748] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-mono font-semibold mb-2">
            <Terminal className="w-3.5 h-3.5" />
            <span>AI PROJECT GENERATOR ENGINE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Synthesize 5 Engineering Project Proposals
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl">
            Input parameters, domain constraints, and technical stack. Gemini AI synthesizes 5 production-grade project specifications with full 6-tier architecture mapping.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none font-mono">
          <span className="text-[11px] text-slate-500 font-semibold whitespace-nowrap">PRESETS:</span>
          {SAMPLE_PRESETS.map(p => (
            <button
              key={p.name}
              onClick={() => handleApplyPreset(p)}
              className="text-xs px-2.5 py-1 rounded bg-[#151921] hover:bg-[#1E2633] text-slate-300 border border-[#2D3748] hover:border-sky-500/50 whitespace-nowrap transition-colors"
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Generator Configuration Form */}
      <form onSubmit={handleGenerate} className="glass rounded-xl p-6 space-y-6 shadow-2xl">
        {/* Domain Selector */}
        <div className="space-y-3">
          <label className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center justify-between">
            <span>1. Target Engineering Domain</span>
            <span className="text-slate-400 font-normal">Active: <strong className="text-sky-400">{selectedDomain}</strong></span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 font-mono">
            {DOMAINS.map(domain => {
              const isSelected = selectedDomain.toLowerCase().includes(domain.name.toLowerCase().slice(0, 5));
              return (
                <div
                  key={domain.id}
                  id={`domain-select-${domain.id}`}
                  onClick={() => {
                    setSelectedDomain(domain.name);
                    const newTechs = Array.from(new Set([...selectedTechs, ...domain.suggestedTech.slice(0, 2)]));
                    setSelectedTechs(newTechs);
                  }}
                  className={`p-3 rounded-lg border cursor-pointer transition-all duration-150 flex flex-col justify-between ${
                    isSelected
                      ? 'bg-sky-500/15 border-sky-500 text-sky-200 shadow-[0_0_12px_rgba(56,189,248,0.15)] font-bold'
                      : 'bg-[#0B0E14] border-[#2D3748] text-slate-400 hover:border-slate-600 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs truncate">{domain.name}</span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />}
                  </div>
                  <p className="text-[10px] text-slate-500 line-clamp-1 mt-1 font-sans">{domain.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Technologies You Know */}
        <div className="space-y-3">
          <label className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center justify-between">
            <span>2. Frameworks, Libraries & Technologies</span>
            <span className="text-slate-400 font-normal">{selectedTechs.length} tech tags active</span>
          </label>

          {/* Active Tag Chips */}
          <div className="flex flex-wrap items-center gap-2 p-3 bg-[#0B0E14] border border-[#2D3748] rounded-lg min-h-[48px] font-mono">
            {selectedTechs.map(tech => (
              <span
                key={tech}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-sky-500/10 text-sky-300 border border-sky-500/30 text-xs font-medium"
              >
                <span>{tech}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTech(tech)}
                  className="hover:text-rose-400 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            {/* Tech Input */}
            <div className="inline-flex items-center gap-1 flex-1 min-w-[140px]">
              <input
                id="tech-input-field"
                type="text"
                value={techInput}
                onChange={e => setTechInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTech(techInput);
                  }
                }}
                placeholder="Type tech + Enter (e.g. PyTorch, Rust)..."
                className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none font-mono"
              />
              {techInput.trim() && (
                <button
                  type="button"
                  onClick={() => handleAddTech(techInput)}
                  className="p-1 rounded bg-sky-500 text-slate-950 text-xs font-bold hover:bg-sky-400"
                >
                  <Plus className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Popular Tag Suggestions */}
          <div className="flex flex-wrap items-center gap-1.5 font-mono">
            <span className="text-[11px] text-slate-500">Quick add:</span>
            {POPULAR_TECHS.slice(0, 12).map(t => (
              <button
                key={t}
                type="button"
                onClick={() => handleAddTech(t)}
                disabled={selectedTechs.includes(t)}
                className={`text-[10px] px-2 py-0.5 rounded border transition-colors ${
                  selectedTechs.includes(t)
                    ? 'bg-[#151921] text-slate-600 border-[#2D3748] cursor-default'
                    : 'bg-[#0B0E14] text-slate-400 border-[#2D3748] hover:border-sky-500/40 hover:text-slate-200'
                }`}
              >
                + {t}
              </button>
            ))}
          </div>
        </div>

        {/* Project Parameters Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
          {/* Difficulty */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">3. Difficulty</label>
            <select
              value={difficulty}
              onChange={e => setDifficulty(e.target.value as any)}
              className="w-full bg-[#0B0E14] border border-[#2D3748] rounded-lg px-3 py-2 text-xs text-white focus:border-sky-500 focus:outline-none"
            >
              {DIFFICULTY_LEVELS.map(d => (
                <option key={d.level} value={d.level} className="bg-[#151921]">
                  {d.label}
                </option>
              ))}
            </select>
          </div>

          {/* Duration */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">4. Timeline Horizon</label>
            <select
              value={duration}
              onChange={e => setDuration(e.target.value)}
              className="w-full bg-[#0B0E14] border border-[#2D3748] rounded-lg px-3 py-2 text-xs text-white focus:border-sky-500 focus:outline-none"
            >
              {DURATION_OPTIONS.map(opt => (
                <option key={opt} value={opt} className="bg-[#151921]">
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Team Format */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">5. Team Format</label>
            <select
              value={teamType}
              onChange={e => setTeamType(e.target.value as any)}
              className="w-full bg-[#0B0E14] border border-[#2D3748] rounded-lg px-3 py-2 text-xs text-white focus:border-sky-500 focus:outline-none"
            >
              <option value="Individual" className="bg-[#151921]">Individual Solo Developer</option>
              <option value="Team" className="bg-[#151921]">Collaborative Team (2-5 Devs)</option>
            </select>
          </div>

          {/* Project Type */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">6. Architecture Archetype</label>
            <select
              value={projectType}
              onChange={e => setProjectType(e.target.value)}
              className="w-full bg-[#0B0E14] border border-[#2D3748] rounded-lg px-3 py-2 text-xs text-white focus:border-sky-500 focus:outline-none"
            >
              {PROJECT_TYPES.map(t => (
                <option key={t} value={t} className="bg-[#151921]">
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Custom Requirements / Constraints */}
        <div className="space-y-2">
          <label className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center justify-between">
            <span>7. Custom Objectives or Specific Constraints (Optional)</span>
            <span className="text-[11px] text-slate-400 font-normal">e.g. Edge ML inference, zero-knowledge proofs, FHIR healthcare data</span>
          </label>
          <textarea
            rows={2}
            value={customRequirements}
            onChange={e => setCustomRequirements(e.target.value)}
            placeholder="Specify any custom engineering requirements, target hardware (Raspberry Pi, Jetson Nano), or industry compliance..."
            className="w-full bg-[#0B0E14] border border-[#2D3748] rounded-lg p-3 text-xs text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none font-mono"
          />
        </div>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#2D3748]">
          <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
            <Zap className="w-4 h-4 text-sky-400" />
            <span>Gemini 3.7 Flash: 5 Comprehensive Specs with 6-Tier Architecture</span>
          </div>

          <button
            type="submit"
            id="generate-ideas-submit-btn"
            disabled={loading}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-mono font-extrabold shadow-[0_0_20px_rgba(56,189,248,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none uppercase tracking-wider"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Synthesizing Specs...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>+ Synthesize 5 Proposals</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Loading Progress State */}
      {loading && (
        <div className="glass rounded-xl p-8 flex flex-col items-center justify-center space-y-4 shadow-2xl font-mono">
          <div className="w-12 h-12 rounded bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <RefreshCw className="w-6 h-6 animate-spin" />
          </div>
          <div className="text-center space-y-1">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Inference Engine Active</h3>
            <p className="text-xs text-sky-300 font-mono">{loadingStep || 'SYNTHESIZING 5 HIGH-IMPACT PROPOSALS...'}</p>
          </div>
          <div className="w-64 h-1.5 bg-[#0B0E14] rounded-full overflow-hidden border border-[#2D3748]">
            <div className="h-full bg-gradient-to-r from-sky-400 via-indigo-400 to-sky-300 rounded-full animate-pulse" />
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-lg bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs font-mono flex items-center justify-between">
          <span>[ERR] {error}</span>
          <button onClick={() => setError(null)} className="text-rose-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Generated Project Ideas List */}
      {generatedIdeas.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#2D3748] pb-3">
            <div>
              <h2 className="text-sm font-mono uppercase font-bold text-white tracking-wider">5 Synthesized Project Specifications</h2>
              <p className="text-xs text-slate-400">Select any project to inspect topology, save to database, or track roadmaps</p>
            </div>
            <span className="pill text-[10px] font-mono">
              5 SPECS GENERATED
            </span>
          </div>

          <div className="space-y-4">
            {generatedIdeas.map((idea, index) => {
              const isExpanded = expandedCardId === idea.id;
              const isSaved = savedProjectIds.has(idea.id);
              const diffStyle = getDifficultyColor(idea.difficultyLevel);

              return (
                <div
                  key={idea.id}
                  id={`project-card-${idea.id}`}
                  className={`glass rounded-xl transition-all duration-150 overflow-hidden shadow-lg ${
                    isExpanded ? 'border-sky-500/60 shadow-[0_0_20px_rgba(56,189,248,0.1)]' : 'hover:border-slate-600'
                  }`}
                >
                  {/* Card Header */}
                  <div
                    onClick={() => setExpandedCardId(isExpanded ? null : idea.id)}
                    className="p-5 sm:p-6 cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 select-none hover:bg-[#1A202C]/50"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2 font-mono">
                        <span className="text-[10px] font-bold text-slate-300 bg-[#0B0E14] border border-[#2D3748] px-2 py-0.5 rounded">
                          SPEC #{index + 1}
                        </span>
                        <span className="text-[10px] font-semibold text-sky-400 bg-sky-500/10 px-2.5 py-0.5 rounded border border-sky-500/25">
                          {idea.domain}
                        </span>
                        <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded border ${diffStyle.bg} ${diffStyle.text} ${diffStyle.border}`}>
                          {idea.difficultyLevel} (Score: {idea.difficultyScore}/10)
                        </span>
                        <span className="text-[10px] font-semibold text-pink-400 bg-pink-500/10 px-2.5 py-0.5 rounded border border-pink-500/25">
                          ★ Innovation: {idea.innovationScore}/10
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-white tracking-tight font-mono">
                        {idea.title}
                      </h3>

                      <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed font-sans">
                        {idea.problemStatement}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center font-mono">
                      <div className="text-right hidden sm:block">
                        <div className="text-xs text-slate-300">{idea.estimatedTime}</div>
                        <div className="text-[10px] text-slate-500 uppercase">{idea.teamType}</div>
                      </div>

                      <button
                        type="button"
                        className="p-2 rounded bg-[#0B0E14] border border-[#2D3748] hover:border-sky-500/40 text-slate-300 transition-colors"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Detailed Specifications */}
                  {isExpanded && (
                    <div className="border-t border-[#2D3748] bg-[#0B0E14]/80 p-5 sm:p-6 space-y-6 animate-fadeIn">
                      {/* Description & Objectives */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <h4 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">Project Overview & Scope</h4>
                          <p className="text-xs text-slate-300 leading-relaxed bg-[#151921] p-3.5 rounded-lg border border-[#2D3748]">
                            {idea.description}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <h4 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">Core Objectives & Milestones</h4>
                          <ul className="space-y-1.5 bg-[#151921] p-3.5 rounded-lg border border-[#2D3748]">
                            {idea.objectives.map((obj, i) => (
                              <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                                <span>{obj}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Technical Requirements Breakdown */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
                        <div className="bg-[#151921] p-4 rounded-lg border border-[#2D3748] space-y-2">
                          <h5 className="text-[11px] font-bold text-sky-400 uppercase tracking-wider">Required Technologies</h5>
                          <div className="flex flex-wrap gap-1.5">
                            {idea.technologiesRequired.map(t => (
                              <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-sky-500/10 text-sky-300 border border-sky-500/20">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="bg-[#151921] p-4 rounded-lg border border-[#2D3748] space-y-2">
                          <h5 className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">Database & Storage</h5>
                          <div className="flex flex-wrap gap-1.5">
                            {idea.databaseRequirements.map(d => (
                              <span key={d} className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                                {d}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="bg-[#151921] p-4 rounded-lg border border-[#2D3748] space-y-2">
                          <h5 className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Target Users & Roles</h5>
                          <div className="flex flex-wrap gap-1.5">
                            {idea.targetUsers.map(u => (
                              <span key={u} className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                                {u}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Hardware / AI Models if applicable */}
                      {(idea.hardwareRequirements?.length || idea.aiMlAlgorithms?.length) ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono">
                          {idea.hardwareRequirements && idea.hardwareRequirements.length > 0 && (
                            <div className="bg-[#151921] p-4 rounded-lg border border-[#2D3748] space-y-2">
                              <h5 className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">Hardware & Sensor Matrix</h5>
                              <ul className="text-xs text-slate-300 space-y-1">
                                {idea.hardwareRequirements.map((h, i) => (
                                  <li key={i} className="flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                                    <span>{h}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {idea.aiMlAlgorithms && idea.aiMlAlgorithms.length > 0 && (
                            <div className="bg-[#151921] p-4 rounded-lg border border-[#2D3748] space-y-2">
                              <h5 className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">AI / ML Algorithms</h5>
                              <ul className="text-xs text-slate-300 space-y-1">
                                {idea.aiMlAlgorithms.map((a, i) => (
                                  <li key={i} className="flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                                    <span>{a}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ) : null}

                      {/* Modular Breakdown */}
                      <div className="space-y-2">
                        <h4 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">Modular Development Architecture</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {idea.developmentModules.map((m, idx) => (
                            <div key={idx} className="bg-[#151921] p-3.5 rounded-lg border border-[#2D3748] space-y-1.5">
                              <span className="text-[10px] font-mono font-bold uppercase text-sky-400">Module {idx + 1}</span>
                              <h5 className="text-xs font-bold text-white font-mono">{m.name}</h5>
                              <p className="text-[11px] text-slate-400 leading-relaxed">{m.description}</p>
                              <div className="text-[10px] font-mono text-slate-500 pt-1 border-t border-[#2D3748]">
                                <strong>Deliverables:</strong> {m.deliverables.join(', ')}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* System Architecture Explanation & APIs */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="bg-[#151921] p-4 rounded-lg border border-[#2D3748] space-y-2">
                          <h5 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">System Architecture Topology</h5>
                          <p className="text-xs text-slate-400 leading-relaxed">{idea.systemArchitectureExplanation}</p>
                        </div>

                        <div className="bg-[#151921] p-4 rounded-lg border border-[#2D3748] space-y-2 font-mono">
                          <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Suggested RESTful APIs</h5>
                          <div className="space-y-1.5">
                            {idea.apiSuggestions.map((apiItem, i) => (
                              <div key={i} className="text-xs bg-[#0B0E14] p-2 rounded border border-[#2D3748] flex items-center justify-between gap-2">
                                <span className="font-mono text-sky-400 font-bold text-[11px]">{apiItem.method} {apiItem.endpoint}</span>
                                <span className="text-[10px] text-slate-400 truncate">{apiItem.description}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Interactive Action Toolbar */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#2D3748] font-mono">
                        {/* Save to SQLite Database */}
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            id={`save-project-btn-${idea.id}`}
                            onClick={async () => {
                              await onSaveProject(idea);
                            }}
                            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded text-xs font-semibold border transition-all ${
                              isSaved
                                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                                : 'bg-[#151921] hover:bg-[#1E2633] text-slate-200 border-[#2D3748]'
                            }`}
                          >
                            {isSaved ? <BookmarkCheck className="w-3.5 h-3.5 text-emerald-400" /> : <Bookmark className="w-3.5 h-3.5" />}
                            <span>{isSaved ? 'SAVED IN SQLITE' : 'SAVE SPEC'}</span>
                          </button>

                          {/* Export buttons */}
                          <button
                            type="button"
                            onClick={() => exportProjectAsMarkdown(idea)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded bg-[#151921] hover:bg-[#1E2633] text-slate-300 border border-[#2D3748] text-xs"
                            title="Download Markdown Spec"
                          >
                            <FileDown className="w-3.5 h-3.5" />
                            <span>.MD</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => exportProjectAsJSON(idea)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded bg-[#151921] hover:bg-[#1E2633] text-slate-300 border border-[#2D3748] text-xs"
                            title="Download JSON Spec"
                          >
                            <FileDown className="w-3.5 h-3.5" />
                            <span>JSON</span>
                          </button>
                        </div>

                        {/* Navigation Actions */}
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onNavigateToEvaluate(idea)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-300 border border-indigo-500/30 text-xs font-semibold"
                          >
                            <Gauge className="w-3.5 h-3.5" />
                            <span>Audit Feasibility</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => onNavigateToArchitecture(idea)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 border border-sky-500/30 text-xs font-semibold"
                          >
                            <Network className="w-3.5 h-3.5" />
                            <span>6-Tier Architecture</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => onNavigateToRoadmap(idea)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-xs font-semibold"
                          >
                            <GitFork className="w-3.5 h-3.5" />
                            <span>Build Roadmap</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => onNavigateToTechStack(idea)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-semibold"
                          >
                            <Cpu className="w-3.5 h-3.5" />
                            <span>Tech Stack</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
