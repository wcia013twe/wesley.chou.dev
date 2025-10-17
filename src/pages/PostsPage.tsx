import { Helmet } from "react-helmet-async";
// import ScrollStack, { ScrollStackItem } from "@/components/ui/scroll-stack";
import SplitText from "../components/SplitText";
import ScrollStack, { ScrollStackItem } from "@/components/ScrollStack.tsx";
import PostHeader from "@/components/PostHeader";
import ScrollStackCard from "@/components/ScrollStackCard";

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
            className="text-5xl font-semibold text-center text-purple-400 mb-2 pb-3"
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
          <ScrollStackCard />
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
