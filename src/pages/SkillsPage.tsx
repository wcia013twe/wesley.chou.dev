import { Helmet } from "react-helmet-async";
import { motion } from "motion/react";
// import ScrollStack, { ScrollStackItem } from "@/components/ui/scroll-stack";
import SplitText from "../components/SplitText";
import ScrollStack, { ScrollStackItem } from "@/components/ScrollStack.tsx";

import ScrollStackCard from "@/components/ScrollStackCard";
import StackIcon from "tech-stack-icons";
import CustomIcon from "@/components/CustomIcon";
import FallingText from "@/components/FallingText";
import { RiResetLeftFill } from "react-icons/ri";
import { useState } from "react";
import FloatingScrollPrompt from "@/components/FloatingScrollPrompt";
import SpaceshipDiagram from "@/components/SpaceshipDiagram";

const SkillsPage = () => {
  const [fallingTextKey, setFallingTextKey] = useState(0);

  return (
    // <div className="min-h-screen flex flex-col items-center justify-center">
    //   <Helmet>
    //     <title>Skills | Wesley Chou</title>
    //     <meta name="description" content="Welcome to Wesley Chou's skills." />
    //   </Helmet>

    //   <FloatingScrollPrompt />

    //   {/* Header Zone - Glassmorphic (matching Projects page) */}
    //   <div className="sticky top-0 z-40 bg-black/40 backdrop-blur-xl border-b border-purple-500/20 shadow-lg shadow-black/10 w-full">
    //     <div className="max-w-6xl mx-auto py-12 px-6 text-center">
    //       <SplitText
    //         text="Skills"
    //         className="text-5xl font-semibold text-center pb-3"
    //         delay={100}
    //         duration={0.4}
    //         ease="power3.out"
    //         splitType="chars"
    //         from={{ opacity: 0, y: 40 }}
    //         to={{ opacity: 1, y: 0 }}
    //         threshold={0.1}
    //         rootMargin="-100px"
    //         textAlign="center"
    //       />
    //       <motion.p
    //         className="text-lg text-white/80"
    //         initial={{ opacity: 0 }}
    //         animate={{ opacity: 1 }}
    //         transition={{ delay: 0.6, duration: 0.6 }}
    //       >
    //         Technology and tools I use to bring ideas to life.
    //       </motion.p>
    //     </div>
    //   </div>

      
    //   <div className="w-[50vw] h-[100vh]">
    //     <ScrollStack className="align-center no-scrollbar -mt-30">
    //       <ScrollStackCard
    //         title="Languages & Frontend"
    //         images={[
    //           <StackIcon name="java" />,
    //           <StackIcon name="python" />,
    //           <StackIcon name="c++" />,
    //           <StackIcon name="typescript" />,
    //           <StackIcon name="js" />,
    //           <StackIcon name="html5" />,
    //           <StackIcon name="css3" />,
    //           <StackIcon name="react" />,
    //           <StackIcon name="tailwindcss" />,
    //           <StackIcon name="nextjs" />,
    //           <StackIcon name="flutter" />,
    //         ]}
    //       />
    //       <ScrollStackCard
    //         title="Backend & Databases"
    //         images={[
    //           <StackIcon name="nodejs" />,
    //           <StackIcon name="spring" />,
    //           <CustomIcon title="FastAPI" src="icons/fastapi.png" />,
    //           <StackIcon name="langchain" />,
    //           <StackIcon name="mongodb" />,
    //           <StackIcon name="postgresql" />,
    //           <StackIcon name="mysql" />,
    //           <StackIcon name="supabase" />,
    //           <StackIcon name="supabase" />,
    //         ]}
    //       />
    //       <ScrollStackCard
    //         title="DevOps & Infrastructure"
    //         images={[
    //           <StackIcon name="docker" />,
    //           <StackIcon name="kubernetes" />,
    //           <StackIcon name="linux" />,
    //           <StackIcon name="git" />,
    //           <StackIcon name="digitalocean" />,
    //           <StackIcon name="colab" />,
    //            <StackIcon name="cloudflare" />,
    //         ]}
    //       />
    //       <ScrollStackCard
    //         title="Tools & Collaboration"
    //         images={[
    //           <StackIcon name="github" />,
    //           <StackIcon name="gitlab" />,
    //           <StackIcon name="postman" />,
    //           <StackIcon name="jira" />,
    //           <CustomIcon
    //             title="Confluence"
    //             src="icons/confluence-removebg-preview.png"
    //           />,
    //           <StackIcon name="figma" />,
    //           <CustomIcon
    //             title="Google ADK"
    //             src="/icons/agent-development-kit.png"
    //           />,
    //         ]}
    //       />
    //       <ScrollStackItem itemClassName="bg-gray-900 text-xs border border-gray-700 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
    //         <h2 className="text-2xl font-semibold mb-4 text-white p-5">
    //           Leadership
    //         </h2>
    //         <FallingText
    //           key={fallingTextKey}
    //           text="Mentorship|High Resiliency|Appetite For Rejection|Research|Shipping Relentlessly|Market Research|High Agency| Pitching|Project Ownership|Mentorship|Stakeholder Communication"
    //           trigger="click"
    //           backgroundColor="transparent"
    //           wireframes={false}
    //           gravity={0.56}
    //           fontSize="1.5rem"
    //           mouseConstraintStiffness={0.9}
    //         />
    //         <button
    //           type="button"
    //           onClick={() => setFallingTextKey((k: number) => k + 1)}
    //           className="absolute z-10 bottom-6 right-6 rounded-md  text-primary text-lg shadow hover:opacity-90 transition"
    //           aria-label="Scatter and reset bubbles"
    //         >
    //           <RiResetLeftFill />
    //         </button>
    //       </ScrollStackItem>
    //     </ScrollStack>
    //   </div>
    // </div>
    <>
      {/* Spaceship Diagram — interactive systems overlay */}
      <SpaceshipDiagram />
    </>
  );
};

export default SkillsPage;
