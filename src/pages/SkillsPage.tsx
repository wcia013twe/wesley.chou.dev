import { Helmet } from "react-helmet-async";
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

const SkillsPage = () => {
  const [fallingTextKey, setFallingTextKey] = useState(0);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <Helmet>
        <title>Skills | Wesley Chou</title>
        <meta name="description" content="Welcome to Wesley Chou's skills." />
      </Helmet>

      <FloatingScrollPrompt />
      <div className="flex flex-col items-center justify-center ">
        <div className="mt-15 text-center">
          <SplitText
            text="Skills"
            className="text-5xl font-semibold text-center mb-2 pb-3"
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
            Technology and tools I use to bring ideas to life.
          </p>
        </div>
      </div>

      
      <div className="w-[50vw] h-[100vh]">
        <ScrollStack className="align-center no-scrollbar -mt-30">
          <ScrollStackCard
            title="Languages"
            images={[
              <StackIcon name="java" />,
              <StackIcon name="python" />,
              <StackIcon name="c++" />,
              <StackIcon name="typescript" />,
              <StackIcon name="js" />,
              <StackIcon name="html5" />,
              <StackIcon name="css3" />,
              <StackIcon name="bash" />,
            ]}
          />
          <ScrollStackCard
            title="Frontend"
            images={[
              <StackIcon name="react" />,
              <StackIcon name="jest" />,
              <StackIcon name="tailwindcss" />,
              <StackIcon name="nextjs" />,
              <StackIcon name="streamlit" />,
              <StackIcon name="materialui" />,
              <StackIcon name="shadcnui" />,
              <StackIcon name="flutter" />,
              <StackIcon name="vitejs" />,
            ]}
          />
          <ScrollStackCard
            title="Backend"
            images={[
              <StackIcon name="nodejs" />,
              <StackIcon name="spring" />,
              <StackIcon name="mongodb" />,
              <StackIcon name="postgresql" />,
              <StackIcon name="mysql" />,
              <StackIcon name="supabase" />,
              <StackIcon name="redis" />,
              <StackIcon name="graphql" />,
              <StackIcon name="firebase" />,
              <StackIcon name="langchain" />,
              <CustomIcon title="FastAPI" src="icons/fastapi.png" />,
            ]}
          />
          <ScrollStackCard
            title="Tools"
            images={[
              <StackIcon name="linux" />,
              <StackIcon name="vercel" />,
              <StackIcon name="kubernetes" />,
              <StackIcon name="git" />,
              <StackIcon name="postman" />,
              <StackIcon name="digitalocean" />,
              <StackIcon name="colab" />,
              <StackIcon name="docker" />,
              <CustomIcon
                title="Google ADK"
                src="/icons/agent-development-kit.png"
              />,
            ]}
          />
          <ScrollStackCard
            title="Platforms"
            images={[
              <StackIcon name="jira" />,
              <StackIcon name="confluence" />,
              <StackIcon name="gitlab" />,
              <StackIcon name="figma" />,
              <StackIcon name="github" />,
              <StackIcon name="digitalocean" />,
              <StackIcon name="colab" />,
              <StackIcon name="docker" />,
              <CustomIcon
                title="Google ADK"
                src="/icons/agent-development-kit.png"
              />,
            ]}
          />
          <ScrollStackItem itemClassName="bg-gray-900 text-xs border border-gray-700 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
            <h2 className="text-2xl font-semibold mb-4 text-white p-5">
              Leadership
            </h2>
            <FallingText
              key={fallingTextKey}
              text="Leadership|Mentorship|High Resiliency|Appetite For Rejection|Research|Shipping Relentlessly|Market Research|High Agency| Pitching|Agile|Project Ownership|Mentorship|Stakeholder Communication|Professional Development"
              trigger="click"
              backgroundColor="transparent"
              wireframes={false}
              gravity={0.56}
              fontSize="1.5rem"
              mouseConstraintStiffness={0.9}
            />
            <button
              type="button"
              onClick={() => setFallingTextKey((k: number) => k + 1)}
              className="absolute z-10 bottom-6 right-6 rounded-md  text-primary text-lg shadow hover:opacity-90 transition"
              aria-label="Scatter and reset bubbles"
            >
              <RiResetLeftFill />
            </button>
          </ScrollStackItem>
        </ScrollStack>
      </div>
    </div>
  );
};

export default SkillsPage;
