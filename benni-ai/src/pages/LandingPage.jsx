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
import rushwan from "../assets/rushwan.jpg";

import Logo from "../assets/Logo.png";
const LandingPage = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const dispatch = useDispatch();
  const { notify } = useNotification();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.user);

  const card = [
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

  console.log("USER =>", user);

  const handleSignOut = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/users/logout",
        {},
        {
          withCredentials: true,
        },
      );

      if (res.data.status === "success") {
        notify({
          title: "Logout successful",
          message: "Thanks for using bennie.",
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
          "Something went wrong try again leter",
      });
    }
  };

  const handleStartWriting = async () => {
    try {
      const data = await getDocuments();
      console.log(data.data.documents);

      if (data.data.documents && data.data.documents.length > 0) {
        navigate(`/editor/${data.data.documents[0]._id}`);
        return;
      }

      const newDocument = await createDocument({
        title: "Untitled Document",
        content: "<h2>Untitled</h2>",
      });

      navigate(`/editor/${newDocument.document._id}`);
    } catch (error) {
      console.log("Failed to start writing:", error);
    }
  };

  return (
    <>
      <div className="p-5">
        <section className="navbar flex justify-between items-center p-3">
          <div className="">
            <h1 className="text-4xl font-extrabold text-[#4274D9] flex items-center">
              <img className="w-23" src={Logo} alt="" />
              <span className="text-[#4CAF1A]">Benni</span> AI
            </h1>
          </div>
          <div className="flex gap-3">
            {!user && (
              <Link to={"/login"}>
                <button className="w-[100px] lg:w-[100px] bg-white border rounded-xl font-semibold py-3 transition-all duration-200 cursor-pointer hover:shadow-2xl hover:scale-105 cursor-pointer">
                  Login
                </button>
              </Link>
            )}

            {user ? (
              <button
                onClick={handleSignOut}
                className="w-[100px] lg:w-[100px] hidden md:block bg-white border rounded-xl font-semibold py-3 transition-all duration-200 cursor-pointer hover:shadow-2xl hover:scale-105 cursor-pointer"
              >
                Logout
              </button>
            ) : (
              <Link to={"/register"}>
                <button className="w-full hidden md:block w-[150px] lg:w-[150px] bg-[#4274D9] text-white rounded-xl font-semibold py-3 transition-all duration-200 hover:bg-[#4338CA] cursor-pointer hover:shadow-2xl hover:scale-105 cursor-pointer">
                  Start writing
                </button>
              </Link>
            )}
          </div>
        </section>
        <section className="min-h-[85vh] flex items-center justify-center bg-white px-6">
          <div className="max-w-5xl text-center">
            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="text-[#17171A] text-6xl md:text-7xl font-bold leading-[1.05] tracking-[-2px]"
            >
              Meet Your Intelligent
              <br />
              Research Assistant
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
              className="mt-8 max-w-3xl mx-auto text-2xl text-[#6B7280] leading-relaxed"
            >
              Benni AI is the intelligent writing workspace where you can create
              documents, research papers, blogs, reports, and emails with the
              power of AI.
            </motion.p>

            {/* Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
            >
              {user ? (
                <motion.button
                  onClick={handleStartWriting}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0px 12px 30px rgba(66,116,217,0.35)",
                  }}
                  whileTap={{ scale: 0.97 }}
                  className="mt-12 bg-[#4274D9] hover:bg-[#4338CA] transition-colors duration-300 text-white text-2xl font-semibold px-12 py-5 rounded-2xl shadow-lg cursor-pointer"
                >
                  Start Writing
                  <span className="font-normal text-[#D6D8FF]">
                    {" "}
                    — It's Free
                  </span>
                </motion.button>
              ) : (
                <Link to={"/register"}>
                  <motion.button
                    onClick={handleStartWriting}
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0px 12px 30px rgba(66,116,217,0.35)",
                    }}
                    whileTap={{ scale: 0.97 }}
                    className="mt-12 bg-[#4274D9] hover:bg-[#4338CA] transition-colors duration-300 text-white text-2xl font-semibold px-12 py-5 rounded-2xl shadow-lg cursor-pointer"
                  >
                    Start Writing
                    <span className="font-normal text-[#D6D8FF]">
                      {" "}
                      — It's Free
                    </span>
                  </motion.button>
                </Link>
              )}
            </motion.div>
          </div>
        </section>
        <section className="w-full py-12 px-4 sm:px-8">
          <div className="max-w-[900px] mx-auto">
            {/* Header */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-3xl sm:text-4xl font-extrabold text-[#1E2560] mb-4"
            >
              Who is <span className="text-[#4CAF1A]">BENNI</span> and how it
              works? —
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: 0.1, duration: 0.6, ease: "easeOut" }}
              className="text-gray-500 text-base sm:text-lg mb-8"
            >
              Meet Benni, your AI writing companion. Benni helps you turn ideas
              into polished blogs, reports, emails, and essays without the
              blank-page struggle. Whether you're drafting your first paragraph
              or refining your final line, Benni works alongside you,
              understanding your tone, adapting to your style, and helping every
              piece of writing sound like you, just better.
            </motion.p>

            {/* Cards */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.15 } },
              }}
              className="flex flex-col gap-4"
            >
              {card.map((item) => (
                <motion.div
                  key={item.number}
                  variants={{
                    hidden: { opacity: 0, y: 40 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.5, ease: "easeOut" },
                    },
                  }}
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0px 10px 25px rgba(30,37,96,0.08)",
                  }}
                  className="relative flex items-center justify-between bg-[#EAF0FB] rounded-xl px-6 py-6 overflow-hidden cursor-default"
                >
                  <div className="max-w-[80%]">
                    <h2 className="font-bold text-[#1E2560] text-sm sm:text-base tracking-wide uppercase mb-2">
                      {item.title}
                    </h2>
                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                  <div className="font-extrabold text-[4rem] sm:text-[7rem] text-[#D7E2F7] leading-none select-none">
                    {item.number}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </div>
      <section className="w-full py-20 px-4 sm:px-8 bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          {/* Founder Card — left */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative shrink-0"
          >
            {/* Soft glow behind the card */}
            <div className="absolute -inset-10 bg-[#4274D9]/10 rounded-full blur-3xl -z-10" />

            <div className="w-[380px] bg-white rounded-3xl border border-gray-100 shadow-2xl p-5">
              <div className="rounded-2xl overflow-hidden aspect-[4/5]">
                <img
                  src={rushwan}
                  alt="Founder"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex items-center justify-between px-2 py-4">
                <div>
                  <p className="font-bold text-[#17171A]">@rushwan-syed</p>
                  <p className="text-sm text-gray-400">Pune, India</p>
                </div>

                <div className="flex items-center gap-2.5">
                  <a
                    href="https://www.linkedin.com/in/sayed-rushwan/"
                    className="text-gray-500 hover:text-[#17171A] transition-colors"
                  >
                    <LinkedinIcon size={18} />
                  </a>
                  <a
                    href="https://www.instagram.com/rushwan_07/"
                    className="text-gray-500 hover:text-[#17171A] transition-colors"
                  >
                    <InstagramIcon size={18} />
                  </a>
                  <a
                    href="https://x.com/RushwanSayyad?t=O9CPnivAJGJwaidj1PDahQ&s=09"
                    className="text-gray-500 hover:text-[#17171A] transition-colors"
                  >
                    <XIcon size={18} />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Content — right */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="flex-1"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-px bg-[#4274D9]" />
              <span className="text-xs font-bold tracking-widest text-[#4274D9] uppercase">
                Creator-led
              </span>
            </div>

            <h2 className="text-4xl sm:text-5xl font-extrabold text-[#17171A] mb-6 leading-tight">
              Meet the creator.
            </h2>

            <p className="text-gray-600 text-lg leading-relaxed mb-5">
              Rushwan is a software developer who has spent years building
              applications, exploring new technologies, and turning ideas into
              real products. While working on his own projects, he experienced
              firsthand how frustrating it could be to write, organize, and
              bring ideas to life with tools that often felt more complicated
              than they needed to be.
            </p>

            <p className="text-gray-600 text-lg leading-relaxed">
              Having experienced that friction himself, every decision behind
              Benni is shaped by what he believes a modern writer and creator
              actually needs: a simple, intelligent workspace that helps turn
              ideas into polished content without getting in the way.
            </p>
          </motion.div>
        </div>
      </section>

      <footer className="w-full bg-[#0A0E27] px-4 sm:px-8 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between gap-10">
            {/* Brand */}
            <div className="items-center flex justify-center flex-wrap text-center max-w-[600px]">
              <h2 className="text-4xl font-extrabold text-[#4274D9] flex items-center">
                <img className="w-27" src={Logo} alt="" />
                <span className="text-[#4CAF1A]">Benni</span> AI
              </h2>
              <div className="w-full flex justify-center items-center border-gray-700 my-2">
                <p className="text-gray-400 text-sm mb-5 max-w-[600px] items-center">
                  Benni AI is the intelligent writing workspace where you can
                  create documents, research papers, blogs, reports, and emails
                  with the power of AI.
                </p>
              </div>
              {user ? (
                <motion.button
                  onClick={handleStartWriting}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0px 12px 30px rgba(66,116,217,0.35)",
                  }}
                  whileTap={{ scale: 0.97 }}
                  className="mt-12 bg-[#4274D9] hover:bg-[#4338CA] transition-colors duration-300 text-white text-2xl font-semibold px-12 py-5 rounded-2xl shadow-lg cursor-pointer"
                >
                  Start Writing
                  <span className="font-normal text-[#D6D8FF]">
                    {" "}
                    — It's Free
                  </span>
                </motion.button>
              ) : (
                <Link to={"/register"}>
                  <motion.button
                    onClick={handleStartWriting}
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0px 12px 30px rgba(66,116,217,0.35)",
                    }}
                    whileTap={{ scale: 0.97 }}
                    className="bg-[#4274D9] hover:bg-[#4338CA] transition-colors duration-300 text-white text-2xl font-semibold px-9 py-4 rounded-2xl shadow-lg cursor-pointer"
                  >
                    Start Writing
                    <span className="font-normal text-[#D6D8FF]">
                      {" "}
                      — It's Free
                    </span>
                  </motion.button>
                </Link>
              )}
            </div>

            {/* Use Cases */}
            <div>
              <h3 className="text-white font-bold mb-4">Use Cases</h3>
              <ul className="flex flex-col gap-3">
                <li className="text-gray-400 text-sm hover:text-white cursor-pointer transition-colors">
                  Teams & Institutions
                </li>
                <li className="text-gray-400 text-sm hover:text-white cursor-pointer transition-colors">
                  For Students
                </li>
                <li className="text-gray-400 text-sm hover:text-white cursor-pointer transition-colors">
                  For Professionals
                </li>
                <li className="text-gray-400 text-sm hover:text-white cursor-pointer transition-colors">
                  Content Creators
                </li>
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-700 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <p className="text-gray-400 text-sm">
              Copyright © 2026 Benni AI, Inc. All rights reserved.
            </p>

            {/* Social Icons */}
            <div className="flex gap-4 text-gray-400">
              <YoutubeIcon size={18} />
              <LinkedinIcon size={18} />
              <InstagramIcon size={18} />
              <XIcon size={18} />
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default LandingPage;
