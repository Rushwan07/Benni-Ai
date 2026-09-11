import { FileText, Ellipsis, Trash2, Pencil } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { deleteDocument } from "../api/docAPI";

const SidebarItem = ({ label, active, hasChevron, projectID }) => {
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [hovered, setHovered] = useState(false);

  const containerRef = useRef(null);
  const textRef = useRef(null);

  // Check whether the label actually overflows its visible space
  useEffect(() => {
    const checkOverflow = () => {
      if (textRef.current && containerRef.current) {
        setIsOverflowing(
          textRef.current.scrollWidth > containerRef.current.clientWidth,
        );
      }
    };
    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [label]);
  return (
    <div
      className="relative "
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <button
        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 ${
          active
            ? "bg-[#4274D9]/10 text-[#4274D9]"
            : "text-gray-600 hover:bg-gray-100"
        }`}
      >
        <span className="flex items-center gap-2.5 min-w-0 flex-1">
          <FileText size={17} className="shrink-0" />

          {/* Fixed-width viewport that clips the label */}
          <span
            ref={containerRef}
            className="relative overflow-hidden whitespace-nowrap min-w-0 flex-1 text-left"
          >
            <motion.span
              ref={textRef}
              className="inline-block"
              animate={
                isOverflowing && hovered
                  ? {
                      x: -(
                        textRef.current?.scrollWidth -
                        containerRef.current?.clientWidth +
                        4
                      ),
                    }
                  : { x: 0 }
              }
              transition={
                isOverflowing && hovered
                  ? {
                      duration: Math.max(1.5, label.length * 0.08),
                      ease: "linear",
                    }
                  : { duration: 0.3, ease: "easeOut" }
              }
              style={
                !hovered && isOverflowing
                  ? {
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      display: "block",
                    }
                  : {}
              }
            >
              {label}
            </motion.span>
          </span>
        </span>
      </button>
    </div>
  );
};

export default SidebarItem;
