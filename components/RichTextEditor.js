// components/RichTextEditor.js
import React, { useRef } from "react";
import dynamic from "next/dynamic";

// Dynamically import React-Quill without SSR
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

import styles from "@/styles/Upload.module.css"

export default function RichTextEditor({ value, onChange, placeholder }) {
  const quillRef = useRef(null);

  

  const modules = {
    toolbar: {
      container: [
        [{ header: "1" }, { header: "2" }, { font: [] }],
        [{ size: [] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image", "video"],
        [{ align: [] }],
        ["clean"],
      ],
    },
  };

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "link",
    "image",
    "align",
  ];

  return (
    <ReactQuill
      ref={quillRef}
      theme="snow"
      modules={modules}
      formats={formats}
      placeholder={placeholder || "Enter text..."}
      value={value}
      onChange={onChange}
      className={styles.reactquillinputfield}
    />
  );
}