import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setUser } from "../feature/Auth/userSlice";
import { useNotification } from "../componants/Notification";
import { createDocument, getDocuments } from "../api/docAPI";
import {
  InstagramIcon,
  YoutubeIcon,
  XIcon,
  LinkedinIcon,
} from "../componants/SocialIcons";
import Logo from "../assets/logo-fav.png";

/* ---------- Static data ---------- */
const CARDS = [
  {
    number: "1",
    title: "Smart Writing Workspace",
    desc: "Draft blogs, reports, emails, and research papers in one place. Benni adapts to your tone and gets smarter with every document you write.",
  },
  {
    number: "2",
    title: "Trusted by Thousands",
    desc: "Over 1000+ writers, students, and professionals use Benni AI to create polished, publish-ready content in a fraction of the time.",
  },
  {
    number: "3",
    title: "Fast & Distraction-Free",
    desc: "No clutter, no unnecessary steps. Just open a doc, describe what you need, and Benni helps you write it, quickly and clearly.",
  },
  {
    number: "4",
    title: "Context-Aware Suggestions",
    desc: "Benni doesn't just generate text, it understands structure, tone, and intent, so every suggestion actually fits what you're writing.",
  },
];

const USE_CASES = [
  "Teams & Institutions",
  "For Students",
  "For Professionals",
  "Content Creators",
];

const spring = { type: "spring", stiffness: 120, damping: 18 };

/* ---------- Reusable pieces ---------- */
const BrandMark = ({ className = "text-4xl", logoClass = "h-12" }) => (
  <span
    className={`font-extrabold text-[#4274D9] flex items-center gap-2 ${className}`}
  >
    <img
      className={`${logoClass} w-auto object-contain`}
      src={Logo}
      alt="Benni AI logo"
    />
    <span>
      <span className="text-[#4CAF1A]">Benni</span> AI
    </span>
  </span>
);

const CtaButton = ({ user, onStart, size = "lg" }) => {
  const sizes = {
    lg: "px-12 py-5 text-2xl rounded-2xl",
    md: "px-9 py-4 text-2xl rounded-2xl",
  };

  const classes = `inline-block bg-[#4274D9] hover:bg-[#4338CA] transition-colors duration-300 text-white font-semibold shadow-lg cursor-pointer ${sizes[size]}`;

  const label = (
    <>
      Start Writing
      <span className="font-normal text-[#D6D8FF]"> — It's Free</span>
    </>
  );

  return (
    <motion.div
      whileHover={{
        scale: 1.05,
        boxShadow: "0px 12px 30px rgba(66,116,217,0.35)",
      }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="inline-block rounded-2xl"
    >
      {user ? (
        <button onClick={onStart} className={classes}>
          {label}
        </button>
      ) : (
        <Link to="/register" className={classes}>
          {label}
        </Link>
      )}
    </motion.div>
  );
};

/* ---------- Page ---------- */
const LandingPage = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const dispatch = useDispatch();
  const { notify } = useNotification();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  console.log("USER", user);

  const handleSignOut = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/users/logout",
        {},
        { withCredentials: true },
      );

      if (res.data.status === "success") {
        notify({
          title: "Logout successful",
          message: "Thanks for using Benni.",
        });
        dispatch(setUser());
        navigate("/");
      }
    } catch (error) {
      console.error("Logout error:", error);
      notify({
        title: "Logout failed",
        message:
          error.response?.data?.message ||
          "Something went wrong, try again later",
      });
    }
  };

  const handleStartWriting = async () => {
    try {
      const data = await getDocuments();
      const documents = data.data.documents;

      if (documents && documents.length > 0) {
        navigate(`/editor/${documents[0]._id}`);
        return;
      }

      const newDocument = await createDocument({
        title: "Untitled Document",
        content: "<h2>Untitled</h2>",
      });

      navigate(`/editor/${newDocument.document._id}`);
    } catch (error) {
      console.error("Failed to start writing:", error);
      notify({
        title: "Couldn't open your workspace",
        message: "Please try again.",
      });
    }
  };

  return (
    <div className="bg-white">
      {/* ---------------- NAVBAR ---------------- */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <nav className="max-w-6xl mx-auto flex justify-between items-center px-5 py-3 gap-4">
          <div className="shrink-0">
            <h1>
              <BrandMark />
            </h1>
          </div>

          <div className="flex gap-3 shrink-0">
            {!user && (
              <Link to="/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="w-[100px] bg-white border border-gray-200 rounded-xl font-semibold py-3 transition-shadow duration-200 cursor-pointer hover:shadow-xl"
                >
                  Login
                </motion.button>
              </Link>
            )}

            {user ? (
              <motion.button
                onClick={handleSignOut}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="w-[100px] bg-white border border-gray-200 rounded-xl font-semibold py-3 transition-shadow duration-200 cursor-pointer hover:shadow-xl"
              >
                Logout
              </motion.button>
            ) : (
              <Link to="/register" className="hidden md:block">
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0px 10px 25px rgba(66,116,217,0.3)",
                  }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="w-[150px] bg-[#4274D9] hover:bg-[#4338CA] text-white rounded-xl font-semibold py-3 transition-colors duration-200 cursor-pointer"
                >
                  Start writing
                </motion.button>
              </Link>
            )}
          </div>
        </nav>
      </header>

      <main>
        {/* ---------------- HERO ---------------- */}
        <section className="relative min-h-[85vh] flex items-center justify-center px-6 overflow-hidden">
          {/* Soft brand glow */}
          <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#4274D9]/10 rounded-full blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 right-0 w-[380px] h-[380px] bg-[#4CAF1A]/10 rounded-full blur-3xl" />

          <div className="relative max-w-5xl text-center">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={spring}
              className="text-[#17171A] text-5xl sm:text-6xl md:text-7xl font-bold leading-[1.05] tracking-[-2px]"
            >
              Meet Your Intelligent
              <br />
              Research Assistant
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: 0.15 }}
              className="mt-8 max-w-3xl mx-auto text-xl sm:text-2xl text-[#6B7280] leading-relaxed"
            >
              Benni AI is the intelligent writing workspace where you can create
              documents, research papers, blogs, reports, and emails with the
              power of AI.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: 0.3 }}
              className="mt-12"
            >
              <CtaButton user={user} onStart={handleStartWriting} size="lg" />
            </motion.div>
          </div>
        </section>

        {/* ---------------- WHO IS BENNI ---------------- */}
        <section className="w-full py-20 px-4 sm:px-8">
          <div className="max-w-[900px] mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={spring}
              className="text-3xl sm:text-4xl font-extrabold text-[#1E2560] mb-4"
            >
              Who is <span className="text-[#4CAF1A]">BENNI</span> and how it
              works? —
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ ...spring, delay: 0.1 }}
              className="text-gray-500 text-base sm:text-lg mb-10 leading-relaxed"
            >
              Meet Benni, your AI writing companion. Benni helps you turn ideas
              into polished blogs, reports, emails, and essays without the
              blank-page struggle. Whether you're drafting your first paragraph
              or refining your final line, Benni works alongside you,
              understanding your tone, adapting to your style, and helping every
              piece of writing sound like you, just better.
            </motion.p>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.12 } },
              }}
              className="flex flex-col gap-4"
            >
              {CARDS.map((item) => (
                <motion.div
                  key={item.number}
                  variants={{
                    hidden: { opacity: 0, y: 40 },
                    visible: { opacity: 1, y: 0, transition: spring },
                  }}
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0px 10px 25px rgba(30,37,96,0.08)",
                  }}
                  className="relative flex items-center justify-between bg-[#EAF0FB] rounded-xl px-6 py-6 overflow-hidden cursor-default"
                >
                  <div className="max-w-[80%] relative z-10">
                    <h3 className="font-bold text-[#1E2560] text-sm sm:text-base tracking-wide uppercase mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 font-extrabold text-[4rem] sm:text-[7rem] text-[#D7E2F7] leading-none select-none">
                    {item.number}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </main>

      {/* ---------------- FOOTER ---------------- */}
      <footer className="w-full bg-[#0A0E27] px-4 sm:px-8 py-14">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between gap-10">
            {/* Brand */}
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left max-w-[600px]">
              <BrandMark className="text-4xl" logoClass="h-12" />

              <p className="text-gray-400 text-sm mt-4 mb-8 max-w-[520px] leading-relaxed">
                Benni AI is the intelligent writing workspace where you can
                create documents, research papers, blogs, reports, and emails
                with the power of AI.
              </p>

              <CtaButton user={user} onStart={handleStartWriting} size="md" />
            </div>

            {/* Use Cases */}
            <div className="text-center sm:text-left">
              <h3 className="text-white font-bold mb-4">Use Cases</h3>
              <ul className="flex flex-col gap-3">
                {USE_CASES.map((item) => (
                  <li
                    key={item}
                    className="text-gray-400 text-sm hover:text-white cursor-pointer transition-colors"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-700 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              Copyright © 2026 Benni AI, Inc. All rights reserved.
            </p>

            <div className="flex gap-4 text-gray-400">
              <YoutubeIcon size={18} />
              <LinkedinIcon size={18} />
              <InstagramIcon size={18} />
              <XIcon size={18} />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
