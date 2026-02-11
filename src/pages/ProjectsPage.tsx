import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "motion/react";

import SplitText from "@/components/SplitText";
import ProjectsGrid from "@/components/projects/ProjectsGrid";
import ProjectModal from "@/components/projects/ProjectModal";
import SolarSystem from "@/components/SolarSystem";
import { projects, type Project } from "@/data/projectsData";

const ProjectsPage = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <div className="min-h-screen relative">
      <Helmet>
        <title>Projects | Wesley Chou</title>
        <meta
          name="description"
          content="Explore my portfolio of projects including AI-powered platforms, web applications, and innovative solutions."
        />
      </Helmet>

      {/* Header Zone - Glassmorphic */}
      <div className="sticky top-0 z-40 bg-black/40 backdrop-blur-xl border-b border-purple-500/20 shadow-lg shadow-black/10">
        <div className="max-w-6xl mx-auto py-12 px-6 text-center">
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
          <motion.p
          className="text-lg text-white/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            Explore a selection of projects throughout my developer journey.
          </motion.p>
        </div>
      </div>

      {/* 3D Solar System - Interactive Projects Explorer */}
      <div className="w-full h-screen">
        <SolarSystem />
      </div>

      {/* 3D Grid Zone with Parallax */}
      {/* <ProjectsGrid projects={projects} onProjectClick={setSelectedProject} /> */}

      {/* Modal */}
      {/* <ProjectModal
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
      /> */}
    </div>
  );
};

export default ProjectsPage;
