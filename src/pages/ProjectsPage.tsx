import { Helmet } from "react-helmet-async";

import ProjectCard from "@/components/ProjectCard";
import SplitText from "../components/SplitText";

const ProjectsPage = () => {
  return (
    <div className="min-h-[120vh]">
      <Helmet>
        <title>Projects | Wesley Chou</title>
        <meta name="description" content="Welcome to Wesley Chou's Projects." />
      </Helmet>

      <div className="flex flex-col items-center justify-center">
        <div className="mt-15 text-center">
          <SplitText
            text="Projects"
            className="text-5xl font-semibold text-center pb-3"
            delay={100}
            duration={0.4}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-100px"
            textAlign="center"
          />
          <p className="text-lg text-center">
            Explore a selection of projects throughout my developer journey.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 mt-10 mb-20 w-full max-w-5xl">
          <ProjectCard
            badge={true}
            title="Emergent"
            description="An AI-powered crisis simulation platform enabling emergency managers to test plans against a dynamic community of 50+ intelligent personas using Google ADK agents. Features interactive GIS mapping, real-time agent simulation, and emergent disaster scenarios."
            date="2025-10-24"
            imageUrl="assets/projects/emergent.png"
            detailsUrl="https://devpost.com/software/emergent-b2t1fl"
            tech={[
              "Next.js 14",
              "TypeScript",
              "React",
              "Tailwind CSS",
              "Python",
              "FastAPI",
              "Google ADK",
              "Parallel Processing",
            ]}
            badgeColor="text-indigo-300"
          />
          <ProjectCard
            title="InsightAI"
            description="A real-time attention-driven UX optimization tool using eye tracking and AI to help developers build more accessible websites. Developers rank component importance, InsightAI measures user attention, identifies mismatches, and uses Gemini AI to suggest concrete HTML improvements applied instantly. Generates comprehensive performance summaries for informed design decisions."
            date="2025-9-27"
            imageUrl="assets/projects/insightAI.png"
            detailsUrl="https://devpost.com/software/emergent-b2t1fl"
            tech={[
              "Python",
              "Python Tkinter",
              "Eye Tracking",
              "Gemini API",
              "MongoDB",
              "TensorFlow",
              "OpenCV",
              "Accessibility",
            ]}
            badgeColor="text-blue-300"
          />
          <ProjectCard
            title="Sonara"
            description="Sonara is a dating platform for people moving into a new city to build new connections through voice"
            date="2025-9-20"
            imageUrl="assets/projects/Sonara.png"
            detailsUrl="https://devpost.com/software/sonara-2xvnh0"
            tech={[
              "Next.js 15",
              "Tailwind CSS",
              "Gemini",
              "Websockets",
              "Tailwind",
              "AI Contextualization",
              "Supabase",
            ]}
            badgeColor="text-lime-300" // Passing "yellow-300"
            />
            <ProjectCard
            title="FitLink"
            description="FitLink is an AI-powered client management tool for personal trainers"
            date="2024-8-18 ~ 2025-5-04"
            imageUrl="assets/projects/FitLink.png"
            detailsUrl="https://github.com/wcia013twe/FitLink"
            tech={[
              "React",
              "Flutter",
              "Firebase",
              "Express.js",
              "Node.js",
              "MongoDB",
              "Google Calender APIs",
            ]}
            badgeColor="text-red-300"
            />
            <ProjectCard
            title="FairMap"
            description="FairMap provides a map comparison of the congressional voting data"
            date="2025-10-10"
            imageUrl="assets/projects/doesmyvotematter.jpg"
            detailsUrl="https://devpost.com/software/does-my-vote-matter-1r2g3d"
            tech={[
              "Python",
              "Django",
              "SQLite",
              "HTML",
              "CSS",
              "JavaScript",
              "Census API",
            ]}
            badgeColor="text-blue-300"
            />
            <ProjectCard
            title="FindMyFriend"
            description="FindMyFriend is a LAMP stack project for tracking your friends' locations."
            date="2025-10-10"
            imageUrl="assets/projects/FindMyFriend.png"
            detailsUrl="https://github.com/wcia013twe/FindMyFriend"
            tech={[
              "Linux",
              "Apache",
              "MySQL",
              "PHP",
              "JavaScript",
              "HTML",
              "CSS",  
            ]}
            badgeColor="text-lime-300"
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
