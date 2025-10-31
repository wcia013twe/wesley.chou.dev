import React from "react";

export type CustomIconProps = {
  size?: number | string; // px or css size
  title?: string;
  className?: string;
  variant?: "light" | "dark" | "grayscale"; // simple visual variants
  style?: React.CSSProperties;
  src?: string; // override path to asset if needed
};

/**
 * GoogleAdkIcon
 *
 * How to use:
 * 1) Place your logo asset at: public/icons/google-adk.svg (or .png)
 * 2) <GoogleAdkIcon size={36} title="Google ADK" />
 *
 * The component will serve from /icons/... via Vite's public folder.
 */
const CustomIcon: React.FC<CustomIconProps> = ({
  size = 58,
  title = "Google ADK",
  className = "",
  variant,
  style,
  src,
}) => {
  const resolvedSrc = src; // expects file under public/icons/

  const filter = variant === "grayscale"
    ? "grayscale(1)"
    : undefined;

  return (
    <span
      className={className}
      title={title}
      aria-label={title}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: typeof size === "number" ? `${size}px` : size,
        height: typeof size === "number" ? `${size}px` : size,
        ...style,
      }}
    >
      <img
        src={resolvedSrc}
        alt={title}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          filter,
        }}
        onError={(e) => {
          // Optional: hide if missing
          (e.currentTarget as HTMLImageElement).style.visibility = "hidden";
        }}
      />
    </span>
  );
};

export default CustomIcon;
