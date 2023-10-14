import React, { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import ReactQuill from "react-quill";

interface PdfModalProps {
  htmlString: string;
  editorRef: React.RefObject<ReactQuill>;
}

export const captureAndDownloadPdf = async (
  editorRef: React.RefObject<ReactQuill>,
  fileName?: string
) => {
  if (editorRef.current) {
    const quillInstance = editorRef.current.getEditor();
    const editorElement = quillInstance.root;

    // 1. [CSS 페이지 나누기 사용]
    //  - CSS 클래스를 사용하여 각 섹션의 페이지 분할을 최적화합니다.
    editorElement.classList.add("avoid-break");


    const originalOverflowY = editorElement.style.overflowY;
    const originalHeight = editorElement.style.height;
    const originalBackgroundColor = editorElement.style.backgroundColor;
    const originalColor = editorElement.style.color;


    editorElement.style.overflowY = "visible";
    editorElement.style.height = "auto";
    editorElement.style.backgroundColor = "white";
    editorElement.style.color = "black";

    const canvas = await html2canvas(editorElement);

    const imgWidth = 210;
    const initialPageHeight = 297;
    const subsequentPageHeight = 280;
    const margin = 10;
    let topMargin = 30;


    const doc = new jsPDF({
      orientation: "p",
      unit: "mm",
      format: "a4",
    });

    let remainingImgHeight = (canvas.height * imgWidth) / canvas.width;
    let currentPageHeight = 0;
    let pageIndex = 0;

    while (remainingImgHeight > 0) {
      // 2. [캡쳐 전 렌더링 최적화]
      const pageHeight = pageIndex === 0 ? initialPageHeight : subsequentPageHeight;

      const canvas1 = document.createElement("canvas");
      canvas1.width = canvas.width;
      canvas1.height = (pageHeight * canvas.width) / imgWidth;
      const ctx = canvas1.getContext("2d");
      ctx?.drawImage(
        canvas,
        0,
        currentPageHeight * (canvas.width / imgWidth),
        canvas.width,
        (pageHeight * canvas.width) / imgWidth,
        0,
        0,
        canvas.width,
        (pageHeight * canvas.width) / imgWidth
      );

      if (pageIndex === 0) {
        topMargin = 5;
      } else {
        topMargin = 20;

      }

      // 3. [캔버스 렌더링 로직 최적화]
      //  - 이미지의 크기와 위치를 정교하게 조절하여 페이지에서 텍스트가 잘리지 않도록 합니다.
      const scaledHeight = (canvas1.height * (imgWidth - 2 * margin)) / canvas1.width;
      doc.addImage(
        canvas1.toDataURL("image/png"),
        "PNG",
        margin,
        topMargin,
        imgWidth - 2 * margin,
        scaledHeight
      );

      remainingImgHeight -= pageHeight;
      currentPageHeight += pageHeight;

      if (remainingImgHeight > 0) {
        doc.addPage();
      }
      pageIndex++;
    }

    editorElement.style.overflowY = originalOverflowY;
    editorElement.style.height = originalHeight;
    editorElement.style.backgroundColor = originalBackgroundColor;
    editorElement.style.color = originalColor;

    doc.save(`${fileName}.pdf`);
  }
};

const ChangeHtml: React.FC<PdfModalProps> = ({ htmlString, editorRef }) => {
  const handleClick = () => {
    captureAndDownloadPdf(editorRef);
  };
  // const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  // const closeModal = () => {
  //   setIsPdfModalOpen(false);
  // };

  // const pdfClick = () => {
  //   if (isPdfModalOpen) {
  //     setIsPdfModalOpen(false);
  //   }
  //   setIsPdfModalOpen(true);
  // };

  return (
    <div>

      <button onClick={handleClick}>PDF 생성1</button>
      {/* {isPdfModalOpen && (
        <div className={styles.container}>
          <div>
            <button onClick={captureAndDownloadPdf}>생성하기</button>
            <button onClick={closeModal}>취소</button>
          </div>
>>>>>>> 5e8a9790e54778881274a459b5d7a8c6600346a0
        </div>
      )} */}
    </div>
  );
};

export default ChangeHtml;
