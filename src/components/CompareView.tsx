import React, { useState } from 'react';
import {
  Scale,
  Sparkles,
  CheckCircle2,
  Layers,
  ArrowRight,
  TrendingUp,
  Award,
  Clock,
  Cpu,
  Database,
  Network,
  Terminal
} from 'lucide-react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  Tooltip
} from 'recharts';
import { ProjectIdea } from '../types';
import { getDifficultyColor } from '../lib/utils';

interface CompareViewProps {
  savedProjects: ProjectIdea[];
  onNavigateToArchitecture: (project: ProjectIdea) => void;
  onNavigateToRoadmap: (project: ProjectIdea) => void;
}

const RADAR_COLORS = ['#38BDF8', '#F472B6', '#34D399', '#FBBF24'];

export const CompareView: React.FC<CompareViewProps> = ({
  savedProjects,
  onNavigateToArchitecture,
  onNavigateToRoadmap
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(
    savedProjects.slice(0, 3).map(p => p.id)
  );

  const handleToggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length > 2) {
        setSelectedIds(selectedIds.filter(item => item !== id));
      }
    } else {
      if (selectedIds.length < 4) {
        setSelectedIds([...selectedIds, id]);
      }
    }
  };

  const comparedProjects = savedProjects.filter(p => selectedIds.includes(p.id));

  // Build Radar Data comparing projects
  const metrics = ['Innovation', 'Readiness', 'Complexity', 'Feasibility', 'Scalability'];
  const radarData = metrics.map(metric => {
    const obj: any = { metric };
    comparedProjects.forEach((p, idx) => {
      let val = 80;
      if (metric === 'Innovation') val = p.innovationScore * 10;
      if (metric === 'Readiness') val = p.readinessScore || 75;
      if (metric === 'Complexity') val = p.difficultyScore * 10;
      if (metric === 'Feasibility') val = p.evaluation?.technicalFeasibilityScore || 80;
      if (metric === 'Scalability') val = p.evaluation?.scalabilityScore || 85;
      obj[`proj_${p.id}`] = val;
    });
    return obj;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#2D3748] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-400 text-xs font-mono font-semibold mb-2">
            <Scale className="w-3.5 h-3.5" />
            <span>MULTI-PROJECT BENCHMARK ENGINE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Side-by-Side Project Comparative Matrix
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl">
            Select 2 to 4 projects from your store to evaluate trade-offs in innovation scores, implementation complexity, timelines, and technical stacks.
          </p>
        </div>

        <span className="pill text-xs font-mono">
          COMPARING {comparedProjects.length} / 4 REPOSITORIES
        </span>
      </div>

      {/* Project Selector Pills */}
      <div className="glass p-4 rounded-xl space-y-2 font-mono">
        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Select 2 to 4 Projects to Benchmark:</label>
        <div className="flex flex-wrap gap-2">
          {savedProjects.map(p => {
            const isSelected = selectedIds.includes(p.id);
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => handleToggleSelect(p.id)}
                className={`px-3 py-1.5 rounded border text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-sky-500 text-slate-950 border-sky-400 font-bold shadow-[0_0_12px_rgba(56,189,248,0.25)]'
                    : 'bg-[#0B0E14] text-slate-400 border-[#2D3748] hover:border-slate-600 hover:text-slate-200'
                }`}
              >
                {isSelected ? '✓ ' : '+ '} {p.title}
              </button>
            );
          })}
        </div>
      </div>

      {comparedProjects.length >= 2 ? (
        <div className="space-y-6">
          {/* Radar Comparison Chart */}
          <div className="glass rounded-xl p-6 shadow-2xl space-y-4 font-mono">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Comparative Radar Analysis</h3>
                <p className="text-[11px] text-slate-400">Multi-dimensional capability footprint</p>
              </div>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius={100} data={radarData}>
                  <PolarGrid stroke="#2D3748" />
                  <PolarAngleAxis dataKey="metric" stroke="#94a3b8" fontSize={10} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" fontSize={8} />
                  {comparedProjects.map((p, idx) => (
                    <Radar
                      key={p.id}
                      name={p.title}
                      dataKey={`proj_${p.id}`}
                      stroke={RADAR_COLORS[idx % RADAR_COLORS.length]}
                      fill={RADAR_COLORS[idx % RADAR_COLORS.length]}
                      fillOpacity={0.2}
                    />
                  ))}
                  <Tooltip
                    contentStyle={{ backgroundColor: '#151921', borderColor: '#2D3748', borderRadius: '6px', color: '#E2E8F0', fontSize: '11px', fontFamily: 'monospace' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '10px', color: '#cbd5e1', paddingTop: '10px', fontFamily: 'monospace' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Side-by-Side Comparison Table */}
          <div className="glass rounded-xl overflow-x-auto shadow-2xl">
            <table className="w-full text-left border-collapse font-mono">
              <thead>
                <tr className="border-b border-[#2D3748] bg-[#0B0E14] text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                  <th className="p-4 w-48 sticky left-0 bg-[#0B0E14]">Attribute</th>
                  {comparedProjects.map((p, idx) => (
                    <th key={p.id} className="p-4 min-w-[240px] max-w-[300px]">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: RADAR_COLORS[idx % RADAR_COLORS.length] }}
                        />
                        <span className="text-white font-bold text-xs truncate">{p.title}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-xs text-slate-300 divide-y divide-[#2D3748]/70">
                <tr>
                  <td className="p-4 font-bold text-slate-400 sticky left-0 bg-[#0B0E14]">Domain</td>
                  {comparedProjects.map(p => (
                    <td key={p.id} className="p-4 text-sky-400 font-semibold">{p.domain}</td>
                  ))}
                </tr>

                <tr>
                  <td className="p-4 font-bold text-slate-400 sticky left-0 bg-[#0B0E14]">Difficulty & Score</td>
                  {comparedProjects.map(p => {
                    const diff = getDifficultyColor(p.difficultyLevel);
                    return (
                      <td key={p.id} className="p-4">
                        <span className={`px-2 py-0.5 rounded border text-[10px] font-semibold ${diff.bg} ${diff.text} ${diff.border}`}>
                          {p.difficultyLevel} ({p.difficultyScore}/10)
                        </span>
                      </td>
                    );
                  })}
                </tr>

                <tr>
                  <td className="p-4 font-bold text-slate-400 sticky left-0 bg-[#0B0E14]">Innovation Score</td>
                  {comparedProjects.map(p => (
                    <td key={p.id} className="p-4 text-pink-400 font-bold text-xs">
                      ★ {p.innovationScore} / 10
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-4 font-bold text-slate-400 sticky left-0 bg-[#0B0E14]">Readiness Score</td>
                  {comparedProjects.map(p => (
                    <td key={p.id} className="p-4 text-emerald-400 font-bold text-xs">
                      {p.readinessScore || 80}%
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-4 font-bold text-slate-400 sticky left-0 bg-[#0B0E14]">Estimated Duration</td>
                  {comparedProjects.map(p => (
                    <td key={p.id} className="p-4 text-slate-200">{p.estimatedTime}</td>
                  ))}
                </tr>

                <tr>
                  <td className="p-4 font-bold text-slate-400 sticky left-0 bg-[#0B0E14]">Team Format</td>
                  {comparedProjects.map(p => (
                    <td key={p.id} className="p-4 text-slate-300">{p.teamType}</td>
                  ))}
                </tr>

                <tr>
                  <td className="p-4 font-bold text-slate-400 sticky left-0 bg-[#0B0E14]">Key Technologies</td>
                  {comparedProjects.map(p => (
                    <td key={p.id} className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {p.technologiesRequired.map(t => (
                          <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-sky-500/10 text-sky-300 border border-sky-500/20">
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-4 font-bold text-slate-400 sticky left-0 bg-[#0B0E14]">Database & Persistence</td>
                  {comparedProjects.map(p => (
                    <td key={p.id} className="p-4 text-slate-300">
                      {p.databaseRequirements.join(', ')}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-4 font-bold text-slate-400 sticky left-0 bg-[#0B0E14]">Hardware / IoT</td>
                  {comparedProjects.map(p => (
                    <td key={p.id} className="p-4 text-slate-400">
                      {p.hardwareRequirements?.length ? p.hardwareRequirements.join(', ') : 'None (Pure Software)'}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-4 font-bold text-slate-400 sticky left-0 bg-[#0B0E14]">Actions</td>
                  {comparedProjects.map(p => (
                    <td key={p.id} className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onNavigateToArchitecture(p)}
                          className="px-2.5 py-1 rounded bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 border border-sky-500/30 text-[10px] font-semibold"
                        >
                          Architect
                        </button>
                        <button
                          onClick={() => onNavigateToRoadmap(p)}
                          className="px-2.5 py-1 rounded bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-[10px] font-semibold"
                        >
                          Roadmap
                        </button>
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="glass rounded-xl p-12 text-center space-y-4 font-mono">
          <Scale className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Select At Least 2 Projects</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto font-sans">
            Choose at least 2 saved projects using the selectors above to populate the side-by-side radar and matrix.
          </p>
        </div>
      )}
    </div>
  );
};
