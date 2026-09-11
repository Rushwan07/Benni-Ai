import { motion } from "framer-motion";

const SIZE_MAP = {
  sm: { box: 16, border: 2 },
  md: { box: 24, border: 2.5 },
  lg: { box: 36, border: 3 },
  xl: { box: 48, border: 4 },
};

const Loader = ({ size = "md", color = "#4274D9", className = "" }) => {
  const { box, border } =
    typeof size === "number"
      ? { box: size, border: Math.max(2, size / 10) }
      : SIZE_MAP[size] || SIZE_MAP.md;

  return (
    <div
      className={`inline-block rounded-full animate-spin ${className}`}
      style={{
        width: box,
        height: box,
        borderWidth: border,
        borderStyle: "solid",
        borderColor: `${color}33`, // faint track
        borderTopColor: color, // solid spinning edge
      }}
    />
  );
};

export default Loader;
