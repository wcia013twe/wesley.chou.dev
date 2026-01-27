import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "./Timeline.css";
import TiltedCard from "./TiltedCard";
import { Button } from "@headlessui/react";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { MdLocationOn } from "react-icons/md";
import { FaBuildingUser } from "react-icons/fa6";
import TimelineDrawer from "./TimelineDrawer";
import { useState } from "react";

// Timeline data could be kept here as a constant, or moved to a separate file (e.g., timelineData.ts or timelineData.json).
// For small, static datasets, keeping it here is fine. For larger or reused data, a separate file is better.

interface TimelineData {
  date: string;
  imageSrc: string;
  hero: string;
  altText: string;
  captionText: string;
  title: string;
  workplace: string;
  location: string;
  description: string;
  skills: string[];
  overview: string;
  key_responsibilities: string[];
  icon: React.ReactElement;
  links?: Record<string, string>;
}

interface TimelineProps {
  data: TimelineData[];
}

function renderSkillBadges(skills: string[]) {
  const maxVisible = 6;
  return (
    <>
      {skills.slice(0, maxVisible).map((skill, i) => (
        <span
          key={i}
          className="bg-[#181e29] border-indigo-300 text-indigo-300 text-[11px] px-3 py-1 rounded-full font-medium border mr-2 mb-2 inline-block"
        >
          {skill}
        </span>
      ))}
      {skills.length > maxVisible && (
        <span className="bg-[#181e29] border-indigo-300 text-indigo-300 text-[11px] px-3 py-1 rounded-full font-medium border mr-2 mb-2 inline-block">
          +{skills.length - maxVisible}
        </span>
      )}
    </>
  );
}

const Timeline = ({ data }: TimelineProps) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  return (
    <>
      <VerticalTimeline>
        {data.map((item, idx) => (
          <VerticalTimelineElement
            key={idx}
            className="vertical-timeline-element--work hover:-translate-y-1 duration-300 ease-in-out group"
            contentStyle={{
              background:
                "linear-gradient(135deg, #23272f 0%, #3a2e5f 60%, #181e29 100%)",
              color: "white",
              border: "1px solid white",
              borderRadius: "25px",
              overflow: "visible",
              position: "relative",
            }}
            contentArrowStyle={{
              borderRight: "7px solid white", // matches the middle color of the gradient
            }}
            date={item.date}
            dateClassName="date-text"
            iconStyle={{ background: "var(--color-card-bg)", color: "#fff" }}
            icon={item.icon}
          >
            <div className="flex gap-[1rem] relative min-h-50">
              <TiltedCard
                imageSrc={item.imageSrc}
                altText={item.altText}
                captionText={item.captionText}
                containerHeight="180px"
                containerWidth="180px"
                imageHeight="180px"
                imageWidth="180px"
                rotateAmplitude={5}
                scaleOnHover={1.05}
                showMobileWarning={false}
                showTooltip={true}
                displayOverlayContent={false}
                overlayContent={
                  <p className="tilted-card-overlay">{item.captionText}</p>
                }
              />
              <div>
                <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                <h4 className="vertical-timeline-element-subtitle text-gray-300 flex items-center gap-0.5 ">
                  <FaBuildingUser />
                  {item.workplace}
                  <MdLocationOn className="ml-2" />
                  {item.location}
                </h4>
                <p className="text-[13px]! mb-2!">{item.description}</p>

                {renderSkillBadges(item.skills)}

                <Button
                  className="absolute bottom-0 right-2 flex items-center text-xs px-3 py-1 rounded-2xl text-white font-semibold bg-gray-600/95 hover:bg-indigo-700 transition-all duration-300 text-nowrap opacity-0 group-hover:opacity-100"
                  onClick={() => {
                    setSelectedIndex(idx);
                    setDrawerOpen(true);
                  }}
                >
                  <h4 className="text-xs">Show Me More</h4>
                  <MdOutlineKeyboardArrowRight
                    size={18}
                    className="ml-1 transition-transform duration-300 group-hover:rotate-90"
                  />
                </Button>
              </div>
            </div>
          </VerticalTimelineElement>
        ))}
      </VerticalTimeline>
      {drawerOpen && selectedIndex !== null && (
        <TimelineDrawer
          icon={data[selectedIndex].icon}
          title={data[selectedIndex].title}
          workplace={data[selectedIndex].workplace}
          hero={data[selectedIndex].hero || ""}
          altText={data[selectedIndex].altText}
          date={data[selectedIndex].date}
          location={data[selectedIndex].location}
          description={data[selectedIndex].description}
          skills={data[selectedIndex].skills}
          overview={data[selectedIndex].overview || ""}
          key_responsibilities={
            data[selectedIndex].key_responsibilities
          }
          links={Object.fromEntries(
            Object.entries(data[selectedIndex].links || {}).filter(
              ([, v]) => typeof v === "string"
            )
          )}
          isOpen={drawerOpen}
          onClose={() => {
            setDrawerOpen(false);
            setSelectedIndex(null);
          }}
        />
      )}
    </>
  );
};

export default Timeline;
