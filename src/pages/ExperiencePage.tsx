import SplitText from "../components/SplitText";
import Timeline from "@/components/Timeline";
import { professionalExperience, academicExperience } from "@/lib/experience";
const ExperiencePage = () => {
  return (
    <div className="relative">
      <div className="fixed inset-0 z-0 bg-black/40" aria-hidden="true" />

      {/* Page content */}
      <div className="relative z-10">
      <div className="mt-6 mb-12 text-center">
        <SplitText
          text="Experience"
          className="text-6xl font-semibold text-center pb-3"
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
        <p className="text-xl text-center text-white">
          A snapshot of my professional journey, growth, and the amazing people
          I've worked with
        </p>
      </div>

      {/* Professional Experience Section */}
      <div className="mt-16">
        <h2 className="text-4xl font-bold text-center text-white/90 mb-8">
          Professional Experience
        </h2>
        <Timeline data={professionalExperience} />
      </div>

      {/* Academic & Leadership Section */}
      <div className="mt-20">
        <h2 className="text-4xl font-bold text-center text-white/90 mb-8">
          Academic & Leadership
        </h2>
        <Timeline data={academicExperience} />
      </div>
      </div>
    </div>
  );
};

export default ExperiencePage;
