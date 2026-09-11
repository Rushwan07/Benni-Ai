import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { PenLine, Sparkles, FileText } from "lucide-react";
import { useState } from "react";
import { useNotification } from "../componants/Notification";
import axios from "axios";
import { useDispatch } from "react-redux";
import Loader from "../componants/Loader";
import Logo from "../assets/Logo.png";

const Register = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [passCheck, setPassCheck] = useState("");
  const [password, setPassword] = useState("");
  const { notify } = useNotification();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    try {
      setLoading(true);
      if (!name || !email || !password || !passCheck) {
        notify({
          title: "Error",
          message: "All fields are required",
        });

        return;
      }

      // Check passwords
      if (password !== passCheck) {
        notify({
          title: "Error",
          message: "Passwords do not match",
        });

        return;
      }

      // Create user
      const res = await axios.post(BASE_URL + "/users/createuser", {
        name,
        email: email.trim(),
        password,
      });

      // Axios response data is inside res.data
      if (res.data.status === "success") {
        notify({
          title: "Profile registered",
          message: "Your account is created. Please login.",
        });

        navigate("/login");
      }
    } catch (error) {
      console.error("Registration error:", error);

      notify({
        title: "Error",
        message:
          error.response?.data?.message ||
          "Something went wrong while creating your account.",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex bg-white">
      {/* Left — Brand Panel */}
      <div className="hidden lg:flex w-1/2 relative bg-[#17171A] overflow-hidden">
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* Glow accent */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#4274D9] rounded-full blur-[140px] opacity-30" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-[#4CAF1A] rounded-full blur-[140px] opacity-20" />

        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <h1 className="text-4xl font-extrabold text-[#4274D9] flex items-center">
              <img className="w-23" src={Logo} alt="" />
              <span className="text-[#4CAF1A]">Benni</span> AI
            </h1>
          </motion.div>

          {/* Headline */}
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-4xl xl:text-5xl font-bold text-white leading-[1.15] tracking-tight max-w-md"
            >
              Your ideas, written with clarity.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.6, ease: "easeOut" }}
              className="mt-4 text-[#A1A1AA] text-base leading-relaxed max-w-sm"
            >
              Join thousands of writers using Benni to draft documents, reports,
              and blogs faster, without losing your voice.
            </motion.p>

            {/* Feature list */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="mt-10 flex flex-col gap-4"
            >
              {[
                {
                  icon: PenLine,
                  text: "Write and edit in a distraction-free workspace",
                },
                {
                  icon: Sparkles,
                  text: "Get AI suggestions that match your tone",
                },
                {
                  icon: FileText,
                  text: "Export polished, ready-to-share documents",
                },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                    <item.icon size={15} className="text-[#4CAF1A]" />
                  </div>
                  <span className="text-sm text-[#D4D4D8]">{item.text}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Footer note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-xs text-[#71717A]"
          >
            © 2026 Benni AI, Inc. All rights reserved.
          </motion.p>
        </div>
      </div>

      {/* Right — Form Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 sm:px-12 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-sm"
        >
          {/* Mobile-only logo */}
          <div className="lg:hidden text-center mb-10">
            <h1 className="text-4xl font-extrabold text-[#4274D9] flex justify-center items-center">
              <img className="w-23" src={Logo} alt="" />
              <span className="text-[#4CAF1A]">Benni</span> AI
            </h1>
          </div>

          <h2 className="text-2xl font-bold text-[#17171A]">Welcome back</h2>
          <p className="text-gray-500 text-sm mt-2">
            register to continue writing with Benni.
          </p>

          {/* Form */}
          <div className="mt-8 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Name
              </label>
              <input
                type="text"
                onChange={(e) => setName(e.target.value)}
                placeholder="First name & Last name"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#17171A] placeholder:text-gray-400 outline-none focus:border-[#4274D9] focus:ring-4 focus:ring-[#4274D9]/10 transition-all duration-150"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Email
              </label>
              <input
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#17171A] placeholder:text-gray-400 outline-none focus:border-[#4274D9] focus:ring-4 focus:ring-[#4274D9]/10 transition-all duration-150"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-gray-600">
                  Password
                </label>
              </div>
              <input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#17171A] placeholder:text-gray-400 outline-none focus:border-[#4274D9] focus:ring-4 focus:ring-[#4274D9]/10 transition-all duration-150"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-gray-600">
                  Re-enter password
                </label>
              </div>
              <input
                type="password"
                onChange={(e) => setPassCheck(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#17171A] placeholder:text-gray-400 outline-none focus:border-[#4274D9] focus:ring-4 focus:ring-[#4274D9]/10 transition-all duration-150"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleRegister}
              disabled={loading}
              className="w-full bg-[#4274D9] hover:bg-[#4338CA] text-white text-sm font-semibold py-3.5 rounded-xl transition-colors duration-200 cursor-pointer shadow-sm shadow-[#4274D9]/20"
            >
              {loading ? <Loader size="sm" color="#ffffff" /> : "Register"}
            </motion.button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Google */}
          {/* <button className="w-full flex items-center justify-center gap-2.5 border border-gray-200 rounded-xl py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-150 cursor-pointer">
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.47a5.53 5.53 0 01-2.4 3.63v3h3.88c2.27-2.09 3.57-5.17 3.57-8.82z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.96-1.07 7.95-2.91l-3.88-3c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.27v3.1A11.998 11.998 0 0012 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.27 14.28A7.19 7.19 0 014.9 12c0-.79.14-1.56.37-2.28v-3.1H1.27A12 12 0 000 12c0 1.94.46 3.77 1.27 5.38l4-3.1z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.76 0 3.35.6 4.6 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.27 6.62l4 3.1c.95-2.85 3.6-4.97 6.73-4.97z"
              />
            </svg>
            Continue with Google
          </button> */}

          {/* Footer */}
          <p className="mt-8 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[#4274D9] font-semibold hover:underline"
            >
              Sign in for free
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
