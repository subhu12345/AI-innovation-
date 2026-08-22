export interface ProjectIdea {
  id: string;
  title: string;
  domain: string;
  difficultyLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  difficultyScore: number; // 1-10
  innovationScore: number; // 1-10
  estimatedTime: string;
  teamType: 'Individual' | 'Team';
  projectType: string;
  problemStatement: string;
  description: string;
  objectives: string[];
  targetUsers: string[];
  technologiesRequired: string[];
  hardwareRequirements?: string[];
  softwareRequirements: string[];
  databaseRequirements: string[];
  aiMlAlgorithms?: string[];
  developmentModules: {
    name: string;
    description: string;
    deliverables: string[];
  }[];
  systemArchitectureExplanation: string;
  apiSuggestions: {
    endpoint: string;
    method: string;
    description: string;
  }[];
  scalabilitySuggestions: string[];
  futureEnhancements: string[];
  readinessScore?: number; // 0-100
  evaluation?: ProjectEvaluation;
  architecture?: ArchitectureData;
  roadmap?: RoadmapData;
  recommendedFeatures?: RecommendedFeature[];
  createdAt: string;
  updatedAt?: string;
  saved?: boolean;
}

export interface ProjectEvaluation {
  overallReadinessScore: number; // 0-100
  innovationScore: number; // 0-100
  technicalFeasibilityScore: number; // 0-100
  usefulnessScore: number; // 0-100
  scalabilityScore: number; // 0-100
  complexityScore: number; // 0-100
  estimatedCostTier: string; // e.g. "$10 - $50/mo (Free Tier available)"
  executiveSummary: string;
  strengths: string[];
  technicalFeasibilityDetails: string;
  realWorldImpactDetails: string;
  possibleChallenges: {
    challenge: string;
    mitigation: string;
  }[];
  securityConcerns: {
    threat: string;
    mitigation: string;
  }[];
  missingFeatures: string[];
  nextSteps: string[];
}

export interface RecommendedFeature {
  id: string;
  title: string;
  category: 'AI Integration' | 'IoT / Hardware' | 'Blockchain' | 'Real-time & Streaming' | 'Cloud & DevOps' | 'UX & Voice' | 'Mobile & Cross-Platform';
  description: string;
  impactLevel: 'High' | 'Medium' | 'Critical';
  difficulty: 'Easy' | 'Moderate' | 'Complex';
  technologies: string[];
  implementationTip: string;
}

export interface ArchitectureLayer {
  layerName: string;
  subtitle: string;
  technologies: string[];
  responsibilities: string[];
  connectionsTo: string;
  protocols: string[];
  details: string;
}

export interface ArchitectureData {
  summary: string;
  frontendLayer: ArchitectureLayer;
  backendLayer: ArchitectureLayer;
  apiGatewayLayer: ArchitectureLayer;
  aiMlLayer: ArchitectureLayer;
  databaseLayer: ArchitectureLayer;
  externalServicesLayer: ArchitectureLayer;
  dataFlowSteps: {
    stepNumber: number;
    title: string;
    description: string;
    dataPayload: string;
  }[];
  securityStrategy: string[];
}

export interface RoadmapTask {
  id: string;
  title: string;
  description: string;
  durationDays: number;
  priority: 'High' | 'Medium' | 'Low';
  dependencies: string[];
  completed: boolean;
}

export interface RoadmapPhase {
  phaseNumber: number;
  phaseName: string;
  durationWeeks: string;
  goals: string;
  tasks: RoadmapTask[];
}

export interface RoadmapData {
  totalDurationWeeks: number;
  completionPercentage: number;
  phases: RoadmapPhase[];
}

export interface TechStackRecommendation {
  category: string;
  recommended: string;
  alternatives: string[];
  rationale: string;
  keyLibraries: string[];
  pros: string[];
  consOrConsiderations: string[];
}

export interface TechStackAdvice {
  projectTitle: string;
  summary: string;
  frontend: TechStackRecommendation;
  backend: TechStackRecommendation;
  database: TechStackRecommendation;
  aiMl: TechStackRecommendation;
  cloud: TechStackRecommendation;
  auth: TechStackRecommendation;
  api: TechStackRecommendation;
  deployment: TechStackRecommendation;
}

export interface DashboardStats {
  totalGenerated: number;
  totalEvaluated: number;
  avgInnovationScore: number;
  avgReadinessScore: number;
  mostPopularDomain: string;
  mostSelectedTech: string;
  domainCounts: { domain: string; count: number }[];
  difficultyCounts: { level: string; count: number }[];
  readinessTiers: { tier: string; count: number }[];
  recentProjects: ProjectIdea[];
}

export type ActiveTab =
  | 'dashboard'
  | 'generate'
  | 'evaluate'
  | 'architecture'
  | 'roadmap'
  | 'tech-stack'
  | 'compare'
  | 'history';
