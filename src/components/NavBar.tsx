import { Tab, TabGroup, TabList } from "@headlessui/react";
import { Link } from "react-router-dom";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { CgFileDocument } from "react-icons/cg";
import { LuRocket } from "react-icons/lu";

import {
  Tooltip,
  TooltipTrigger,
  TooltipPanel,
} from "@/components/animate-ui/components/base/tooltip";

function Navbar() {
  const TAB_CLASS = "rounded-full px-5 py-2.5 text-lg font-semibold text-white/70 border border-transparent transition-all duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 data-hover:bg-white/10 data-hover:border-white/10 data-hover:text-white data-hover:scale-105 data-selected:bg-gradient-to-r data-selected:from-purple-600 data-selected:to-purple-500 data-selected:text-white data-selected:shadow-lg data-selected:shadow-purple-500/50 data-selected:scale-105 motion-reduce:scale-100 motion-reduce:transition-colors";

  return (
    <TabGroup>
      <div className="fixed top-0 left-0 z-50 flex h-[var(--nav-height)] w-full items-center justify-between border-b border-purple-500/20 bg-[var(--color-bg)]/60 backdrop-blur-xl supports-[backdrop-filter]:bg-[var(--color-bg)]/60 shadow-lg shadow-black/10 px-6 font-sans text-xl font-medium tracking-wide text-[var(--color-fg)] transition-all duration-300">
        {/* Tabs */}
        <Link
          to="/"
          aria-label="Navigate to home page"
          className="flex items-center gap-2 px-6 group transition-all duration-300"
        >
          <LuRocket className="text-3xl transition-all duration-300 group-hover:text-purple-500 group-hover:-translate-y-1 group-hover:-rotate-12 group-hover:drop-shadow-[0_0_8px_rgba(147,51,234,0.6)] motion-reduce:transform-none motion-reduce:drop-shadow-none"/>
          <p className="text-2xl transition-all duration-300 group-hover:text-purple-500 group-hover:tracking-wider motion-reduce:tracking-normal">Wesley Chou</p>
        </Link>
        <TabList className="flex items-center gap-1">
          <Tab
            className={TAB_CLASS}
            as={Link}
            to="/"
          >
            Home
          </Tab>
          <Tab
            className={TAB_CLASS}
            as={Link}
            to="/experience"
          >
            Experience
          </Tab>
          <Tab
            className={TAB_CLASS}
            as={Link}
            to="/projects"
          >
            Projects
          </Tab>
          <Tab
            className={TAB_CLASS}
            as={Link}
            to="/skills"
          >
            Skills
          </Tab>
 
        </TabList>
        {/* Icons */}
        <div className="flex items-center gap-3 border-l border-purple-500/20 pl-3">
          <Tooltip>
            <TooltipTrigger
              render={
                <a
                  href="https://github.com/wcia013twe"
                  aria-label="GitHub"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex p-2.5 rounded-lg text-white/80 hover:text-purple-500 hover:bg-purple-500/20 hover:backdrop-blur-sm hover:scale-110 hover:rotate-6 hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-250 motion-reduce:scale-100 motion-reduce:rotate-0 motion-reduce:shadow-none"
                >
                  <FaGithub className="text-4xl" />
                </a>
              }
            />
            <TooltipPanel side="bottom" sideOffset={6} className="text-xs bg-black/80 backdrop-blur-md border border-purple-500/30 px-2 py-1">
              GitHub
            </TooltipPanel>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger
              render={
                <a
                  href="https://www.linkedin.com/in/weschou013/"
                  aria-label="LinkedIn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex p-2.5 rounded-lg text-white/80 hover:text-purple-500 hover:bg-purple-500/20 hover:backdrop-blur-sm hover:scale-110 hover:rotate-6 hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-250 motion-reduce:scale-100 motion-reduce:rotate-0 motion-reduce:shadow-none"
                >
                  <FaLinkedin className="text-4xl" />
                </a>
              }
            />
            <TooltipPanel side="bottom" sideOffset={6} className="text-xs bg-black/80 backdrop-blur-md border border-purple-500/30 px-2 py-1">
              LinkedIn
            </TooltipPanel>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger
              render={
                <a
                  href="documents/IWesChouResume2026_1120.pdf"
                  aria-label="Resume"
                  className="inline-flex p-2.5 rounded-lg text-white/80 hover:text-purple-500 hover:bg-purple-500/20 hover:backdrop-blur-sm hover:scale-110 hover:rotate-6 hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-250 motion-reduce:scale-100 motion-reduce:rotate-0 motion-reduce:shadow-none"
                >
                  <CgFileDocument className="text-4xl" />
                </a>
              }
            />
            <TooltipPanel side="bottom" sideOffset={6} className="text-xs bg-black/80 backdrop-blur-md border border-purple-500/30 px-2 py-1">
              Resume
            </TooltipPanel>
          </Tooltip>
        </div>
      </div>
    </TabGroup>
  );
}

export default Navbar;
