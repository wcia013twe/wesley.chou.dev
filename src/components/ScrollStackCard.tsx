import React from "react";
import PostHeader from "./PostHeader";
import { ScrollStackItem } from "./ScrollStack";
import { GoShieldCheck } from "react-icons/go";
import { FaGlobeAmericas } from "react-icons/fa";
import { marked } from 'marked';
import DOMPurify from 'dompurify';

import {
  differenceInDays,
  differenceInWeeks,
  differenceInMonths,
  differenceInYears,
} from "date-fns";
import { string } from "prop-types";

export interface ScrollStackCardProps {
  name: string;
  title: string;
  date: string;
  profileImageUrl: string;
  text: string;
  links: string;
  post_link: string;
  impressions: number;
}

export function shortTimeAgo(date: string): string {
  const createdAt = new Date(date);
  const now = new Date();
  const years = differenceInYears(now, createdAt);
  if (years > 0) return `${years}y`;
  const months = differenceInMonths(now, createdAt);
  if (months > 0) return `${months}mo`;
  const weeks = differenceInWeeks(now, createdAt);
  if (weeks > 0) return `${weeks}w`;
  const days = differenceInDays(now, createdAt);
  if (days > 0) return `${days}d`;
  return "now";
}

const getTextFromMarkDown = (text: string): string => {
    const rawHtml = typeof marked === "function" ? marked(text) : "";
    return DOMPurify.sanitize(rawHtml as string);
}

const ScrollStackCard = ({
  name = "Wes", // Default value applied via ES6 syntax
  title = "Prev @ Goldman Sachs, Lockheed Martin | CS @ UCF",
  date = "10/07/2025",
  profileImageUrl,
  text = `# My Heading

    This is some **bold** text and *italic* text.

    - List item 1
    - List item 2`,
  links,
  post_link,
  impressions = 0,
}: ScrollStackCardProps) => {
  return (
    <ScrollStackItem itemClassName="bg-gray-900 text-xs border border-gray-700 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      <div className="flex items-start  p-4 border-gray-700/50 bg-gray-900 rounded-t-xl w-full">
        {/* 1. Profile Picture */}
        <div className="flex-shrink-0 mr-3">
          <img
            src={
              profileImageUrl ||
              "https://placehold.co/48x48/CCCCCC/333333?text=WC"
            }
            alt={name}
            className="w-12 h-12 rounded-full object-cover border-2 border-gray-700"
          />
        </div>

        {/* 2. Text Content and Hierarchy */}
        <div className="flex-grow">
          {/* Row 1: Name and Verification */}
          <div className="flex items-center space-x-1">
            <span className="text-lg font-bold text-white tracking-tight">
              {name}
            </span>
            {/* Mock LinkedIn Verification Checkmark/Dot (Icon Placeholder) */}
            <span className="text-cyan-500" title="Verified">
              {/* Example SVG for a small dot or checkmark */}
              <GoShieldCheck />
            </span>
            <span className="text-gray-500 font-medium text-sm">· You</span>
          </div>

          {/* Row 2: Prev Roles/Title (Muted Context) */}
          <p className="text-sm text-gray-400 mt-[-2px] truncate">{title}</p>

          {/* Row 3: Timestamp */}
          <div className="flex items-center space-x-1 text-xs text-gray-500 mt-0.5">
            {shortTimeAgo(date)}
            <span className="font-bold mx-1">·</span>
            {/* Mock Global Icon */}
            <FaGlobeAmericas />
          </div>
        </div>
      </div>
      <div className="flex-1 p-4 pt-0 flex flex-col">
        <div className="p-2 pl-0 flex-1">
          <p className="text-white text-sm mb-4 leading-relaxed">Hi,</p>
          <div
            className="text-white text-sm mb-4 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: getTextFromMarkDown(text) }}
          />
          {links}
          {post_link}
          {impressions}
        </div>
      </div>
    </ScrollStackItem>
  );
};

export default ScrollStackCard;
