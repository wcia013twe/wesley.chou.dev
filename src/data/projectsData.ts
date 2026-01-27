/**
 * Projects Data
 *
 * Enhanced project data structure for the 3D parallax projects page.
 * Each project includes depth layer assignments, categorized tech stacks,
 * and extended descriptions for the modal view.
 */

// ==================== TypeScript Interfaces ====================

export interface TechItem {
  name: string;
  category: 'frontend' | 'backend' | 'database' | 'ai' | 'devops';
  icon?: React.ReactNode; // Optional tech logo (for future enhancement)
}

export interface Project {
  id: string;
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
    badge: true,
    title: 'Emergent',
    description: 'An AI-powered crisis simulation platform enabling emergency managers to test plans against a dynamic community of 50+ intelligent personas using Google ADK agents. Features interactive GIS mapping, real-time agent simulation, and emergent disaster scenarios.',
    fullDescription: `Emergent is a cutting-edge crisis simulation platform that revolutionizes emergency preparedness by combining AI-powered agent systems with interactive GIS mapping. The platform enables emergency managers to test their response plans against a dynamic community of 50+ intelligent personas, each powered by Google ADK agents with unique backgrounds, behaviors, and decision-making patterns.

The system features real-time agent simulation where AI personas interact with disaster scenarios, make decisions based on their characteristics, and generate emergent behaviors that mirror real-world crisis situations. Emergency managers can observe how different segments of the community respond to various scenarios, identify gaps in their plans, and refine strategies before real disasters strike.

Built with a modern tech stack featuring Next.js 14 for the frontend and FastAPI for high-performance backend processing, Emergent leverages parallel processing to simulate complex multi-agent interactions in real-time. The interactive GIS mapping provides visual feedback on scenario progression, agent movements, and resource allocation, making it an invaluable tool for emergency preparedness training and planning.`,
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
    badge: false,
    title: 'InsightAI',
    description: 'A real-time attention-driven UX optimization tool using eye tracking and AI to help developers build more accessible websites. Developers rank component importance, InsightAI measures user attention, identifies mismatches, and uses Gemini AI to suggest concrete HTML improvements applied instantly. Generates comprehensive performance summaries for informed design decisions.',
    fullDescription: `InsightAI transforms web accessibility and UX optimization by combining eye tracking technology with AI-powered analysis. The platform provides developers with a scientific approach to understanding user attention patterns, helping them build websites that are not only beautiful but also effectively guide user focus to the most important elements.

The workflow is elegantly simple yet powerful: developers first rank their UI components by importance, then InsightAI uses eye tracking to measure actual user attention. The system identifies mismatches between intended and actual focus areas, then leverages Gemini AI to analyze the discrepancies and suggest concrete HTML improvements. These suggestions can be applied instantly, allowing developers to iterate rapidly on their designs.

Beyond real-time optimization, InsightAI generates comprehensive performance summaries that track attention metrics over time, identify patterns in user behavior, and provide data-driven insights for design decisions. Built with Python and Tkinter for the desktop interface, the tool integrates TensorFlow and OpenCV for robust eye tracking, while MongoDB stores attention data for historical analysis. This makes InsightAI an essential tool for any developer serious about accessibility and user experience.`,
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
    badge: false,
    title: 'Sonara',
    description: 'Sonara is a dating platform for people moving into a new city to build new connections through voice',
    fullDescription: `Sonara reimagines the dating app experience for urban migrants by prioritizing authentic voice connections over superficial profile browsing. Moving to a new city can be isolating, and traditional dating apps often fail to capture the nuances of personality and chemistry that voice communication naturally conveys. Sonara fills this gap by creating a platform where voice is the primary medium for connection.

The platform leverages real-time WebSocket technology to enable seamless voice conversations between users, while AI contextualization powered by Gemini helps match people based on conversation style, interests, and compatibility signals beyond what text profiles can capture. The experience is designed to feel natural and low-pressure, encouraging meaningful conversations that help newcomers build genuine connections in their new city.

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
    badge: false,
    title: 'FitLink',
    description: 'FitLink is an AI-powered client management tool for personal trainers',
    fullDescription: `FitLink is a comprehensive client management platform designed specifically for personal trainers who want to scale their business without sacrificing personalized attention. The platform combines AI-powered workout planning, nutrition tracking, and client communication tools into a single unified system that makes managing multiple clients effortless.

Personal trainers can use FitLink to create customized workout programs, track client progress through detailed analytics, and stay connected via the mobile app built with Flutter. The AI component analyzes client performance data, suggests program adjustments, and helps trainers identify when clients might need extra motivation or modified routines. Integration with Google Calendar APIs ensures seamless scheduling, while the Express.js backend and MongoDB database provide fast, reliable data management.

The dual-platform approach (React web dashboard for trainers, Flutter mobile app for clients) ensures that both parties have optimal experiences tailored to their needs. Trainers get powerful analytics and management tools on desktop, while clients get a streamlined mobile experience for logging workouts, viewing programs, and communicating with their trainer. Firebase integration enables real-time updates, so trainers can monitor client activity as it happens and provide immediate feedback when needed.`,
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
    badge: false,
    title: 'FairMap',
    description: 'FairMap provides a map comparison of the congressional voting data',
    fullDescription: `FairMap tackles the critical issue of gerrymandering and voter representation by providing an interactive, data-driven platform for comparing congressional voting patterns across different district maps. The platform empowers citizens, journalists, and researchers to understand how district boundaries affect election outcomes and whether their vote truly matters in their current district.

By pulling real voting data from the Census API and combining it with historical election results, FairMap creates visualizations that reveal disparities in voting power across districts. Users can compare different proposed district maps, see how their specific vote would be weighted under different scenarios, and understand the real-world impact of redistricting decisions. The platform makes complex electoral data accessible and understandable to everyday citizens.

Built with Django and SQLite for robust data management, and featuring an interactive frontend powered by vanilla JavaScript, HTML, and CSS, FairMap proves that impactful civic tech doesn't always require the latest frameworks. The platform's straightforward architecture ensures fast load times and broad accessibility, making critical voting information available to anyone with a web browser. This project demonstrates how technology can promote transparency and informed participation in democracy.`,
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
    badge: false,
    title: 'FindMyFriend',
    description: "FindMyFriend is a LAMP stack project for tracking your friends' locations.",
    fullDescription: `FindMyFriend is a classic LAMP (Linux, Apache, MySQL, PHP) stack application that demonstrates the fundamentals of full-stack web development through a practical use case: helping friends coordinate meetups by sharing their locations. This project showcases how traditional server-side technologies can create functional, real-world applications with database integration and dynamic content.

The platform allows users to create accounts, add friends, and share their current locations on a map interface. Built entirely with PHP for server-side logic and MySQL for data persistence, FindMyFriend handles user authentication, friend relationship management, and location updates in real-time. The frontend uses vanilla JavaScript, HTML, and CSS to create an interactive map experience that displays friend locations and enables quick coordination.

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
