import React, { useRef, useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./Editor.module.scss";
interface IEditor {
  content: string | undefined;
  setContent: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const Editor: React.FC<IEditor> = ({ content, setContent }) => {
  const editorRef = useRef<ReactQuill | null>(null);
  const [isEditorFocused, setIsEditorFocused] = useState(false);

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

  // 에디터 내용이 변경될 때 호출되는 핸들러
  const handleEditorChange = (newHtmlStr: string) => {
    setContent(newHtmlStr);
  };

  useEffect(() => {
    // 에디터 컴포넌트가 처음 렌더링될 때 초기 높이 설정
    if (editorRef.current) {
      const editor = editorRef.current.getEditor();
      const quillRoot = editor.root;
      const screenHeight = window.innerHeight;
      const desiredHeight = screenHeight - 119; // 예를 들어, 여유 공간을 위해 16px을 더 빼줄 수 있습니다.

      quillRoot.style.height = `${desiredHeight}px`; // 계산된 높이를 설정
    }
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
