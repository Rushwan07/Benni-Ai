import { useState } from "react";
import { useEditor, EditorContent, useEditorState } from "@tiptap/react";

import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";

import { motion, AnimatePresence } from "framer-motion";
import { useNotification } from "../componants/Notification";
import Sidebar from "./Sidebar";
import { getDocuments, saveDocument, useBennie } from "../api/docAPI";
import { useParams } from "react-router-dom";

import {
  FileText,
  HelpCircle,
  FileDown,
  MoreHorizontal,
  Undo,
  Redo,
  Bold,
  Italic,
  Underline as UnderlineIcon,
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
  ArrowUp,
  Check,
  Save,
  Loader2,
  Heading1,
  Heading2,
  Heading3,
  Pilcrow,
  ChevronDown,
} from "lucide-react";
import { useEffect } from "react";
import Loader from "./Loader";

const EditorPage = () => {
  // -----------------------------
  // State
  // -----------------------------

  const [title, setTitle] = useState("New Document");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [wordCount, setWordCount] = useState(0);
  const [promptBoxOpen, setPromptBoxOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const { notify } = useNotification();
  const [Documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [loading, setLoading] = useState(false);
  const [headingOpen, setHeadingOpen] = useState(false);
  const [prompt, setPrompt] = useState();
  const [isDirty, setIsDirty] = useState(false);

  const { docId } = useParams();
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const res = await getDocuments();

        setDocuments(res.data.documents);
      } catch (error) {
        console.log(error);
      }
    };

    fetchDocuments();
  }, []);

  useEffect(() => {
    if (!docId || Documents.length === 0) return;

    const document = Documents.find((doc) => doc._id === docId);

    setSelectedDocument(document || null);
  }, [docId, Documents]);
  // console.log("selectedDocument", selectedDocument);
  // -----------------------------
  // Editor
  // -----------------------------

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({
        placeholder: "Start writing, or let Benni help you begin...",
      }),
    ],

    content: "",
    editable: true,

    onUpdate: ({ editor }) => {
      setIsDirty(true);

      const text = editor.getText();
      setWordCount(text.replace(/\s/g, "").length);
    },

    editorProps: {
      attributes: {
        class: `
        max-w-none focus:outline-none min-h-[600px] text-[#17171A] leading-relaxed
        [&_h1]:text-4xl [&_h1]:font-bold [&_h1]:mt-6 [&_h1]:mb-4
        [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:mt-5 [&_h2]:mb-3
        [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:mt-4 [&_h3]:mb-2
        [&_p]:mb-4
        [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4
        [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4
        [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-600
        [&_strong]:font-bold
        [&_em]:italic
      `
          .replace(/\s+/g, " ")
          .trim(),
      },
    },
  });

  // -----------------------------
  // Editor State
  // -----------------------------

  const editorState = useEditorState({
    editor,
    selector: (ctx) => ({
      bold: ctx.editor.isActive("bold"),
      italic: ctx.editor.isActive("italic"),
      underline: ctx.editor.isActive("underline"),
      strike: ctx.editor.isActive("strike"),
      heading1: ctx.editor.isActive("heading", { level: 1 }),
      heading2: ctx.editor.isActive("heading", { level: 2 }),
      heading3: ctx.editor.isActive("heading", { level: 3 }),
      paragraph: ctx.editor.isActive("paragraph"),
    }),
  });

  useEffect(() => {
    if (!editor || !selectedDocument) return;

    editor.commands.setContent(selectedDocument.content);
    setTitle(selectedDocument.title);
  }, [editor, selectedDocument]);

  const toggle = (command) => (e) => {
    e.preventDefault();
    command();
  };

  // -----------------------------
  // Toolbar Button
  // -----------------------------
  const handleSave = async (productId) => {
    try {
      setSaveLoading(true);
      const content = editor.getHTML();

      const data = await saveDocument(productId, title, content);
      setDocuments((prevDocuments) => [
        data.document,
        ...prevDocuments.filter((pro) => pro._id !== data.document._id),
      ]);
      if (data.status === "success") {
        notify({
          title: "Saved",
          message: "Document saved",
        });

        return;
      }
    } catch (error) {
      console.log("Failed to save document:", error);
    } finally {
      setIsDirty(false);
      setSaveLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!editor) return;

    try {
      const content = editor.getHTML();

      const printWindow = window.open("", "_blank");

      if (!printWindow) {
        console.error("Popup blocked. Please allow popups for this site.");
        return;
      }

      printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title || "document"}</title>

          <style>
            @page {
              size: A4;
              margin: 20mm;
            }

            * {
              box-sizing: border-box;
            }

            html,
            body {
              margin: 0;
              padding: 0;
              background: white;
            }

            body {
              font-family: Arial, sans-serif;
              font-size: 14px;
              line-height: 1.6;
              color: #17171A;
              white-space: pre-wrap;
            }

            h1 {
              font-size: 28px;
              font-weight: bold;
              margin: 20px 0 12px;
              line-height: 1.25;
              break-after: avoid;
            }

            h2 {
              font-size: 22px;
              font-weight: bold;
              margin: 18px 0 10px;
              line-height: 1.3;
              break-after: avoid;
            }

            h3 {
              font-size: 18px;
              font-weight: bold;
              margin: 16px 0 8px;
              line-height: 1.35;
              break-after: avoid;
            }

            p {
              margin: 0 0 12px;
              white-space: pre-wrap;
              overflow-wrap: break-word;
            }

            ul {
              list-style-type: disc;
              padding-left: 24px;
              margin: 0 0 12px;
            }

            ol {
              list-style-type: decimal;
              padding-left: 24px;
              margin: 0 0 12px;
            }

            li {
              margin-bottom: 6px;
              break-inside: avoid;
            }

            blockquote {
              border-left: 4px solid #D1D5DB;
              padding-left: 16px;
              margin: 12px 0;
              font-style: italic;
              color: #4B5563;
              break-inside: avoid;
            }

            strong {
              font-weight: bold;
            }

            em {
              font-style: italic;
            }

            br {
              line-height: 1.6;
            }

            /* Don't split these elements awkwardly */
            h1,
            h2,
            h3,
            blockquote {
              break-inside: avoid;
            }

            /* Prevent a paragraph from being left with only
               one or two lines on the next page */
            p,
            li {
              orphans: 2;
              widows: 2;
            }

            @media print {
              body {
                margin: 0;
              }
            }
          </style>
        </head>

        <body>
          ${content}
        </body>
      </html>
    `);

      printWindow.document.close();

      // Wait until the document is fully rendered
      printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();

        printWindow.onafterprint = () => {
          printWindow.close();
        };
      };
    } catch (err) {
      console.error("PDF export failed:", err);
    }
  };

  const [aiLoading, setAiLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  // Splits the generated HTML into top-level blocks (h1, p, ul, etc.)
  // so we can insert them one at a time instead of all at once
  const splitIntoBlocks = (html) => {
    const container = document.createElement("div");
    container.innerHTML = html;
    return Array.from(container.children).map((el) => el.outerHTML);
  };

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleBennie = async () => {
    if (!editor || !prompt.trim()) return;

    setAiLoading(true);

    try {
      const data = await useBennie(prompt);

      if (data.status === "success") {
        setPromptBoxOpen(false);

        const blocks = splitIntoBlocks(data.content);

        for (const block of blocks) {
          editor.chain().focus("end").insertContent(block).run();

          // Scroll so the newly inserted block stays in view as it streams in
          editor.commands.scrollIntoView();

          await sleep(250); // delay between each block — tune to taste
        }
        setPrompt("");
      }
    } catch (error) {
      if (error.status === 503) {
        notify({
          title: "Generation failed",
          message:
            "Bennie is busy. Please try again in a moment." ||
            "Please try again.",
        });
      } else {
        notify({
          title: "Generation failed",
          message: "Something went wrong. Please try again.",
        });
      }
    } finally {
      setAiLoading(false);
    }
  };

  const toolbarButton = (icon, label, onMouseDown, active = false) => {
    const Icon = icon;

    return (
      <button
        type="button"
        onMouseDown={onMouseDown}
        title={label}
        className={`p-2 rounded-lg transition-colors duration-150 cursor-pointer shrink-0 ${
          active
            ? "bg-[#4274D9] text-white"
            : "text-gray-500 hover:bg-gray-100 hover:text-[#17171A]"
        }`}
      >
        <Icon size={17} />
      </button>
    );
  };

  // -----------------------------
  // Render
  // -----------------------------
  const HeadingDropdown = ({ editor, editorState, open, setOpen }) => {
    if (!editor) return null;

    const currentLabel = editorState.heading1
      ? "H1"
      : editorState.heading2
        ? "H2"
        : editorState.heading3
          ? "H3"
          : "Text";

    const options = [
      {
        label: "Text",
        icon: Pilcrow,
        active: editorState.paragraph,
        onSelect: () => editor.chain().focus().setParagraph().run(),
        preview: "text-sm",
      },
      {
        label: "Heading 1",
        icon: Heading1,
        active: editorState.heading1,
        onSelect: () =>
          editor.chain().focus().toggleHeading({ level: 1 }).run(),
        preview: "text-xl font-bold",
      },
      {
        label: "Heading 2",
        icon: Heading2,
        active: editorState.heading2,
        onSelect: () =>
          editor.chain().focus().toggleHeading({ level: 2 }).run(),
        preview: "text-lg font-bold",
      },
      {
        label: "Heading 3",
        icon: Heading3,
        active: editorState.heading3,
        onSelect: () =>
          editor.chain().focus().toggleHeading({ level: 3 }).run(),
        preview: "text-base font-bold",
      },
    ];

    return (
      <div className="relative shrink-0">
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            setOpen((v) => !v);
          }}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 cursor-pointer whitespace-nowrap"
        >
          {currentLabel}
          <ChevronDown
            size={14}
            className={`transition-transform duration-150 ${open ? "rotate-180" : ""}`}
          />
        </button>

        <AnimatePresence>
          {open && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setOpen(false)}
              />

              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.97 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="absolute top-full left-0 mt-10 w-48 bg-white rounded-xl border border-gray-200 shadow-lg p-1.5 z-20"
              >
                {options.map((opt) => (
                  <button
                    key={opt.label}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      opt.onSelect();
                      setOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer transition-colors duration-150 ${
                      opt.active
                        ? "bg-[#4274D9]/10 text-[#4274D9]"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <opt.icon size={15} className="shrink-0" />
                    <span className={opt.preview}>{opt.label}</span>
                  </button>
                ))}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Sidebar */}

      <Sidebar
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        projects={Documents}
        setProjects={setDocuments}
      />

      <div className="flex-1 flex flex-col min-w-0">
        {/* ---------------- TOP BAR ---------------- */}

        <div className="flex items-center justify-between gap-4 px-4 sm:px-6 py-4 border-b border-gray-100">
          {/* <div className="flex items-center"> */}
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-lg font-semibold text-[#17171A] outline-none bg-transparent min-w-0 flex-1 w-20"
          />
          <motion.button
            onClick={() => handleSave(selectedDocument._id)}
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.92 }}
            className={`cursor-pointer flex items-center justify-center gap-0.5 px-3 py-2 rounded-xl shrink-0 transition-colors duration-150 ${
              isDirty
                ? "bg-[#4274D9] text-white hover:bg-[#4338CA]"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {saveLoading ? (
              <>
                Saving...
              </>
            ) : (
              <>
                <Save size={20} />
                <span className="text-[15px] font-medium leading-none">
                  Save
                </span>
              </>
            )}
          </motion.button>
          {/* </div> */}

          <div className="flex items-center gap-3 shrink-0">
            <button className="hidden md:flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-[#17171A] cursor-pointer">
              <HelpCircle size={16} />
              Help
            </button>

            <motion.button
              whileHover={!loading ? { scale: 1.05 } : {}}
              whileTap={!loading ? { scale: 0.97 } : {}}
              onClick={handleDownloadPDF}
              disabled={loading}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 text-sm font-medium rounded-xl whitespace-nowrap transition-colors duration-150 ${
                loading
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-600 hover:bg-gray-100 cursor-pointer"
              }`}
            >
              <AnimatePresence mode="wait" initial={false}>
                {loading ? (
                  <Loader size="sm" />
                ) : (
                  <motion.div
                    key="icon"
                    initial={{ opacity: 0, rotate: 90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <FileDown size={16} />
                  </motion.div>
                )}
              </AnimatePresence>

              {loading ? "Exporting..." : "Export"}
            </motion.button>
          </div>
        </div>

        {/* ---------------- FORMAT TOOLBAR ---------------- */}

        <div className="relative flex items-center gap-1 px-4 sm:px-6 py-2.5 border-b border-gray-100 flex-wrap">
          {/* Undo */}
          {toolbarButton(
            Undo,
            "Undo",
            toggle(() => editor?.chain().focus().undo().run()),
          )}

          {/* Redo */}
          {toolbarButton(
            Redo,
            "Redo",
            toggle(() => editor?.chain().focus().redo().run()),
          )}

          <div className="w-px h-5 bg-gray-200 mx-2 shrink-0" />

          {/* Heading dropdown */}
          <HeadingDropdown
            editor={editor}
            editorState={editorState}
            open={headingOpen}
            setOpen={setHeadingOpen}
          />

          <div className="w-px h-5 bg-gray-200 mx-2 shrink-0" />

          {/* Bold */}
          {toolbarButton(
            Bold,
            "Bold",
            toggle(() => editor?.chain().focus().toggleBold().run()),
            editorState?.bold,
          )}

          {/* Italic */}
          {toolbarButton(
            Italic,
            "Italic",
            toggle(() => editor?.chain().focus().toggleItalic().run()),
            editorState?.italic,
          )}

          {/* Underline */}
          {toolbarButton(
            UnderlineIcon,
            "Underline",
            toggle(() => editor?.chain().focus().toggleUnderline().run()),
            editorState?.underline,
          )}

          {/* Desktop Strikethrough */}
          <div className="hidden lg:flex items-center gap-1">
            {toolbarButton(
              Strikethrough,
              "Strikethrough",
              toggle(() => editor?.chain().focus().toggleStrike().run()),
              editorState?.strike,
            )}
            <div className="w-px h-5 bg-gray-200 mx-2 shrink-0" />
          </div>

          {/* Mobile More */}
          <div className="lg:hidden relative shrink-0">
            {toolbarButton(
              MoreHorizontal,
              "More",
              (e) => {
                e.preventDefault();
                setMoreOpen((value) => !value);
              },
              moreOpen,
            )}

            <AnimatePresence>
              {moreOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setMoreOpen(false)}
                  />

                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute top-full left-[-160px] mt-15 lg:mt-2 w-56 bg-white rounded-xl border border-gray-200 shadow-lg p-1.5 z-20"
                  >
                    {/* Heading options tucked in here too, so mobile isn't missing them */}
                    <button
                      onClick={() =>
                        editor
                          ?.chain()
                          .focus()
                          .toggleHeading({ level: 1 })
                          .run()
                      }
                      className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg cursor-pointer ${
                        editorState?.heading1
                          ? "bg-[#4274D9]/10 text-[#4274D9]"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <Heading1 size={16} />
                      Heading 1
                    </button>

                    <button
                      onClick={() =>
                        editor
                          ?.chain()
                          .focus()
                          .toggleHeading({ level: 2 })
                          .run()
                      }
                      className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg cursor-pointer ${
                        editorState?.heading2
                          ? "bg-[#4274D9]/10 text-[#4274D9]"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <Heading2 size={16} />
                      Heading 2
                    </button>

                    <button
                      onClick={() =>
                        editor
                          ?.chain()
                          .focus()
                          .toggleHeading({ level: 3 })
                          .run()
                      }
                      className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg cursor-pointer ${
                        editorState?.heading3
                          ? "bg-[#4274D9]/10 text-[#4274D9]"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <Heading3 size={16} />
                      Heading 3
                    </button>

                    <div className="h-px bg-gray-100 my-1.5" />

                    <button
                      onClick={() =>
                        editor?.chain().focus().toggleStrike().run()
                      }
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer"
                    >
                      <Strikethrough size={16} />
                      Strikethrough
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ---------------- EDITOR ---------------- */}

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.4,
            delay: 0.1,
            ease: "easeOut",
          }}
          className="flex-1 overflow-y-auto px-4 sm:px-10 py-8"
        >
          <div className="max-w-3xl mx-auto ">
            {/* Prompt Button */}
            <div className=" fixed bg-white top-30 left-50-translate-x-1/2 w-full max-w-3xl px-2 sm:px-10 z-30">
              <button
                onClick={() => setPromptBoxOpen(!promptBoxOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 cursor-pointer"
              >
                <FileText size={14} />
                Prompts
              </button>

              {/* Prompt Box */}

              {promptBoxOpen && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.3,
                    ease: "easeOut",
                  }}
                  className="flex items-end gap-2 mb-6"
                >
                  <textarea
                    rows={1}
                    className=" md:w-[calc(100%-200px)] mt-3 w-[60%] resize-none overflow-hidden border border-gray-300 rounded-2xl p-3 focus:outline-none focus:border-[#4274D9]"
                    placeholder="Enter a prompt..."
                    onInput={(e) => {
                      e.target.style.height = "auto";

                      e.target.style.height = `${e.target.scrollHeight}px`;
                    }}
                    onChange={(e) => setPrompt(e.target.value)}
                  />
                  {prompt && (
                    <motion.button
                      initial={{
                        opacity: 0,
                        x: 10,
                      }}
                      animate={{
                        opacity: 1,
                        x: 0,
                      }}
                      transition={{
                        duration: 0.3,
                        ease: "easeOut",
                      }}
                      onClick={handleBennie}
                      disabled={aiLoading}
                      className="cursor-pointer bg-[#4274D9] text-white h-[50px] w-[50px] flex items-center justify-center rounded-xl hover:bg-[#2e5bb5] transition-colors disabled:opacity-70"
                    >
                      {aiLoading ? (
                        <Loader size="sm" color="#ffffff" />
                      ) : (
                        <ArrowUp size={20} />
                      )}
                    </motion.button>
                  )}
                </motion.div>
              )}
            </div>

            {/* Tiptap Editor */}

            <div className="mt-5">
              <EditorContent editor={editor} />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Word Count */}

      <div className="fixed bottom-0 right-5 p-3">
        {wordCount ? (
          <motion.small
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.3,
              ease: "easeOut",
            }}
            className="hidden lg:block items-center font-semibold text-[0.8rem] text-gray-600 hover:text-[#17171A]"
          >
            {wordCount} words
          </motion.small>
        ) : null}
      </div>
    </div>
  );
};

export default EditorPage;
