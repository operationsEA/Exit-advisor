"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { FontFamily } from "@tiptap/extension-font-family";
import { Highlight } from "@tiptap/extension-highlight";
import {
  Box,
  Button,
  Divider,
  Paper,
  Tooltip,
  useTheme,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import {
  FiBold,
  FiItalic,
  FiCode,
  FiList,
  FiCheckSquare,
  FiRotateCcw,
} from "react-icons/fi";

import {
  FaQuoteLeft,
  FaStrikethrough,
  FaPalette,
  FaHighlighter,
} from "react-icons/fa";

import {
  LuHeading1,
  LuHeading2,
  LuHeading3,
  LuSeparatorHorizontal,
} from "react-icons/lu";
import "./TipTapEditor.css";

const MenuButton = ({ onClick, isActive, disabled, title, icon: Icon }) => {
  const theme = useTheme();
  return (
    <Tooltip title={title}>
      <Button
        size="small"
        onClick={onClick}
        disabled={disabled}
        sx={{
          minWidth: "auto",
          padding: "6px 8px",
          color: isActive ? "#0884ff" : "#6b7280",
          backgroundColor: isActive ? "rgba(8, 132, 255, 0.1)" : "transparent",
          border: isActive ? "1px solid #0884ff" : "1px solid transparent",
          borderRadius: 1,
          "&:hover": {
            backgroundColor: "rgba(8, 132, 255, 0.05)",
          },
          "&.Mui-disabled": {
            opacity: 0.5,
          },
        }}
      >
        <Icon size={16} />
      </Button>
    </Tooltip>
  );
};

const ColorButton = ({ onClick, disabled, title, icon: Icon, color }) => {
  return (
    <Tooltip title={title}>
      <Button
        size="small"
        onClick={onClick}
        disabled={disabled}
        sx={{
          minWidth: "auto",
          padding: "6px 8px",
          color: "#6b7280",
          backgroundColor: "transparent",
          border: "1px solid transparent",
          borderRadius: 1,
          position: "relative",
          "&:hover": {
            backgroundColor: "rgba(8, 132, 255, 0.05)",
          },
          "&.Mui-disabled": {
            opacity: 0.5,
          },
        }}
      >
        <Box
          sx={{
            position: "relative",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Icon size={16} />
          {color && (
            <Box
              sx={{
                position: "absolute",
                bottom: -2,
                right: -2,
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: color,
                border: "1px solid #fff",
              }}
            />
          )}
        </Box>
      </Button>
    </Tooltip>
  );
};

export default function TipTapEditor({
  value = "",
  onChange,
  placeholder = "Write something...",
  disabled = false,
  minHeight = 300,
  showMenuBar = true,
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color.configure({ types: ["textStyle"] }),
      FontFamily.configure({
        types: ["textStyle"],
      }),
      Highlight.configure({ multicolor: true }),
    ],
    content: value,
    immediatelyRender: false,
    editable: !disabled,
    onUpdate: ({ editor }) => {
      if (onChange) {
        onChange(editor.getHTML());
      }
    },
  });

  const FONT_FAMILIES = [
    { label: "Sans Serif", value: "sans-serif" },
    { label: "Serif", value: "serif" },
    { label: "Monospace", value: "monospace" },
    { label: "Courier New", value: "'Courier New', monospace" },
    { label: "Georgia", value: "Georgia, serif" },
    { label: "Trebuchet MS", value: "'Trebuchet MS', sans-serif" },
    { label: "Verdana", value: "Verdana, sans-serif" },
  ];

  const COLORS = [
    { label: "Black", value: "#000000" },
    { label: "Red", value: "#ef4444" },
    { label: "Orange", value: "#f97316" },
    { label: "Yellow", value: "#eab308" },
    { label: "Green", value: "#22c55e" },
    { label: "Blue", value: "#0884ff" },
    { label: "Purple", value: "#a855f7" },
    { label: "Pink", value: "#ec4899" },
    { label: "Gray", value: "#6b7280" },
  ];

  const HIGHLIGHT_COLORS = [
    { label: "Yellow", value: "#fef3c7" },
    { label: "Green", value: "#dcfce7" },
    { label: "Blue", value: "#dbeafe" },
    { label: "Pink", value: "#fce7f3" },
    { label: "Purple", value: "#f3e8ff" },
  ];

  if (!editor) {
    return null;
  }

  return (
    <Box sx={{ width: "100%" }}>
      {showMenuBar && (
        <Paper
          elevation={0}
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 0.5,
            p: 1,
            borderBottom: "1px solid #e5e7eb",
            backgroundColor: "#f9fafb",
            borderRadius: "4px 4px 0 0",
          }}
        >
          {/* Text formatting */}
          <MenuButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive("bold")}
            disabled={disabled}
            title="Bold (Ctrl+B)"
            icon={FiBold}
          />
          <MenuButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive("italic")}
            disabled={disabled}
            title="Italic (Ctrl+I)"
            icon={FiItalic}
          />
          <MenuButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive("strike")}
            disabled={disabled}
            title="Strikethrough"
            icon={FaStrikethrough}
          />
          <MenuButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            isActive={editor.isActive("code")}
            disabled={disabled}
            title="Inline Code"
            icon={FiCode}
          />

          <Divider
            orientation="vertical"
            sx={{ my: 1, height: "auto", opacity: 0.3 }}
          />

          {/* Headings */}
          <MenuButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            isActive={editor.isActive("heading", { level: 1 })}
            disabled={disabled}
            title="Heading 1"
            icon={LuHeading1}
          />
          <MenuButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            isActive={editor.isActive("heading", { level: 2 })}
            disabled={disabled}
            title="Heading 2"
            icon={LuHeading2}
          />
          <MenuButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            isActive={editor.isActive("heading", { level: 3 })}
            disabled={disabled}
            title="Heading 3"
            icon={LuHeading3}
          />

          <Divider
            orientation="vertical"
            sx={{ my: 1, height: "auto", opacity: 0.3 }}
          />

          {/* Lists */}
          <MenuButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive("bulletList")}
            disabled={disabled}
            title="Bullet List"
            icon={FiList}
          />
          <MenuButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive("orderedList")}
            disabled={disabled}
            title="Ordered List"
            icon={FiCheckSquare}
          />

          <Divider
            orientation="vertical"
            sx={{ my: 1, height: "auto", opacity: 0.3 }}
          />

          {/* Blocks */}
          <MenuButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive("blockquote")}
            disabled={disabled}
            title="Blockquote"
            icon={FaQuoteLeft}
          />
          <MenuButton
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            disabled={disabled}
            title="Horizontal Rule"
            icon={LuSeparatorHorizontal}
          />

          <Divider
            orientation="vertical"
            sx={{ my: 1, height: "auto", opacity: 0.3 }}
          />

          {/* Reset */}
          <MenuButton
            onClick={() => editor.chain().focus().clearNodes().run()}
            disabled={disabled}
            title="Clear Formatting"
            icon={FiRotateCcw}
          />

          <Divider
            orientation="vertical"
            sx={{ my: 1, height: "auto", opacity: 0.3 }}
          />

          {/* Font Family */}
          <FormControl sx={{ minWidth: 140 }} size="small">
            <Select
              value={
                editor.getAttributes("textStyle").fontFamily || "sans-serif"
              }
              onChange={(e) =>
                editor.chain().focus().setFontFamily(e.target.value).run()
              }
              disabled={disabled}
              sx={{
                height: 32,
                fontSize: "0.875rem",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#d1d5db",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#0884ff",
                },
              }}
            >
              {FONT_FAMILIES.map((font) => (
                <MenuItem key={font.value} value={font.value}>
                  {font.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Text Color */}
          <Tooltip title="Text Color">
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                px: 1,
                py: 0.5,
                border: "1px solid #d1d5db",
                borderRadius: 1,
                cursor: disabled ? "not-allowed" : "pointer",
                opacity: disabled ? 0.5 : 1,
                "&:hover": {
                  borderColor: "#0884ff",
                  backgroundColor: "rgba(8, 132, 255, 0.05)",
                },
              }}
            >
              <FaPalette size={14} style={{ color: "#6b7280" }} />
              <input
                type="color"
                value={editor.getAttributes("textStyle").color || "#000000"}
                onChange={(e) => {
                  editor.chain().focus().setColor(e.target.value).run();
                }}
                disabled={disabled}
                style={{
                  width: 24,
                  height: 24,
                  border: "none",
                  borderRadius: 4,
                  cursor: disabled ? "not-allowed" : "pointer",
                }}
              />
            </Box>
          </Tooltip>

          {/* Highlight Color */}
          <Tooltip title="Highlight Color">
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                px: 1,
                py: 0.5,
                border: "1px solid #d1d5db",
                borderRadius: 1,
                cursor: disabled ? "not-allowed" : "pointer",
                opacity: disabled ? 0.5 : 1,
                "&:hover": {
                  borderColor: "#0884ff",
                  backgroundColor: "rgba(8, 132, 255, 0.05)",
                },
              }}
            >
              <FaHighlighter size={14} style={{ color: "#6b7280" }} />
              <input
                type="color"
                value={editor.getAttributes("highlight").color || "#fef3c7"}
                onChange={(e) => {
                  if (e.target.value) {
                    editor
                      .chain()
                      .focus()
                      .setHighlight({ color: e.target.value })
                      .run();
                  }
                }}
                disabled={disabled}
                style={{
                  width: 24,
                  height: 24,
                  border: "none",
                  borderRadius: 4,
                  cursor: disabled ? "not-allowed" : "pointer",
                }}
              />
            </Box>
          </Tooltip>
        </Paper>
      )}

      <Paper
        elevation={0}
        sx={{
          border: disabled ? "1px solid #e5e7eb" : "1px solid #dbe5f2",
          borderRadius: showMenuBar ? "0 0 4px 4px" : "4px",
          backgroundColor: disabled ? "#f3f4f6" : "#ffffff",
          overflow: "hidden",
          "& .ProseMirror": {
            minHeight: minHeight,
            padding: 2,
            outline: "none",
            fontSize: "0.95rem",
            lineHeight: 1.6,
            color: disabled ? "#9ca3af" : "#0f172a",
          },
        }}
      >
        <EditorContent editor={editor} disabled={disabled} />
      </Paper>
    </Box>
  );
}
