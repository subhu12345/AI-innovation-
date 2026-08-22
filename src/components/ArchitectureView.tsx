import React, { useState } from 'react';
import {
  Network,
  Sparkles,
  Layers,
  ArrowDown,
  ArrowRight,
  ShieldCheck,
  Server,
  Database,
  Cpu,
  Smartphone,
  Globe,
  Radio,
  RefreshCw,
  Copy,
  Check,
  Zap,
  Code,
  Terminal,
  Activity
} from 'lucide-react';
import { ProjectIdea, ArchitectureData } from '../types';
import { api } from '../lib/api';

interface ArchitectureViewProps {
  activeProject?: ProjectIdea | null;
  savedProjects: ProjectIdea[];
  onSelectProject?: (project: ProjectIdea) => void;
}

export const ArchitectureView: React.FC<ArchitectureViewProps> = ({
  activeProject,
  savedProjects,
  onSelectProject
}) => {
  const [selectedProject, setSelectedProject] = useState<ProjectIdea | null>(activeProject || savedProjects[0] || null);
  const [architecture, setArchitecture] = useState<ArchitectureData | null>(
    activeProject?.architecture || (savedProjects[0]?.architecture ?? null)
  );
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(1);
  const [activeLayer, setActiveLayer] = useState<string>('frontend');
  const [copied, setCopied] = useState(false);

  const handleGenerateArchitecture = async (proj: ProjectIdea) => {
    setLoading(true);
    try {
      const arch = await api.generateArchitecture({
        title: proj.title,
        domain: proj.domain,
        description: proj.description,
        technologiesRequired: proj.technologiesRequired,
        projectId: proj.id
      });
      setArchitecture(arch);
    } catch (err) {
      console.error('Failed to generate architecture:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProjectChange = (projId: string) => {
    const proj = savedProjects.find(p => p.id === projId);
    if (proj) {
      setSelectedProject(proj);
      if (proj.architecture) {
        setArchitecture(proj.architecture);
      } else {
        handleGenerateArchitecture(proj);
      }
    }
  };

  const copyArchitectureJSON = () => {
    if (architecture) {
      navigator.clipboard.writeText(JSON.stringify(architecture, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#2D3748] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-mono font-semibold mb-2">
            <Network className="w-3.5 h-3.5" />
            <span>AI SYSTEM ARCHITECTURE TOPOLOGY</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            6-Tier System Architecture & Data Flow
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl">
            Visually inspect structural layers from Web/Client interfaces to API Gateways, Microservices, AI/ML inference, SQLite/PostgreSQL persistence, and Edge IoT nodes.
          </p>
        </div>

        {/* Project Selector & Actions */}
        <div className="flex items-center gap-3 font-mono">
          {savedProjects.length > 0 && (
            <select
              id="arch-project-select"
              value={selectedProject?.id || ''}
              onChange={e => handleSelectProjectChange(e.target.value)}
              className="bg-[#151921] border border-[#2D3748] text-xs text-slate-200 rounded px-3 py-2 focus:outline-none focus:border-sky-500 max-w-[200px] truncate"
            >
              {savedProjects.map(p => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          )}

          {selectedProject && (
            <button
              type="button"
              onClick={() => handleGenerateArchitecture(selectedProject)}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-2 rounded bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold transition-all disabled:opacity-50 uppercase tracking-wider"
            >
              {loading ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5" />
              )}
              <span>Regen Stack</span>
            </button>
          )}

          {architecture && (
            <button
              type="button"
              onClick={copyArchitectureJSON}
              className="p-2 rounded bg-[#151921] hover:bg-[#1E2633] text-slate-300 border border-[#2D3748] text-xs flex items-center gap-1 transition-colors"
              title="Copy Architecture JSON"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="glass rounded-xl p-12 flex flex-col items-center justify-center space-y-4 shadow-2xl font-mono">
          <RefreshCw className="w-8 h-8 text-sky-400 animate-spin" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Synthesizing 6-Tier Architecture Topology</h3>
          <p className="text-xs text-slate-400">Deconstructing frontend, gateway, services, AI model pipeline and schema mappings...</p>
        </div>
      ) : architecture ? (
        <div className="space-y-6">
          {/* Architecture Summary Banner */}
          <div className="glass rounded-xl p-5 flex items-start gap-4 shadow-lg">
            <div className="w-9 h-9 rounded bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 flex-shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xs font-mono uppercase font-bold text-white">
                Architecture Topology: <span className="text-sky-300">{selectedProject?.title || 'System'}</span>
              </h2>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed font-sans">{architecture.summary}</p>
            </div>
          </div>

          {/* Interactive Visual Multi-Tier Flowchart */}
          <div className="glass rounded-xl p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-[#2D3748] pb-4">
              <div>
                <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-sky-400" />
                  <span>Visual Multi-Layer Stack Diagram</span>
                </h3>
                <p className="text-[11px] text-slate-400">Click any tier node to inspect technical responsibilities and connection protocols</p>
              </div>
              <span className="pill text-[10px] font-mono">
                TIERS 1 - 6
              </span>
            </div>

            {/* Layer Nodes Stack */}
            <div className="flex flex-col items-center space-y-3 max-w-3xl mx-auto font-mono">
              {/* 1. Frontend Layer */}
              <div
                id="layer-node-frontend"
                onClick={() => setActiveLayer('frontend')}
                className={`w-full p-4 rounded-lg border cursor-pointer transition-all duration-150 flex items-center justify-between gap-4 ${
                  activeLayer === 'frontend'
                    ? 'bg-sky-500/15 border-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.15)]'
                    : 'bg-[#0B0E14] border-[#2D3748] hover:border-slate-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">Tier 1</span>
                      <h4 className="text-xs font-bold text-white">{architecture.frontendLayer.layerName}</h4>
                    </div>
                    <p className="text-[11px] text-slate-400 font-sans">{architecture.frontendLayer.subtitle}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 max-w-[240px] justify-end">
                  {architecture.frontendLayer.technologies.slice(0, 3).map(t => (
                    <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-sky-500/10 text-sky-300 border border-sky-500/20">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Protocol Arrow 1 */}
              <div className="flex items-center gap-2 text-slate-500 text-xs py-0.5">
                <ArrowDown className="w-3.5 h-3.5 text-sky-400 animate-bounce" />
                <span className="text-[10px] bg-[#0B0E14] px-2 py-0.5 rounded border border-[#2D3748] text-slate-400">
                  {architecture.frontendLayer.protocols.join(' • ')}
                </span>
              </div>

              {/* 2. API Gateway Layer */}
              <div
                id="layer-node-api-gateway"
                onClick={() => setActiveLayer('gateway')}
                className={`w-full p-4 rounded-lg border cursor-pointer transition-all duration-150 flex items-center justify-between gap-4 ${
                  activeLayer === 'gateway'
                    ? 'bg-indigo-500/15 border-indigo-400 shadow-[0_0_15px_rgba(129,140,248,0.15)]'
                    : 'bg-[#0B0E14] border-[#2D3748] hover:border-slate-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Tier 2</span>
                      <h4 className="text-xs font-bold text-white">{architecture.apiGatewayLayer.layerName}</h4>
                    </div>
                    <p className="text-[11px] text-slate-400 font-sans">{architecture.apiGatewayLayer.subtitle}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 max-w-[240px] justify-end">
                  {architecture.apiGatewayLayer.technologies.slice(0, 3).map(t => (
                    <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Protocol Arrow 2 */}
              <div className="flex items-center gap-2 text-slate-500 text-xs py-0.5">
                <ArrowDown className="w-3.5 h-3.5 text-indigo-400 animate-bounce" />
                <span className="text-[10px] bg-[#0B0E14] px-2 py-0.5 rounded border border-[#2D3748] text-slate-400">
                  {architecture.apiGatewayLayer.protocols.join(' • ')}
                </span>
              </div>

              {/* 3. Backend Core Service Layer */}
              <div
                id="layer-node-backend"
                onClick={() => setActiveLayer('backend')}
                className={`w-full p-4 rounded-lg border cursor-pointer transition-all duration-150 flex items-center justify-between gap-4 ${
                  activeLayer === 'backend'
                    ? 'bg-purple-500/15 border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.15)]'
                    : 'bg-[#0B0E14] border-[#2D3748] hover:border-slate-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                    <Server className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">Tier 3</span>
                      <h4 className="text-xs font-bold text-white">{architecture.backendLayer.layerName}</h4>
                    </div>
                    <p className="text-[11px] text-slate-400 font-sans">{architecture.backendLayer.subtitle}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 max-w-[240px] justify-end">
                  {architecture.backendLayer.technologies.slice(0, 3).map(t => (
                    <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Forked Arrows to AI & Database */}
              <div className="grid grid-cols-2 w-full gap-4 pt-1">
                {/* 4. AI/ML Engine Layer */}
                <div
                  id="layer-node-ai-ml"
                  onClick={() => setActiveLayer('ai')}
                  className={`p-4 rounded-lg border cursor-pointer transition-all duration-150 space-y-2 ${
                    activeLayer === 'ai'
                      ? 'bg-pink-500/15 border-pink-400 shadow-[0_0_15px_rgba(244,114,182,0.15)]'
                      : 'bg-[#0B0E14] border-[#2D3748] hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400">
                      <Cpu className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-pink-400 uppercase tracking-wider">Tier 4</span>
                      <h4 className="text-xs font-bold text-white">{architecture.aiMlLayer.layerName}</h4>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400 font-sans">{architecture.aiMlLayer.subtitle}</p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {architecture.aiMlLayer.technologies.slice(0, 2).map(t => (
                      <span key={t} className="text-[9px] px-1.5 py-0.5 rounded bg-pink-500/10 text-pink-300 border border-pink-500/20">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 5. Database & Storage Layer */}
                <div
                  id="layer-node-database"
                  onClick={() => setActiveLayer('database')}
                  className={`p-4 rounded-lg border cursor-pointer transition-all duration-150 space-y-2 ${
                    activeLayer === 'database'
                      ? 'bg-emerald-500/15 border-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.15)]'
                      : 'bg-[#0B0E14] border-[#2D3748] hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                      <Database className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider">Tier 5</span>
                      <h4 className="text-xs font-bold text-white">{architecture.databaseLayer.layerName}</h4>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400 font-sans">{architecture.databaseLayer.subtitle}</p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {architecture.databaseLayer.technologies.slice(0, 2).map(t => (
                      <span key={t} className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Protocol Arrow 3 */}
              <div className="flex items-center gap-2 text-slate-500 text-xs py-0.5">
                <ArrowDown className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
                <span className="text-[10px] bg-[#0B0E14] px-2 py-0.5 rounded border border-[#2D3748] text-slate-400">
                  {architecture.externalServicesLayer.protocols.join(' • ')}
                </span>
              </div>

              {/* 6. External Services & IoT Layer */}
              <div
                id="layer-node-external"
                onClick={() => setActiveLayer('external')}
                className={`w-full p-4 rounded-lg border cursor-pointer transition-all duration-150 flex items-center justify-between gap-4 ${
                  activeLayer === 'external'
                    ? 'bg-amber-500/15 border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.15)]'
                    : 'bg-[#0B0E14] border-[#2D3748] hover:border-slate-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Radio className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Tier 6</span>
                      <h4 className="text-xs font-bold text-white">{architecture.externalServicesLayer.layerName}</h4>
                    </div>
                    <p className="text-[11px] text-slate-400 font-sans">{architecture.externalServicesLayer.subtitle}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 max-w-[240px] justify-end">
                  {architecture.externalServicesLayer.technologies.slice(0, 3).map(t => (
                    <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Active Layer Deep Dive Card */}
          {(() => {
            const layerMap: Record<string, any> = {
              frontend: architecture.frontendLayer,
              gateway: architecture.apiGatewayLayer,
              backend: architecture.backendLayer,
              ai: architecture.aiMlLayer,
              database: architecture.databaseLayer,
              external: architecture.externalServicesLayer
            };
            const current = layerMap[activeLayer] || architecture.frontendLayer;

            return (
              <div className="glass rounded-xl p-6 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-[#2D3748] pb-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase text-sky-400">LAYER TELEMETRY INSPECTION</span>
                    <h3 className="text-sm font-bold text-white font-mono">{current.layerName}</h3>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono">
                    {current.protocols.map((p: string) => (
                      <span key={p} className="text-[10px] px-2 py-0.5 rounded bg-[#0B0E14] text-sky-300 border border-sky-500/30">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono">
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Core Responsibilities</h4>
                    <ul className="space-y-1.5">
                      {current.responsibilities.map((r: string, i: number) => (
                        <li key={i} className="text-xs text-slate-300 flex items-start gap-2 bg-[#0B0E14] p-2 rounded border border-[#2D3748] font-sans">
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1.5 flex-shrink-0" />
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Connectivity & Schemas</h4>
                    <p className="text-xs text-slate-300 bg-[#0B0E14] p-3 rounded border border-[#2D3748] leading-relaxed font-sans">
                      {current.details}
                    </p>
                    <div className="text-xs text-slate-400">
                      <strong>Interconnects With:</strong> <span className="text-sky-300 font-semibold">{current.connectionsTo}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Chronological Data Flow Stepper */}
          <div className="glass rounded-xl p-6 space-y-5 shadow-xl">
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Chronological End-to-End Request Pipeline</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 font-mono">
              {architecture.dataFlowSteps.map((step) => {
                const isActive = activeStep === step.stepNumber;
                return (
                  <div
                    key={step.stepNumber}
                    onClick={() => setActiveStep(step.stepNumber)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      isActive
                        ? 'bg-sky-500/20 border-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.2)]'
                        : 'bg-[#0B0E14] border-[#2D3748] hover:border-slate-600'
                    }`}
                  >
                    <span className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded ${
                      isActive ? 'bg-sky-500 text-slate-950' : 'bg-[#151921] text-slate-400'
                    }`}>
                      STEP {step.stepNumber}
                    </span>
                    <h4 className="text-xs font-bold text-white mt-1.5 truncate">{step.title}</h4>
                    <p className="text-[10px] text-slate-400 line-clamp-2 mt-1 font-sans">{step.description}</p>
                  </div>
                );
              })}
            </div>

            {/* Active Step Details */}
            {(() => {
              const activeStepData = architecture.dataFlowSteps.find(s => s.stepNumber === activeStep) || architecture.dataFlowSteps[0];
              return (
                <div className="p-4 rounded-lg bg-[#0B0E14] border border-[#2D3748] space-y-2 font-mono">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-sky-300">
                      Step {activeStepData.stepNumber}: {activeStepData.title}
                    </h4>
                    <span className="text-[10px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                      Payload: {activeStepData.dataPayload}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">{activeStepData.description}</p>
                </div>
              );
            })()}
          </div>

          {/* Security & Threat Hardening Strategy */}
          <div className="glass rounded-xl p-6 space-y-4 shadow-xl">
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Architectural Security & Zero-Trust Isolation Safeguards</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono">
              {architecture.securityStrategy.map((sec, i) => (
                <div key={i} className="bg-[#0B0E14] p-3 rounded-lg border border-[#2D3748] flex items-start gap-2.5 text-xs text-slate-300 font-sans">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>{sec}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="glass rounded-xl p-12 text-center space-y-4 font-mono">
          <Network className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">No Architecture Generated Yet</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto font-sans">
            Select a project from the top dropdown or generate a new project to produce an interactive 6-tier architecture.
          </p>
        </div>
      )}
    </div>
  );
};
