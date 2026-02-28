/**
 * Projects Data
 *
 * Enhanced project data structure for the 3D parallax projects page.
 * Each project includes depth layer assignments, categorized tech stacks,
 * and extended descriptions for the modal view.
 */

// ==================== TypeScript Interfaces ====================

export type PlanetId =
  | "ai-infra"
  | "full-stack"
  | "machine-learning"
  | "hardware"
  | "open-source";

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
  /**
   * Override the orbit camera distance for this planet.
   * Smaller = tighter zoom, larger = more distant.
   * Defaults to `size * 1 + 0.5` if omitted.
   */
  zoomDist?: number;
  /**
   * Orbit tier index. Planets that share the same tier share the same orbital
   * radius. Tiers are sorted 0 → N (innermost → outermost).
   * Defaults to each planet having its own unique tier if omitted.
   */
  orbitTier?: number;
  /**
   * Starting angle in degrees for this planet's initial position on its orbit.
   * 0 = positive-X axis. Use 180 to place a planet directly opposite another
   * planet on the same tier. Defaults to 0 if omitted.
   */
  startAngleDeg?: number;
}

// ─── Planet Configuration ─────────────────────────────────────────────────────
// Add / remove planets here. Change a project's `planetId` below to reassign it.
// `previewScale` controls how big the planet looks when you enter its tab.

export const categoryPlanets: CategoryPlanet[] = [
  {
    name: "AI Systems",
    id: "ai-infra",
    img: "jupiter.png",
    size: 0.8,
    previewScale: 3,
    glowColor: "#c5a84e",
    orbitTier: 0,
    startAngleDeg: 0,
  },
  {
    name: "Open Source",
    id: "open-source",
    img: "neptune.png",
    size: 0.6,
    previewScale: 1.8,
    glowColor: "#4a6fa5",
    orbitTier: 0,
    startAngleDeg: 180,
  },
  {
    name: "Apps",
    id: "full-stack",
    img: "earth.png",
    size: 0.65,
    previewScale: 2.0,
    glowColor: "#4ecdc4",
    orbitTier: 1,
    startAngleDeg: 0,
  },
  {
    name: "Embedded",
    id: "hardware",
    img: "mars.png",
    size: 0.55,
    previewScale: 1.6,
    glowColor: "#c1440e",
    orbitTier: 1,
    startAngleDeg: 180,
  },
  {
    name: "AI/ML",
    id: "machine-learning",
    img: "saturn.png",
    size: 0.7,
    previewScale: 2.2,
    glowColor: "#d4a843",
    orbitTier: 2,
    startAngleDeg: 0,
    rings: true,
  },
];

export interface TechItem {
  name: string;
  category: "frontend" | "backend" | "database" | "ai" | "devops";
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
  awards?: string[]; // Optional list of awards / recognitions
  badgeColor: string;
  depth: 1 | 2 | 3; // Depth layer assignment
}

// ==================== Tech Category Colors ====================

export const techCategoryColors = {
  frontend: "#9333ea", // Purple
  backend: "#3b82f6", // Blue
  database: "#10b981", // Green
  ai: "#ec4899", // Pink
  devops: "#f59e0b", // Orange
};

// ==================== Projects Data ====================

export const projects: Project[] = [
  {
    id: "emergent",
    planetId: "full-stack",
    badge: true,
    title: "Emergent",
    description:
      "AI-powered crisis simulation platform where emergency managers test response plans against 50+ intelligent Google ADK agent personas with real-time GIS mapping.",
    fullDescription: `Emergent is a crisis simulation platform that revolutionizes emergency preparedness by combining AI-powered agent systems with interactive GIS mapping.

Emergency managers test their response plans against a dynamic community of 50+ intelligent personas, each powered by Google ADK agents with unique backgrounds, behaviors, and decision-making patterns. AI personas interact with disaster scenarios in real-time, generating emergent behaviors that mirror real-world crisis situations.

Built with Next.js 14 and FastAPI, Emergent leverages parallel processing to simulate complex multi-agent interactions. The interactive GIS mapping provides visual feedback on scenario progression, agent movements, and resource allocation — helping managers identify gaps in their plans before real disasters strike.`,
    date: "2025-10-24",
    imageUrl: "assets/projects/emergent.png",
    detailsUrl: "https://devpost.com/software/emergent-b2t1fl",
    githubUrl: undefined,
    tech: [
      { name: "Next.js 14", category: "frontend" },
      { name: "TypeScript", category: "frontend" },
      { name: "React", category: "frontend" },
      { name: "Tailwind CSS", category: "frontend" },
      { name: "Python", category: "backend" },
      { name: "FastAPI", category: "backend" },
      { name: "Google ADK", category: "ai" },
      { name: "Parallel Processing", category: "devops" },
    ],
    awards: [
      "🏆 1st Place Overall — HackWestern 11",
      "🥇 Best Use of Google ADK",
    ],
    badgeColor: "text-indigo-300",
    depth: 1, // Front layer
  },
  {
  id: "imsoatl",
  planetId: "full-stack",
  badge: true,
  title: "ImsoATL — Atlas True Link",
  description:
    "AI-powered urban WiFi equity mapping tool that identifies connectivity gaps and recommends optimal hotspot locations for maximum social impact.",
  fullDescription: `ImsoATL (Atlas True Link) is an interactive decision-support platform designed to help cities, ISPs, and community organizations deploy public WiFi with maximum equity impact.  

The system scores neighborhoods using demographic, income, and connectivity indicators, highlighting WiFi deserts and prioritizing areas most at risk of digital exclusion. AI agents interpret these metrics to pinpoint specific blocks, schools, libraries, and transit hubs where new hotspots would be most effective.  

A Mapbox-based interactive map provides planners with hoverable, clickable insights, grounded explanations, and exportable recommendations — turning weeks of GIS and survey work into minutes. The backend uses Python and FastAPI for scoring, Snowflake for geospatial data caching, and Google ADK to orchestrate AI reasoning, ensuring that every recommendation is actionable and explainable.`,
  date: "2025-09-12",
  imageUrl: "assets/projects/atl.png",
  detailsUrl: "https://devpost.com/software/imsoatl-atlas-true-link",
  githubUrl: undefined,
  tech: [
    { name: "Next.js", category: "frontend" },
    { name: "React", category: "frontend" },
    { name: "Tailwind CSS", category: "frontend" },
    { name: "Mapbox", category: "frontend" },
    { name: "Python", category: "backend" },
    { name: "FastAPI", category: "backend" },
    { name: "Google ADK", category: "ai" },
    { name: "Snowflake", category: "database" },
    { name: "Geospatial Analysis", category: "ai" },
  ],
  awards: [
    "🏆 Best Domain - GoDaddy"
  ],
  badgeColor: "text-teal-300",
  depth: 1, // Front layer
},
  
  {
    id: "sonara",
    planetId: "full-stack",
    badge: false,
    title: "Sonara",
    description:
      "Voice-first dating app for people moving to new cities — AI matches users on conversation style and compatibility beyond what text profiles capture.",
    fullDescription: `Sonara reimagines dating for urban migrants by prioritizing authentic voice connections over superficial profile browsing.

Real-time WebSocket technology enables seamless voice conversations between users, while AI contextualization powered by Gemini matches people based on conversation style, interests, and compatibility signals that text profiles can't capture.

Built with Next.js 15 and Tailwind CSS, with Supabase handling authentication and real-time data sync — ensuring secure user management and smooth conversation flows.`,
    date: "2025-9-20",
    imageUrl: "assets/projects/Sonara.png",
    detailsUrl: "https://devpost.com/software/sonara-2xvnh0",
    githubUrl: undefined,
    tech: [
      { name: "Next.js 15", category: "frontend" },
      { name: "Tailwind CSS", category: "frontend" },
      { name: "Gemini", category: "ai" },
      { name: "Websockets", category: "devops" },
      { name: "AI Contextualization", category: "ai" },
      { name: "Supabase", category: "database" },
    ],
    badgeColor: "text-lime-300",
    depth: 3, // Back layer
  },
  {
    id: "fitlink",
    planetId: "full-stack",
    badge: false,
    title: "FitLink",
    description:
      "AI-powered client management platform for personal trainers — custom workout programs, progress analytics, and a Flutter mobile app for clients.",
    fullDescription: `FitLink is a client management platform built for personal trainers who want to scale without sacrificing personalized attention.

Trainers create customized workout programs, track client progress through detailed analytics, and stay connected via a Flutter mobile app. The AI component analyzes performance data, suggests program adjustments, and flags when clients may need extra motivation or modified routines.

The dual-platform approach pairs a React web dashboard for trainers with the Flutter client app. Express.js, MongoDB, Firebase, and Google Calendar APIs handle scheduling, real-time updates, and data management.`,
    date: "2024-8-18 ~ 2025-5-04",
    imageUrl: "assets/projects/FitLink.png",
    detailsUrl: "https://github.com/wcia013twe/FitLink",
    githubUrl: "https://github.com/wcia013twe/FitLink",
    tech: [
      { name: "React", category: "frontend" },
      { name: "Flutter", category: "frontend" },
      { name: "Firebase", category: "database" },
      { name: "Express.js", category: "backend" },
      { name: "Node.js", category: "backend" },
      { name: "MongoDB", category: "database" },
      { name: "Google Calendar APIs", category: "devops" },
    ],
    badgeColor: "text-red-300",
    depth: 1, // Front layer
  },
  {
    id: "fairmap",
    planetId: "full-stack",
    badge: false,
    title: "FairMap",
    description:
      "Interactive platform exposing gerrymandering by visualizing how congressional district maps affect real voting power using Census data.",
    fullDescription: `FairMap tackles gerrymandering and voter representation by letting users compare congressional voting patterns across different district maps.

By pulling real voting data from the Census API and combining it with historical election results, FairMap creates visualizations that reveal disparities in voting power across districts. Users can compare proposed maps, see how their vote would be weighted under each scenario, and understand the real-world impact of redistricting.

Built with Django, SQLite, and a vanilla JavaScript frontend — proving impactful civic tech doesn't require the latest frameworks.`,
    date: "2025-10-10",
    imageUrl: "assets/projects/doesmyvotematter.jpg",
    detailsUrl: "https://devpost.com/software/does-my-vote-matter-1r2g3d",
    githubUrl: undefined,
    tech: [
      { name: "Python", category: "backend" },
      { name: "Django", category: "backend" },
      { name: "SQLite", category: "database" },
      { name: "HTML", category: "frontend" },
      { name: "CSS", category: "frontend" },
      { name: "JavaScript", category: "frontend" },
      { name: "Census API", category: "devops" },
    ],
    badgeColor: "text-blue-300",
    depth: 2, // Mid layer
  },
  {
    id: "findmyfriend",
    planetId: "full-stack",
    badge: false,
    title: "FindMyFriend",
    description:
      "LAMP stack app for sharing real-time locations with friends to coordinate meetups — built from scratch with PHP, MySQL, and vanilla JS.",
    fullDescription: `FindMyFriend is a LAMP (Linux, Apache, MySQL, PHP) stack app that helps friends coordinate meetups by sharing their real-time locations.

Users create accounts, add friends, and share their current location on a map interface. PHP handles server-side logic and authentication, MySQL manages persistence, and a vanilla JavaScript, HTML, and CSS frontend keeps things lightweight.

A deliberate exercise in foundational web technologies — no frameworks, just the stack that still powers a significant portion of the web.`,
    date: "2025-10-10",
    imageUrl: "assets/projects/FindMyFriend.png",
    detailsUrl: "https://github.com/wcia013twe/FindMyFriend",
    githubUrl: "https://github.com/wcia013twe/FindMyFriend",
    tech: [
      { name: "Linux", category: "devops" },
      { name: "Apache", category: "devops" },
      { name: "MySQL", category: "database" },
      { name: "PHP", category: "backend" },
      { name: "JavaScript", category: "frontend" },
      { name: "HTML", category: "frontend" },
      { name: "CSS", category: "frontend" },
    ],
    badgeColor: "text-lime-300",
    depth: 3, // Back layer
  },

  //-------------HARDWARE------------//

  {
    id: "firewatch",
    planetId: "hardware",
    // badge: true,
    title: "Firewatch",
    description:
      "Real-time hazard awareness system for firefighters, combining edge AI, computer vision, and RAG-powered contextual intelligence to detect smoke, fire, and flashover risks in extreme conditions.",
    fullDescription: `Firewatch is a real-time hazard awareness platform designed for firefighters operating in extreme conditions where visibility is near-zero, air is limited, and every second counts.

The system integrates thermal and smoke sensors with YOLOv8 computer vision models running on the NVIDIA Jetson Orin. Observations are processed in under 30ms to detect hazards, track human movement, and identify flashover risks before they become critical. A low-latency RAG pipeline converts these observations into actionable guidance and stores a mission log, ensuring context-aware decisions for both firefighters and command centers.

Firewatch also features a tactical React dashboard with WebSockets, visualizing hazard data, prioritizing critical communications, and providing real-time checklists to responders. The system is optimized to function reliably in extreme heat, low visibility, and high-stress environments, effectively amplifying human situational awareness and safety.`,
    date: "2026-2-18",
    imageUrl: "assets/projects/firewatch.png",
    detailsUrl: "https://devpost.com/software/firewatch",
    githubUrl: undefined,
    tech: [
      { name: "Python", category: "backend" },
      { name: "YOLOv8", category: "ai" },
      { name: "NVIDIA Jetson Orin", category: "devops" },
      { name: "Thermal & Smoke Sensors", category: "devops" },
      { name: "FastAPI", category: "backend" },
      { name: "Redis", category: "backend" },
      { name: "Actian Vector", category: "ai" },
      { name: "React", category: "frontend" },
      { name: "WebSockets", category: "frontend" },
    ],
    badgeColor: "text-orange-400",
    depth: 1, // Front layer
  },

  // ----------- MACHINE LEARNING ------------- //
  {
    id: "insightai",
    planetId: "machine-learning",
    badge: false,
    title: "InsightAI",
    description:
      "Eye tracking + AI tool that measures where users actually look, then uses Gemini to suggest instant HTML fixes when attention mismatches developer intent.",
    fullDescription: `InsightAI transforms UX optimization by combining eye tracking technology with AI-powered analysis.

Developers rank their UI components by importance, then InsightAI uses eye tracking to measure actual user attention. The system identifies mismatches between intended and actual focus areas, then leverages Gemini AI to suggest concrete HTML improvements that can be applied instantly.

Built with Python and Tkinter, the tool integrates TensorFlow and OpenCV for robust eye tracking, while MongoDB stores attention data for historical analysis. InsightAI generates comprehensive performance summaries that track attention metrics over time and provide data-driven insights for design decisions.`,
    date: "2025-9-27",
    imageUrl: "assets/projects/insightAI.png",
    detailsUrl: "https://devpost.com/software/emergent-b2t1fl",
    githubUrl: undefined,
    tech: [
      { name: "Python", category: "backend" },
      { name: "Python Tkinter", category: "frontend" },
      { name: "Eye Tracking", category: "ai" },
      { name: "Gemini API", category: "ai" },
      { name: "MongoDB", category: "database" },
      { name: "TensorFlow", category: "ai" },
      { name: "OpenCV", category: "ai" },
    ],
    badgeColor: "text-blue-300",
    depth: 2, // Mid layer
  },
];
