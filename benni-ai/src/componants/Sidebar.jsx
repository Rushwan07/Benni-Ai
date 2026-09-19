import {
  Plus,
  FileText,
  Library,
  Search,
  MessageCircle,
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  Undo,
  Redo,
  Bold,
  Italic,
  UnderlineIcon,
  Strikethrough,
  Code,
  Superscript,
  Subscript,
  Link as LinkIcon,
  AtSign,
  Image as ImageIcon,
  Table as TableIcon,
  Code2,
  Sigma,
  Users,
  ShieldCheck,
  Sparkles,
  Puzzle,
  Video,
  HelpCircle,
  Command,
  MoreHorizontal,
  FileDown,
  ArrowUp,
  Check,
  Trash2,
  LogOut,
  ChevronLeft,
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";
import SidebarItem from "./SidebarItem";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logoutUser, createDocument, deleteDocument } from "../api/docAPI";
import { setUser } from "../feature/Auth/userSlice";
import Loader from "./Loader";

const Sidebar = ({ open, setOpen, projects, setProjects }) => {
  const { user } = useSelector((state) => state.user);
  const [openNewProject, setOpenNewProject] = useState(false);
  const [title, setProjectName] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [openDropdown, setOpenDropdown] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const FilteredProducts = projects?.filter((pro) =>
    pro?.title?.toLowerCase().includes(searchInput.toLowerCase()),
  );

  const handleCreateDocument = async () => {
    if (!title.trim()) return;

    try {
      setLoading(true);
      const data = await createDocument({
        title: title,
        content: "New Document",
      });
      setProjects((prevProjects) => [data.document, ...prevProjects]);
      navigate(`/editor/${data.document._id}`);

      setProjectName("");
      setOpenNewProject(false);
    } catch (error) {
      console.log("Failed to create document:", error);
    } finally {
      setLoading(false);
    }
  };
  const location = useLocation();

  const handleDelete = async (projectID) => {
    try {
      const data = await deleteDocument(projectID);
      if (data.status === "success") {
        setProjects((prevProjects) =>
          prevProjects.filter((pro) => pro._id !== projectID),
        );
        navigate(`/editor/${FilteredProducts[1]._id}`);
      }
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleLogout = async () => {
    try {
      const data = await logoutUser();

      console.log(data);

      dispatch(setUser(null));

      navigate("/");
    } catch (error) {
      console.log("Logout failed:", error);
    }
  };

  return (
    <>
      <AnimatePresence initial={false}>
        {open && (
          <motion.aside
            key="sidebar"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 260, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="h-screen bg-white border-r border-gray-200 flex flex-col py-4 overflow-hidden shrink-0"
          >
            <div className="w-[260px] px-3 flex flex-col h-full min-h-0">
              {/* Account */}
              <div className="flex items-center justify-between px-2 mb-6 shrink-0">
                <div className="flex items-center gap-1">
                  <Link to={"/"}>
                    <div className="cursor-pointer text-gray-400 hover:text-[#17171A]">
                      <ChevronLeft />
                    </div>
                  </Link>
                  <div className="w-7 h-7 rounded-full bg-[#4274D9] flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {user?.name[0]}
                  </div>
                  <span className="text-sm font-semibold text-[#17171A] whitespace-nowrap w-30 overflow-hidden">
                    {user?.name}
                  </span>
                  <div className="relative">
                    <button
                      onClick={() => setOpenDropdown((prev) => !prev)}
                      className="p-1 rounded-md cursor-pointer hover:bg-gray-100 transition-colors duration-150"
                    >
                      <ChevronDown
                        size={14}
                        className={`text-gray-400 shrink-0 transition-transform duration-150 ${
                          openDropdown ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    <AnimatePresence>
                      {openDropdown && (
                        <>
                          {/* Backdrop to close on outside click */}
                          <div
                            className="fixed inset-0 z-40"
                            onClick={() => setOpenDropdown(false)}
                          />

                          <motion.div
                            initial={{ opacity: 0, y: -6, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -6, scale: 0.97 }}
                            transition={{ duration: 0.15, ease: "easeOut" }}
                            className="fixed left-20 top-12 z-50 w-30 rounded-xl bg-white border border-gray-200 shadow-lg p-1.5"
                          >
                            <button
                              onClick={() => {
                                setOpenDropdown(false);
                                handleLogout();
                              }}
                              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-sm font-medium text-red-600 hover:bg-red-50 cursor-pointer transition-colors duration-150"
                            >
                              <LogOut size={15} />
                              Logout
                            </button>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="cursor-pointer text-gray-400 hover:text-[#17171A] transition-colors"
                >
                  <ChevronsLeft size={18} />
                </button>
              </div>

              {/* New button */}
              <button
                onClick={() => {
                  if (openNewProject) {
                    setOpenNewProject(false);
                  } else {
                    setOpenNewProject(true);
                  }
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 mb-4 rounded-lg text-sm font-semibold text-[#4274D9] hover:bg-[#4274D9]/10 transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <Plus size={17} /> New
              </button>

              <AnimatePresence>
                {openNewProject && (
                  <motion.div
                    key="new-project-input"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                    className="overflow-hidden mb-6"
                  >
                    <motion.div
                      initial={{ y: -12, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -8, opacity: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                      className="flex items-end gap-2 pt-1"
                    >
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setProjectName(e.target.value)}
                        autoFocus
                        className="w-full border border-gray-300 rounded-2xl p-3 outline-none focus:border-[#4274D9] focus:ring-4 focus:ring-[#4274D9]/10 transition-shadow duration-200"
                        placeholder="Project name"
                      />

                      <motion.button
                        type="button"
                        onClick={handleCreateDocument}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.92 }}
                        className="cursor-pointer text-gray-700 h-[50px] w-[50px] flex items-center justify-center rounded-xl shrink-0 hover:bg-gray-100 transition-colors duration-150"
                      >
                        {loading ? (
                          <Loader />
                        ) : (
                          <>
                            <Check size={22} />
                          </>
                        )}
                      </motion.button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="relative mb-4">
                <Search
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full border border-gray-300 rounded-2xl py-3 pl-11 pr-3 outline-none focus:border-[#4274D9] focus:ring-4 focus:ring-[#4274D9]/10 transition-shadow duration-200"
                  placeholder="Search docs..."
                />
              </div>

              {/* Nav — this is the part that scrolls */}
              <div className="flex flex-col gap-1 flex-1 min-h-0 overflow-y-auto pr-1">
                {FilteredProducts && FilteredProducts.length > 0 ? (
                  FilteredProducts.map((project) => (
                    <div className="flex justify-between items-center gap-2 ">
                      <div className="w-full overflow-hidden ">
                        <Link key={project._id} to={`/editor/${project._id}`}>
                          <SidebarItem
                            label={project?.title}
                            projectID={project._id}
                            hasChevron
                            active={
                              location.pathname === `/editor/${project._id}`
                            }
                          />
                        </Link>
                      </div>
                      {FilteredProducts.length > 1 && (
                        <motion.button
                          onClick={() => handleDelete(project._id)}
                          className="cursor-pointer"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.97 }}
                        >
                          <Trash2 size={15} />
                        </motion.button>
                      )}
                    </div>
                  ))
                ) : (
                  <h1 className="text-center text-gray-500 font-medium font-sans">
                    No document found
                  </h1>
                )}
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Collapsed rail with expand button */}
      {!open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.15 }}
          className="h-screen w-12 bg-white border-r border-gray-200 flex flex-col items-center py-4 shrink-0"
        >
          <button
            onClick={() => setOpen(true)}
            className="cursor-pointer text-gray-400 hover:text-[#17171A] transition-colors"
            title="Expand sidebar"
          >
            <ChevronsRight size={18} />
          </button>
        </motion.div>
      )}
    </>
  );
};

export default Sidebar;
