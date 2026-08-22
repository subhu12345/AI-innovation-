import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { IdeaGeneratorView } from './components/IdeaGeneratorView';
import { EvaluatorView } from './components/EvaluatorView';
import { ArchitectureView } from './components/ArchitectureView';
import { RoadmapView } from './components/RoadmapView';
import { TechStackAdvisorView } from './components/TechStackAdvisorView';
import { CompareView } from './components/CompareView';
import { ProjectHistoryView } from './components/ProjectHistoryView';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { ProjectIdea, ActiveTab, DashboardStats, ProjectEvaluation, RoadmapData } from './types';
import { api } from './lib/api';
import { triggerCelebration } from './lib/utils';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [savedProjects, setSavedProjects] = useState<ProjectIdea[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [hasGeminiKey, setHasGeminiKey] = useState(true);

  // Selected project for modal or contextual cross-tab actions
  const [inspectingProject, setInspectingProject] = useState<ProjectIdea | null>(null);
  const [contextProject, setContextProject] = useState<ProjectIdea | null>(null);

  // Toast notification state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Initial data loading
  const loadData = async () => {
    try {
      setStatsLoading(true);
      const [statsData, projectsData, healthData] = await Promise.all([
        api.getDashboardStats().catch(() => null),
        api.getProjects().catch(() => []),
        api.checkHealth().catch(() => ({ status: 'ok', hasGeminiKey: true }))
      ]);

      if (statsData) setStats(statsData);
      if (projectsData) setSavedProjects(projectsData);
      if (healthData) setHasGeminiKey(healthData.hasGeminiKey);
    } catch (err) {
      console.error('Failed to load initial lab telemetry:', err);
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveProject = async (project: ProjectIdea) => {
    try {
      const saved = await api.saveProject(project);
      setSavedProjects(prev => {
        const filtered = prev.filter(p => p.id !== saved.id);
        return [saved, ...filtered];
      });
      // Refresh stats
      api.getDashboardStats().then(s => setStats(s)).catch(() => {});
      showToast(`Saved "${saved.title}" to SQLite Database!`);
      triggerCelebration();
    } catch (err: any) {
      console.error('Error saving project:', err);
      showToast(err.message || 'Failed to save project', 'error');
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      await api.deleteProject(id);
      setSavedProjects(prev => prev.filter(p => p.id !== id));
      api.getDashboardStats().then(s => setStats(s)).catch(() => {});
      showToast('Project removed from database.');
    } catch (err: any) {
      console.error('Error deleting project:', err);
      showToast(err.message || 'Failed to delete project', 'error');
    }
  };

  const handleSaveEvaluation = async (projectId: string, evaluation: ProjectEvaluation) => {
    try {
      await api.updateProject(projectId, {
        evaluation,
        readinessScore: evaluation.overallReadinessScore
      });
      loadData();
      showToast('Evaluation stored to project records.');
    } catch (err) {
      console.error('Failed to update evaluation:', err);
    }
  };

  const handleSaveRoadmap = async (projectId: string, roadmap: RoadmapData) => {
    try {
      await api.updateProject(projectId, { roadmap });
      loadData();
      showToast('Roadmap synced with database.');
    } catch (err) {
      console.error('Failed to update roadmap:', err);
    }
  };

  // Cross-tab direct navigators
  const navigateToArchitecture = (project: ProjectIdea) => {
    setContextProject(project);
    setActiveTab('architecture');
  };

  const navigateToRoadmap = (project: ProjectIdea) => {
    setContextProject(project);
    setActiveTab('roadmap');
  };

  const navigateToEvaluate = (project: ProjectIdea) => {
    setContextProject(project);
    setActiveTab('evaluate');
  };

  const navigateToTechStack = (project: ProjectIdea) => {
    setContextProject(project);
    setActiveTab('tech-stack');
  };

  const savedProjectIds = new Set(savedProjects.map(p => p.id));

  return (
    <div className="min-h-screen grid-pattern text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-slate-950">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border shadow-2xl backdrop-blur-md text-xs font-mono font-medium ${
            toast.type === 'success'
              ? 'bg-[#151921]/95 text-emerald-400 border-emerald-500/40 shadow-emerald-500/10'
              : 'bg-[#151921]/95 text-rose-400 border-rose-500/40 shadow-rose-500/10'
          }`}>
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            )}
            <span>[SYS] {toast.message}</span>
          </div>
        </div>
      )}

      {/* Global Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        savedCount={savedProjects.length}
        hasGeminiKey={hasGeminiKey}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <DashboardView
            stats={stats}
            loading={statsLoading}
            onNavigate={setActiveTab}
            onSelectProject={setInspectingProject}
          />
        )}

        {activeTab === 'generate' && (
          <IdeaGeneratorView
            onSaveProject={handleSaveProject}
            onNavigateToArchitecture={navigateToArchitecture}
            onNavigateToRoadmap={navigateToRoadmap}
            onNavigateToEvaluate={navigateToEvaluate}
            onNavigateToTechStack={navigateToTechStack}
            savedProjectIds={savedProjectIds}
          />
        )}

        {activeTab === 'evaluate' && (
          <EvaluatorView
            initialProject={contextProject}
            savedProjects={savedProjects}
            onSaveEvaluation={handleSaveEvaluation}
            onNavigateToArchitecture={navigateToArchitecture}
            onNavigateToRoadmap={navigateToRoadmap}
          />
        )}

        {activeTab === 'architecture' && (
          <ArchitectureView
            activeProject={contextProject}
            savedProjects={savedProjects}
            onSelectProject={setContextProject}
          />
        )}

        {activeTab === 'roadmap' && (
          <RoadmapView
            activeProject={contextProject}
            savedProjects={savedProjects}
            onSaveRoadmap={handleSaveRoadmap}
          />
        )}

        {activeTab === 'tech-stack' && (
          <TechStackAdvisorView
            activeProject={contextProject}
            savedProjects={savedProjects}
          />
        )}

        {activeTab === 'compare' && (
          <CompareView
            savedProjects={savedProjects}
            onNavigateToArchitecture={navigateToArchitecture}
            onNavigateToRoadmap={navigateToRoadmap}
          />
        )}

        {activeTab === 'history' && (
          <ProjectHistoryView
            projects={savedProjects}
            onSelectProject={setInspectingProject}
            onDeleteProject={handleDeleteProject}
            onNavigateToArchitecture={navigateToArchitecture}
            onNavigateToRoadmap={navigateToRoadmap}
            onNavigateToEvaluate={navigateToEvaluate}
            onNavigateToTechStack={navigateToTechStack}
          />
        )}
      </main>

      {/* Full Project Detail Modal */}
      <ProjectDetailModal
        project={inspectingProject}
        onClose={() => setInspectingProject(null)}
        onNavigateToArchitecture={navigateToArchitecture}
        onNavigateToRoadmap={navigateToRoadmap}
        onNavigateToEvaluate={navigateToEvaluate}
        onNavigateToTechStack={navigateToTechStack}
      />

      {/* Footer */}
      <footer className="border-t border-[#2D3748] bg-[#0B0E14]/90 backdrop-blur-md py-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sky-400"></span>
            <span className="text-slate-300">INNOV-LAB CORE // v2.5</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400 text-[11px]">Gemini 2.5 Flash Engine</span>
          </div>
          <div className="flex items-center gap-3 text-slate-500 text-[11px]">
            <span className="text-slate-400">RESTful Microservices</span>
            <span>•</span>
            <span className="text-slate-400">6-Tier Topology</span>
            <span>•</span>
            <span className="text-slate-400">8-Phase Pipeline</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
