import React from "react";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import { Button } from '@headlessui/react'

export interface TimelineDrawerProps {
  icon: React.ReactElement;
  title: string;
  workplace: string;
  hero: string;
  altText: string;
  date: string;
  location: string;
  description: string;
  skills: string[];
  overview: string;
  key_responsibilities: string[];
  links: { [key: string]: string };
  isOpen: boolean;
  onClose: () => void;
}

const responsibilityList = (key_responsibilities: string[]) => {
  return (
    <ul className="list-disc pl-6">
      {key_responsibilities.map((item, i) => (
        <li key={i} className="text-white mb-2">
          {item}
        </li>
      ))}
    </ul>
  );
};

const skillsGrid = (skills: string[]) => {
  return (
    <ul className="grid grid-cols-3 gap-x-4 list-disc pl-6">
      {skills.map((skill, i) => (
        <li key={i} className="text-white mb-2">
          {skill}
        </li>
      ))}
    </ul>
  );
};

const linksList = (links: { [key: string]: string }) => {
  const linkEntries = Object.entries(links);
  return (
    <ul className="list-none pl-0 flex flex-wrap gap-2">
      {linkEntries.map(([label, url], i) => (
        <li key={i} className="text-white mb-2 flex items-center">
          <Button
            as="a"
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-bold bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:from-purple-600 hover:to-indigo-700 transition-colors shadow-md whitespace-nowrap"
          >
            {label}
            <FaArrowUpRightFromSquare className="inline-block" />
          </Button>
        </li>
      ))}
    </ul>
  );
};

const TimelineDrawer: React.FC<TimelineDrawerProps> = ({
  icon,
  title,
  workplace,
  hero,
  date,
  altText,
  location,
  skills,
  overview,
  key_responsibilities,
  links,
  isOpen,
  onClose,
}) => {
  return (
    <div
      className={`fixed inset-0 z-50 flex ${isOpen ? "" : "pointer-events-none"}`}
      style={{ background: isOpen ? "rgba(0,0,0,0.5)" : "transparent" }}
    >
      {/* Drawer panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-2xl bg-[#23272f] shadow-2xl transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"} overflow-y-auto`}
        role="dialog"
        aria-modal="true"
      >
        <Button
          as="button"
          type="button"
          className="absolute top-2 right-2 text-white text-2xl z-10 rounded-lg transition-colors p-2 w-10 h-10 flex items-center justify-center hover:bg-gray-500/80"
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </Button>
        <div className="flex w-full items-center justify-center h-[250px] relative overflow-hidden rounded-2xl">
          <div
            className="absolute inset-0 z-0 pointer-events-none border-b"
            style={{
              background:
                "radial-gradient(ellipse 80% 40% at 60% 30%, rgba(127,90,240,0.35) 0%, rgba(98,70,234,0.25) 60%, transparent 100%), radial-gradient(ellipse 60% 30% at 30% 70%, rgba(185,131,255,0.25) 0%, transparent 100%)",
              opacity: 1,
              filter: "blur(18px)",
            }}
          />
          <img
            src={hero}
            alt={altText}
            className="relative z-10 rounded-2xl object-contain max-h-[180px]"
          />
        </div>
        <div className="p-6 h-full overflow-y-auto">
          <div className="flex items-center justify-between">
            <div className="flex">
              <h2 className="text-xl font-bold text-white">{workplace}</h2>
              <div className="p-2 text-xl mr-2 ">{icon}</div>
            </div>
            <h3 className="text-xl">{location}</h3>
          </div>
          <div className="flex items-center justify-between">
            <h3 className="text-purple-300 mb-2 text-xl">{title}</h3>
            <h3 className="text-xl">{date}</h3>
          </div>

          <h3 className="text-lg mt-5 mb-2 font-semibold text-yellow-300">
            Overview
          </h3>
          <p className="text-white mb-4">{overview}</p>

          <h3 className="text-lg mt-5 mb-2 font-semibold text-yellow-300">
            Key Achievements
          </h3>
          {responsibilityList(key_responsibilities)}

          <h3 className="text-lg mt-5 mb-2 font-semibold text-yellow-300">
            Skills
          </h3>
          {skillsGrid(skills)}

          <h3 className="text-lg mt-5 mb-2 font-semibold text-yellow-300">
            Links
          </h3>
          {linksList(links)}
        </div>
      </div>
      {/* Overlay for closing */}
      {isOpen && (
        <div
          className="flex-1 cursor-pointer"
          onClick={onClose}
          aria-label="Close Drawer"
        />
      )}
    </div>
  );
};

export default TimelineDrawer;
