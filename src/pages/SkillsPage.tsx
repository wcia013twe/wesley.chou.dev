import { Helmet } from "react-helmet-async";
import { motion } from "motion/react";
import SplitText from "../components/SplitText";
import TechGalaxy from "@/components/galaxy/TechGalaxy";

const SkillsPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Skills | Wesley Chou</title>
        <meta name="description" content="Welcome to Wesley Chou's skills." />
      </Helmet>

      {/* Header Zone - Glassmorphic (matching Projects page) */}
      <div className="sticky top-0 z-40 bg-black/40 backdrop-blur-xl border-b border-purple-500/20 shadow-lg shadow-black/10 w-full">
        <div className="max-w-6xl mx-auto py-12 px-6 text-center">
          <SplitText
            text="Skills"
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
            Technology and tools I use to bring ideas to life.
          </motion.p>
        </div>
      </div>

      {/* 3D Galaxy Canvas - fills remaining viewport space */}
      <div className="flex-1">
        <TechGalaxy />
      </div>
    </div>
  );
};

export default SkillsPage;
