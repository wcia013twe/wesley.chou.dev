import PixelBlast from "@/components/PixelBlast";
import SplitText from "../components/SplitText";
import TextType from "../components/TextType";
import FloatingScrollPrompt from "@/components/FloatingScrollPrompt";
import { Button } from "@headlessui/react";
import { MdEmail } from "react-icons/md";
import { ImHappy2 } from "react-icons/im";
import { Helmet } from "react-helmet-async";

const handleAnimationComplete = () => {
  console.log("All letters have animated!");
};

const HomePage = () => {
  return (
    // The outermost container (it should not have a position class)
    <div className="">
      <Helmet>
        <title>Home | Wesley Chou</title>
        <meta
          name="description"
          content="Welcome to Wesley Chou's portfolio."
        />
      </Helmet>

      <div className="fixed inset-0 -z-20 bg-black/50">
        <PixelBlast color="#a78bfa" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 pt-50 pb-40 space-y-24 min-h-[200]">
        <section className="space-y-4 text-center text-white">
          <h1>
            <SplitText
              text="Hello there👋!"
              className="text-6xl font-semibold text-center"
              delay={100}
              duration={0.4}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 40 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.1}
              rootMargin="-100px"
              textAlign="center"
              onLetterAnimationComplete={handleAnimationComplete}
            />
          </h1>
          <p className="mx-auto max-w-prose text-3xl leading-relaxed text-white">
            Hi, I'm <strong>Wesley Chou</strong>, and I am a
            <br />
            <TextType
              text={[
                "Software Engineer",
                "Augmented Reality Researcher",
                "Startup Enthusiast",
              ]}
              typingSpeed={50}
              pauseDuration={1500}
              showCursor={true}
              cursorCharacter="|"
            />
          </p>
          <div className="flex flex-wrap gap-3 pt-2 justify-center mx-auto w-fit">
            <Button className="inline-flex items-center gap-2 rounded-md bg-gray-700 px-4 py-3 text-2xl font-semibold text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-600 data-open:bg-gray-700">
              {" "}
              About Me
              <ImHappy2 />
            </Button>
            <Button className="inline-flex items-center gap-2 rounded-md bg-purple-500 px-4 py-3 text-2xl font-semibold text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-600 data-open:bg-gray-700">
              {" "}
              Contact Me
              <MdEmail />
            </Button>
          </div>
        </section>

        <FloatingScrollPrompt />

        <section className="flex flex-col md:flex-row items-center gap-8 text-white mt-100">
          <div className="flex-1">
            <h2 className="text-5xl font-semibold text-white/90 mb-10">
              About Me
            </h2>
            <p className="max-w-prose text-2xl leading-relaxed text-white">
              My name is Wei-Lin, but you can call me Wes! I'm a Computer
              Science senior at{" "}
              <a
                href="https://www.ucf.edu/"
                className="text-yellow-300 underline"
              >
                University of Central Florida
              </a>
              , working at the intersection of software engineering, AI, and
              entrepreneurship. 
            </p>
          </div>
          <div className="flex-1 flex justify-center">
            <img
              src="src/assets/pfp.jpg"
              alt="profile picture"
              className="w-100 h-100 object-cover rounded-full border-4 border-yellow-300 shadow-lg"
            />
          </div>
        </section>

        <section className="flex flex-col md:flex-row items-center gap-8 text-white">
          <div className="flex-1">
            <h2 className="text-5xl font-semibold text-white/90 mb-10">
              My Journey
            </h2>
            <p className="max-w-prose text-2xl leading-relaxed text-white">
              In my short two-years at UCF, I have deepened my passion for
              technology, particularly through exploring machine learning,
              modern software development, and entrepreneurial ventures. 
            </p>
          </div>
          <div className="flex-1 flex justify-center">
            <img
              src="src/assets/ucf.avif"
              alt="profile picture"
              className="w-100 h-100 object-cover rounded-full border-4 border-yellow-300 shadow-lg"
            />
          </div>
        </section>

        <section className="flex flex-col md:flex-row items-center gap-8 text-white">
          <div className="flex-1">
            <h2 className="text-5xl font-semibold text-white/90 mb-10">
              My Interests
            </h2>
            <p className="max-w-prose text-2xl leading-relaxed text-white">
              I am an outgoing engineer who is passionate about all things
              AI and latest tech trends. When I step away from
              the keyboard, I love hiking, volleyball, playing board games, or
              planning my next trip abroad!
            </p>
          </div>
          <div className="flex-1 flex justify-center">
            <img
              src="src/assets/IMG_8569.jpg"
              alt="profile picture"
              className="w-100 h-100 object-cover rounded-full border-4 border-yellow-300 shadow-lg"
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
