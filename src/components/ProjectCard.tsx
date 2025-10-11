import React from "react";
import SpotlightCard from "./SpotlightCard";
// Removed unused import



type ProjectCardProps = {
  title: string;
  description: string;
  date: string;
  imageUrl?: string;
  tech?: string[];
  detailsUrl?: string;
  index?: number;
  badgeColor?: string;
};

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  date,
  imageUrl,
  tech = [],
  detailsUrl = "#",
  badgeColor = "text-cyan-300",
}) => {
  return (
    <SpotlightCard className={`rounded-2xl overflow-hidden shadow-lg bg-[#10141c] border border-[var(--color-border)] flex flex-col min-h-[370px] ${badgeColor} hover:-translate-y-2 duration-300` }>
        {/* Top image area */}
        <div className="bg-[#181e29] h-60 flex items-end justify-start relative">
          {/* Floating title */}
          <div className="absolute left-4 bottom-4 z-10 bg-[#10141c] px-4 py-2 rounded-2xl shadow text-white text-lg font-semibold drop-shadow w-auto min-w-[80px] max-w-[70%]">
            {title}
          </div>
          {imageUrl && (
            <img
              src={imageUrl}
              alt={title}
              className="object-cover w-full h-full rounded-t-2xl opacity-70"
            />
          )}
        </div>
        <div className="p-5 flex flex-col flex-1">
          {/* Date */}
          <div className="flex items-center gap-2 text-sm text-muted mb-2">
            <svg
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="inline-block align-middle opacity-70"
            >
              <circle cx="9" cy="9" r="8" />
              <path d="M9 4v5l3 3" />
            </svg>
            <span>{date}</span>
          </div>
          {/* Description */}
          <div className="mb-3">
            <p className="text-base text-white leading-snug line-clamp-3">
              {description}
            </p>
          </div>
          {/* Tech badges */}
          {tech.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {tech.slice(0, 5).map((t, i) => (
                <span
                  key={i}
                  className={`bg-[#181e29] text-xs px-3 py-1 rounded-full font-medium ${badgeColor} border border-[var(--color-border)]`}
                >
                  {t}
                </span>
              ))}
              {tech.length > 5 && (
                <span className={`bg-[#181e29] text-xs px-3 py-1 rounded-full font-medium ${badgeColor} border border-[var(--color-border)]`}>
                  +{tech.length - 6}
                </span>
              )}
            </div>
          )}
          {/* View Details link */}
          <a
            href={detailsUrl}
            className={`mt-auto ${badgeColor} font-semibold text-base hover:underline flex items-center gap-1`}
          >
            View Details
            <svg
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="inline-block align-middle"
            >
              <path d="M5 9h8M9 5l4 4-4 4" />
            </svg>
          </a>
        </div>

    </SpotlightCard>
  );
};

export default ProjectCard;
