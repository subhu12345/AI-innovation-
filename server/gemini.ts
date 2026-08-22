import { GoogleGenAI, Type } from '@google/genai';
import { ProjectIdea, ProjectEvaluation, RecommendedFeature, ArchitectureData, RoadmapData, TechStackAdvice } from '../src/types.js';

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

/**
 * Generate 5 unique, innovative, high-impact project ideas
 */
export async function generateProjectIdeas(params: {
  domain: string;
  technologies: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  teamType: 'Individual' | 'Team';
  projectType: string;
  customRequirements?: string;
}): Promise<ProjectIdea[]> {
  const ai = getGeminiClient();

  const prompt = `You are an elite Principal Software Architect and AI Innovation Director at a top-tier R&D Lab.
Generate 5 UNIQUE, HIGHLY PRACTICAL, cutting-edge, and innovative project ideas for:
- Domain: ${params.domain}
- User's Known Technologies: ${params.technologies.join(', ') || 'Standard modern stack'}
- Difficulty Level: ${params.difficulty}
- Project Duration: ${params.duration}
- Collaboration: ${params.teamType}
- Preferred Project Type: ${params.projectType}
${params.customRequirements ? `- Specific Requirements / Interests: ${params.customRequirements}` : ''}

CRITICAL RULES:
1. Provide exactly 5 diverse, high-value, realistic project ideas.
2. Ensure realistic complexity suited for ${params.difficulty} difficulty within ${params.duration}.
3. Every idea must solve a genuine real-world problem with modern tech.
4. Output valid JSON adhering exactly to the requested schema.`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          systemInstruction: 'You generate high-caliber, practical software, IoT, and AI project ideas with deep engineering rigor and accurate technical specifications.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                domain: { type: Type.STRING },
                difficultyLevel: { type: Type.STRING },
                difficultyScore: { type: Type.NUMBER, description: '1 to 10 scale' },
                innovationScore: { type: Type.NUMBER, description: '1 to 10 scale' },
                estimatedTime: { type: Type.STRING },
                teamType: { type: Type.STRING },
                projectType: { type: Type.STRING },
                problemStatement: { type: Type.STRING },
                description: { type: Type.STRING },
                objectives: { type: Type.ARRAY, items: { type: Type.STRING } },
                targetUsers: { type: Type.ARRAY, items: { type: Type.STRING } },
                technologiesRequired: { type: Type.ARRAY, items: { type: Type.STRING } },
                hardwareRequirements: { type: Type.ARRAY, items: { type: Type.STRING } },
                softwareRequirements: { type: Type.ARRAY, items: { type: Type.STRING } },
                databaseRequirements: { type: Type.ARRAY, items: { type: Type.STRING } },
                aiMlAlgorithms: { type: Type.ARRAY, items: { type: Type.STRING } },
                developmentModules: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      description: { type: Type.STRING },
                      deliverables: { type: Type.ARRAY, items: { type: Type.STRING } }
                    },
                    required: ['name', 'description', 'deliverables']
                  }
                },
                systemArchitectureExplanation: { type: Type.STRING },
                apiSuggestions: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      endpoint: { type: Type.STRING },
                      method: { type: Type.STRING },
                      description: { type: Type.STRING }
                    },
                    required: ['endpoint', 'method', 'description']
                  }
                },
                scalabilitySuggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
                futureEnhancements: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: [
                'title',
                'problemStatement',
                'description',
                'objectives',
                'targetUsers',
                'technologiesRequired',
                'softwareRequirements',
                'databaseRequirements',
                'developmentModules',
                'systemArchitectureExplanation',
                'apiSuggestions',
                'scalabilitySuggestions',
                'futureEnhancements',
                'difficultyScore',
                'innovationScore'
              ]
            }
          }
        }
      });

      const parsed = JSON.parse(response.text || '[]');
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((p, idx) => ({
          ...p,
          id: 'proj_gen_' + Math.random().toString(36).substring(2, 9) + '_' + (Date.now() + idx),
          domain: params.domain,
          difficultyLevel: params.difficulty,
          estimatedTime: params.duration,
          teamType: params.teamType,
          projectType: params.projectType,
          createdAt: new Date().toISOString(),
          saved: false,
          readinessScore: Math.round(70 + (p.innovationScore || 8) * 2.5)
        }));
      }
    } catch (err) {
      console.warn('Gemini API call failed or timed out, using fallback innovation generator:', err);
    }
  }

  // High quality fallback ideas matching user domain & parameters
  return getFallbackProjects(params);
}

/**
 * Evaluate a project idea with in-depth readiness and risk metrics
 */
export async function evaluateProject(projectData: {
  title: string;
  domain: string;
  problemStatement: string;
  description: string;
  technologiesRequired?: string[];
  targetUsers?: string[];
}): Promise<ProjectEvaluation> {
  const ai = getGeminiClient();

  const prompt = `You are a Senior Venture Capital Technical Partner and Chief Technology Auditor.
Evaluate the following software/AI/IoT project with rigorous objective scoring:
Title: ${projectData.title}
Domain: ${projectData.domain}
Problem: ${projectData.problemStatement}
Description: ${projectData.description}
Technologies: ${(projectData.technologiesRequired || []).join(', ')}
Target Users: ${(projectData.targetUsers || []).join(', ')}

Provide an honest evaluation with scores from 0-100 for:
- Overall Readiness Score (0-100)
- Innovation (0-100)
- Technical Feasibility (0-100)
- Real-world Usefulness (0-100)
- Scalability (0-100)
- Complexity (0-100)
- Estimated Cost Tier
- Executive Summary
- Key Strengths
- Technical Feasibility details
- Real-world Impact details
- Possible Challenges with mitigations
- Security Concerns with mitigations
- Missing / Recommended Features
- Immediate Actionable Next Steps`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              overallReadinessScore: { type: Type.NUMBER },
              innovationScore: { type: Type.NUMBER },
              technicalFeasibilityScore: { type: Type.NUMBER },
              usefulnessScore: { type: Type.NUMBER },
              scalabilityScore: { type: Type.NUMBER },
              complexityScore: { type: Type.NUMBER },
              estimatedCostTier: { type: Type.STRING },
              executiveSummary: { type: Type.STRING },
              strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
              technicalFeasibilityDetails: { type: Type.STRING },
              realWorldImpactDetails: { type: Type.STRING },
              possibleChallenges: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    challenge: { type: Type.STRING },
                    mitigation: { type: Type.STRING }
                  },
                  required: ['challenge', 'mitigation']
                }
              },
              securityConcerns: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    threat: { type: Type.STRING },
                    mitigation: { type: Type.STRING }
                  },
                  required: ['threat', 'mitigation']
                }
              },
              missingFeatures: { type: Type.ARRAY, items: { type: Type.STRING } },
              nextSteps: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: [
              'overallReadinessScore',
              'innovationScore',
              'technicalFeasibilityScore',
              'usefulnessScore',
              'scalabilityScore',
              'complexityScore',
              'estimatedCostTier',
              'executiveSummary',
              'strengths',
              'technicalFeasibilityDetails',
              'realWorldImpactDetails',
              'possibleChallenges',
              'securityConcerns',
              'missingFeatures',
              'nextSteps'
            ]
          }
        }
      });

      return JSON.parse(response.text || '{}') as ProjectEvaluation;
    } catch (err) {
      console.warn('Gemini evaluator failed, using fallback evaluator:', err);
    }
  }

  // Fallback evaluation
  return {
    overallReadinessScore: 84,
    innovationScore: 88,
    technicalFeasibilityScore: 82,
    usefulnessScore: 90,
    scalabilityScore: 78,
    complexityScore: 72,
    estimatedCostTier: '$0 - $40/month (Free Tier + Cloud Run/Vercel)',
    executiveSummary: `The "${projectData.title}" project demonstrates strong market relevance in ${projectData.domain}. With targeted AI integration and modular microservices, it has a viable path to production and high adoption potential.`,
    strengths: [
      'Addresses a well-defined operational bottleneck with tangible ROI',
      'Modern tech stack allows quick prototyping and cloud scaling',
      'Strong potential for data flywheel effects and continuous model improvement'
    ],
    technicalFeasibilityDetails: 'Standard REST/GraphQL APIs and open-source foundation models provide 80%+ of the heavy lifting. The main technical hurdle is pipeline latency and clean data ingestion.',
    realWorldImpactDetails: 'Directly impacts user efficiency, reduces manual error rates by up to 65%, and offers seamless cross-device collaboration.',
    possibleChallenges: [
      { challenge: 'Inference latency under peak concurrent loads', mitigation: 'Employ semantic caching with Redis and asynchronous queue workers.' },
      { challenge: 'Data privacy & regulatory compliance', mitigation: 'Implement client-side encryption and strict token-scoped RBAC policies.' },
      { challenge: 'Model hallucination in critical domain outputs', mitigation: 'Enforce RAG grounding with vector similarity thresholds and schema validation.' }
    ],
    securityConcerns: [
      { threat: 'Prompt Injection / Jailbreaking on LLM endpoints', mitigation: 'Sanitize user inputs and apply guardrail classifiers before passing to model.' },
      { threat: 'Unauthorized API enumeration', mitigation: 'Implement Cloudflare / rate limiting and signed JWT bearer tokens.' }
    ],
    missingFeatures: [
      'Multi-modal input processing (Voice and Document OCR)',
      'Automated CI/CD integration with canary testing',
      'Audit logging and exportable compliance reports'
    ],
    nextSteps: [
      'Draft OpenAPI 3.0 specification for core endpoints',
      'Benchmark embedding models against domain-specific test vectors',
      'Build a minimal viable end-to-end interactive prototype'
    ]
  };
}

/**
 * Recommend cutting-edge advanced features
 */
export async function recommendFeatures(projectData: {
  title: string;
  domain: string;
  description: string;
  technologiesRequired?: string[];
}): Promise<RecommendedFeature[]> {
  const ai = getGeminiClient();

  const prompt = `You are a Lead AI Research Scientist.
Analyze this project:
Title: ${projectData.title}
Domain: ${projectData.domain}
Description: ${projectData.description}
Technologies: ${(projectData.technologiesRequired || []).join(', ')}

Question: "What advanced features can make this project significantly more innovative, differentiated, and market-ready?"
Generate 6 to 8 advanced, game-changing feature suggestions spanning:
- AI integration & Agentic workflows
- Voice & Multimodal UX
- IoT & Hardware telemetry
- Blockchain & Verifiable Credentials
- Real-time streaming & WebSockets
- Predictive Analytics & RAG Knowledge Retrieval
- Mobile & Cloud-Native resiliency`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                category: { type: Type.STRING },
                description: { type: Type.STRING },
                impactLevel: { type: Type.STRING },
                difficulty: { type: Type.STRING },
                technologies: { type: Type.ARRAY, items: { type: Type.STRING } },
                implementationTip: { type: Type.STRING }
              },
              required: ['id', 'title', 'category', 'description', 'impactLevel', 'difficulty', 'technologies', 'implementationTip']
            }
          }
        }
      });

      return JSON.parse(response.text || '[]') as RecommendedFeature[];
    } catch (err) {
      console.warn('Gemini feature recommender failed, using fallback features:', err);
    }
  }

  return [
    {
      id: 'feat_1',
      title: 'Autonomous Multi-Agent Task Orchestrator',
      category: 'AI Integration',
      description: 'Implement autonomous sub-agents that collaborate concurrently to verify inputs, validate outputs, and trigger automated downstream actions.',
      impactLevel: 'Critical',
      difficulty: 'Moderate',
      technologies: ['LangGraph', 'Gemini Function Calling', 'Redis Queue'],
      implementationTip: 'Use structured tool declarations so agents can trigger database updates and external API notifications deterministically.'
    },
    {
      id: 'feat_2',
      title: 'Real-Time Telemetry & WebSocket Push',
      category: 'Real-time & Streaming',
      description: 'Stream live calculations, task progress, and live data telemetry directly to user browsers with sub-50ms latency.',
      impactLevel: 'High',
      difficulty: 'Easy',
      technologies: ['WebSockets', 'Socket.io', 'Server-Sent Events'],
      implementationTip: 'Use SSE for one-way AI streaming tokens and WebSockets for bidirectional collaboration.'
    },
    {
      id: 'feat_3',
      title: 'Multimodal Voice & Audio Command Interface',
      category: 'UX & Voice',
      description: 'Allow hands-free control and contextual voice queries with Gemini Live API audio streaming.',
      impactLevel: 'High',
      difficulty: 'Moderate',
      technologies: ['Web Audio API', 'Gemini Live WebSockets', 'PCM Audio'],
      implementationTip: 'Capture 16kHz PCM audio on client and stream directly over WebSocket for seamless real-time responses.'
    },
    {
      id: 'feat_4',
      title: 'RAG Knowledge Graph with Hybrid Search',
      category: 'AI Integration',
      description: 'Ingest domain documentation and user manuals into a vector store combined with keyword BM25 ranking to eliminate hallucinations.',
      impactLevel: 'Critical',
      difficulty: 'Moderate',
      technologies: ['PgVector', 'ChromaDB', 'Gemini Embeddings'],
      implementationTip: 'Chunk documents by semantic sections (300-500 tokens) with 10% overlap and store metadata filters.'
    },
    {
      id: 'feat_5',
      title: 'Decentralized Audit Trail & Proof-of-Action',
      category: 'Blockchain',
      description: 'Record critical system decisions and tamper-proof user verification logs onto a fast L2 blockchain or decentralized ledger.',
      impactLevel: 'Medium',
      difficulty: 'Moderate',
      technologies: ['Polygon / Base', 'Solidity', 'Ethers.js'],
      implementationTip: 'Batch transaction hashes into a Merkle tree root and write only the root to the blockchain every hour to minimize gas fees.'
    },
    {
      id: 'feat_6',
      title: 'Offline-First Edge PWA with Background Sync',
      category: 'Mobile & Cross-Platform',
      description: 'Ensure full system functionality without an internet connection, queuing state updates for automatic sync upon reconnection.',
      impactLevel: 'High',
      difficulty: 'Easy',
      technologies: ['Service Workers', 'IndexedDB', 'Workbox PWA'],
      implementationTip: 'Use an optimistic UI pattern with local IndexedDB mutations followed by background queue sync.'
    }
  ];
}

/**
 * Generate Structured Visual System Architecture
 */
export async function generateSystemArchitecture(projectData: {
  title: string;
  domain: string;
  description: string;
  technologiesRequired?: string[];
}): Promise<ArchitectureData> {
  const ai = getGeminiClient();

  const prompt = `You are an Enterprise Solutions Architect.
Design the complete end-to-end system architecture for:
Title: ${projectData.title}
Domain: ${projectData.domain}
Description: ${projectData.description}
Technologies: ${(projectData.technologiesRequired || []).join(', ')}

Structure the architecture into:
1. Frontend Layer
2. Backend Layer
3. API Gateway / REST Layer
4. AI/ML Engine Layer
5. Database Layer
6. External Services / IoT Devices Layer
Also include chronological Data Flow Steps (1 to 5) and key Security Strategies.`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.STRING },
              frontendLayer: {
                type: Type.OBJECT,
                properties: {
                  layerName: { type: Type.STRING },
                  subtitle: { type: Type.STRING },
                  technologies: { type: Type.ARRAY, items: { type: Type.STRING } },
                  responsibilities: { type: Type.ARRAY, items: { type: Type.STRING } },
                  connectionsTo: { type: Type.STRING },
                  protocols: { type: Type.ARRAY, items: { type: Type.STRING } },
                  details: { type: Type.STRING }
                },
                required: ['layerName', 'subtitle', 'technologies', 'responsibilities', 'connectionsTo', 'protocols', 'details']
              },
              backendLayer: {
                type: Type.OBJECT,
                properties: {
                  layerName: { type: Type.STRING },
                  subtitle: { type: Type.STRING },
                  technologies: { type: Type.ARRAY, items: { type: Type.STRING } },
                  responsibilities: { type: Type.ARRAY, items: { type: Type.STRING } },
                  connectionsTo: { type: Type.STRING },
                  protocols: { type: Type.ARRAY, items: { type: Type.STRING } },
                  details: { type: Type.STRING }
                },
                required: ['layerName', 'subtitle', 'technologies', 'responsibilities', 'connectionsTo', 'protocols', 'details']
              },
              apiGatewayLayer: {
                type: Type.OBJECT,
                properties: {
                  layerName: { type: Type.STRING },
                  subtitle: { type: Type.STRING },
                  technologies: { type: Type.ARRAY, items: { type: Type.STRING } },
                  responsibilities: { type: Type.ARRAY, items: { type: Type.STRING } },
                  connectionsTo: { type: Type.STRING },
                  protocols: { type: Type.ARRAY, items: { type: Type.STRING } },
                  details: { type: Type.STRING }
                },
                required: ['layerName', 'subtitle', 'technologies', 'responsibilities', 'connectionsTo', 'protocols', 'details']
              },
              aiMlLayer: {
                type: Type.OBJECT,
                properties: {
                  layerName: { type: Type.STRING },
                  subtitle: { type: Type.STRING },
                  technologies: { type: Type.ARRAY, items: { type: Type.STRING } },
                  responsibilities: { type: Type.ARRAY, items: { type: Type.STRING } },
                  connectionsTo: { type: Type.STRING },
                  protocols: { type: Type.ARRAY, items: { type: Type.STRING } },
                  details: { type: Type.STRING }
                },
                required: ['layerName', 'subtitle', 'technologies', 'responsibilities', 'connectionsTo', 'protocols', 'details']
              },
              databaseLayer: {
                type: Type.OBJECT,
                properties: {
                  layerName: { type: Type.STRING },
                  subtitle: { type: Type.STRING },
                  technologies: { type: Type.ARRAY, items: { type: Type.STRING } },
                  responsibilities: { type: Type.ARRAY, items: { type: Type.STRING } },
                  connectionsTo: { type: Type.STRING },
                  protocols: { type: Type.ARRAY, items: { type: Type.STRING } },
                  details: { type: Type.STRING }
                },
                required: ['layerName', 'subtitle', 'technologies', 'responsibilities', 'connectionsTo', 'protocols', 'details']
              },
              externalServicesLayer: {
                type: Type.OBJECT,
                properties: {
                  layerName: { type: Type.STRING },
                  subtitle: { type: Type.STRING },
                  technologies: { type: Type.ARRAY, items: { type: Type.STRING } },
                  responsibilities: { type: Type.ARRAY, items: { type: Type.STRING } },
                  connectionsTo: { type: Type.STRING },
                  protocols: { type: Type.ARRAY, items: { type: Type.STRING } },
                  details: { type: Type.STRING }
                },
                required: ['layerName', 'subtitle', 'technologies', 'responsibilities', 'connectionsTo', 'protocols', 'details']
              },
              dataFlowSteps: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    stepNumber: { type: Type.NUMBER },
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    dataPayload: { type: Type.STRING }
                  },
                  required: ['stepNumber', 'title', 'description', 'dataPayload']
                }
              },
              securityStrategy: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: [
              'summary',
              'frontendLayer',
              'backendLayer',
              'apiGatewayLayer',
              'aiMlLayer',
              'databaseLayer',
              'externalServicesLayer',
              'dataFlowSteps',
              'securityStrategy'
            ]
          }
        }
      });

      return JSON.parse(response.text || '{}') as ArchitectureData;
    } catch (err) {
      console.warn('Gemini architecture generation failed, using fallback:', err);
    }
  }

  return {
    summary: `A resilient, distributed 6-tier cloud architecture designed for high availability, low inference latency, and effortless horizontal scaling.`,
    frontendLayer: {
      layerName: 'Frontend Client Layer',
      subtitle: 'Responsive Web SPA & Mobile Interfaces',
      technologies: ['React 19 / Next.js', 'Tailwind CSS', 'Motion', 'Recharts / Chart.js'],
      responsibilities: ['Client state management', 'Interactive visualizations', 'Optimistic UI rendering', 'User input sanitization'],
      connectionsTo: 'API Gateway Layer',
      protocols: ['HTTPS / HTTP/2', 'WSS (WebSockets)', 'SSE'],
      details: 'Serves responsive browser and mobile clients with sub-second initial load and real-time reactive charting.'
    },
    apiGatewayLayer: {
      layerName: 'API Gateway & Ingress Layer',
      subtitle: 'Traffic Routing, Auth & Rate Limiting',
      technologies: ['Nginx / Cloudflare', 'Express Ingress', 'JWT / OAuth2'],
      responsibilities: ['Reverse proxying', 'SSL Termination', 'DDoS protection', 'CORS & Token validation'],
      connectionsTo: 'Backend Services Layer',
      protocols: ['gRPC', 'REST / JSON', 'TCP 443'],
      details: 'Inspects every incoming request, validates authorization bearer tokens, and routes traffic efficiently.'
    },
    backendLayer: {
      layerName: 'Backend Core Service Layer',
      subtitle: 'Business Logic & Task Orchestrator',
      technologies: ['Node.js / Express', 'Python FastAPI', 'Celery / Redis Workers'],
      responsibilities: ['Business domain validation', 'Asynchronous job queueing', 'Database transaction management', 'AI pipeline coordination'],
      connectionsTo: 'AI/ML Engine & Database Layer',
      protocols: ['REST', 'Redis Pub/Sub', 'PostgreSQL Wire Protocol'],
      details: 'Manages core business rules, transactional database consistency, and coordinates background worker pipelines.'
    },
    aiMlLayer: {
      layerName: 'AI / ML Inference Engine Layer',
      subtitle: 'Foundation Models & Specialized Pipelines',
      technologies: ['Google Gemini API (gemini-3.7-flash)', 'PyTorch / ONNX', 'PgVector / Vector Store'],
      responsibilities: ['Semantic embeddings', 'Prompt orchestration & grounding', 'Model inference & tool calling', 'Content safety filters'],
      connectionsTo: 'Backend Layer & Vector Database',
      protocols: ['HTTPS REST', 'gRPC Stream'],
      details: 'Executes generative intelligence, structured schema extraction, and similarity retrieval in milliseconds.'
    },
    databaseLayer: {
      layerName: 'Database & Storage Persistence Layer',
      subtitle: 'Relational, Vector & Cache Stores',
      technologies: ['PostgreSQL / SQLite', 'Redis In-Memory Cache', 'Cloud Storage / S3'],
      responsibilities: ['ACID transaction storage', 'Session caching', 'Vector embeddings indexing', 'Media asset hosting'],
      connectionsTo: 'Backend Layer',
      protocols: ['TCP / SQL Native', 'Redis Protocol'],
      details: 'Provides reliable ACID compliance, sub-millisecond cache lookups, and persistent file asset hosting.'
    },
    externalServicesLayer: {
      layerName: 'External Services & IoT Device Layer',
      subtitle: 'Third-party APIs & Hardware Telemetry',
      technologies: ['MQTT Brokers', 'Stripe / Payment APIs', 'SendGrid', 'IoT Sensors / Microcontrollers'],
      responsibilities: ['Sensor data telemetry', 'Webhook dispatch', 'Email notifications', 'Third-party integrations'],
      connectionsTo: 'Backend Layer',
      protocols: ['MQTT over TLS', 'Webhooks', 'REST'],
      details: 'Collects physical telemetry or triggers external cloud actions with retry-backed exponential backoff.'
    },
    dataFlowSteps: [
      { stepNumber: 1, title: 'Client Request Ingestion', description: 'User submits request from React frontend with JWT header.', dataPayload: 'JSON Payload with Auth Token' },
      { stepNumber: 2, title: 'API Gateway Inspection', description: 'Nginx / Express validates token signature and rate limits.', dataPayload: 'Sanitized HTTP Request' },
      { stepNumber: 3, title: 'Backend Processing', description: 'Backend loads relevant context from PostgreSQL and queues AI prompt.', dataPayload: 'Augmented Context Object' },
      { stepNumber: 4, title: 'AI Inference Execution', description: 'Gemini 3.7 Flash analyzes context and returns validated JSON.', dataPayload: 'Structured Model Response' },
      { stepNumber: 5, title: 'Persistence & Streaming Delivery', description: 'Result is saved to database and pushed back to client via WebSocket / SSE.', dataPayload: 'Reactive UI State Update' }
    ],
    securityStrategy: [
      'Strict server-side secret management with Zero Key Exposure to client browsers',
      'End-to-end TLS 1.3 encryption for all data in transit',
      'Database encryption at rest with AES-256',
      'Schema-level input validation using Zod / JSON Schema to prevent injection attacks',
      'Role-based access control (RBAC) on all mutating endpoints'
    ]
  };
}

/**
 * Generate 8-Phase Development Roadmap
 */
export async function generateRoadmap(projectData: {
  title: string;
  domain: string;
  description: string;
  duration?: string;
}): Promise<RoadmapData> {
  const ai = getGeminiClient();

  const prompt = `You are a Technical Program Manager.
Create an 8-phase actionable engineering roadmap for:
Title: ${projectData.title}
Domain: ${projectData.domain}
Description: ${projectData.description}
Project Duration Target: ${projectData.duration || '3 Months'}

Must contain exactly these 8 phases:
Phase 1: Requirement Analysis & Scoping
Phase 2: UI/UX Wireframing & Design
Phase 3: Database & Schema Architecture
Phase 4: Backend & Core API Development
Phase 5: AI / ML Integration & Training
Phase 6: Frontend Integration & Visual Dashboards
Phase 7: Testing, QA & Security Hardening
Phase 8: Deployment, Monitoring & Launch

For each phase, provide 3-5 concrete tasks with realistic durationDays, priority (High/Medium/Low), dependencies, and completed: false.`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              totalDurationWeeks: { type: Type.NUMBER },
              completionPercentage: { type: Type.NUMBER },
              phases: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    phaseNumber: { type: Type.NUMBER },
                    phaseName: { type: Type.STRING },
                    durationWeeks: { type: Type.STRING },
                    goals: { type: Type.STRING },
                    tasks: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          id: { type: Type.STRING },
                          title: { type: Type.STRING },
                          description: { type: Type.STRING },
                          durationDays: { type: Type.NUMBER },
                          priority: { type: Type.STRING },
                          dependencies: { type: Type.ARRAY, items: { type: Type.STRING } },
                          completed: { type: Type.BOOLEAN }
                        },
                        required: ['id', 'title', 'description', 'durationDays', 'priority', 'dependencies', 'completed']
                      }
                    }
                  },
                  required: ['phaseNumber', 'phaseName', 'durationWeeks', 'goals', 'tasks']
                }
              }
            },
            required: ['totalDurationWeeks', 'completionPercentage', 'phases']
          }
        }
      });

      return JSON.parse(response.text || '{}') as RoadmapData;
    } catch (err) {
      console.warn('Gemini roadmap generation failed, using fallback:', err);
    }
  }

  // Fallback 8-Phase Roadmap
  return {
    totalDurationWeeks: 12,
    completionPercentage: 0,
    phases: [
      {
        phaseNumber: 1,
        phaseName: 'Phase 1: Requirement Analysis & Scoping',
        durationWeeks: '1-2 Weeks',
        goals: 'Define functional specifications, user personas, success metrics, and threat models.',
        tasks: [
          { id: 'p1_t1', title: 'Stakeholder & User Story Mapping', description: 'Document key user personas and operational workflows.', durationDays: 3, priority: 'High', dependencies: [], completed: false },
          { id: 'p1_t2', title: 'Technical Feasibility & Threat Modeling', description: 'Analyze API latency constraints and security requirements.', durationDays: 4, priority: 'High', dependencies: ['p1_t1'], completed: false },
          { id: 'p1_t3', title: 'Technology Stack Selection & Proof-of-Concept', description: 'Validate core SDK versions and integration feasibility.', durationDays: 3, priority: 'Medium', dependencies: ['p1_2'], completed: false }
        ]
      },
      {
        phaseNumber: 2,
        phaseName: 'Phase 2: UI/UX Wireframing & Design System',
        durationWeeks: '1 Week',
        goals: 'Create interactive component mockups, responsive viewports, and visual design tokens.',
        tasks: [
          { id: 'p2_t1', title: 'Information Architecture & User Flow Diagramming', description: 'Map navigation routes and modal flows.', durationDays: 2, priority: 'Medium', dependencies: ['p1_t1'], completed: false },
          { id: 'p2_t2', title: 'Figma High-Fidelity UI Prototyping', description: 'Design interactive dashboard layouts and chart components.', durationDays: 4, priority: 'High', dependencies: ['p2_t1'], completed: false },
          { id: 'p2_t3', title: 'Design System & Tailwind Theme Tokens', description: 'Configure typography scales, color palettes, and animation curves.', durationDays: 2, priority: 'Medium', dependencies: ['p2_t2'], completed: false }
        ]
      },
      {
        phaseNumber: 3,
        phaseName: 'Phase 3: Database & Schema Architecture',
        durationWeeks: '1 Week',
        goals: 'Design relational tables, vector embedding indexes, and caching strategies.',
        tasks: [
          { id: 'p3_t1', title: 'Entity-Relationship Diagram (ERD) Modeling', description: 'Design primary keys, foreign constraints, and audit columns.', durationDays: 3, priority: 'High', dependencies: ['p1_t1'], completed: false },
          { id: 'p3_t2', title: 'Database Migration Scripts & Seed Data', description: 'Write reproducible DDL migration scripts and sample test datasets.', durationDays: 2, priority: 'High', dependencies: ['p3_t1'], completed: false },
          { id: 'p3_t3', title: 'Redis Cache & Vector Index Setup', description: 'Configure cache TTL policies and HNSW vector index params.', durationDays: 2, priority: 'Medium', dependencies: ['p3_t2'], completed: false }
        ]
      },
      {
        phaseNumber: 4,
        phaseName: 'Phase 4: Backend & Core API Development',
        durationWeeks: '2-3 Weeks',
        goals: 'Implement RESTful endpoints, auth middleware, and business logic handlers.',
        tasks: [
          { id: 'p4_t1', title: 'API Gateway & Ingress Router', description: 'Build structured route handlers with CORS and rate limiters.', durationDays: 4, priority: 'High', dependencies: ['p3_t2'], completed: false },
          { id: 'p4_t2', title: 'Authentication & RBAC Middleware', description: 'Integrate JWT / OAuth token verification and role guards.', durationDays: 3, priority: 'High', dependencies: ['p4_t1'], completed: false },
          { id: 'p4_t3', title: 'Asynchronous Job Queue & Webhooks', description: 'Setup Redis workers for background tasks and external event dispatch.', durationDays: 4, priority: 'Medium', dependencies: ['p4_t1'], completed: false }
        ]
      },
      {
        phaseNumber: 5,
        phaseName: 'Phase 5: AI / ML Integration & Engine Pipeline',
        durationWeeks: '2 Weeks',
        goals: 'Connect Gemini 3.7 Flash API, construct system prompts, and configure vector search.',
        tasks: [
          { id: 'p5_t1', title: 'Gemini SDK Integration & Prompt Engineering', description: 'Develop structured response schema parsers and telemetry headers.', durationDays: 4, priority: 'High', dependencies: ['p4_t1'], completed: false },
          { id: 'p5_t2', title: 'RAG Knowledge Ingestion & Vector Retrieval', description: 'Build document chunking, embedding generation, and similarity filters.', durationDays: 4, priority: 'High', dependencies: ['p3_t3', 'p5_t1'], completed: false },
          { id: 'p5_t3', title: 'Output Guardrails & Semantic Caching', description: 'Implement hallucination verification and Redis prompt cache.', durationDays: 3, priority: 'Medium', dependencies: ['p5_t2'], completed: false }
        ]
      },
      {
        phaseNumber: 6,
        phaseName: 'Phase 6: Frontend Integration & Visual Dashboards',
        durationWeeks: '2 Weeks',
        goals: 'Connect React components to backend APIs, render live charts, and optimize UX.',
        tasks: [
          { id: 'p6_t1', title: 'API Client & State Management Hooks', description: 'Implement optimistic caching and query invalidation.', durationDays: 4, priority: 'High', dependencies: ['p4_t1', 'p2_t3'], completed: false },
          { id: 'p6_t2', title: 'Interactive Chart & Graph Visualizations', description: 'Integrate Recharts / Chart.js for real-time analytics.', durationDays: 4, priority: 'High', dependencies: ['p6_t1'], completed: false },
          { id: 'p6_t3', title: 'Responsive Polish & Accessibility Testing', description: 'Verify mobile viewport breakpoints and WCAG AA contrast.', durationDays: 3, priority: 'Medium', dependencies: ['p6_t2'], completed: false }
        ]
      },
      {
        phaseNumber: 7,
        phaseName: 'Phase 7: Testing, QA & Security Hardening',
        durationWeeks: '1-2 Weeks',
        goals: 'Perform end-to-end automated testing, load benchmarks, and penetration audits.',
        tasks: [
          { id: 'p7_t1', title: 'Automated Unit & Integration Test Suite', description: 'Write Jest / Vitest test cases covering 85%+ backend logic.', durationDays: 4, priority: 'High', dependencies: ['p5_t1', 'p6_t1'], completed: false },
          { id: 'p7_t2', title: 'Load & Concurrency Benchmarking', description: 'Simulate concurrent user spikes with k6 and optimize bottleneck queries.', durationDays: 3, priority: 'Medium', dependencies: ['p7_t1'], completed: false },
          { id: 'p7_t3', title: 'Security Audit & Dependency Vulnerability Scan', description: 'Execute SAST scans and verify zero leaked credentials.', durationDays: 3, priority: 'High', dependencies: ['p7_t1'], completed: false }
        ]
      },
      {
        phaseNumber: 8,
        phaseName: 'Phase 8: Deployment, Monitoring & Launch',
        durationWeeks: '1 Week',
        goals: 'Deploy to Cloud Run / Kubernetes, setup Prometheus monitoring, and launch.',
        tasks: [
          { id: 'p8_t1', title: 'Docker Containerization & CI/CD Pipeline', description: 'Build multi-stage Dockerfile and GitHub Actions deploy workflows.', durationDays: 2, priority: 'High', dependencies: ['p7_t1'], completed: false },
          { id: 'p8_t2', title: 'Cloud Infrastructure Provisioning', description: 'Configure domain DNS, SSL certificates, and auto-scaling rules.', durationDays: 2, priority: 'High', dependencies: ['p8_t1'], completed: false },
          { id: 'p8_t3', title: 'Telemetry, Sentry Error Tracking & Launch', description: 'Set up alerting webhooks, uptime checks, and public release.', durationDays: 2, priority: 'High', dependencies: ['p8_t2'], completed: false }
        ]
      }
    ]
  };
}

/**
 * AI Tech Stack Advisor
 */
export async function recommendTechStack(projectData: {
  title: string;
  domain: string;
  description: string;
  constraints?: string;
}): Promise<TechStackAdvice> {
  const ai = getGeminiClient();

  const prompt = `You are a Principal Software Architect.
Provide the definitive technical stack recommendations with deep technical rationale, pros/cons, key libraries, and alternatives for:
Project Title: ${projectData.title}
Domain: ${projectData.domain}
Description: ${projectData.description}
Constraints / Preferences: ${projectData.constraints || 'Modern, performant, scalable, cost-effective'}

Categories required:
1. Frontend Framework
2. Backend Framework
3. Database System
4. AI / ML Stack
5. Cloud Platform
6. Authentication System
7. API Architecture
8. Deployment & CI/CD Platform`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              projectTitle: { type: Type.STRING },
              summary: { type: Type.STRING },
              frontend: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING },
                  recommended: { type: Type.STRING },
                  alternatives: { type: Type.ARRAY, items: { type: Type.STRING } },
                  rationale: { type: Type.STRING },
                  keyLibraries: { type: Type.ARRAY, items: { type: Type.STRING } },
                  pros: { type: Type.ARRAY, items: { type: Type.STRING } },
                  consOrConsiderations: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ['category', 'recommended', 'alternatives', 'rationale', 'keyLibraries', 'pros', 'consOrConsiderations']
              },
              backend: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING },
                  recommended: { type: Type.STRING },
                  alternatives: { type: Type.ARRAY, items: { type: Type.STRING } },
                  rationale: { type: Type.STRING },
                  keyLibraries: { type: Type.ARRAY, items: { type: Type.STRING } },
                  pros: { type: Type.ARRAY, items: { type: Type.STRING } },
                  consOrConsiderations: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ['category', 'recommended', 'alternatives', 'rationale', 'keyLibraries', 'pros', 'consOrConsiderations']
              },
              database: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING },
                  recommended: { type: Type.STRING },
                  alternatives: { type: Type.ARRAY, items: { type: Type.STRING } },
                  rationale: { type: Type.STRING },
                  keyLibraries: { type: Type.ARRAY, items: { type: Type.STRING } },
                  pros: { type: Type.ARRAY, items: { type: Type.STRING } },
                  consOrConsiderations: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ['category', 'recommended', 'alternatives', 'rationale', 'keyLibraries', 'pros', 'consOrConsiderations']
              },
              aiMl: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING },
                  recommended: { type: Type.STRING },
                  alternatives: { type: Type.ARRAY, items: { type: Type.STRING } },
                  rationale: { type: Type.STRING },
                  keyLibraries: { type: Type.ARRAY, items: { type: Type.STRING } },
                  pros: { type: Type.ARRAY, items: { type: Type.STRING } },
                  consOrConsiderations: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ['category', 'recommended', 'alternatives', 'rationale', 'keyLibraries', 'pros', 'consOrConsiderations']
              },
              cloud: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING },
                  recommended: { type: Type.STRING },
                  alternatives: { type: Type.ARRAY, items: { type: Type.STRING } },
                  rationale: { type: Type.STRING },
                  keyLibraries: { type: Type.ARRAY, items: { type: Type.STRING } },
                  pros: { type: Type.ARRAY, items: { type: Type.STRING } },
                  consOrConsiderations: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ['category', 'recommended', 'alternatives', 'rationale', 'keyLibraries', 'pros', 'consOrConsiderations']
              },
              auth: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING },
                  recommended: { type: Type.STRING },
                  alternatives: { type: Type.ARRAY, items: { type: Type.STRING } },
                  rationale: { type: Type.STRING },
                  keyLibraries: { type: Type.ARRAY, items: { type: Type.STRING } },
                  pros: { type: Type.ARRAY, items: { type: Type.STRING } },
                  consOrConsiderations: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ['category', 'recommended', 'alternatives', 'rationale', 'keyLibraries', 'pros', 'consOrConsiderations']
              },
              api: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING },
                  recommended: { type: Type.STRING },
                  alternatives: { type: Type.ARRAY, items: { type: Type.STRING } },
                  rationale: { type: Type.STRING },
                  keyLibraries: { type: Type.ARRAY, items: { type: Type.STRING } },
                  pros: { type: Type.ARRAY, items: { type: Type.STRING } },
                  consOrConsiderations: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ['category', 'recommended', 'alternatives', 'rationale', 'keyLibraries', 'pros', 'consOrConsiderations']
              },
              deployment: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING },
                  recommended: { type: Type.STRING },
                  alternatives: { type: Type.ARRAY, items: { type: Type.STRING } },
                  rationale: { type: Type.STRING },
                  keyLibraries: { type: Type.ARRAY, items: { type: Type.STRING } },
                  pros: { type: Type.ARRAY, items: { type: Type.STRING } },
                  consOrConsiderations: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ['category', 'recommended', 'alternatives', 'rationale', 'keyLibraries', 'pros', 'consOrConsiderations']
              }
            },
            required: ['projectTitle', 'summary', 'frontend', 'backend', 'database', 'aiMl', 'cloud', 'auth', 'api', 'deployment']
          }
        }
      });

      return JSON.parse(response.text || '{}') as TechStackAdvice;
    } catch (err) {
      console.warn('Gemini tech stack advisor failed, using fallback:', err);
    }
  }

  return {
    projectTitle: projectData.title,
    summary: `A high-performance modern tech stack tailored for ${projectData.domain}, balancing rapid developer velocity, low maintenance overhead, and effortless horizontal scalability.`,
    frontend: {
      category: 'Frontend Framework',
      recommended: 'React 19 + TypeScript + Vite + Tailwind CSS',
      alternatives: ['Next.js App Router', 'Vue 3 / Nuxt', 'SvelteKit'],
      rationale: 'React 19 with Vite provides instant HMR, superior ecosystem adoption, unmatched charting library support (Recharts, Chart.js), and zero vendor lock-in.',
      keyLibraries: ['motion', 'lucide-react', 'recharts', 'chart.js', 'clsx', 'tailwind-merge'],
      pros: ['Enormous ecosystem and community support', 'Excellent rendering performance', 'TypeScript strict type safety'],
      consOrConsiderations: ['Requires client-side state management for large scale nested trees']
    },
    backend: {
      category: 'Backend Framework',
      recommended: 'Node.js / Express with TypeScript or Python FastAPI',
      alternatives: ['Go (Gin/Fiber)', 'NestJS', 'Rust (Actix-web)'],
      rationale: 'Node.js/Express matches full-stack TypeScript parity with instant async I/O. FastAPI is ideal if heavy numerical/PyTorch tasks run in-process.',
      keyLibraries: ['express', 'cors', 'zod', 'dotenv', 'esbuild'],
      pros: ['Unified TypeScript language across stack', 'Vast npm package registry', 'Extremely fast I/O throughput'],
      consOrConsiderations: ['CPU-bound tasks should be delegated to background workers']
    },
    database: {
      category: 'Database & Storage',
      recommended: 'PostgreSQL with pgvector + Redis Cache (or SQLite for local dev)',
      alternatives: ['MongoDB Atlas', 'Supabase', 'CockroachDB'],
      rationale: 'PostgreSQL provides rock-solid ACID transactions alongside vector similarity search via pgvector, eliminating the need for a separate vector database.',
      keyLibraries: ['pg', 'drizzle-orm / prisma', 'ioredis'],
      pros: ['Battle-tested reliability', 'Native vector embeddings support', 'Rich JSONB document indexing'],
      consOrConsiderations: ['Requires managed backups and connection pooling (PgBouncer) under high loads']
    },
    aiMl: {
      category: 'AI / ML Engine',
      recommended: 'Google Gemini 3.7 Flash SDK (@google/genai)',
      alternatives: ['OpenAI GPT-4o', 'Anthropic Claude 3.5 Sonnet', 'Local Ollama / Llama 3'],
      rationale: 'Gemini 3.7 Flash provides lightning-fast reasoning, large context window (1M+ tokens), multimodal audio/vision understanding, and strict JSON Schema enforcement at lowest cost per token.',
      keyLibraries: ['@google/genai', 'langchain (optional)'],
      pros: ['Sub-second latency on structured tasks', 'Built-in multimodal capabilities', 'State of the art reasoning score'],
      consOrConsiderations: ['Requires server-side secret API key management']
    },
    cloud: {
      category: 'Cloud Platform',
      recommended: 'Google Cloud Platform (Cloud Run + Cloud SQL)',
      alternatives: ['AWS (ECS Fargate + RDS)', 'Vercel + Supabase', 'DigitalOcean App Platform'],
      rationale: 'Cloud Run provides automatic scale-to-zero serverless container hosting, generous free tier, seamless VPC peering to Cloud SQL, and automatic SSL.',
      keyLibraries: ['@google-cloud/storage', 'Cloud Run buildpacks'],
      pros: ['Scale to zero cost savings', 'Instant container cold-starts', 'Enterprise DDoS and IAM security'],
      consOrConsiderations: ['Stateless containers require external storage buckets for user uploads']
    },
    auth: {
      category: 'Authentication System',
      recommended: 'JWT with Refresh Tokens + OAuth 2.0 (Google / GitHub)',
      alternatives: ['Firebase Auth', 'Clerk', 'Auth0 / Okta'],
      rationale: 'Standard stateless JWTs signed with RS256/HS256 provide secure authentication without requiring constant database lookups on every request.',
      keyLibraries: ['jsonwebtoken', 'bcryptjs', 'google-auth-library'],
      pros: ['Zero third-party vendor monthly fees', 'Decentralized token validation', 'Seamless mobile & web interoperability'],
      consOrConsiderations: ['Token revocation requires a fast Redis blacklist']
    },
    api: {
      category: 'API Architecture',
      recommended: 'RESTful API with OpenAPI 3.0 Specification + WebSockets for Live Updates',
      alternatives: ['GraphQL (Apollo)', 'tRPC', 'gRPC-Web'],
      rationale: 'REST is universally accessible, easy to cache with HTTP headers, and straightforward to debug. WebSockets provide low-overhead push events.',
      keyLibraries: ['express-validator', 'ws', 'swagger-ui-express'],
      pros: ['Universal client compatibility', 'Standard HTTP status codes and caching', 'Low cognitive overhead'],
      consOrConsiderations: ['Potential over-fetching on deeply nested relationship queries']
    },
    deployment: {
      category: 'Deployment & CI/CD',
      recommended: 'Docker Multi-stage Builds + GitHub Actions + Cloud Run',
      alternatives: ['GitLab CI', 'Docker Swarm', 'Railway'],
      rationale: 'Multi-stage Docker builds produce lightweight production containers (<150MB) that boot in under 2 seconds on Cloud Run with zero downtime rolling deploys.',
      keyLibraries: ['Docker', 'GitHub Actions', 'esbuild'],
      pros: ['100% reproducible builds', 'Instant rollbacks', 'Automated lint & test validation prior to merge'],
      consOrConsiderations: ['Requires setting up repository secrets and container registry permissions']
    }
  };
}

/**
 * Fallback generator for realistic project ideas
 */
function getFallbackProjects(params: {
  domain: string;
  technologies: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  teamType: 'Individual' | 'Team';
  projectType: string;
}): ProjectIdea[] {
  const domain = params.domain || 'Artificial Intelligence';
  const diff = params.difficulty || 'Intermediate';
  const dur = params.duration || '1 Month';
  const team = params.teamType || 'Individual';
  const type = params.projectType || 'Full-Stack Web App & AI';

  return [
    {
      id: 'proj_fall_' + Math.random().toString(36).substring(2, 9) + '_1',
      title: `${domain} Intelligent Synthesis & Analytics Engine`,
      domain,
      difficultyLevel: diff,
      difficultyScore: diff === 'Beginner' ? 4.5 : diff === 'Intermediate' ? 7.2 : 9.0,
      innovationScore: 8.8,
      estimatedTime: dur,
      teamType: team,
      projectType: type,
      problemStatement: `Organizations in ${domain} struggle with information overload, siloed telemetry, and slow manual decision cycles.`,
      description: `An end-to-end intelligent platform that ingests unstructured domain data, generates predictive health vectors, and automates multi-step workflows.`,
      objectives: [
        'Automate ingestion and categorization of heterogeneous data streams',
        'Provide sub-100ms vector search across historical domain knowledge',
        'Deliver actionable automated recommendations via interactive dashboards'
      ],
      targetUsers: ['Domain Practitioners', 'Engineering Leads', 'System Administrators'],
      technologiesRequired: ['TypeScript', 'Python', 'React', 'FastAPI', 'Gemini 3.7 Flash', 'PostgreSQL', 'TailwindCSS'],
      softwareRequirements: ['Node.js v20+', 'Python 3.11', 'Docker'],
      databaseRequirements: ['PostgreSQL with pgvector', 'Redis Cache'],
      aiMlAlgorithms: ['Gemini 3.7 Flash Structured Extraction', 'HNSW Vector Indexing', 'Anomaly Detection Isolation Forest'],
      developmentModules: [
        { name: 'Core Ingestion Pipeline', description: 'Parses streaming inputs and extracts structured entity fields.', deliverables: ['Ingestion worker', 'Field parser'] },
        { name: 'Predictive Reasoning Core', description: 'Computes trend projections and detects anomalies.', deliverables: ['Inference handler', 'Benchmark metrics'] },
        { name: 'Interactive Executive Studio', description: 'Visualizes live telemetry and operational alerts.', deliverables: ['React Dashboard', 'Exportable PDF reporter'] }
      ],
      systemArchitectureExplanation: 'Clients communicate via REST & WebSockets with a modular API server that coordinates asynchronous Gemini AI reasoning and PostgreSQL persistence.',
      apiSuggestions: [
        { endpoint: '/api/v1/telemetry/ingest', method: 'POST', description: 'Ingest raw event payload' },
        { endpoint: '/api/v1/analytics/predict', method: 'POST', description: 'Run predictive model analysis' },
        { endpoint: '/api/v1/reports/export', method: 'GET', description: 'Download generated report' }
      ],
      scalabilitySuggestions: ['Use horizontal container autoscaling', 'Partition time-series records by month'],
      futureEnhancements: ['Voice command navigation', 'Decentralized audit logging on Polygon blockchain'],
      readinessScore: 86,
      createdAt: new Date().toISOString(),
      saved: false
    },
    {
      id: 'proj_fall_' + Math.random().toString(36).substring(2, 9) + '_2',
      title: `Decentralized ${domain} Verification & Compliance Ledger`,
      domain,
      difficultyLevel: diff,
      difficultyScore: diff === 'Beginner' ? 5.0 : diff === 'Intermediate' ? 7.8 : 9.2,
      innovationScore: 9.1,
      estimatedTime: dur,
      teamType: team,
      projectType: type,
      problemStatement: `Lack of tamper-proof audit trails and verifiable integrity checks creates fraud risks and compliance delays in ${domain}.`,
      description: `A cryptographic zero-knowledge verification framework pairing smart contracts with automated AI compliance auditors.`,
      objectives: [
        'Create tamper-evident cryptographic proofs of state transitions',
        'Automate compliance auditing against industry standards with AI',
        'Provide single-click verification portal for external regulators'
      ],
      targetUsers: ['Compliance Officers', 'Auditors', 'Enterprise Security Teams'],
      technologiesRequired: ['Solidity / Smart Contracts', 'TypeScript', 'Next.js', 'Ethers.js', 'PostgreSQL', 'IPFS'],
      softwareRequirements: ['Hardhat', 'Node.js v20+', 'MetaMask'],
      databaseRequirements: ['Decentralized IPFS storage', 'PostgreSQL for metadata indexer'],
      aiMlAlgorithms: ['Gemini Regulatory Rule Matcher', 'TF-IDF Semantic Clause Search'],
      developmentModules: [
        { name: 'Smart Contract Layer', description: 'Immutable registry recording state merkle roots.', deliverables: ['Solidity contracts', 'Test coverage suite'] },
        { name: 'AI Compliance Checker', description: 'Scans transaction payloads against regulatory guidelines.', deliverables: ['Audit daemon', 'Rule engine'] },
        { name: 'Auditor Verification Portal', description: 'Web UI for inspecting cryptographic proofs.', deliverables: ['React explorer UI', 'Merkle proof generator'] }
      ],
      systemArchitectureExplanation: 'Web3 frontend connects to smart contracts on Ethereum L2, with an off-chain Node.js indexer and AI auditing pipeline.',
      apiSuggestions: [
        { endpoint: '/api/v1/audit/verify', method: 'POST', description: 'Verify cryptographic Merkle root' },
        { endpoint: '/api/v1/compliance/check', method: 'POST', description: 'Evaluate transaction compliance with AI' }
      ],
      scalabilitySuggestions: ['Utilize Zero-Knowledge Rollups for 1000x gas savings', 'Implement distributed IPFS pinning clusters'],
      futureEnhancements: ['Cross-chain bridge verification', 'Automated regulatory filing submission'],
      readinessScore: 89,
      createdAt: new Date().toISOString(),
      saved: false
    },
    {
      id: 'proj_fall_' + Math.random().toString(36).substring(2, 9) + '_3',
      title: `Edge-Adaptive IoT Micro-Node & Fault Forecaster`,
      domain,
      difficultyLevel: diff,
      difficultyScore: diff === 'Beginner' ? 4.8 : diff === 'Intermediate' ? 7.4 : 8.9,
      innovationScore: 8.7,
      estimatedTime: dur,
      teamType: team,
      projectType: type,
      problemStatement: `Unplanned hardware downtime in ${domain} leads to catastrophic financial losses and safety hazards.`,
      description: `An edge-intelligent telemetry collector running lightweight TinyML models on microcontrollers to forecast hardware failure 48 hours in advance.`,
      objectives: [
        'Sample vibration, thermal, and current metrics at 100Hz',
        'Execute on-device TinyML anomaly inference under 10mW power',
        'Alert maintenance technicians with exact root-cause diagnostics'
      ],
      targetUsers: ['Maintenance Engineers', 'Plant Operators', 'Hardware Developers'],
      technologiesRequired: ['C++ / Embedded C', 'Python', 'MQTT', 'React', 'TimescaleDB', 'FastAPI', 'TensorFlow Lite for Microcontrollers'],
      hardwareRequirements: ['ESP32-S3 or Raspberry Pi Pico 2', 'MPU-6050 Accelerometer', 'DS18B20 Temp Sensor'],
      softwareRequirements: ['PlatformIO', 'Python 3.11', 'Node.js v20+'],
      databaseRequirements: ['TimescaleDB for high-velocity sensor metrics', 'SQLite for edge local cache'],
      aiMlAlgorithms: ['Autoencoder Anomaly Detector (TFLite Micro)', 'LSTM Temporal Failure Forecaster'],
      developmentModules: [
        { name: 'Firmware & Sensor Sampling', description: 'High-frequency interrupt-driven sensor reads and I2C communication.', deliverables: ['C++ firmware', 'FreeRTOS task scheduler'] },
        { name: 'MQTT Edge Gateway', description: 'Secure TLS broker aggregating multi-sensor packets.', deliverables: ['EMQX broker config', 'Packet deserializer'] },
        { name: 'Predictive Health Console', description: 'Live gauge telemetry, failure probability indicators, and push notifications.', deliverables: ['React Dashboard', 'Webhook notifier'] }
      ],
      systemArchitectureExplanation: 'Microcontrollers publish telemetry over MQTT to a cloud gateway. When anomalous vibration thresholds are breached, the ML pipeline triggers SMS/Slack dispatch.',
      apiSuggestions: [
        { endpoint: '/api/v1/sensors/telemetry', method: 'POST', description: 'Ingest raw sensor burst data' },
        { endpoint: '/api/v1/devices/health', method: 'GET', description: 'Fetch equipment health indices' }
      ],
      scalabilitySuggestions: ['Deploy MQTT cluster with Kafka backend for millions of concurrent devices', 'Compress historic telemetry with Gorilla compression'],
      futureEnhancements: ['Solar energy harvesting self-power module', 'AR glasses overlay for technician field repair'],
      readinessScore: 88,
      createdAt: new Date().toISOString(),
      saved: false
    },
    {
      id: 'proj_fall_' + Math.random().toString(36).substring(2, 9) + '_4',
      title: `Agentic Knowledge Hub & Automated Co-Pilot for ${domain}`,
      domain,
      difficultyLevel: diff,
      difficultyScore: diff === 'Beginner' ? 4.0 : diff === 'Intermediate' ? 6.8 : 8.5,
      innovationScore: 9.0,
      estimatedTime: dur,
      teamType: team,
      projectType: type,
      problemStatement: `Knowledge workers in ${domain} spend over 30% of their workday searching through documentation and manually drafting repetitive reports.`,
      description: `A collaborative AI agent workspace equipped with multimodal document understanding, tool calling, and automated synthesis.`,
      objectives: [
        'Index internal PDFs, codebase repos, and databases into a unified vector space',
        'Enable natural language query-to-action agent workflows',
        'Draft polished domain-specific reports in seconds with source citations'
      ],
      targetUsers: ['Researchers', 'Knowledge Workers', 'Product Managers', 'Students'],
      technologiesRequired: ['TypeScript', 'React', 'Tailwind CSS', 'Gemini 3.7 Flash', 'PgVector', 'Express', 'Markdown-it'],
      softwareRequirements: ['Node.js v20+', 'PostgreSQL'],
      databaseRequirements: ['PostgreSQL with pgvector extension'],
      aiMlAlgorithms: ['Gemini 3.7 Flash Grounded Reasoning', 'Vector Cosine Similarity Ranking', 'BM25 Hybrid Search'],
      developmentModules: [
        { name: 'Document Parser & Vectorizer', description: 'Converts unstructured documents into semantic embeddings.', deliverables: ['Chunking utility', 'Embedding generator'] },
        { name: 'Agent Execution Loop', description: 'Executes multi-step reasoning plans with tool calling.', deliverables: ['Agent controller', 'Tool registry'] },
        { name: 'Interactive Workspace UI', description: 'Chat, canvas view, and document editor with citation tooltips.', deliverables: ['React workspace', 'Markdown live preview'] }
      ],
      systemArchitectureExplanation: 'Browser client streams user prompts to an Express agent orchestrator. The orchestrator queries vector stores and invokes Gemini 3.7 Flash for grounded answers.',
      apiSuggestions: [
        { endpoint: '/api/v1/documents/upload', method: 'POST', description: 'Upload and vectorize document' },
        { endpoint: '/api/v1/agent/chat', method: 'POST', description: 'Stream agentic response with citations' }
      ],
      scalabilitySuggestions: ['Cache popular vector query responses in Redis', 'Use asynchronous workers for background document indexing'],
      futureEnhancements: ['Voice speech-to-text input', 'Collaborative multi-user live editing canvas'],
      readinessScore: 91,
      createdAt: new Date().toISOString(),
      saved: false
    },
    {
      id: 'proj_fall_' + Math.random().toString(36).substring(2, 9) + '_5',
      title: `Autonomous Resource Allocator & Sustainability Optimizer`,
      domain,
      difficultyLevel: diff,
      difficultyScore: diff === 'Beginner' ? 4.2 : diff === 'Intermediate' ? 7.0 : 8.6,
      innovationScore: 8.9,
      estimatedTime: dur,
      teamType: team,
      projectType: type,
      problemStatement: `Inefficient energy, computing, and supply chain usage leads to unnecessary carbon emissions and bloated operational costs.`,
      description: `A dynamic optimization platform that models real-time demand curves, schedules workloads during green-energy peak hours, and cuts waste by up to 40%.`,
      objectives: [
        'Monitor real-time utility tariffs and grid carbon intensity',
        'Automatically re-schedule non-urgent computing and physical loads',
        'Generate certified ESG sustainability reports for compliance'
      ],
      targetUsers: ['Sustainability Managers', 'Cloud Architects', 'Operations Directors'],
      technologiesRequired: ['Python', 'FastAPI', 'React', 'Recharts', 'PostgreSQL', 'Docker'],
      softwareRequirements: ['Python 3.11', 'Node.js v20+'],
      databaseRequirements: ['PostgreSQL for historical workload metrics', 'Redis for real-time demand cache'],
      aiMlAlgorithms: ['Linear & Integer Programming (PuLP / SciPy)', 'ARIMA Time-Series Forecasting'],
      developmentModules: [
        { name: 'Grid Telemetry Ingester', description: 'Fetches real-time carbon intensity and pricing feeds.', deliverables: ['API ingester', 'Price feed scheduler'] },
        { name: 'Optimization Solver', description: 'Solves constrained resource allocation mathematical models.', deliverables: ['Solver module', 'Constraint validator'] },
        { name: 'Sustainability Dashboard', description: 'Tracks carbon savings, cost reduction, and compliance scorecards.', deliverables: ['Interactive Recharts UI', 'CSV exporter'] }
      ],
      systemArchitectureExplanation: 'Telemetry workers collect energy grid pricing and submit scheduled tasks to an optimization solver that outputs optimal execution schedules.',
      apiSuggestions: [
        { endpoint: '/api/v1/grid/intensity', method: 'GET', description: 'Fetch current regional carbon intensity' },
        { endpoint: '/api/v1/optimize/schedule', method: 'POST', description: 'Compute optimal resource schedule' }
      ],
      scalabilitySuggestions: ['Scale solver workers independently on Kubernetes', 'Store historic tariff trends in columnar data stores'],
      futureEnhancements: ['Automated carbon offset purchasing via API', 'Smart contract micro-grid energy exchange'],
      readinessScore: 87,
      createdAt: new Date().toISOString(),
      saved: false
    }
  ];
}
