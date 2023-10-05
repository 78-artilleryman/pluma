import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface PdfModalProps {
  htmlString: string;
}

const PdfModal: React.FC<PdfModalProps> = ({ htmlString }) => {
  const [pdfGenerated, setPdfGenerated] = useState(false);

  const generatePdf = () => {
    // HTML 문자열을 파싱하여 요소로 만듭니다.
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(htmlString, 'text/html');
    const htmlElement = htmlDoc.body;

    // 파싱된 HTML 요소를 현재 페이지의 어딘가에 추가합니다.
    document.body.appendChild(htmlElement);

    // 캡처 및 PDF 생성 로직은 그대로 유지합니다.
    html2canvas(document.body).then((canvas) => {
      // 캡처된 이미지 데이터를 얻습니다.
      const imgData = canvas.toDataURL("image/png");

      const imgWidth = 210; // 가로(mm) (A4)
      const pageHeight = imgWidth * 1.414; // 세로 길이 (A4)
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const doc = new jsPDF({
        orientation: "p",
        unit: "mm",
        format: "a4",
      });

      let heightLeft = imgHeight;
      let position = 0;

      // 첫 페이지 출력
      doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // 한 페이지 이상일 경우 루프 돌면서 출력
      while (heightLeft >= 20) {
        position = heightLeft - imgHeight;
        doc.addPage();
        doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // PDF를 저장합니다.
      doc.save("capture.pdf");

      // 캡처 후에 추가한 HTML 요소를 다시 제거합니다.
      document.body.removeChild(htmlElement);

      // PDF가 생성되었음을 표시합니다.
      setPdfGenerated(true);
    });
  };

  return (
    <div>
      {pdfGenerated ? (
        <p>PDF가 생성되었습니다.</p>
      ) : (
        <button onClick={generatePdf}>PDF 생성</button>
      )}
    </div>
  );
};

export default PdfModal;
