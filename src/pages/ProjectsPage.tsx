import { Helmet } from "react-helmet-async";

import ProjectCard from "@/components/ProjectCard";

const ProjectsPage = () => {
  return (
    <div className="bg-[#0f1115] min-h-[120vh]">
      <Helmet>
        <title>Projects | Wesley Chou</title>
        <meta name="description" content="Welcome to Wesley Chou's Projects." />
      </Helmet>

      <div className="flex flex-col items-center justify-center mt-15">
        <div>
          <h1 className="text-4xl font-bold text-center mb-2 text-purple-500">Projects</h1>
          <p className="text-lg text-center">Check out some of the cool stuff I have built</p>
        </div>

          <div className="grid grid-cols-2 gap-6 mt-10 mb-20 w-full max-w-5xl">
            <ProjectCard 
              title="Sound Haus"
              description="Sound Haus is a desk and web platform that allows music artists to efficiently share their work and collaborate together"
              date="2025-8-18 - Present"
              imageUrl="src/assets/New-York-Maps-2024.webp"
              tech={["Electron", "React", "Gitea", "Docker", "Tailwind", "API", "WebApp"]}
              badgeColor="text-indigo-300" 
            />
            <ProjectCard 
              title="InsightAI"
              description="InsightAI utilizes eye tracking and AI-intelligence to help user experience developers update web components live"
              date="2025-9-27"
              imageUrl="src/assets/New-York-Maps-2024.webp"
              tech={["Python", "Pandas", "Mapbox", "React", "Tailwind", "API", "WebApp"]}
              badgeColor="text-blue-300" 
            />
            <ProjectCard 
              title="Sonara"
              description="Sonara is a dating platform for people moving into a new city to build new connections through voice"
              date="2025-9-20"
              imageUrl="src/assets/New-York-Maps-2024.webp"
              tech={["Python", "Pandas", "Mapbox", "React", "Tailwind", "API", "WebApp"]}
              badgeColor="text-lime-300" // Passing "yellow-300"
            />
             <ProjectCard 
              title="FitLink"
              description="FitLink is an AI-powered client management tool for personal trainers"
              date="2024-8-18 ~ 2025-5-04"
              imageUrl="src/assets/New-York-Maps-2024.webp"
              tech={["Python", "Pandas", "Mapbox", "React", "Tailwind", "API", "WebApp"]}
              badgeColor="text-red-300" 
            />
            <ProjectCard 
              title="FairMap"
              description="FairMap provides a map comparison of the congressional voting data"
              date="2025-10-10"
              imageUrl="src/assets/New-York-Maps-2024.webp"
              tech={["Python", "Pandas", "Mapbox", "React", "Tailwind", "API", "WebApp"]}
              badgeColor="text-blue-300" 
            />
            <ProjectCard 
              title="FairMap"
              description="FairMap provides a map comparison of the congressional voting data"
              date="2025-10-10"
              imageUrl="src/assets/New-York-Maps-2024.webp"
              tech={["Python", "Pandas", "Mapbox", "React", "Tailwind", "API", "WebApp"]}
              badgeColor="text-lime-300" // Passing "yellow-300"
            />
          </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
