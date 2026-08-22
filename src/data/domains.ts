export interface DomainOption {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  suggestedTech: string[];
}

export const DOMAINS: DomainOption[] = [
  {
    id: 'ai',
    name: 'Artificial Intelligence',
    description: 'Agentic workflows, Generative AI, LLM fine-tuning, RAG, and NLP systems.',
    icon: 'Brain',
    color: 'from-violet-500 to-indigo-600',
    suggestedTech: ['Python', 'Gemini API', 'PyTorch', 'LangChain', 'FastAPI', 'PgVector']
  },
  {
    id: 'ml',
    name: 'Machine Learning & Vision',
    description: 'Computer vision, Deep learning, YOLO object detection, and predictive analytics.',
    icon: 'Eye',
    color: 'from-blue-500 to-cyan-600',
    suggestedTech: ['TensorFlow', 'OpenCV', 'Scikit-learn', 'YOLOv11', 'Pandas', 'Streamlit']
  },
  {
    id: 'iot',
    name: 'IoT & Smart Hardware',
    description: 'Connected microcontrollers, sensor telemetry, Edge AI, and MQTT automation.',
    icon: 'Cpu',
    color: 'from-emerald-500 to-teal-600',
    suggestedTech: ['ESP32', 'Raspberry Pi', 'C++', 'MQTT', 'TimescaleDB', 'MicroPython']
  },
  {
    id: 'blockchain',
    name: 'Blockchain & Web3',
    description: 'Smart contracts, Zero-Knowledge proofs, decentralized finance, and audit ledgers.',
    icon: 'ShieldCheck',
    color: 'from-amber-500 to-orange-600',
    suggestedTech: ['Solidity', 'Ethereum', 'Hardhat', 'Ethers.js', 'IPFS', 'Circom ZK']
  },
  {
    id: 'web',
    name: 'Web & Cloud Development',
    description: 'High-throughput full-stack architectures, microservices, and real-time platforms.',
    icon: 'Globe',
    color: 'from-sky-500 to-blue-600',
    suggestedTech: ['React 19', 'TypeScript', 'Node.js', 'Express', 'Tailwind CSS', 'PostgreSQL', 'Docker']
  },
  {
    id: 'cybersecurity',
    name: 'Cybersecurity & Defense',
    description: 'Threat hunting, automated vulnerability scanning, SIEM, and cryptographic privacy.',
    icon: 'Lock',
    color: 'from-rose-500 to-red-600',
    suggestedTech: ['Python', 'Wireshark', 'Rust', 'ELK Stack', 'Snort', 'Cryptography']
  },
  {
    id: 'healthcare',
    name: 'Healthcare & Biotech',
    description: 'Medical imaging AI, patient telemetry, EHR security, and clinical decision support.',
    icon: 'Activity',
    color: 'from-teal-500 to-emerald-600',
    suggestedTech: ['DICOM', 'PyTorch', 'FastAPI', 'HIPAA Cloud', 'React Native', 'PostgreSQL']
  },
  {
    id: 'agriculture',
    name: 'Agriculture & AgriTech',
    description: 'Drone crop multispectral analytics, soil telemetry, and precision micro-irrigation.',
    icon: 'Leaf',
    color: 'from-green-500 to-lime-600',
    suggestedTech: ['Python', 'YOLO', 'LoRaWAN', 'Mapbox', 'TimescaleDB', 'FastAPI']
  },
  {
    id: 'smart_city',
    name: 'Smart City & Mobility',
    description: 'Intelligent traffic optimization, micro-grid balance, and civic infrastructure.',
    icon: 'Building2',
    color: 'from-cyan-500 to-blue-600',
    suggestedTech: ['SUMO Simulator', 'Python RLlib', 'React', 'Redis', 'WebSockets', 'GIS']
  },
  {
    id: 'education',
    name: 'Education & EdTech',
    description: 'Adaptive learning co-pilots, automated coding grading, and interactive visual pedagogy.',
    icon: 'GraduationCap',
    color: 'from-purple-500 to-pink-600',
    suggestedTech: ['React', 'Node.js', 'Gemini API', 'Monaco Editor', 'PostgreSQL']
  },
  {
    id: 'cleantech',
    name: 'CleanTech & Energy',
    description: 'Solar microgrid management, carbon emission tracking, and battery optimization.',
    icon: 'Zap',
    color: 'from-amber-400 to-yellow-600',
    suggestedTech: ['Python', 'TimescaleDB', 'SciPy', 'React', 'FastAPI', 'Recharts']
  },
  {
    id: 'robotics',
    name: 'Robotics & Automation',
    description: 'ROS 2 autonomous navigation, SLAM mapping, and industrial manipulators.',
    icon: 'Bot',
    color: 'from-slate-600 to-zinc-800',
    suggestedTech: ['ROS 2', 'C++', 'Python', 'Gazebo', 'Jetson Nano', 'OpenCV']
  }
];

export const POPULAR_TECHS = [
  'Python',
  'TypeScript',
  'React 19',
  'Node.js',
  'Express',
  'FastAPI',
  'PyTorch',
  'TensorFlow',
  'Gemini API',
  'PostgreSQL',
  'MongoDB',
  'Redis',
  'Docker',
  'Solidity',
  'ESP32',
  'Raspberry Pi',
  'OpenCV',
  'Tailwind CSS',
  'WebSockets',
  'LangChain',
  'Rust',
  'C++',
  'Next.js',
  'TimescaleDB',
  'IPFS'
];

export const DIFFICULTY_LEVELS = [
  { level: 'Beginner', label: 'Beginner (Level 1-4)', desc: 'Ideal for 1st/2nd year students, hackathons, and foundational prototypes.' },
  { level: 'Intermediate', label: 'Intermediate (Level 5-7)', desc: 'Full-stack applications with AI models, database scaling, and responsive UI.' },
  { level: 'Advanced', label: 'Advanced (Level 8-10)', desc: 'Production-grade distributed systems, hardware integration, or custom neural architectures.' }
];

export const DURATION_OPTIONS = [
  'Hackathon (24 - 48 Hours)',
  '1 - 2 Weeks (Sprint)',
  '1 Month (Mini Project)',
  '3 Months (Capstone / Semester)',
  '6 Months (Final Year Thesis / Production)'
];

export const PROJECT_TYPES = [
  'Full-Stack Web & AI App',
  'Embedded IoT & Hardware System',
  'Mobile Application (React Native / Flutter)',
  'Blockchain & Web3 dApp',
  'Agentic AI & Multi-Agent Orchestrator',
  'Research Algorithm & Data Science Benchmark',
  'Edge Computing & TinyML Device',
  'Cloud Microservice & API Gateway'
];

export const SAMPLE_PRESETS = [
  {
    name: '🌾 Smart Agri Drone',
    domain: 'Agriculture & AgriTech',
    tech: ['Python', 'PyTorch', 'FastAPI', 'React', 'OpenCV', 'TimescaleDB'],
    difficulty: 'Advanced',
    duration: '3 Months (Capstone / Semester)',
    type: 'Embedded IoT & Hardware System',
    custom: 'Multispectral NDVI camera crop disease detection with localized pesticide spraying.'
  },
  {
    name: '🏥 Decentralized MedVault',
    domain: 'Healthcare & Biotech',
    tech: ['Solidity', 'TypeScript', 'React 19', 'IPFS', 'PostgreSQL', 'Ethers.js'],
    difficulty: 'Advanced',
    duration: '3 Months (Capstone / Semester)',
    type: 'Blockchain & Web3 dApp',
    custom: 'Zero-knowledge patient consent protocol with encrypted IPFS records.'
  },
  {
    name: '🚦 Autonomous Traffic RL',
    domain: 'Smart City & Mobility',
    tech: ['Python', 'FastAPI', 'React 19', 'Redis', 'WebSockets', 'Tailwind CSS'],
    difficulty: 'Intermediate',
    duration: '1 Month (Mini Project)',
    type: 'Agentic AI & Multi-Agent Orchestrator',
    custom: 'Reinforcement learning traffic signal controller with ambulance green corridor preemption.'
  },
  {
    name: '🛡️ AI Zero-Day Threat Hunter',
    domain: 'Cybersecurity & Defense',
    tech: ['Python', 'TypeScript', 'Docker', 'Gemini API', 'PostgreSQL', 'FastAPI'],
    difficulty: 'Intermediate',
    duration: '1 - 2 Weeks (Sprint)',
    type: 'Full-Stack Web & AI App',
    custom: 'Automated reverse engineering assistant and vulnerability scanner for compiled binaries.'
  }
];
