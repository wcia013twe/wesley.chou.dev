import PixelBlast from "@/components/PixelBlast";
import SplitText from "../components/SplitText";
import TextType from "../components/TextType";
import FloatingScrollPrompt from "@/components/FloatingScrollPrompt";
import { Button } from "@headlessui/react";
import { MdEmail } from "react-icons/md";
import { GiJourney } from "react-icons/gi";
import { ImHappy2 } from "react-icons/im";

const handleAnimationComplete = () => {
  console.log("All letters have animated!");
};

const HomePage = () => {
  return (
    // The outermost container (it should not have a position class)
    <div>
      <div className="fixed inset-0 -z-20 bg-black/50">
        <PixelBlast />
      </div>

      {/* <div className="fixed inset-0 -z-10 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,0.55)_100%)]" /> */}

      <div className="relative z-10 mx-auto max-w-3xl px-6 pt-24 pb-40 space-y-24 min-h-[200vh]">
        <section className="space-y-4 text-center text-white">
          <h1>
            <SplitText
              text="Hello All👋!"
              className="text-4xl font-semibold text-center"
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
          <p className="mx-auto max-w-prose text-base leading-relaxed text-white">
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
            <Button className="inline-flex items-center gap-2 rounded-md bg-gray-700 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-600 data-open:bg-gray-700">
              {" "}
              About Me
              <ImHappy2 />
            </Button>
            <Button className="inline-flex items-center gap-2 rounded-md bg-purple-500 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-600 data-open:bg-gray-700">
              {" "}
              Contact Me
              <MdEmail />
            </Button>
          </div>
        </section>

        <FloatingScrollPrompt />

        <section className="space-y-4 text-white mt-50">
          <h2 className="text-2xl font-semibold text-white/90">About Me👨‍💻</h2>
          <p className="max-w-prose text-sm leading-relaxed text-white">
            I'm a Computer Science senior at{" "}
            <a
              href="https://www.ucf.edu/"
              className="text-yellow-300 underline"
            >
              University of Central Florida
            </a>{" "}
            , working at the intersection of software engineering, AI, and
            entrepreneurship. 
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <button className="rounded-md bg-white/10 px-4 py-2 text-xs font-medium text-white backdrop-blur hover:bg-white/15 transition">
              Action
            </button>
            <button className="rounded-md bg-white/5 px-4 py-2 text-xs font-medium text-white backdrop-blur hover:bg-white/10 transition">
              Secondary
            </button>
          </div>
        </section>

        <section className="space-y-4 text-white">
          <h2 className="text-2xl font-semibold text-white/90">
            Longer Content
          </h2>
          <p className="max-w-prose text-sm leading-relaxed text-white/70">
            Add more sections to extend the scroll length. The fixed canvas
            underneath renders once per frame but never reflows. If performance
            becomes a concern, you can pause rendering when scrolled beyond a
            threshold or when the tab is hidden.
          </p>
          <ul className="list-disc pl-5 text-white/60 text-sm space-y-1">
            <li>Easy layering with z-index</li>
            <li>Readable text via radial gradient overlay</li>
            <li>Independent scroll performance</li>
            <li>Future: parallax or dynamic blur on scroll</li>
          </ul>
        </section>

        <section className="space-y-4 pb-10 text-white">
          <h2 className="text-2xl font-semibold text-white/90">Next Ideas</h2>
          <p className="max-w-prose text-sm leading-relaxed text-white/70">
            Want more depth? We can add a slow zoom, hue shifting, cursor
            reactive ripples, or performance switches that pause animation when
            the tab is in the background.
          </p>
          {/* This large div ensures the total page height exceeds the viewport, enabling scroll */}
          <div className="h-[100vh]"></div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
