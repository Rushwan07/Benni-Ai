import { motion } from "framer-motion";
import {
  FileText,
  Sparkles,
  Save,
  FileDown,
  Bold,
  MousePointerClick,
  FolderPlus,
  HelpCircle,
  LogIn,
} from "lucide-react";
import pic1 from "../assets/help/pic1.png";
import pic2 from "../assets/help/pic2.png";
import pic3 from "../assets/help/pic3.png";
import pic4 from "../assets/help/pic4.png";
import pic5 from "../assets/help/pic5.png";
import pic6 from "../assets/help/pic6.png";

const steps = [
  {
    icon: LogIn,
    title: "1. Log in or create an account",
    description:
      "Sign up with your email or log in if you already have an account. You'll land straight in your workspace, ready to write.",
    screenshotLabel: "Screenshot: login / register screen",
    image: pic1,
  },
  {
    icon: FolderPlus,
    title: "2. Start with your default project",
    description:
      "We'll set you up with a default project right away so you can start writing immediately, no setup needed. Want more? Click + New in the sidebar anytime to create additional projects.",
    screenshotLabel: "Screenshot: default project + New button",
    image: pic2,
  },
  {
    icon: Bold,
    title: "3. Format your writing",
    description:
      "Use the toolbar to add bold, italic, underline, headings, and lists. Select any text to bring up quick formatting options.",
    screenshotLabel: "Screenshot: formatting toolbar in use",
    image: pic3,
  },
  {
    icon: Sparkles,
    title: "4. Ask Benni for help",
    description:
      "Click star icon, or select text and choose Ask Benni to rewrite, expand, shorten, or fix grammar, generated instantly and inserted right where you need it.",
    screenshotLabel: "Screenshot: Ask Benni in action",
    image: pic4,
  },
  {
    icon: Save,
    title: "5. Save your work",
    description:
      "Your document saves automatically as you type. You can also press Ctrl+S (or Cmd+S on Mac) or click Save anytime for peace of mind.",
    screenshotLabel: "Screenshot: save button / shortcut",
    image: pic5,
  },
  {
    icon: FileDown,
    title: "6. Export when you're done",
    description:
      "Click Export to download your document as a polished PDF, ready to share or print.",
    screenshotLabel: "Screenshot: export flow",
    image: pic6,
  },
];

const HelpPage = () => {
  return (
    <div className="min-h-screen bg-white px-4 sm:px-8 py-12">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center mb-14"
        >
          <div className="w-14 h-14 rounded-2xl bg-[#4274D9]/10 flex items-center justify-center mx-auto mb-5">
            <HelpCircle size={26} className="text-[#4274D9]" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#17171A] mb-3">
            How to use <span className="text-[#4CAF1A]">Benni</span> AI
          </h1>
          <p className="text-gray-500 text-base sm:text-lg max-w-xl mx-auto">
            A quick walkthrough to get you writing faster, from your first login
            to your finished document.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="flex flex-col gap-14">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.05 }}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-11 h-11 rounded-xl bg-[#4274D9]/10 flex items-center justify-center shrink-0">
                  <step.icon size={20} className="text-[#4274D9]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#17171A] mb-1.5">
                    {step.title}
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Screenshot placeholder — replace with your own <img> */}
              <div className="ml-0 sm:ml-[60px] rounded-2xl border-2 border-dashed border-gray-200  aspect-video flex flex-col items-center justify-center gap-2 text-gray-400">
                <img className="" src={step.image} alt="" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer help note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mt-16 text-center bg-[#EAF0FB] rounded-2xl p-8"
        >
          <FileText size={22} className="text-[#4274D9] mx-auto mb-3" />
          <h3 className="text-lg font-bold text-[#17171A] mb-2">
            Still have questions?
          </h3>
          <p className="text-gray-600 text-sm mb-5">
            Reach out and we'll help you get set up.
          </p>
          <a
            href="mailto:rushdeveloper07@gmail.com"
            className="inline-block bg-[#4274D9] hover:bg-[#4338CA] text-white text-sm font-semibold px-6 py-3 rounded-xl transition-colors duration-200 cursor-pointer"
          >
            Contact support
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default HelpPage;
