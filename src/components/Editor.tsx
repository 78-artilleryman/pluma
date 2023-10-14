import React, { useRef, useEffect, useState } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./Editor.scss";
import { ImageResize } from "quill-image-resize-module-ts";
import { captureAndDownloadPdf } from "./Document/ChangeHtml";
import CreateModal from "src/utils/CreateModal";
import styles from "../components/Document/AddDocumentItem.module.scss";
import { uploadPictureRequest } from "src/store/version/versionActions";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { selectImageUrl } from "src/store/version/versionSelectors";
Quill.register("modules/ImageResize", ImageResize); // 이미지 리사이징 모듈 등록

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
  const dispatch = useDispatch();
  const { documentId } = useParams();
  const imgUrl = useSelector(selectImageUrl);

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
      const uploadButton = document.querySelector(".ql-upload") as HTMLElement;
      const handlePdfButtonClick = () => {
        setIsPdfNameModalOpen(true);
      };
      if (pdfButton) {
        pdfButton.addEventListener("click", handlePdfButtonClick);
      }
      if (uploadButton) {
        uploadButton.addEventListener("click", handleImageUpload);
      }
      return () => {
        pdfButton?.removeEventListener("click", handlePdfButtonClick);
        uploadButton?.removeEventListener("click", handleImageUpload);
      };
    }
  }, []);

  useEffect(() => {
    if (imgUrl !== null) {
      const baseImageUrl = `https://dowonbucket.s3.ap-northeast-2.amazonaws.com/`;
      const uploadedImageUrl = baseImageUrl + imgUrl;
      console.log(uploadedImageUrl);
      const editor = editorRef.current?.getEditor();

      if (editor && uploadedImageUrl) {
        const range = editor.getSelection(true);
        editor.insertEmbed(range.index + 1, "image", uploadedImageUrl, "user"); // 이미지 추가
      }
    }
  }, [imgUrl]);

  const handleSavePdfName = () => {
    if (pdfFileNameRef.current) {
      setPdfFileName(pdfFileNameRef.current.value);
      captureAndDownloadPdf(editorRef, pdfFileNameRef.current.value);
      setIsPdfNameModalOpen(false);
    }
  };
  const handleImageUpload = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.addEventListener("change", async (e: Event) => {
      const inputElement = e.target as HTMLInputElement;
      if (inputElement.files && inputElement.files.length > 0) {
        const file = inputElement.files[0];
        if (file) {
          dispatch(uploadPictureRequest({ documentId: documentId, imageFile: file }));
        }
      } else {
        alert("이미지를 선택하세요.");
      }
    });
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
    "image",
  ];
  const handleEditorChange = (newHtmlStr: string) => {
    setContent(newHtmlStr);
  };

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
            ["link", "video", "code-block", "image"],
            [{ color: [] }, { background: [] }],
            [{ align: [] }],
            ["clean"],
            ["compare"], // "비교하기" 레이블을 가진 버튼 정의
            ["pdf"],
            ["upload"], // 사진 업로드
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
