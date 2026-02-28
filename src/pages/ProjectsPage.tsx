import { Helmet } from "react-helmet-async";

import SolarSystem from "@/components/SolarSystem";

const ProjectsPage = () => (
  <div className="min-h-screen relative">
    <Helmet>
      <title>Projects | Wesley Chou</title>
      <meta
        name="description"
        content="Explore my portfolio of projects including AI-powered platforms, web applications, and innovative solutions."
      />
    </Helmet>

    <div className="relative w-full h-screen">
      <SolarSystem />
    </div>
  </div>
);

export default ProjectsPage;
