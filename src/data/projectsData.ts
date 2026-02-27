/**
 * Projects Data
 *
 * Enhanced project data structure for the 3D parallax projects page.
 * Each project includes depth layer assignments, categorized tech stacks,
 * and extended descriptions for the modal view.
 */

// ==================== TypeScript Interfaces ====================

export type PlanetId = 'ai-infra' | 'full-stack' | 'machine-learning' | 'hardware' | 'open-source';

export interface CategoryPlanet {
  /** Display label shown in the solar system and overlay header */
  name: string;
  /** Must match a PlanetId — used to filter projects */
  id: PlanetId;
  /** Filename inside /public/textures/ */
  img: string;
  /** Orbital radius scale — affects planet size in the solar system */
  size: number;
  /**
   * How large the planet appears in its own tab (the horizon zone preview).
   * 2.2 is the default. Go higher for a more immersive/looming look,
   * lower for planets that should feel distant.
   */
  previewScale?: number;
  /** Accent color used for glow, header borders, and text highlights */
  glowColor: string;
  /** Set true only for Saturn — renders RingGeometry */
  rings?: boolean;
}

// ─── Planet Configuration ─────────────────────────────────────────────────────
// Add / remove planets here. Change a project's `planetId` below to reassign it.
// `previewScale` controls how big the planet looks when you enter its tab.

export const categoryPlanets: CategoryPlanet[] = [
  { name: 'AI Infra',         id: 'ai-infra',        img: 'jupiter.png',  size: 0.8,  previewScale: 3, glowColor: '#c5a84e' },
  { name: 'Full Stack',       id: 'full-stack',       img: 'earth.png',    size: 0.65, previewScale: 2.0, glowColor: '#4ecdc4' },
  { name: 'Machine Learning', id: 'machine-learning', img: 'saturn.png',   size: 0.7,  previewScale: 2.2, glowColor: '#d4a843', rings: true },
  { name: 'Hardware',         id: 'hardware',         img: 'mars.png',     size: 0.55, previewScale: 1.6, glowColor: '#c1440e' },
  { name: 'Open Source',      id: 'open-source',      img: 'neptune.png',  size: 0.6,  previewScale: 1.8, glowColor: '#4a6fa5' },
];

export interface TechItem {
  name: string;
  category: 'frontend' | 'backend' | 'database' | 'ai' | 'devops';
  icon?: React.ReactNode; // Optional tech logo (for future enhancement)
}

export interface Project {
  id: string;
  planetId: PlanetId;
  badge?: boolean;
  title: string;
  description: string; // Short version for card
  fullDescription: string; // Extended for modal (2-3 paragraphs)
  date: string;
  imageUrl: string;
  detailsUrl: string; // Project demo/Devpost link
  githubUrl?: string; // GitHub repository (optional)
  tech: TechItem[];
  badgeColor: string;
  depth: 1 | 2 | 3; // Depth layer assignment
}

// ==================== Tech Category Colors ====================

export const techCategoryColors = {
  frontend: '#9333ea',    // Purple
  backend: '#3b82f6',     // Blue
  database: '#10b981',    // Green
  ai: '#ec4899',          // Pink
  devops: '#f59e0b'       // Orange
};

// ==================== Projects Data ====================

export const projects: Project[] = [
  {
    id: 'emergent',
    planetId: 'ai-infra',
    badge: true,
    title: 'Emergent',
    description: 'An AI-powered crisis simulation platform enabling emergency managers to test plans against a dynamic community of 50+ intelligent personas using Google ADK agents. Features interactive GIS mapping, real-time agent simulation, and emergent disaster scenarios.',
    fullDescription: `Emergent is a cutting-edge crisis simulation platform that revolutionizes emergency preparedness by combining AI-powered agent systems with interactive GIS mapping. The platform enables emergency managers to test their response plans against a dynamic community of 50+ intelligent personas, each powered by Google ADK agents with unique backgrounds, behaviors, and decision-making patterns. The system features real-time agent simulation where AI personas interact with disaster scenarios, make decisions based on their characteristics, and generate emergent behaviors that mirror real-world crisis situations.

Built with Next.js 14 and FastAPI for high-performance backend processing, Emergent leverages parallel processing to simulate complex multi-agent interactions in real-time. The interactive GIS mapping provides visual feedback on scenario progression, agent movements, and resource allocation, allowing emergency managers to identify gaps in their plans and refine strategies before real disasters strike.`,
    date: '2025-10-24',
    imageUrl: 'assets/projects/emergent.png',
    detailsUrl: 'https://devpost.com/software/emergent-b2t1fl',
    githubUrl: undefined,
    tech: [
      { name: 'Next.js 14', category: 'frontend' },
      { name: 'TypeScript', category: 'frontend' },
      { name: 'React', category: 'frontend' },
      { name: 'Tailwind CSS', category: 'frontend' },
      { name: 'Python', category: 'backend' },
      { name: 'FastAPI', category: 'backend' },
      { name: 'Google ADK', category: 'ai' },
      { name: 'Parallel Processing', category: 'devops' },
    ],
    badgeColor: 'text-indigo-300',
    depth: 1, // Front layer
  },
  {
    id: 'insightai',
    planetId: 'machine-learning',
    badge: false,
    title: 'InsightAI',
    description: 'A real-time attention-driven UX optimization tool using eye tracking and AI to help developers build more accessible websites. Developers rank component importance, InsightAI measures user attention, identifies mismatches, and uses Gemini AI to suggest concrete HTML improvements applied instantly. Generates comprehensive performance summaries for informed design decisions.',
    fullDescription: `InsightAI transforms web accessibility and UX optimization by combining eye tracking technology with AI-powered analysis. Developers first rank their UI components by importance, then InsightAI uses eye tracking to measure actual user attention. The system identifies mismatches between intended and actual focus areas, then leverages Gemini AI to analyze the discrepancies and suggest concrete HTML improvements that can be applied instantly.

Built with Python and Tkinter for the desktop interface, the tool integrates TensorFlow and OpenCV for robust eye tracking, while MongoDB stores attention data for historical analysis. InsightAI generates comprehensive performance summaries that track attention metrics over time, identify patterns in user behavior, and provide data-driven insights for design decisions, making it an essential tool for any developer serious about accessibility and user experience.`,
    date: '2025-9-27',
    imageUrl: 'assets/projects/insightAI.png',
    detailsUrl: 'https://devpost.com/software/emergent-b2t1fl',
    githubUrl: undefined,
    tech: [
      { name: 'Python', category: 'backend' },
      { name: 'Python Tkinter', category: 'frontend' },
      { name: 'Eye Tracking', category: 'ai' },
      { name: 'Gemini API', category: 'ai' },
      { name: 'MongoDB', category: 'database' },
      { name: 'TensorFlow', category: 'ai' },
      { name: 'OpenCV', category: 'ai' },
    ],
    badgeColor: 'text-blue-300',
    depth: 2, // Mid layer
  },
  {
    id: 'sonara',
    planetId: 'full-stack',
    badge: false,
    title: 'Sonara',
    description: 'Sonara is a dating platform for people moving into a new city to build new connections through voice',
    fullDescription: `Sonara reimagines the dating app experience for urban migrants by prioritizing authentic voice connections over superficial profile browsing. The platform leverages real-time WebSocket technology to enable seamless voice conversations between users, while AI contextualization powered by Gemini helps match people based on conversation style, interests, and compatibility signals beyond what text profiles can capture.

Built with Next.js 15 and styled with Tailwind CSS, Sonara features a modern, responsive interface that makes voice-first dating feel intuitive and engaging. Supabase provides robust authentication and real-time data synchronization, ensuring secure user management and smooth conversation flows. By focusing on voice and AI-driven contextualization, Sonara helps people overcome the initial awkwardness of meeting new people and builds connections that go deeper than swipe-based dating.`,
    date: '2025-9-20',
    imageUrl: 'assets/projects/Sonara.png',
    detailsUrl: 'https://devpost.com/software/sonara-2xvnh0',
    githubUrl: undefined,
    tech: [
      { name: 'Next.js 15', category: 'frontend' },
      { name: 'Tailwind CSS', category: 'frontend' },
      { name: 'Gemini', category: 'ai' },
      { name: 'Websockets', category: 'devops' },
      { name: 'AI Contextualization', category: 'ai' },
      { name: 'Supabase', category: 'database' },
    ],
    badgeColor: 'text-lime-300',
    depth: 3, // Back layer
  },
  {
    id: 'fitlink',
    planetId: 'full-stack',
    badge: false,
    title: 'FitLink',
    description: 'FitLink is an AI-powered client management tool for personal trainers',
    fullDescription: `FitLink is a comprehensive client management platform designed specifically for personal trainers who want to scale their business without sacrificing personalized attention. Personal trainers can create customized workout programs, track client progress through detailed analytics, and stay connected via the mobile app built with Flutter. The AI component analyzes client performance data, suggests program adjustments, and helps trainers identify when clients might need extra motivation or modified routines.

The dual-platform approach features a React web dashboard for trainers and a Flutter mobile app for clients, ensuring optimal experiences tailored to each user's needs. Integration with Google Calendar APIs ensures seamless scheduling, while the Express.js backend, MongoDB database, and Firebase provide fast, reliable data management with real-time updates so trainers can monitor client activity and provide immediate feedback.`,
    date: '2024-8-18 ~ 2025-5-04',
    imageUrl: 'assets/projects/FitLink.png',
    detailsUrl: 'https://github.com/wcia013twe/FitLink',
    githubUrl: 'https://github.com/wcia013twe/FitLink',
    tech: [
      { name: 'React', category: 'frontend' },
      { name: 'Flutter', category: 'frontend' },
      { name: 'Firebase', category: 'database' },
      { name: 'Express.js', category: 'backend' },
      { name: 'Node.js', category: 'backend' },
      { name: 'MongoDB', category: 'database' },
      { name: 'Google Calendar APIs', category: 'devops' },
    ],
    badgeColor: 'text-red-300',
    depth: 1, // Front layer
  },
  {
    id: 'fairmap',
    planetId: 'open-source',
    badge: false,
    title: 'FairMap',
    description: 'FairMap provides a map comparison of the congressional voting data',
    fullDescription: `FairMap tackles the critical issue of gerrymandering and voter representation by providing an interactive, data-driven platform for comparing congressional voting patterns across different district maps. By pulling real voting data from the Census API and combining it with historical election results, FairMap creates visualizations that reveal disparities in voting power across districts. Users can compare different proposed district maps, see how their vote would be weighted under different scenarios, and understand the real-world impact of redistricting decisions.

Built with Django and SQLite for robust data management, and featuring an interactive frontend powered by vanilla JavaScript, HTML, and CSS, FairMap proves that impactful civic tech doesn't always require the latest frameworks. The platform's straightforward architecture ensures fast load times and broad accessibility, making critical voting information available to anyone with a web browser and demonstrating how technology can promote transparency and informed participation in democracy.`,
    date: '2025-10-10',
    imageUrl: 'assets/projects/doesmyvotematter.jpg',
    detailsUrl: 'https://devpost.com/software/does-my-vote-matter-1r2g3d',
    githubUrl: undefined,
    tech: [
      { name: 'Python', category: 'backend' },
      { name: 'Django', category: 'backend' },
      { name: 'SQLite', category: 'database' },
      { name: 'HTML', category: 'frontend' },
      { name: 'CSS', category: 'frontend' },
      { name: 'JavaScript', category: 'frontend' },
      { name: 'Census API', category: 'devops' },
    ],
    badgeColor: 'text-blue-300',
    depth: 2, // Mid layer
  },
  {
    id: 'findmyfriend',
    planetId: 'open-source',
    badge: false,
    title: 'FindMyFriend',
    description: "FindMyFriend is a LAMP stack project for tracking your friends' locations.",
    fullDescription: `FindMyFriend is a classic LAMP (Linux, Apache, MySQL, PHP) stack application that demonstrates the fundamentals of full-stack web development through a practical use case: helping friends coordinate meetups by sharing their locations. The platform allows users to create accounts, add friends, and share their current locations on a map interface. Built entirely with PHP for server-side logic and MySQL for data persistence, FindMyFriend handles user authentication, friend relationship management, and location updates with a vanilla JavaScript, HTML, and CSS frontend.

While modern frameworks have gained popularity, this project illustrates the enduring value of understanding foundational web technologies. The LAMP stack powers millions of websites worldwide, and mastering these technologies provides a solid foundation for understanding how web applications work under the hood. Running on Linux with Apache as the web server, FindMyFriend is a testament to the power of tried-and-true technologies for building reliable, straightforward web applications.`,
    date: '2025-10-10',
    imageUrl: 'assets/projects/FindMyFriend.png',
    detailsUrl: 'https://github.com/wcia013twe/FindMyFriend',
    githubUrl: 'https://github.com/wcia013twe/FindMyFriend',
    tech: [
      { name: 'Linux', category: 'devops' },
      { name: 'Apache', category: 'devops' },
      { name: 'MySQL', category: 'database' },
      { name: 'PHP', category: 'backend' },
      { name: 'JavaScript', category: 'frontend' },
      { name: 'HTML', category: 'frontend' },
      { name: 'CSS', category: 'frontend' },
    ],
    badgeColor: 'text-lime-300',
    depth: 3, // Back layer
  },
];
