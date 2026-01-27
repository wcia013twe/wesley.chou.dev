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
  return (
    <TabGroup>
      <div className="fixed top-0 left-0 z-50 flex h-[var(--nav-height)] w-full items-center justify-between border-b border-purple-500/20 bg-[var(--color-bg)]/60 backdrop-blur-xl supports-[backdrop-filter]:bg-[var(--color-bg)]/60 shadow-lg shadow-black/10 px-6 font-sans text-xl font-medium tracking-wide text-[var(--color-fg)] transition-all duration-300">
        {/* Tabs */}
        <div className="flex items-center justify-center">
          <LuRocket className="text-3xl hover:text-[var(--color-primary)]"/>
          <p className="pl-2 text-2xl hover:text-[var(--color-primary)]">Wesley Chou</p>
        </div>
        <TabList className="flex items-center gap-1">
          <Tab
            className="rounded-full px-6 py-3 text-xl font-semibold text-white focus:outline-none focus-visible:ring-0 data-hover:bg-white/5 data-selected:bg-white/10 data-selected:data-hover:bg-white/10"
            as={Link}
            to="/"
          >
            Home
          </Tab>
          <Tab
            className="rounded-full px-6 py-3 text-xl font-semibold text-white focus:outline-none focus-visible:ring-0 data-hover:bg-white/5 data-selected:bg-white/10 data-selected:data-hover:bg-white/10"
            as={Link}
            to="/experience"
          >
            Experience
          </Tab>
          <Tab
            className="rounded-full px-6 py-3 text-xl font-semibold text-white focus:outline-none focus-visible:ring-0 data-hover:bg-white/5 data-selected:bg-white/10 data-selected:data-hover:bg-white/10"
            as={Link}
            to="/projects"
          >
            Projects
          </Tab>
          <Tab
            className="rounded-full px-6 py-3 text-xl font-semibold text-white focus:outline-none focus-visible:ring-0 data-hover:bg-white/5 data-selected:bg-white/10 data-selected:data-hover:bg-white/10"
            as={Link}
            to="/skills"
          >
            Skills
          </Tab>
 
        </TabList>
        {/* Icons */}
        <div className="flex items-center gap-2 text-sm">
          <Tooltip>
            <TooltipTrigger
              render={
                <a
                  href="https://github.com/wcia013twe"
                  aria-label="GitHub"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex p-2 rounded-md hover:text-[var(--color-primary)] hover:bg-[var(--color-surface-alt)] transition-colors"
                >
                  <FaGithub className="text-5xl" />
                </a>
              }
            />
            <TooltipPanel side="bottom" sideOffset={6} className="text-xs">
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
                  className="inline-flex p-2 rounded-md hover:text-[var(--color-primary)] hover:bg-[var(--color-surface-alt)] transition-colors"
                >
                  <FaLinkedin className="text-5xl" />
                </a>
              }
            />
            <TooltipPanel side="bottom" sideOffset={6} className="text-xs">
              LinkedIn
            </TooltipPanel>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger
              render={
                <a
                  href="documents/IWesChouResume2026_1120.pdf"
                  aria-label="Resume"
                  className="inline-flex p-2 rounded-md hover:text-[var(--color-primary)] hover:bg-[var(--color-surface-alt)] transition-colors"
                >
                  <CgFileDocument className="text-5xl" />
                </a>
              }
            />
            <TooltipPanel side="bottom" sideOffset={6} className="text-xs">
              Resume
            </TooltipPanel>
          </Tooltip>
        </div>
      </div>
    </TabGroup>
  );
}

export default Navbar;
