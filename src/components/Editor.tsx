import React, { useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./Editor.scss";
import {uploadPictureRequest} from "../store/version/versionActions";
import {selectImageUrl, selectVersionLoading} from "../store/version/versionSelectors"


interface IEditor {
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
}) => {
  const editorRef = useRef<ReactQuill | null>(null);

  const dispatch = useDispatch();
  const { documentId } = useParams();
  const imgUrl = useSelector(selectImageUrl);
  

  useEffect(() => {
    if (editorRef.current) {
      const compareButton = document.querySelector(".ql-compare") as HTMLElement;
      if (compareButton) {
        compareButton.addEventListener("click", toggleComparator);
        if (isComparatorVisible) {
          compareButton.classList.add("ql-active");
        } else {
          compareButton.classList.remove("ql-active");
          compareButton.blur(); // 포커스 제거
        }
      }
    }
  }, [toggleComparator]);

  const handleImageUpload = () => {
    const imgElement = document.createElement("img");
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();
  
    input.addEventListener("change", (e: Event) => {
      const inputElement = e.target as HTMLInputElement;
      if (inputElement.files && inputElement.files.length > 0) {
        const file = inputElement.files[0];
        if (file) {
          const reader = new FileReader();
          // 파일이 선택된 경우 처리 로직을 진행합니다.
          dispatch(uploadPictureRequest({ documentId: documentId, imageFile: file }))
          
          const imageUrl = `https://dowonbucket.s3.ap-northeast-2.amazonaws.com/`;
          
          console.log(imageUrl);
          console.log(imgUrl);
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


  useEffect(() => {
    console.log(editorRef.current?.selection?.index)
  },[content])
  useEffect(() =>{
    const upLoadButton = document.querySelector(".ql-upload") as HTMLElement;

    if(upLoadButton){
      upLoadButton.addEventListener("click", ()=>{
     
        handleImageUpload(); 
      })
    }
  },[])

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
    "compare",
    "upload",
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
            ["compare"], // "비교하기" 레이블을 가진 버튼 정의
            ["upload"], // 사진 업로드
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
