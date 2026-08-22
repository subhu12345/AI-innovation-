import React from 'react';
import {
  X,
  Sparkles,
  CheckCircle2,
  Clock,
  Users,
  Target,
  FileDown,
  Network,
  GitFork,
  Gauge,
  Cpu,
  Layers,
  Server,
  Database,
  Radio,
  BookOpen,
  Terminal
} from 'lucide-react';
import { ProjectIdea } from '../types';
import { getDifficultyColor, exportProjectAsMarkdown, exportProjectAsJSON } from '../lib/utils';

interface ProjectDetailModalProps {
  project: ProjectIdea | null;
  onClose: () => void;
  onNavigateToArchitecture: (project: ProjectIdea) => void;
  onNavigateToRoadmap: (project: ProjectIdea) => void;
  onNavigateToEvaluate: (project: ProjectIdea) => void;
  onNavigateToTechStack: (project: ProjectIdea) => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  onClose,
  onNavigateToArchitecture,
  onNavigateToRoadmap,
  onNavigateToEvaluate,
  onNavigateToTechStack
}) => {
  if (!project) return null;

  const diffStyle = getDifficultyColor(project.difficultyLevel);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div
        id="project-detail-modal"
        className="relative w-full max-w-4xl max-h-[90vh] bg-[#151921] border border-[#2D3748] rounded-xl shadow-2xl flex flex-col overflow-hidden animate-scaleIn font-mono"
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-[#2D3748] flex items-start justify-between gap-4 bg-[#0B0E14]">
          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                {project.domain}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${diffStyle.bg} ${diffStyle.text} ${diffStyle.border}`}>
                {project.difficultyLevel} (Diff: {project.difficultyScore}/10)
              </span>
              <span className="text-[10px] font-bold text-pink-400 bg-pink-500/10 px-2 py-0.5 rounded border border-pink-500/20">
                ★ INNOVATION: {project.innovationScore}/10
              </span>
              {project.readinessScore && (
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  READINESS: {project.readinessScore}%
                </span>
              )}
            </div>

            <h2 className="text-lg font-bold text-white tracking-tight">{project.title}</h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded bg-[#151921] hover:bg-[#1E2633] text-slate-300 border border-[#2D3748] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs text-slate-300">
          {/* Problem Statement & Description */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#0B0E14] p-4 rounded border border-[#2D3748] space-y-2">
              <h4 className="font-bold text-rose-300 uppercase tracking-wider text-[10px]">Problem Statement</h4>
              <p className="leading-relaxed text-slate-300 font-sans">{project.problemStatement}</p>
            </div>

            <div className="bg-[#0B0E14] p-4 rounded border border-[#2D3748] space-y-2">
              <h4 className="font-bold text-sky-300 uppercase tracking-wider text-[10px]">System Summary</h4>
              <p className="leading-relaxed text-slate-300 font-sans">{project.description}</p>
            </div>
          </div>

          {/* Objectives & Target Users */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#0B0E14] p-4 rounded border border-[#2D3748] space-y-2">
              <h4 className="font-bold text-emerald-300 uppercase tracking-wider text-[10px]">Core Objectives</h4>
              <ul className="space-y-1.5 font-sans">
                {project.objectives.map((o, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>{o}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[#0B0E14] p-4 rounded border border-[#2D3748] space-y-2">
              <h4 className="font-bold text-amber-300 uppercase tracking-wider text-[10px]">Target Audience</h4>
              <div className="flex flex-wrap gap-1.5 pt-1 font-sans">
                {project.targetUsers.map(u => (
                  <span key={u} className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[11px]">
                    {u}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Technology Requirements */}
          <div className="bg-[#0B0E14] p-4 rounded border border-[#2D3748] space-y-3">
            <h4 className="font-bold text-sky-300 uppercase tracking-wider text-[10px]">Technology Specification</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Tech Stack:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {project.technologiesRequired.map(t => (
                    <span key={t} className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-300 border border-sky-500/20 text-[10px]">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Database:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {project.databaseRequirements.map(d => (
                    <span key={d} className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 text-[10px]">
                      {d}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Hardware / IoT:</span>
                <div className="text-[11px] text-slate-300 mt-1 font-sans">
                  {project.hardwareRequirements?.length ? project.hardwareRequirements.join(', ') : 'Pure Software / Cloud'}
                </div>
              </div>
            </div>
          </div>

          {/* Modular Architecture Breakdown */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[10px]">Core Micro-Modules</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {project.developmentModules.map((mod, idx) => (
                <div key={idx} className="bg-[#0B0E14] p-3.5 rounded border border-[#2D3748] space-y-1">
                  <span className="text-[9px] font-bold text-sky-400 uppercase">Module 0{idx + 1}</span>
                  <h5 className="font-bold text-white text-xs">{mod.name}</h5>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-sans">{mod.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* System Architecture & APIs */}
          <div className="bg-[#0B0E14] p-4 rounded border border-[#2D3748] space-y-3">
            <h4 className="font-bold text-sky-300 uppercase tracking-wider text-[10px]">System Architecture & API Endpoints</h4>
            <p className="text-slate-300 leading-relaxed font-sans">{project.systemArchitectureExplanation}</p>
            <div className="space-y-1 pt-2">
              {project.apiSuggestions.map((api, i) => (
                <div key={i} className="bg-[#151921] p-2 rounded border border-[#2D3748] flex items-center justify-between text-[11px]">
                  <span className="font-mono text-sky-400 font-bold">{api.method} {api.endpoint}</span>
                  <span className="text-slate-400 font-sans">{api.description}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 border-t border-[#2D3748] bg-[#0B0E14] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => exportProjectAsMarkdown(project)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#151921] hover:bg-[#1E2633] text-slate-200 text-xs font-mono border border-[#2D3748]"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>.MD</span>
            </button>
            <button
              onClick={() => exportProjectAsJSON(project)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#151921] hover:bg-[#1E2633] text-slate-200 text-xs font-mono border border-[#2D3748]"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>JSON</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onNavigateToEvaluate(project);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 border border-purple-500/30 text-xs font-semibold uppercase tracking-wider"
            >
              <Gauge className="w-3.5 h-3.5" />
              <span>Evaluate</span>
            </button>
            <button
              onClick={() => {
                onClose();
                onNavigateToArchitecture(project);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 border border-sky-500/30 text-xs font-semibold uppercase tracking-wider"
            >
              <Network className="w-3.5 h-3.5" />
              <span>Architecture</span>
            </button>
            <button
              onClick={() => {
                onClose();
                onNavigateToRoadmap(project);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-xs font-semibold uppercase tracking-wider"
            >
              <GitFork className="w-3.5 h-3.5" />
              <span>Roadmap</span>
            </button>
            <button
              onClick={() => {
                onClose();
                onNavigateToTechStack(project);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-semibold uppercase tracking-wider"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Tech Stack</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
