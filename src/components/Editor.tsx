import React, { useRef, useEffect, useState } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./Editor.scss";
import { ImageResize } from "quill-image-resize-module-ts";
import { captureAndDownloadPdf } from "./Document/ChangeHtml";
import CreateModal from "src/utils/CreateModal";
import styles from "../components/Document/AddDocumentItem.module.scss";
Quill.register("modules/ImageResize", ImageResize);

interface IEditor {
  editorRef: React.RefObject<ReactQuill>;
  content: string | null;
  setContent: React.Dispatch<React.SetStateAction<string | null>>;
  selectedLineNumber: number | null;
  toggleComparator: () => void;
  isComparatorVisible: boolean;
}

const Editor: React.FC<IEditor> = ({
  content,
  setContent,
  selectedLineNumber,
  toggleComparator,
  isComparatorVisible,
  editorRef,
}) => {
  useEffect(() => {
    if (editorRef.current) {
      const compareButton = document.querySelector(".ql-compare") as HTMLElement;
      const onCompareButtonClick = () => {
        toggleComparator();
        compareButton.classList.toggle("ql-active", isComparatorVisible);
      };
      if (compareButton) {
        compareButton.addEventListener("click", onCompareButtonClick);
      }
      return () => {
        compareButton?.removeEventListener("click", onCompareButtonClick);
      };
    }
  }, [toggleComparator, isComparatorVisible]);

  const [isPdfNameModalOpen, setIsPdfNameModalOpen] = useState(false);
  const [pdfFileName, setPdfFileName] = useState("document");
  const pdfFileNameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editorRef.current) {
      const pdfButton = document.querySelector(".ql-pdf") as HTMLElement;
      const handlePdfButtonClick = () => {
        setIsPdfNameModalOpen(true);
      };
      if (pdfButton) {
        pdfButton.addEventListener("click", handlePdfButtonClick);
      }
      return () => {
        pdfButton?.removeEventListener("click", handlePdfButtonClick);
      };
    }
  }, []);

  const handleSavePdfName = () => {
    if (pdfFileNameRef.current) {
      setPdfFileName(pdfFileNameRef.current.value);
      captureAndDownloadPdf(editorRef, pdfFileNameRef.current.value); // Ensure captureAndDownloadPdf accepts file name
      setIsPdfNameModalOpen(false);
    }
  };
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
    "code-block",
    "table",
    "align",
    "color",
    "background",
    "compare",
  ];
  const handleEditorChange = (newHtmlStr: string) => {
    setContent(newHtmlStr);
  };

  useEffect(() => {
    // const adjustEditorHeight = () => {
    //   if (editorRef.current) {
    //     const editor = editorRef.current.getEditor();
    //     const quillRoot = editor.root;
    //     const screenHeight = window.innerHeight;
    //     const desiredHeight = screenHeight - 118;
    //     quillRoot.style.minHeight = `${desiredHeight}px`;
    //   }
    // };
    Quill.register("modules/ImageResize", ImageResize);

    // adjustEditorHeight();
    // window.addEventListener("resize", adjustEditorHeight);

    // return () => {
    //   window.removeEventListener("resize", adjustEditorHeight);
    // };
  }, []);

  return (
    <div>
      <ReactQuill
        theme="snow"
        ref={editorRef}
        value={content || ""}
        onChange={handleEditorChange}
        modules={{
          ImageResize: {
            parchment: Quill.import("parchment"),
            modules: ["Resize", "DisplaySize"],
          },
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
            ["compare"], // "비교하기" 레이블을 가진 버튼 정의
            ["pdf"],
          ],
          clipboard: {
            matchVisual: false,
          },
        }}
        formats={formats}
      />
      {isPdfNameModalOpen && (
        <CreateModal isOpen={isPdfNameModalOpen} onClose={() => setIsPdfNameModalOpen(false)}>
          <h2>PDF 명</h2>
          <input
            className={styles.title}
            ref={pdfFileNameRef}
            type="text"
            defaultValue={pdfFileName}
          />
          <button
            className={styles.button}
            onClick={handleSavePdfName}
            style={{ marginRight: "10px" }}
          >
            저장
          </button>
          <button className={styles.button} onClick={() => setIsPdfNameModalOpen(false)}>
            취소
          </button>
        </CreateModal>
      )}
    </div>
  );
};

export default Editor;
