import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X } from "lucide-react";

/* ---------- Context + Hook ---------- */
const NotificationContext = createContext(null);

export const useNotification = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx)
    throw new Error("useNotification must be used inside NotificationProvider");
  return ctx;
};

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(null);

  const notify = useCallback(
    ({ title, message, icon: Icon = Sparkles, duration = 4000 }) => {
      const id = Date.now() + Math.random();
      setNotification({ id, title, message, Icon, duration });
      return id;
    },
    [],
  );

  const dismiss = useCallback(() => {
    setNotification(null);
  }, []);

  return (
    <NotificationContext.Provider value={{ notify, dismiss }}>
      {children}
      <NotificationStack notification={notification} dismiss={dismiss} />
    </NotificationContext.Provider>
  );
};

/* ---------- Stack Renderer ---------- */
const NotificationStack = ({ notification, dismiss }) => (
  <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-full max-w-sm px-4 pointer-events-none">
    <AnimatePresence mode="popLayout">
      {notification && (
        <NotificationToast
          key={notification.id}
          {...notification}
          onDismiss={dismiss}
        />
      )}
    </AnimatePresence>
  </div>
);

/* ---------- Single Toast ---------- */
const NotificationToast = ({ title, message, Icon, duration, onDismiss }) => {
  const timerRef = useRef(null);
  const startTimer = () => {
    timerRef.current = setTimeout(onDismiss, duration);
  };
  const clearTimer = () => clearTimeout(timerRef.current);

  useState(() => {
    startTimer();
    return clearTimer;
  });

  return (
    <motion.div
      layout
      initial={{ y: -80, opacity: 0, scale: 0.9 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: -60, opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
      transition={{ type: "spring", stiffness: 350, damping: 28 }}
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={{ top: 0.5, bottom: 0 }}
      onDragStart={clearTimer}
      onDragEnd={(e, info) => {
        if (info.offset.y < -40) {
          onDismiss();
        } else {
          startTimer();
        }
      }}
      onMouseEnter={clearTimer}
      onMouseLeave={startTimer}
      className="pointer-events-auto absolute top-0 left-0 right-0 bg-white/80 backdrop-blur-xl border border-white/60 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] px-4 py-3.5 flex items-start gap-3 cursor-grab active:cursor-grabbing"
    >
      <div className="w-9 h-9 rounded-xl bg-[#4274D9] flex items-center justify-center shrink-0 mt-0.5">
        <Icon size={17} className="text-white" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[13px] font-semibold text-[#17171A]">
            Benni AI
          </span>
          <span className="text-[11px] text-gray-400 shrink-0">now</span>
        </div>
        {title && (
          <p className="text-[13px] font-medium text-[#17171A] mt-0.5 truncate">
            {title}
          </p>
        )}
        {message && (
          <p className="text-[13px] text-gray-500 leading-snug line-clamp-2 mt-0.5">
            {message}
          </p>
        )}
      </div>

      <button
        onClick={onDismiss}
        className="text-gray-400 hover:text-gray-600 transition-colors shrink-0 mt-0.5 cursor-pointer"
      >
        <X size={15} />
      </button>
    </motion.div>
  );
};
