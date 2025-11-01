import React from "react";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

export type GalleryItem = {
  original: string;
  thumbnail?: string;
  originalAlt?: string;
  thumbnailAlt?: string;
  description?: string;
};

type StickyGalleryProps = {
  items: GalleryItem[];
  className?: string;
  /** Sticky offset from the top (accounts for fixed navbars). Accepts number (px) or CSS string. */
  top?: number | string;
  /** Explicit height for the sticky area (defaults to full viewport). */
  height?: string;
};

/**
 * A viewport-height sticky gallery that remains fixed while its parent column scrolls.
 * Use inside a container that is at least screen-height to enable sticky behavior.
 */
const StickyGallery: React.FC<StickyGalleryProps> = ({
  items,
  className = "",
  top = 0,
  height = "100vh",
}) => {
  return (
    <aside
      className={"sticky bg-transparent flex items-center justify-center " + className}
      style={{ top: typeof top === "number" ? `${top}px` : top, height }}
    >
      <div className="w-full max-w-xl border-2 border-[#a78bfa] round-md">
        <ImageGallery
          items={items}
          showFullscreenButton={false}
          showPlayButton={false}
          lazyLoad
          showNav
        />
      </div>
    </aside>
  );
};

export default StickyGallery;
