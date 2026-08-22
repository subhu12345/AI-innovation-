import React, { useState } from 'react';
import {
  FolderHeart,
  Search,
  Filter,
  Trash2,
  ExternalLink,
  FileDown,
  Sparkles,
  Network,
  GitFork,
  Gauge,
  Cpu,
  Clock,
  Award,
  Layers,
  LayoutGrid,
  List,
  Terminal,
  Database
} from 'lucide-react';
import { ProjectIdea } from '../types';
import { getDifficultyColor, exportProjectAsMarkdown, exportProjectAsJSON } from '../lib/utils';
import { DOMAINS } from '../data/domains';

interface ProjectHistoryViewProps {
  projects: ProjectIdea[];
  onSelectProject: (project: ProjectIdea) => void;
  onDeleteProject: (projectId: string) => Promise<void>;
  onNavigateToArchitecture: (project: ProjectIdea) => void;
  onNavigateToRoadmap: (project: ProjectIdea) => void;
  onNavigateToEvaluate: (project: ProjectIdea) => void;
  onNavigateToTechStack: (project: ProjectIdea) => void;
}

export const ProjectHistoryView: React.FC<ProjectHistoryViewProps> = ({
  projects,
  onSelectProject,
  onDeleteProject,
  onNavigateToArchitecture,
  onNavigateToRoadmap,
  onNavigateToEvaluate,
  onNavigateToTechStack
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [domainFilter, setDomainFilter] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const filteredProjects = projects.filter(p => {
    const matchesSearch =
      !searchTerm ||
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.technologiesRequired.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesDomain = !domainFilter || p.domain.toLowerCase().includes(domainFilter.toLowerCase());
    const matchesDiff = !difficultyFilter || p.difficultyLevel.toLowerCase() === difficultyFilter.toLowerCase();

    return matchesSearch && matchesDomain && matchesDiff;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#2D3748] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-mono font-semibold mb-2">
            <Database className="w-3.5 h-3.5" />
            <span>SQLITE DATABASE PROJECT REPOSITORY</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Saved Innovation Repositories
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl">
            Review, search, filter, and export all generated architectures, roadmaps, and feasibility audits stored in the database.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded border transition-colors ${
              viewMode === 'grid'
                ? 'bg-sky-500 text-slate-950 border-sky-400 font-bold'
                : 'bg-[#151921] text-slate-400 border-[#2D3748] hover:text-slate-200'
            }`}
            title="Grid View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-2 rounded border transition-colors ${
              viewMode === 'table'
                ? 'bg-sky-500 text-slate-950 border-sky-400 font-bold'
                : 'bg-[#151921] text-slate-400 border-[#2D3748] hover:text-slate-200'
            }`}
            title="Table View"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass p-3.5 rounded-xl flex flex-col md:flex-row items-center gap-3 shadow-lg font-mono">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search projects by title, keywords, or technologies..."
            className="w-full bg-[#0B0E14] border border-[#2D3748] rounded pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
        </div>

        {/* Domain Filter */}
        <select
          value={domainFilter}
          onChange={e => setDomainFilter(e.target.value)}
          className="bg-[#0B0E14] border border-[#2D3748] rounded px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-sky-500 w-full md:w-auto"
        >
          <option value="" className="bg-[#151921]">All Domains</option>
          {DOMAINS.map(d => (
            <option key={d.id} value={d.name} className="bg-[#151921]">
              {d.name}
            </option>
          ))}
        </select>

        {/* Difficulty Filter */}
        <select
          value={difficultyFilter}
          onChange={e => setDifficultyFilter(e.target.value)}
          className="bg-[#0B0E14] border border-[#2D3748] rounded px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-sky-500 w-full md:w-auto"
        >
          <option value="" className="bg-[#151921]">All Difficulties</option>
          <option value="Beginner" className="bg-[#151921]">Beginner</option>
          <option value="Intermediate" className="bg-[#151921]">Intermediate</option>
          <option value="Advanced" className="bg-[#151921]">Advanced</option>
        </select>

        <span className="text-[11px] text-slate-400 whitespace-nowrap">
          {filteredProjects.length} / {projects.length} RECORDS
        </span>
      </div>

      {/* Grid or Table Display */}
      {filteredProjects.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProjects.map(project => {
              const diffStyle = getDifficultyColor(project.difficultyLevel);

              return (
                <div
                  key={project.id}
                  id={`history-card-${project.id}`}
                  className="glass rounded-xl p-5 flex flex-col justify-between space-y-4 transition-all duration-150 hover:border-sky-500/50 shadow-lg group font-mono"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-semibold text-sky-400 bg-sky-500/10 px-2.5 py-0.5 rounded border border-sky-500/20 truncate max-w-[140px]">
                        {project.domain}
                      </span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${diffStyle.bg} ${diffStyle.text} ${diffStyle.border}`}>
                        {project.difficultyLevel}
                      </span>
                    </div>

                    <h3
                      onClick={() => onSelectProject(project)}
                      className="text-sm font-bold text-white group-hover:text-sky-300 transition-colors cursor-pointer line-clamp-2"
                    >
                      {project.title}
                    </h3>

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed font-sans">
                      {project.problemStatement || project.description}
                    </p>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {project.technologiesRequired.slice(0, 4).map(t => (
                        <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-[#0B0E14] text-slate-300 border border-[#2D3748]">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#2D3748] space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>{project.estimatedTime}</span>
                      </div>
                      <div className="flex items-center gap-1 text-pink-400 font-semibold">
                        <Award className="w-3.5 h-3.5" />
                        <span>★ {project.innovationScore}/10</span>
                      </div>
                    </div>

                    {/* Action Toolbar */}
                    <div className="flex items-center justify-between gap-2 pt-1">
                      <button
                        onClick={() => onSelectProject(project)}
                        className="flex-1 py-1.5 rounded bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold transition-all text-center uppercase tracking-wider"
                      >
                        Inspect Spec
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onNavigateToArchitecture(project)}
                          className="p-1.5 rounded bg-[#0B0E14] hover:bg-[#1E2633] text-sky-300 border border-[#2D3748]"
                          title="Architecture"
                        >
                          <Network className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onNavigateToRoadmap(project)}
                          className="p-1.5 rounded bg-[#0B0E14] hover:bg-[#1E2633] text-emerald-300 border border-[#2D3748]"
                          title="Roadmap"
                        >
                          <GitFork className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => exportProjectAsMarkdown(project)}
                          className="p-1.5 rounded bg-[#0B0E14] hover:bg-[#1E2633] text-slate-300 border border-[#2D3748]"
                          title="Export Markdown"
                        >
                          <FileDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteProject(project.id)}
                          className="p-1.5 rounded bg-[#0B0E14] hover:bg-rose-950 text-rose-400 hover:text-rose-300 border border-[#2D3748]"
                          title="Delete Project"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Table View */
          <div className="glass rounded-xl overflow-x-auto shadow-xl">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className="border-b border-[#2D3748] bg-[#0B0E14] text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="p-4">Project Title</th>
                  <th className="p-4">Domain</th>
                  <th className="p-4">Difficulty</th>
                  <th className="p-4">Innovation</th>
                  <th className="p-4">Duration</th>
                  <th className="p-4">Technologies</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2D3748]/60 text-slate-300">
                {filteredProjects.map(p => (
                  <tr key={p.id} className="hover:bg-[#1A202C]/40 transition-colors">
                    <td className="p-4 font-bold text-white cursor-pointer" onClick={() => onSelectProject(p)}>
                      {p.title}
                    </td>
                    <td className="p-4 text-sky-400">{p.domain}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded bg-[#0B0E14] border border-[#2D3748]">
                        {p.difficultyLevel}
                      </span>
                    </td>
                    <td className="p-4 text-pink-400 font-bold">★ {p.innovationScore}/10</td>
                    <td className="p-4 text-slate-400">{p.estimatedTime}</td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {p.technologiesRequired.slice(0, 3).map(t => (
                          <span key={t} className="text-[10px] px-1.5 py-0.2 rounded bg-[#0B0E14] text-slate-400 border border-[#2D3748]">
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onSelectProject(p)}
                          className="px-2.5 py-1 rounded bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold uppercase text-[10px]"
                        >
                          View
                        </button>
                        <button
                          onClick={() => onDeleteProject(p.id)}
                          className="p-1 rounded bg-[#0B0E14] hover:bg-rose-950 text-rose-400 border border-[#2D3748]"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : (
        <div className="glass rounded-xl p-12 text-center space-y-4 font-mono">
          <FolderHeart className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">No Projects Match Your Search</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto font-sans">
            Try adjusting your search keywords or domain filters, or generate new ideas using the Idea Generator.
          </p>
        </div>
      )}
    </div>
  );
};
