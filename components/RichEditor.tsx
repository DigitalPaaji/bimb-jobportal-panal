"use client";

import React, { useMemo } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(
  () => import("react-quill-new"),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[280px] items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-400 ">
        Loading editor...
      </div>
    ),
  }
);

/* =========================
   Types
========================= */

interface RichEditorProps {
  content?: string;
  setContent: any;
  placeholder?: string;
  minHeight?: string;
  readOnly?: boolean;
}

/* =========================
   Component
========================= */

const RichEditor: React.FC<RichEditorProps> = ({
  content = "",
  setContent,
  placeholder = "Write your content here...",
  minHeight = "280px",
  readOnly = false,
}) => {
  /* =========================
     Quill Modules
  ========================= */

  const modules = useMemo(
    () => ({
      toolbar: [
        [
          {
            header: [1, 2, 3, 4, 5, 6, false],
          },
        ],

        [
          "bold",
          "italic",
          "underline",
          "strike",
        ],

        [
          {
            color: [],
          },
          {
            background: [],
          },
        ],

        [
          {
            align: [],
          },
        ],

        [
          {
            list: "ordered",
          },
          {
            list: "bullet",
          },
        ],

        [
          {
            indent: "-1",
          },
          {
            indent: "+1",
          },
        ],

        [
          "blockquote",
          "code-block",
        ],

        [
          "clean",
        ],
      ],
    }),
    []
  );

  /* =========================
     Quill Formats
  ========================= */

  const formats = useMemo(
    () => [
      "header",

      "bold",
      "italic",
      "underline",
      "strike",

      "color",
      "background",

      "align",

      "list",
      "indent",

      "blockquote",
      "code-block",
    ],
    []
  );

  /* =========================
     Handle Editor Change
  ========================= */

  const handleChange = (
    value: string,
    _delta: unknown,
    _source: string,
    _editor: unknown
  ): void => {
    if (readOnly) return;

    setContent(value);
  };

  /* =========================
     JSX
  ========================= */

  return (
    <div
      className="
        rich-editor
        overflow-hidden
        rounded-xl
        border
        border-gray-200
        bg-white
      
      "
    >
      <ReactQuill
        theme="snow"
        value={content}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        readOnly={readOnly}
        preserveWhitespace
      />

      <style>{`
        /* ================================
           TOOLBAR
        ================================= */

        .rich-editor .ql-toolbar {
          border: 0;
          border-bottom: 1px solid #e5e7eb;
          background: #f9fafb;
          padding: 10px;
        }

        .dark .rich-editor .ql-toolbar {
          border-bottom-color: #374151;
          background: #11161d;
        }

        /* ================================
           CONTAINER
        ================================= */

        .rich-editor .ql-container {
          border: 0;
          font-family: inherit;
          font-size: 15px;
        }

        /* ================================
           EDITOR
        ================================= */

        .rich-editor .ql-editor {
          min-height: ${minHeight};
          padding: 16px;
          line-height: 1.7;
          color: #111827;
        }

        .dark .rich-editor .ql-editor {
          color: #f3f4f6;
        }

        /* ================================
           PLACEHOLDER
        ================================= */

        .rich-editor .ql-editor.ql-blank::before {
          color: #9ca3af;
          font-style: normal;
          left: 16px;
          right: 16px;
        }

        .dark .rich-editor .ql-editor.ql-blank::before {
          color: #6b7280;
        }

        /* ================================
           TOOLBAR ICONS
        ================================= */

        .rich-editor
          .ql-snow
          .ql-stroke {
          stroke: #4b5563;
        }

        .rich-editor
          .ql-snow
          .ql-fill {
          fill: #4b5563;
        }

        .dark
          .rich-editor
          .ql-snow
          .ql-stroke {
          stroke: #d1d5db;
        }

        .dark
          .rich-editor
          .ql-snow
          .ql-fill {
          fill: #d1d5db;
        }

        /* ================================
           TOOLBAR HOVER
        ================================= */

        .rich-editor
          .ql-toolbar
          button:hover
          .ql-stroke {
          stroke: #2563eb;
        }

        .rich-editor
          .ql-toolbar
          button:hover
          .ql-fill {
          fill: #2563eb;
        }

        /* ================================
           PICKERS
        ================================= */

        .dark .rich-editor .ql-picker-label {
          color: #d1d5db;
        }

        .dark .rich-editor .ql-picker-options {
          background: #11161d;
          border-color: #374151;
        }

        .dark .rich-editor .ql-picker-item {
          color: #d1d5db;
        }

        /* ================================
           HEADINGS
        ================================= */

        .rich-editor .ql-editor h1 {
          font-size: 2rem;
          line-height: 1.2;
          margin-bottom: 12px;
          font-weight: 700;
        }

        .rich-editor .ql-editor h2 {
          font-size: 1.5rem;
          line-height: 1.3;
          margin-bottom: 10px;
          font-weight: 700;
        }

        .rich-editor .ql-editor h3 {
          font-size: 1.25rem;
          line-height: 1.4;
          margin-bottom: 8px;
          font-weight: 600;
        }

        /* ================================
           BLOCKQUOTE
        ================================= */

        .rich-editor .ql-editor blockquote {
          border-left: 4px solid #9ca3af;
          padding-left: 14px;
          color: #6b7280;
          margin: 12px 0;
        }

        .dark .rich-editor .ql-editor blockquote {
          color: #9ca3af;
          border-left-color: #4b5563;
        }

        /* ================================
           CODE
        ================================= */

        .rich-editor .ql-editor pre {
          border-radius: 8px;
          padding: 14px;
          background: #111827;
          color: #f9fafb;
        }

        /* ================================
           LINKS
        ================================= */

        .rich-editor .ql-editor a {
          color: #2563eb;
          text-decoration: underline;
        }

        /* ================================
           IMAGES
        ================================= */

        .rich-editor .ql-editor img {
          max-width: 100%;
          height: auto;
          border-radius: 10px;
          margin: 12px 0;
        }

        /* ================================
           LIST
        ================================= */

        .rich-editor .ql-editor ul,
        .rich-editor .ql-editor ol {
          padding-left: 24px;
        }

        /* ================================
           SCROLLBAR
        ================================= */

        .rich-editor .ql-editor::-webkit-scrollbar {
          width: 6px;
        }

        .rich-editor .ql-editor::-webkit-scrollbar-track {
          background: transparent;
        }

        .rich-editor .ql-editor::-webkit-scrollbar-thumb {
          background: #9ca3af;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default RichEditor;
