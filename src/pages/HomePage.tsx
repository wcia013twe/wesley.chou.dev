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
import Particles from "@/components/Particles";

const MONO = "ui-monospace, SFMono-Regular, monospace";
const C_CYAN   = "#22d3ee";
const C_BRIGHT = "#67e8f9";
const C_DIM    = "rgba(34,211,238,0.45)";

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
      <section className="relative flex flex-col md:flex-row min-h-screen overflow-hidden">
        {/* Particles background layer */}
        <div className="absolute inset-0 z-50 pointer-events-none">
          <Particles
            particleColors={["#ffffff"]}
            particleCount={300}
            particleSpread={10}
            speed={0.1}
            particleBaseSize={50}
            moveParticlesOnHover={false}
            alphaParticles={false}
            disableRotation={false}
            pixelRatio={1}
          />
        </div>

        {/* Shared 3D background - spans both sections */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <SpaceshipScene />
        </div>

        {/* Left Section - subtle cyan glow overlay */}
        <div className="relative w-full md:w-1/2 h-[50vh] md:h-screen z-20">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/10 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Right Section - Text Content */}
        <div className="relative w-full md:w-1/2 flex flex-col items-start justify-center px-6 py-12 md:py-0 md:pl-12 z-20">
          <motion.div
            className="space-y-6 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1
              className="text-4xl md:text-6xl lg:text-7xl font-bold"
              style={{
                fontFamily:    MONO,
                letterSpacing: "0.06em",
                color:         "white",
                textShadow:    "0 0 30px rgba(34,211,238,0.5), 0 0 80px rgba(34,211,238,0.15)",
              }}
            >
              Hi, I'm Wesley Chou
            </h1>

            <div className="text-xl md:text-2xl lg:text-3xl">
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
                textColors={[C_BRIGHT]}
              />
            </div>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-wrap gap-4 pt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Link to="/experience">
                <motion.button
                  className="inline-flex items-center gap-3 px-6 py-3 md:py-4 border border-cyan-400/50 bg-cyan-400/5 text-cyan-400 hover:bg-cyan-400/10 hover:border-cyan-300/70 hover:text-cyan-300 transition-all duration-250"
                  style={{
                    fontFamily:    MONO,
                    fontSize:      "13px",
                    letterSpacing: "0.25em",
                    textTransform: "uppercase",
                  }}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  View Experience
                  <FaArrowRight size={12} />
                </motion.button>
              </Link>

              <a href="mailto:wcia013twe@gmail.com">
                <motion.button
                  className="inline-flex items-center gap-3 px-6 py-3 md:py-4 border border-cyan-400/20 text-cyan-400/55 hover:border-cyan-400/45 hover:text-cyan-400 transition-all duration-250"
                  style={{
                    fontFamily:    MONO,
                    fontSize:      "13px",
                    letterSpacing: "0.25em",
                    textTransform: "uppercase",
                  }}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Contact Me
                  <MdEmail size={14} />
                </motion.button>
              </a>
            </motion.div>
          </motion.div>

          <div className="absolute bottom-8 left-6">
            <ScrollIndicator />
          </div>
        </div>
      </section>

      {/* Feature Cards Zone */}
      <section className="relative z-10 bg-black px-6 py-20">
        {/* Starfield */}
        <div className="absolute inset-0 pointer-events-none">
          <Particles
            particleColors={["#ffffff"]}
            particleCount={200}
            particleSpread={10}
            speed={0.1}
            particleBaseSize={50}
            moveParticlesOnHover={false}
            alphaParticles={false}
            disableRotation={false}
            pixelRatio={1}
          />
        </div>
        <div className="relative max-w-7xl mx-auto">
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
        </div>
      </section>

      {/* Quick Links Footer */}
      <footer
        className="relative z-10"
        style={{ borderTop: "1px solid rgba(34,211,238,0.10)", background: "#000" }}
      >
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Row 1: Social Icons */}
          <div className="flex justify-center gap-5 mb-5">
            <a
              href="https://github.com/wcia013twe"
              aria-label="GitHub"
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xl transition-all duration-200 hover:scale-110 hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]"
              style={{ color: C_DIM }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = C_BRIGHT)}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = C_DIM)}
            >
              <FaGithub />
            </a>
            <a
              href="https://www.linkedin.com/in/weschou013/"
              aria-label="LinkedIn"
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xl transition-all duration-200 hover:scale-110 hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]"
              style={{ color: C_DIM }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = C_BRIGHT)}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = C_DIM)}
            >
              <FaLinkedin />
            </a>
            <a
              href="documents/IWesChouResume2026_1120.pdf"
              aria-label="Resume"
              className="text-2xl transition-all duration-200 hover:scale-110 hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]"
              style={{ color: C_DIM }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = C_BRIGHT)}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = C_DIM)}
            >
              <CgFileDocument />
            </a>
          </div>

          {/* Row 2: Copyright & Navigation */}
          <div
            className="flex flex-col md:flex-row justify-center items-center gap-4"
            style={{
              fontFamily:    MONO,
              fontSize:      "10px",
              letterSpacing: "0.2em",
              textTransform: "uppercase" as const,
              color:         "rgba(34,211,238,0.3)",
            }}
          >
            <p>© 2025 Wesley Chou</p>
            <div className="flex gap-3 items-center">
              {[
                { to: "/experience", label: "Experience" },
                { to: "/projects",   label: "Projects"   },
                { to: "/skills",     label: "Skills"     },
              ].map(({ to, label }, i, arr) => (
                <span key={to} className="flex items-center gap-3">
                  <Link
                    to={to}
                    className="transition-colors duration-200"
                    style={{ color: "rgba(34,211,238,0.3)", textDecoration: "none" }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.color = C_CYAN;
                      (e.currentTarget as HTMLElement).style.textShadow = `0 0 8px ${C_CYAN}`;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.color = "rgba(34,211,238,0.3)";
                      (e.currentTarget as HTMLElement).style.textShadow = "none";
                    }}
                  >
                    {label}
                  </Link>
                  {i < arr.length - 1 && (
                    <span style={{ color: "rgba(34,211,238,0.15)" }}>·</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
