import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import styles from "./ChangeHtml.module.scss";


interface PdfModalProps {
  htmlString: string;
}

const ChangeHtml: React.FC<PdfModalProps> = ({ htmlString }) => {
  const containerRef = useRef<HTMLDivElement>(null);

 
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  const captureAndDownloadPdf = async () => {
    if (containerRef.current) {
      const canvas = await html2canvas(containerRef.current);
      const imgData = canvas.toDataURL('image/png');

      // PDF 생성
      const imgWidth = 210; // 가로(mm) (A4)
      const pageHeight = imgWidth * 1.414; // 세로 길이 (A4)
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const doc = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
      });

      let heightLeft = imgHeight;
      let position = 0;

      // 첫 페이지 출력
      doc.addImage(imgData, 'PNG', 10, 10, imgWidth - 20, imgHeight);
      heightLeft -= pageHeight;

      // 한 페이지 이상일 경우 루프 돌면서 출력
      while (heightLeft >= 20) {
        position = heightLeft - imgHeight;
        doc.addPage();
        doc.addImage(imgData, 'PNG', 10, position + 10, imgWidth - 20, imgHeight);
        heightLeft -= pageHeight;
      }

      // PDF 다운로드
      doc.save('capture.pdf');
      setIsPdfModalOpen(false)
    }
  };

  const closeModal = ()=>{
    setIsPdfModalOpen(false)
  }

  const pdfClick = () => {
    if(isPdfModalOpen){
      setIsPdfModalOpen(false)
    }
    setIsPdfModalOpen(true)
  }

  return (
    <div>
      <button onClick={pdfClick}>PDF 생성1</button>
      {isPdfModalOpen &&(
        <div className={styles.container}>
   
        <div ref={containerRef} className={styles.content}>
        {/* 이 부분에 HTML 태그가 그대로 유지되어야 함 */}
        <div dangerouslySetInnerHTML={{ __html: htmlString }} />
        </div>
        
        <div>
          <button onClick={captureAndDownloadPdf}>생성하기</button>
          <button onClick={closeModal}>취소</button>
        </div>
        
      </div>
      )}
  </div>
    
  );
};

export default ChangeHtml;

