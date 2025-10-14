import { Helmet } from "react-helmet-async";
// import ScrollStack, { ScrollStackItem } from "@/components/ui/scroll-stack";
import SplitText from "../components/SplitText";
import ScrollStack, { ScrollStackItem } from "@/components/ScrollStack.tsx";
import PostHeader from "@/components/PostHeader";

const LinkedInPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <Helmet>
        <title>Posts | Wesley Chou</title>
        <meta name="description" content="Welcome to Wesley Chou's posts." />
      </Helmet>

      <div className="flex flex-col items-center justify-center ">
        <div className="mt-15 text-center">
          <SplitText
            text="Projects"
            className="text-5xl font-semibold text-center text-purple-500 mb-2 pb-3"
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
      </div>
      <div className="w-[75vw] h-screen -mt-25">
        <ScrollStack className="align-center no-scrollbar ">
          <ScrollStackItem itemClassName="bg-[#10141c] border border-gray-700 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <PostHeader
              name="Wesley Chou"
              title="Undergraduate Researcher | CS @ UCF"
              timeAgo="1w"
              profileImageUrl="https://placehold.co/48x48/CCCCCC/333333?text=WC"
            />
            <div className="p-6">
          
          <p className="text-white mb-4 leading-relaxed">
            Hi,
          </p>
          
          {/* Core Contribution Paragraph */}
          <p className="leading-relaxed text-white mb-4">
            Thrilled to share that I've joined <span className="text-cyan-300 font-semibold">CREOL, The College of Optics & Photonics</span>, as an Undergraduate Researcher under the guidance of <span className="text-cyan-300 font-semibold">Dr. Shin-Tson Wu</span>.
          </p>
          
          <p className="leading-relaxed text-white mb-4">
            I'll be collaborating with <span className="text-cyan-300 font-semibold">Luke Benoit</span> to research and develop power optimization techniques in AR glasses. This is an incredible opportunity to contribute my passion for **Computer Vision** and **Deep Learning** directly to advanced optical systems.
          </p>
          
          <p className="leading-relaxed text-white mb-4">
            I'm incredibly grateful to be working within a lab surrounded by top researchers and look forward to contributing to the future of **Augmented Reality**.
          </p>

            {/* 3. Tech Badges (Simulating Hashtags for Quick Scanning) */}
            <div className="mt-4 pt-2 border-t border-gray-700/50">
              <span className="text-xs font-medium text-purple-400 bg-purple-900/40 px-3 py-1 rounded-full border border-purple-700/50">
                #AR Optics
              </span>
              <span className="text-xs font-medium text-purple-400 bg-purple-900/40 px-3 py-1 rounded-full border border-purple-700/50 ml-2">
                #DeepLearning
              </span>
              <span className="text-xs font-medium text-purple-400 bg-purple-900/40 px-3 py-1 rounded-full border border-purple-700/50 ml-2">
                #ComputerVision
              </span>
              <span className="text-xs font-medium text-purple-400 bg-purple-900/40 px-3 py-1 rounded-full border border-purple-700/50 ml-2">
                #UCF Research #CREOL
              </span>
            </div>
      </div>
          </ScrollStackItem>
          <ScrollStackItem itemClassName="border">
            <h2>Card 2</h2>
            <p>This is the second card in the stack</p>
          </ScrollStackItem>
          <ScrollStackItem itemClassName="border">
            <h2>Card 3</h2>
            <p>This is the third card in the stack</p>
          </ScrollStackItem>
        </ScrollStack>
      </div>
    </div>
  );
};

export default LinkedInPage;

//Scroll stack for linkedin posts
