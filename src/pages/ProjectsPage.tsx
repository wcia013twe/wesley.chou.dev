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
            className="text-5xl font-semibold text-center text-purple-500 mb-2"
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
            title="Sound Haus"
            description="Sound Haus is a desk and web platform that allows music artists to efficiently share their work and collaborate together"
            date="2025-8-18 - Present"
            imageUrl="src/assets/New-York-Maps-2024.webp"
            tech={[
              "Electron",
              "React",
              "Gitea",
              "Docker",
              "Tailwind",
              "API",
              "WebApp",
            ]}
            badgeColor="text-indigo-300"
          />
          <ProjectCard
            title="InsightAI"
            description="InsightAI utilizes eye tracking and AI-intelligence to help user experience developers update web components live"
            date="2025-9-27"
            imageUrl="src/assets/New-York-Maps-2024.webp"
            tech={[
              "Python",
              "Pandas",
              "Mapbox",
              "React",
              "Tailwind",
              "API",
              "WebApp",
            ]}
            badgeColor="text-blue-300"
          />
          <ProjectCard
            title="Sonara"
            description="Sonara is a dating platform for people moving into a new city to build new connections through voice"
            date="2025-9-20"
            imageUrl="src/assets/New-York-Maps-2024.webp"
            tech={[
              "Python",
              "Pandas",
              "Mapbox",
              "React",
              "Tailwind",
              "API",
              "WebApp",
            ]}
            badgeColor="text-lime-300" // Passing "yellow-300"
          />
          <ProjectCard
            title="FitLink"
            description="FitLink is an AI-powered client management tool for personal trainers"
            date="2024-8-18 ~ 2025-5-04"
            imageUrl="src/assets/New-York-Maps-2024.webp"
            tech={[
              "Python",
              "Pandas",
              "Mapbox",
              "React",
              "Tailwind",
              "API",
              "WebApp",
            ]}
            badgeColor="text-red-300"
          />
          <ProjectCard
            title="FairMap"
            description="FairMap provides a map comparison of the congressional voting data"
            date="2025-10-10"
            imageUrl="src/assets/New-York-Maps-2024.webp"
            tech={[
              "Python",
              "Pandas",
              "Mapbox",
              "React",
              "Tailwind",
              "API",
              "WebApp",
            ]}
            badgeColor="text-blue-300"
          />
          <ProjectCard
            title="FairMap"
            description="FairMap provides a map comparison of the congressional voting data"
            date="2025-10-10"
            imageUrl="src/assets/New-York-Maps-2024.webp"
            tech={[
              "Python",
              "Pandas",
              "Mapbox",
              "React",
              "Tailwind",
              "API",
              "WebApp",
            ]}
            badgeColor="text-lime-300" // Passing "yellow-300"
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
