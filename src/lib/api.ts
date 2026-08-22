import {
  ProjectIdea,
  ProjectEvaluation,
  RecommendedFeature,
  ArchitectureData,
  RoadmapData,
  TechStackAdvice,
  DashboardStats
} from '../types';

export class ApiError extends Error {
  constructor(public message: string, public status?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const response = await fetch(endpoint, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  const json = await response.json().catch(() => ({}));

  if (!response.ok || json.success === false) {
    throw new ApiError(json.message || `Request failed with status ${response.status}`, response.status);
  }

  return json.data !== undefined ? json.data : json;
}

export const api = {
  // Check backend health & Gemini key status
  checkHealth: async (): Promise<{ status: string; hasGeminiKey: boolean }> => {
    const res = await fetch('/api/health');
    return res.json();
  },

  // Dashboard stats
  getDashboardStats: (): Promise<DashboardStats> => {
    return request<DashboardStats>('/api/dashboard/stats');
  },

  // Generate 5 ideas
  generateIdeas: (params: {
    domain: string;
    technologies: string[];
    difficulty: string;
    duration: string;
    teamType: string;
    projectType: string;
    customRequirements?: string;
  }): Promise<ProjectIdea[]> => {
    return request<ProjectIdea[]>('/api/projects/generate', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  },

  // Evaluate project
  evaluateProject: (params: {
    title: string;
    domain: string;
    problemStatement: string;
    description: string;
    technologiesRequired?: string[];
    targetUsers?: string[];
    projectId?: string;
  }): Promise<ProjectEvaluation> => {
    return request<ProjectEvaluation>('/api/projects/evaluate', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  },

  // Feature recommendations
  recommendFeatures: (params: {
    title: string;
    domain: string;
    description: string;
    technologiesRequired?: string[];
    projectId?: string;
  }): Promise<RecommendedFeature[]> => {
    return request<RecommendedFeature[]>('/api/projects/recommend-features', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  },

  // System Architecture
  generateArchitecture: (params: {
    title: string;
    domain: string;
    description: string;
    technologiesRequired?: string[];
    projectId?: string;
  }): Promise<ArchitectureData> => {
    return request<ArchitectureData>('/api/projects/architecture', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  },

  // Development Roadmap
  generateRoadmap: (params: {
    title: string;
    domain: string;
    description: string;
    duration?: string;
    projectId?: string;
  }): Promise<RoadmapData> => {
    return request<RoadmapData>('/api/projects/roadmap', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  },

  // Tech stack advice
  recommendTechStack: (params: {
    title: string;
    domain: string;
    description: string;
    constraints?: string;
  }): Promise<TechStackAdvice> => {
    return request<TechStackAdvice>('/api/projects/tech-stack', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  },

  // Compare projects
  compareProjects: (projectIds: string[]): Promise<ProjectIdea[]> => {
    return request<ProjectIdea[]>('/api/projects/compare', {
      method: 'POST',
      body: JSON.stringify({ projectIds }),
    });
  },

  // CRUD Projects
  getProjects: (filters?: { domain?: string; difficulty?: string; search?: string; savedOnly?: boolean }): Promise<ProjectIdea[]> => {
    const query = new URLSearchParams();
    if (filters?.domain) query.set('domain', filters.domain);
    if (filters?.difficulty) query.set('difficulty', filters.difficulty);
    if (filters?.search) query.set('search', filters.search);
    if (filters?.savedOnly) query.set('savedOnly', 'true');

    const url = `/api/projects${query.toString() ? '?' + query.toString() : ''}`;
    return request<ProjectIdea[]>(url);
  },

  getProjectById: (id: string): Promise<ProjectIdea> => {
    return request<ProjectIdea>(`/api/projects/${id}`);
  },

  saveProject: (project: Omit<ProjectIdea, 'id' | 'createdAt'>): Promise<ProjectIdea> => {
    return request<ProjectIdea>('/api/projects', {
      method: 'POST',
      body: JSON.stringify(project),
    });
  },

  updateProject: (id: string, updates: Partial<ProjectIdea>): Promise<ProjectIdea> => {
    return request<ProjectIdea>(`/api/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  deleteProject: (id: string): Promise<void> => {
    return request<void>(`/api/projects/${id}`, {
      method: 'DELETE',
    });
  },
};
