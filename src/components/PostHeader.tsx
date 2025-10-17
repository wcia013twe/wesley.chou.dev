import React from 'react';

export interface PostHeaderProps {
  name: string;
  title: string; // The primary title (e.g., Prev @ Goldman Sachs...)
  timeAgo: string; // e.g., "1w"
  profileImageUrl: string;
}

const PostHeader: React.FC<PostHeaderProps> = ({
  name = "Wes",
  title = "Hi LinkedIn",
  timeAgo,
  profileImageUrl,
}) => {
  return (
  <div className="flex items-start p-4 border-gray-700/50 bg-gray-900 rounded-t-xl w-full">
      
      {/* 1. Profile Picture */}
      <div className="flex-shrink-0 mr-3">
        <img
          src={profileImageUrl || "https://placehold.co/48x48/CCCCCC/333333?text=WC"}
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
          <span className="text-gray-500 font-medium text-sm">
            · You
          </span>
        </div>

        {/* Row 2: Prev Roles/Title (Muted Context) */}
        <p className="text-sm text-gray-400 mt-[-2px] truncate">
          {title}
        </p>

        {/* Row 3: Timestamp */}
        <div className="flex items-center space-x-1 text-xs text-gray-500 mt-0.5">
          <span>{timeAgo}</span>
          <span className="font-bold">·</span>
          {/* Mock Global Icon */}
          <span className="text-gray-500" title="Public">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.95-7-7.93 0-.75.13-1.49.36-2.19l3.19 3.19-.01.01c-.13.19-.24.4-.33.61-.25.59-.39 1.25-.39 1.96 0 1.93.99 3.65 2.5 4.67V14h2v7.58c1.3-.43 2.45-1.16 3.39-2.11L14 15.65v-2.02h2v3.74c1.1-.96 1.8-2.26 2-3.72L12 6.54V4.07c3.95.49 7 3.95 7 7.93 0 1.34-.35 2.6-.99 3.68z"/></svg>
          </span>
        </div>
      </div>

      {/* 3. Options Menu (for completeness) */}
      <div className="flex-shrink-0">
        <button className="text-gray-500 hover:text-white rounded-full p-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
        </button>
      </div>

    </div>
  );
};

export default PostHeader;
