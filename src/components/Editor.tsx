import React, { useRef, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Quill의 기본 스타일
import "./Editor.module.scss";

interface IEditor {
  content: string | null;
  setContent: React.Dispatch<React.SetStateAction<string | null>>;
  selectedLineNumber: number | null;
}

const Editor: React.FC<IEditor> = ({ content, setContent, selectedLineNumber }) => {
  const editorRef = useRef<ReactQuill | null>(null);

  useEffect(() => {
    if (editorRef.current && typeof selectedLineNumber === "number") {
      const editor = editorRef.current.getEditor();
      const lines = editor.getLines();

      if (lines[selectedLineNumber - 1]) {
        const index = editor.getIndex(lines[selectedLineNumber - 1]);
        editor.setSelection(index, 0);
      }
    }
  }, [selectedLineNumber]);

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "video",
    "image",
    "code-block",
    "table",
    "align",
    "color",
    "background",
  ];

  const handleEditorChange = (newHtmlStr: string) => {
    setContent(newHtmlStr);
  };

  useEffect(() => {
    const adjustEditorHeight = () => {
      if (editorRef.current) {
        const editor = editorRef.current.getEditor();
        const quillRoot = editor.root;
        const screenHeight = window.innerHeight;
        const desiredHeight = screenHeight - 160;
        quillRoot.style.height = `${desiredHeight}px`;
      }
    };

    adjustEditorHeight();
    window.addEventListener("resize", adjustEditorHeight);

    return () => {
      window.removeEventListener("resize", adjustEditorHeight);
    };
  }, []);

  return (
    <div>
      <ReactQuill
        ref={editorRef}
        value={content || ""}
        onChange={handleEditorChange}
        modules={{
          toolbar: [
            [
              { header: [1, 2, 3, 4, 5, 6] },
              { size: ["small", false, "large", "huge"] },
              { font: [] },
            ],
            ["bold", "italic", "underline", "strike", "blockquote"],
            [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
            ["link", "video", "image", "code-block"],
            [{ color: [] }, { background: [] }],
            [{ align: [] }],
            ["clean"],
          ],
          clipboard: {
            matchVisual: false,
          },
        }}
        formats={formats}
      />
    </div>
  );
};

export default Editor;
