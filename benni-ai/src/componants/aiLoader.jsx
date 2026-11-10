import { motion } from "framer-motion";

const AILoader = ({ text = "Benni is thinking" }) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm">{text}</span>

      <div className="flex items-center gap-1">
        {[0, 1, 2].map((dot) => (
          <motion.span
            key={dot}
            animate={{
              y: [0, -4, 0],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: dot * 0.15,
              ease: "easeInOut",
            }}
            className="w-1.5 h-1.5 rounded-full bg-[#4274D9]"
          />
        ))}
      </div>
    </div>
  );
};

export default AILoader;
