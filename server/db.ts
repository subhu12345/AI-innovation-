import fs from 'fs';
import path from 'path';
import { ProjectIdea, DashboardStats } from '../src/types.js';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'projects.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial seed projects to give users an instant rich playground
const INITIAL_PROJECTS: ProjectIdea[] = [
  {
    id: 'proj_seed_1',
    title: 'AgriVision AI: Autonomous Crop Disease & Drone Spraying Optimizer',
    domain: 'Agriculture & IoT',
    difficultyLevel: 'Advanced',
    difficultyScore: 8.5,
    innovationScore: 9.2,
    estimatedTime: '3 Months',
    teamType: 'Team',
    projectType: 'Embedded IoT & Agentic AI',
    problemStatement: 'Early detection of crop blight and automated localized pesticide spraying to reduce chemical runoff by up to 70%.',
    description: 'An integrated edge-AI drone analytics platform that maps multispectral farm imagery, segments pest hotspots using YOLOv11 and SegNet, and computes autonomous micro-dosage flight plans.',
    objectives: [
      'Perform real-time crop disease classification with >94% accuracy',
      'Generate GPS-tagged vegetation index (NDVI) heatmaps',
      'Control micro-sprayers to deliver targeted pesticide doses',
      'Provide farmers with mobile telemetry and weather-risk alerts'
    ],
    targetUsers: ['Precision Farmers', 'Agronomists', 'Drone Fleet Operators', 'Agricultural Co-ops'],
    technologiesRequired: ['Python', 'PyTorch', 'FastAPI', 'React', 'React Native', 'OpenCV', 'MQTT', 'TimescaleDB', 'Docker'],
    hardwareRequirements: ['DJI T40 or custom PX4 Drone', 'Raspberry Pi 5 / Jetson Orin Nano', 'Multispectral NDVI Sensor', 'LoRaWAN Gateway'],
    softwareRequirements: ['Ubuntu 22.04 LTS', 'QGroundControl', 'Node.js v20+', 'PostgreSQL / PostGIS'],
    databaseRequirements: ['PostgreSQL for farm metadata', 'TimescaleDB for sensor metrics', 'MinIO / S3 for orthomosaic imagery'],
    aiMlAlgorithms: ['YOLOv11-Nano (Edge Object Detection)', 'U-Net Semantic Segmentation', 'Deep Q-Learning for Path Planning'],
    developmentModules: [
      {
        name: 'Edge Vision Inference',
        description: 'Image preprocessing, hardware acceleration via TensorRT, real-time bounding box detection.',
        deliverables: ['Trained PyTorch weights', 'ONNX runtime wrapper', 'FPS benchmark report']
      },
      {
        name: 'Telemetry & Teleoperation Gateway',
        description: 'MQTT broker over LoRa/4G for live battery, altitude, and spraying flow rates.',
        deliverables: ['MQTT Broker config', 'MAVLink packet parser', 'Emergency geo-fence daemon']
      },
      {
        name: 'Farm Dashboard & Analytics',
        description: 'Interactive map viewer with NDVI overlays, weather forecast sync, and yield projections.',
        deliverables: ['Mapbox GL web app', 'Yield risk predictor', 'PDF inspection report generator']
      }
    ],
    systemArchitectureExplanation: 'Drones stream sensor and video frames to an on-board Jetson unit for primary inference, which relays coordinates via MQTT to a central FastAPI cloud backend. Frontend clients render Mapbox overlays and live stream flight telemetry.',
    apiSuggestions: [
      { endpoint: '/api/v1/telemetry', method: 'POST', description: 'Stream drone position, battery, and spraying status' },
      { endpoint: '/api/v1/maps/orthomosaic', method: 'POST', description: 'Upload and stitch raw aerial imagery' },
      { endpoint: '/api/v1/inference/predict', method: 'POST', description: 'Run pest classification on captured image part' }
    ],
    scalabilitySuggestions: [
      'Partition spatial tables in PostGIS by geographic farm sectors',
      'Use Celery / Redis queue workers for asynchronous orthomosaic stitching',
      'Deploy inference models onto edge micro-k8s clusters'
    ],
    futureEnhancements: [
      'Soil moisture sensor integration via subterranean mesh nodes',
      'Autonomous battery docking stations',
      'Carbon credit verification ledger on Polygon blockchain'
    ],
    readinessScore: 92,
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    saved: true
  },
  {
    id: 'proj_seed_2',
    title: 'MedVault: Decentralized Electronic Health Records with Zero-Knowledge Audit',
    domain: 'Blockchain & Healthcare',
    difficultyLevel: 'Advanced',
    difficultyScore: 9.0,
    innovationScore: 8.8,
    estimatedTime: '3 Months',
    teamType: 'Team',
    projectType: 'Blockchain dApp & Zero-Knowledge Cryptography',
    problemStatement: 'Patient medical records are fragmented across hospitals, vulnerable to ransomware, and lack fine-grained consent control.',
    description: 'A sovereign patient data custody protocol combining IPFS encrypted storage with Ethereum/Polygon smart contracts and Circom ZK-SNARKs for proving doctor authorization without revealing medical details.',
    objectives: [
      'Grant and revoke temporal doctor access via ERC-721 revocable tokens',
      'Store HIPAA-compliant encrypted patient payloads on decentralized IPFS',
      'Generate Zero-Knowledge proofs for insurance eligibility without exposing diagnoses'
    ],
    targetUsers: ['Hospital Networks', 'Patients', 'Health Insurance Providers', 'Medical Researchers'],
    technologiesRequired: ['Solidity', 'Hardhat', 'Circom / snarkjs', 'Next.js', 'Ethers.js', 'Web3Auth', 'IPFS / Pinata'],
    softwareRequirements: ['Node.js v20', 'MetaMask / WalletConnect', 'Go-IPFS Node'],
    databaseRequirements: ['Decentralized IPFS', 'SQLite / PostgreSQL for local indexer cache'],
    developmentModules: [
      {
        name: 'ZK Consent Engine',
        description: 'Circom circuits verifying credential signatures and role boundaries in under 1.2 seconds.',
        deliverables: ['Compiled ZK circuits', 'Verification smart contract', 'Client-side snarkjs prover']
      },
      {
        name: 'Patient Sovereign Portal',
        description: 'Biometric web wallet interface for approving hospital access requests and emergency overrides.',
        deliverables: ['React UI', 'Web3Auth onboarding', 'Emergency biometric QR card']
      }
    ],
    systemArchitectureExplanation: 'Smart contracts on Polygon act as immutable access policy registries. Medical records are AES-256 encrypted on the client and stored in IPFS. ZK verifiers on-chain authenticate access requests instantaneously.',
    apiSuggestions: [
      { endpoint: '/api/v1/auth/zk-verify', method: 'POST', description: 'Verify cryptographic zero knowledge proof' },
      { endpoint: '/api/v1/records/metadata', method: 'GET', description: 'Fetch patient encrypted IPFS hashes' }
    ],
    scalabilitySuggestions: ['Use Layer-2 Rollups (Arbitrum/Optimism) for gas fee reduction', 'Decentralized indexers using Subgraphs'],
    futureEnhancements: ['Federated ML on encrypted patient cohorts', 'Cross-border international health passport standard'],
    readinessScore: 88,
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    saved: true
  },
  {
    id: 'proj_seed_3',
    title: 'UrbanFlow: Agentic Traffic Signal Orchestrator & Emergency Preemption',
    domain: 'Smart City & AI',
    difficultyLevel: 'Intermediate',
    difficultyScore: 7.2,
    innovationScore: 8.6,
    estimatedTime: '1 Month',
    teamType: 'Individual',
    projectType: 'Agentic AI & Reinforcement Learning',
    problemStatement: 'Fixed-timer traffic lights cause billions in fuel waste and delay emergency response vehicles in congested urban corridors.',
    description: 'A multi-agent reinforcement learning system (using SUMO and PPO) that adjusts green-wave timings in real-time based on computer-vision vehicle counts and preempts green corridors for ambulances.',
    objectives: [
      'Decrease average intersection wait time by 28%',
      'Detect emergency sirens and strobe frequencies for automatic green light corridors',
      'Provide city traffic operators with real-time congestion heatmap'
    ],
    targetUsers: ['City Transport Departments', 'Emergency First Responders', 'Urban Planners'],
    technologiesRequired: ['Python', 'SUMO Simulator', 'Ray RLlib', 'FastAPI', 'React', 'TailwindCSS', 'WebSocket', 'Redis'],
    softwareRequirements: ['Python 3.11', 'SUMO 1.18+', 'Node.js v20+'],
    databaseRequirements: ['Redis for live vehicle state cache', 'PostgreSQL for historic flow stats'],
    aiMlAlgorithms: ['Proximal Policy Optimization (PPO)', 'Graph Neural Networks for Corridor Topology', 'YOLOv10 for Traffic Camera Feeds'],
    developmentModules: [
      {
        name: 'SUMO RL Simulation Engine',
        description: 'Gym environment simulating 16 connected intersections with varying rush hour volume.',
        deliverables: ['Simulation environment', 'Trained PPO agent', 'Benchmark comparison vs Fixed Timers']
      },
      {
        name: 'Dispatch & Monitoring GUI',
        description: 'Live interactive dashboard with signal cycle controls, vehicle counters, and siren alerts.',
        deliverables: ['Real-time WebSocket dashboard', 'Signal override control panel', 'CSV analytics export']
      }
    ],
    systemArchitectureExplanation: 'Traffic cameras feed vehicle densities into a local FastAPI edge server running RL inference. The model issues phase change commands to SUMO/physical controllers while streaming telemetry over WebSockets to city dispatchers.',
    apiSuggestions: [
      { endpoint: '/api/v1/traffic/state', method: 'GET', description: 'Get live intersection queue lengths and signal phases' },
      { endpoint: '/api/v1/emergency/preempt', method: 'POST', description: 'Trigger emergency vehicle green corridor' }
    ],
    scalabilitySuggestions: ['Cluster RL agents hierarchically per urban district', 'Use Redis streams for high throughput sensor ingestion'],
    futureEnhancements: ['V2X (Vehicle-to-Everything) DSRC radio protocol integration', 'Autonomous fleet routing coordination'],
    readinessScore: 85,
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    saved: true
  }
];

class ProjectDatabase {
  private projects: ProjectIdea[] = [];

  constructor() {
    this.load();
  }

  private load() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.projects = JSON.parse(raw);
      } else {
        this.projects = [...INITIAL_PROJECTS];
        this.save();
      }
    } catch (err) {
      console.error('Error loading database, resetting to seed data:', err);
      this.projects = [...INITIAL_PROJECTS];
      this.save();
    }
  }

  private save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.projects, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving database:', err);
    }
  }

  public getAll(filters?: { domain?: string; difficulty?: string; search?: string; savedOnly?: boolean }): ProjectIdea[] {
    let result = [...this.projects];

    if (filters?.domain && filters.domain !== 'All') {
      result = result.filter(p => p.domain.toLowerCase().includes(filters.domain!.toLowerCase()));
    }

    if (filters?.difficulty && filters.difficulty !== 'All') {
      result = result.filter(p => p.difficultyLevel.toLowerCase() === filters.difficulty!.toLowerCase());
    }

    if (filters?.savedOnly) {
      result = result.filter(p => p.saved);
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        p =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.domain.toLowerCase().includes(q) ||
          p.technologiesRequired.some(t => t.toLowerCase().includes(q))
      );
    }

    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getById(id: string): ProjectIdea | undefined {
    return this.projects.find(p => p.id === id);
  }

  public create(project: Omit<ProjectIdea, 'id' | 'createdAt'>): ProjectIdea {
    const newProject: ProjectIdea = {
      ...project,
      id: 'proj_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now(),
      createdAt: new Date().toISOString(),
      saved: project.saved ?? true,
    };
    this.projects.unshift(newProject);
    this.save();
    return newProject;
  }

  public update(id: string, updates: Partial<ProjectIdea>): ProjectIdea | null {
    const idx = this.projects.findIndex(p => p.id === id);
    if (idx === -1) return null;

    this.projects[idx] = {
      ...this.projects[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.save();
    return this.projects[idx];
  }

  public delete(id: string): boolean {
    const initialLen = this.projects.length;
    this.projects = this.projects.filter(p => p.id !== id);
    if (this.projects.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  public getStats(): DashboardStats {
    const totalGenerated = this.projects.length;
    const evaluatedProjects = this.projects.filter(p => p.readinessScore !== undefined || p.evaluation !== undefined);
    const totalEvaluated = evaluatedProjects.length;

    const avgInnovation = totalGenerated > 0
      ? Number((this.projects.reduce((acc, p) => acc + (p.innovationScore || 7.5), 0) / totalGenerated).toFixed(1))
      : 8.0;

    const avgReadiness = totalEvaluated > 0
      ? Math.round(evaluatedProjects.reduce((acc, p) => acc + (p.readinessScore || p.evaluation?.overallReadinessScore || 75), 0) / totalEvaluated)
      : 82;

    // Domain counts
    const domainMap = new Map<string, number>();
    const techMap = new Map<string, number>();

    for (const p of this.projects) {
      domainMap.set(p.domain, (domainMap.get(p.domain) || 0) + 1);
      for (const t of p.technologiesRequired || []) {
        techMap.set(t, (techMap.get(t) || 0) + 1);
      }
    }

    const domainCounts = Array.from(domainMap.entries())
      .map(([domain, count]) => ({ domain, count }))
      .sort((a, b) => b.count - a.count);

    let mostPopularDomain = domainCounts[0]?.domain || 'Artificial Intelligence';

    const techCounts = Array.from(techMap.entries())
      .map(([tech, count]) => ({ tech, count }))
      .sort((a, b) => b.count - a.count);

    let mostSelectedTech = techCounts[0]?.tech || 'Python / PyTorch';

    // Difficulty counts
    const diffMap: Record<string, number> = { Beginner: 0, Intermediate: 0, Advanced: 0 };
    for (const p of this.projects) {
      if (p.difficultyLevel && diffMap[p.difficultyLevel] !== undefined) {
        diffMap[p.difficultyLevel]++;
      } else {
        diffMap['Intermediate']++;
      }
    }
    const difficultyCounts = Object.entries(diffMap).map(([level, count]) => ({ level, count }));

    // Readiness score tiers
    const tiers = { '90-100% (Production Ready)': 0, '75-89% (High Feasibility)': 0, '50-74% (Moderate)': 0, '<50% (Needs R&D)': 0 };
    for (const p of this.projects) {
      const score = p.readinessScore || p.evaluation?.overallReadinessScore || 75;
      if (score >= 90) tiers['90-100% (Production Ready)']++;
      else if (score >= 75) tiers['75-89% (High Feasibility)']++;
      else if (score >= 50) tiers['50-74% (Moderate)']++;
      else tiers['<50% (Needs R&D)']++;
    }
    const readinessTiers = Object.entries(tiers).map(([tier, count]) => ({ tier, count }));

    return {
      totalGenerated,
      totalEvaluated,
      avgInnovationScore: avgInnovation,
      avgReadinessScore: avgReadiness,
      mostPopularDomain,
      mostSelectedTech,
      domainCounts,
      difficultyCounts,
      readinessTiers,
      recentProjects: this.projects.slice(0, 5)
    };
  }
}

export const db = new ProjectDatabase();
