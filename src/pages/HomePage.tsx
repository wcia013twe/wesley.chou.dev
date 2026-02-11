import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MdEmail } from "react-icons/md";
import { FaArrowRight, FaGithub, FaLinkedin } from "react-icons/fa";
import { CgFileDocument } from "react-icons/cg";
import SpaceshipScene from "@/components/SpaceshipScene";
import FeatureCard from "@/components/FeatureCard";
import ScrollIndicator from "@/components/ScrollIndicator";
import TextType from "@/components/TextType";

const HomePage = () => {
  return (
    <div className="">
      <Helmet>
        <title>Home | Wesley Chou</title>
        <meta
          name="description"
          content="Portfolio of Wesley Chou - Software Engineer, AR Researcher, and Founder"
        />
      </Helmet>


      {/* Hero Zone - Split Screen */}
      <section className="flex flex-col md:flex-row min-h-screen">
        {/* Left Section - 3D Spaceship */}
        <div className="relative w-full md:w-1/2 h-[50vh] md:h-screen bg-gradient-to-br from-purple-900/20 via-black to-black">
          <SpaceshipScene />
        </div>

        {/* Right Section - Text Content */}
        <div className="relative w-full md:w-1/2 flex flex-col items-center justify-center px-6 py-12 md:py-0 bg-black">
          <motion.div
            className="text-center space-y-6 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white drop-shadow-lg">
              Hi, I'm Wesley Chou
            </h1>

            <div className="text-2xl md:text-4xl text-white/90">
              <TextType
                text={[
                  "Software Engineer",
                  "AR Researcher",
                  "Founder",
                ]}
                typingSpeed={50}
                pauseDuration={1500}
                showCursor={true}
                cursorCharacter="|"
              />
            </div>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-wrap gap-4 justify-center pt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Link to="/experience">
                <motion.button
                  className="inline-flex items-center gap-2 px-4 py-3 md:px-6 md:py-4 text-lg md:text-xl font-semibold bg-purple-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  View Experience
                  <FaArrowRight />
                </motion.button>
              </Link>

              <a href="mailto:wcia013twe@gmail.com">
                <motion.button
                  className="inline-flex items-center gap-2 px-4 py-3 md:px-6 md:py-4 text-lg md:text-xl font-semibold bg-transparent border-2 border-white text-white rounded-lg hover:bg-white/10 transition-colors"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Contact Me
                  <MdEmail />
                </motion.button>
              </a>
            </motion.div>
          </motion.div>

          <div className="absolute bottom-8">
            <ScrollIndicator />
          </div>
        </div>
      </section>

      {/* Feature Cards Zone */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.15,
              },
            },
          }}
        >
          <FeatureCard
            title="About Me"
            description="My name is Wei-Lin, but you can call me Wes! I'm a Computer Science senior at University of Central Florida, working at the intersection of software engineering, AI, and entrepreneurship."
            imageSrc="assets/gallery/pfp.jpg"
          />

          <FeatureCard
            title="My Journey"
            description="In my short two years at UCF, I have deepened my passion for technology, particularly through exploring machine learning, modern software development, and entrepreneurial ventures."
            imageSrc="assets/gallery/korea.jpg"
          />

          <FeatureCard
            title="My Interests"
            description="I am an outgoing engineer who is passionate about all things AI and latest tech trends. When I step away from the keyboard, I love hiking, volleyball, playing board games, or planning my next trip abroad!"
            imageSrc="assets/gallery/duck.jpeg"
          />
        </motion.div>
      </section>

      {/* Quick Links Footer */}
      <footer className="relative z-10 bg-black/80 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Row 1: Social Icons */}
          <div className="flex justify-center gap-4 mb-4">
            <a
              href="https://github.com/wcia013twe"
              aria-label="GitHub"
              target="_blank"
              rel="noopener noreferrer"
              className="text-3xl text-white/80 hover:text-purple-500 hover:scale-110 transition-all"
            >
              <FaGithub />
            </a>
            <a
              href="https://www.linkedin.com/in/weschou013/"
              aria-label="LinkedIn"
              target="_blank"
              rel="noopener noreferrer"
              className="text-3xl text-white/80 hover:text-purple-500 hover:scale-110 transition-all"
            >
              <FaLinkedin />
            </a>
            <a
              href="documents/IWesChouResume2026_1120.pdf"
              aria-label="Resume"
              className="text-3xl text-white/80 hover:text-purple-500 hover:scale-110 transition-all"
            >
              <CgFileDocument />
            </a>
          </div>

          {/* Row 2: Copyright & Navigation */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 text-sm text-white/60">
            <p>© 2025 Wesley Chou</p>
            <div className="flex gap-2">
              <Link to="/experience" className="hover:text-purple-500 hover:underline transition-colors">
                Experience
              </Link>
              <span>|</span>
              <Link to="/projects" className="hover:text-purple-500 hover:underline transition-colors">
                Projects
              </Link>
              <span>|</span>
              <Link to="/skills" className="hover:text-purple-500 hover:underline transition-colors">
                Skills
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
