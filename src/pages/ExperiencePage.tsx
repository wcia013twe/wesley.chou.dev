import React from "react";
import SplitText from "../components/SplitText";
import Timeline from "@/components/Timeline";
const ExperiencePage = () => {
  return (
    <div>
      <div className="mt-15 text-center">
        <SplitText
          text="Experience"
          className="text-5xl font-semibold text-center text-purple-300 mb-2"
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
      <Timeline />
    </div>
  );
};

export default ExperiencePage;
