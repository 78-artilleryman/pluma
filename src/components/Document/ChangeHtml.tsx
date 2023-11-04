import React from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import ReactQuill from "react-quill";
import axios from "axios";

interface PdfModalProps {
  htmlString: string;
  editorRef: React.RefObject<ReactQuill>;
}

export const captureAndDownloadPdf = async (
  editorRef: React.RefObject<ReactQuill>,
  fileName: string = "document"
) => {
  if (editorRef.current) {
    const quillInstance = editorRef.current.getEditor();
    const editorElement = quillInstance.root;

    const images = editorElement.getElementsByTagName("img");
    for (let img of Array.from(images)) {
      try {
        const response = await axios.get(img.src, { responseType: "blob" });
        const blobUrl = URL.createObjectURL(response.data);
        img.src = blobUrl;
      } catch (error) {
        console.error("Error fetching image", error);
      }
    }

    editorElement.classList.add("avoid-break");

    const originalStyles = {
      overflowY: editorElement.style.overflowY,
      height: editorElement.style.height,
      backgroundColor: editorElement.style.backgroundColor,
      color: editorElement.style.color,
    };

    Object.assign(editorElement.style, {
      overflowY: "visible",
      height: "auto",
      backgroundColor: "white",
      color: "black",
    });

    const canvas = await html2canvas(editorElement, {
      useCORS: true,
      logging: true,
    });

    const imgWidth = 210;
    const initialPageHeight = 297;
    const subsequentPageHeight = 280;
    const margin = 10;

    const doc = new jsPDF({
      unit: "mm",
      format: "a4",
    });

    let remainingImgHeight = (canvas.height * imgWidth) / canvas.width;
    let currentPageHeight = 0;
    let pageIndex = 0;

    while (remainingImgHeight > 0) {
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

      const topMargin = pageIndex === 0 ? 5 : 20;
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

    Object.assign(editorElement.style, originalStyles);

    doc.save(`${fileName}.pdf`);
  }
};

const ChangeHtml: React.FC<PdfModalProps> = ({ htmlString, editorRef }) => {
  const handleClick = () => {
    captureAndDownloadPdf(editorRef);
  };

  return (
    <div>
      <button onClick={handleClick}>PDF 생성1</button>
    </div>
  );
};

export default ChangeHtml;
