import SplitText from "../components/SplitText";
import Timeline from "@/components/Timeline";
import { professionalExperience, academicExperience } from "@/lib/experience";
import SolarSystem from "@/components/SolarSystem";

const ExperiencePage = () => {
  return (
    <div>
      <div className="my-15 text-center">
        <SplitText
          text="Experience"
          className="text-5xl font-semibold text-center  pb-3"
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
        <p className="text-lg text-center text-white">
          A snapshot of my professional journey, growth, and the amazing people
          I've worked with
        </p>
      </div>

      {/* 3D Solar System - For experimentation */}
      <div className="w-full h-screen my-16">
        <SolarSystem />
      </div>

      {/* Professional Experience Section */}
      {/* <div className="mt-16">
        <h2 className="text-4xl font-bold text-center text-white/90 mb-8">
          Professional Experience
        </h2>
        <Timeline data={professionalExperience} />
      </div> */}

      {/* Academic & Leadership Section */}
      {/* <div className="mt-20">
        <h2 className="text-4xl font-bold text-center text-white/90 mb-8">
          Academic & Leadership
        </h2>
        <Timeline data={academicExperience} />
      </div> */}
    </div>
  );
};

export default ExperiencePage;
