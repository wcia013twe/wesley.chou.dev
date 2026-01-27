import { ReactNode } from "react";
import StackIcon from "tech-stack-icons";
import CustomIcon from "@/components/CustomIcon";

export interface SkillIcon {
  name: string;
  icon: ReactNode;
}

export interface SkillCategory {
  id: string;
  name: string;
  color: string;
  position: [number, number, number];
  radius: number;
  skills: SkillIcon[];
}

export const skillsGalaxyData: SkillCategory[] = [
  {
    id: "languages-frontend",
    name: "Languages & Frontend",
    color: "#9333ea",
    position: [-8, 2, 0],
    radius: 2.5,
    skills: [
      { name: "Java", icon: <StackIcon name="java" /> },
      { name: "Python", icon: <StackIcon name="python" /> },
      { name: "C++", icon: <StackIcon name="c++" /> },
      { name: "TypeScript", icon: <StackIcon name="typescript" /> },
      { name: "JavaScript", icon: <StackIcon name="js" /> },
      { name: "HTML5", icon: <StackIcon name="html5" /> },
      { name: "CSS3", icon: <StackIcon name="css3" /> },
      { name: "React", icon: <StackIcon name="react" /> },
      { name: "Tailwind CSS", icon: <StackIcon name="tailwindcss" /> },
      { name: "Next.js", icon: <StackIcon name="nextjs" /> },
      { name: "Flutter", icon: <StackIcon name="flutter" /> },
    ],
  },
  {
    id: "backend-databases",
    name: "Backend & Databases",
    color: "#3b82f6",
    position: [4, -1, -6],
    radius: 2.0,
    skills: [
      { name: "Node.js", icon: <StackIcon name="nodejs" /> },
      { name: "Spring", icon: <StackIcon name="spring" /> },
      { name: "FastAPI", icon: <CustomIcon title="FastAPI" src="icons/fastapi.png" /> },
      { name: "LangChain", icon: <StackIcon name="langchain" /> },
      { name: "MongoDB", icon: <StackIcon name="mongodb" /> },
      { name: "PostgreSQL", icon: <StackIcon name="postgresql" /> },
      { name: "MySQL", icon: <StackIcon name="mysql" /> },
      { name: "Supabase", icon: <StackIcon name="supabase" /> },
    ],
  },
  {
    id: "devops-infrastructure",
    name: "DevOps & Infrastructure",
    color: "#10b981",
    position: [6, 1, 4],
    radius: 1.8,
    skills: [
      { name: "Docker", icon: <StackIcon name="docker" /> },
      { name: "Kubernetes", icon: <StackIcon name="kubernetes" /> },
      { name: "Linux", icon: <StackIcon name="linux" /> },
      { name: "Git", icon: <StackIcon name="git" /> },
      { name: "DigitalOcean", icon: <StackIcon name="digitalocean" /> },
      { name: "Colab", icon: <StackIcon name="colab" /> },
      { name: "Cloudflare", icon: <StackIcon name="cloudflare" /> },
    ],
  },
  {
    id: "tools-collaboration",
    name: "Tools & Collaboration",
    color: "#f59e0b",
    position: [-5, -2, 5],
    radius: 1.8,
    skills: [
      { name: "GitHub", icon: <StackIcon name="github" /> },
      { name: "GitLab", icon: <StackIcon name="gitlab" /> },
      { name: "Postman", icon: <StackIcon name="postman" /> },
      { name: "Jira", icon: <StackIcon name="jira" /> },
      { name: "Confluence", icon: <CustomIcon title="Confluence" src="icons/confluence-removebg-preview.png" /> },
      { name: "Figma", icon: <StackIcon name="figma" /> },
      { name: "Google ADK", icon: <CustomIcon title="Google ADK" src="/icons/agent-development-kit.png" /> },
    ],
  },
  {
    id: "leadership",
    name: "Leadership",
    color: "#ec4899",
    position: [0, 3, -4],
    radius: 2.2,
    skills: [
      { name: "Mentorship", icon: null },
      { name: "High Resiliency", icon: null },
      { name: "Appetite For Rejection", icon: null },
      { name: "Research", icon: null },
      { name: "Shipping Relentlessly", icon: null },
      { name: "Market Research", icon: null },
      { name: "High Agency", icon: null },
      { name: "Pitching", icon: null },
      { name: "Project Ownership", icon: null },
      { name: "Stakeholder Communication", icon: null },
    ],
  },
];
