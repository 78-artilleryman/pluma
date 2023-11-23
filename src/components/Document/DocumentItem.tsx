// Document.tsx

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { timeSince } from "src/utils/TimeSince";
import { DocumentInfo } from "../../store/document/types";
import { getInitialTheme } from "../../utils/theme";
import styles from "./Document.module.scss";
import CreateModal from "src/utils/CreateModal";

interface DocumentProps {
  documentData: DocumentInfo;
  onDeleteDocument: (documentId: number) => void;
  onTitleImageDocument: ()=> void;
}

const DocumentItem: React.FC<DocumentProps> = ({ documentData, onDeleteDocument, onTitleImageDocument }) => {
  const [timeAgo, setTimeAgo] = useState("");

 

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", getInitialTheme());
  }, []);
  useEffect(() => {
    const timeAgoString = timeSince(documentData.regDate);
    setTimeAgo(timeAgoString);
  }, [documentData.regDate]);

  const [isMenuOpen, setIsMenuOpen] = useState(false); // 메뉴 상태

  const handleMenuToggle = (event: React.MouseEvent) => {
    event.preventDefault();
    setIsMenuOpen(!isMenuOpen); // 메뉴 상태 토글
  };

  const handleDeleteClick = (event: React.MouseEvent) => {
    event.preventDefault();
    onDeleteDocument(documentData.documentId);
  };

  const handleTitleImageClick = (event: React.MouseEvent) => {
    event.preventDefault();
    onTitleImageDocument();
  };
  return (
    <Link to={`/document/${documentData.documentId}`} className={styles.documentLink}>
      <div className={styles.documentCard}>
        {/* <p>{documentData.documentId}</p> */}
        <h3 className={styles.documentTitle}>{documentData.title}</h3>
        {/* <p>작성자: {documentData.username}</p> */}
        {/* <p>작성일: {documentData.regDate}</p>
      <p>수정일: {documentData.modDate}</p> */}
        <p className={styles.documentDescription}>{timeAgo}</p>
        <button onClick={handleMenuToggle} className={styles.menuButton}>
          ...
        </button>
        {isMenuOpen && (
          <div className={styles.menu}>
            <button onClick={handleDeleteClick} className={styles.menuItem}>
              Delete
            </button>
            <button onClick={handleTitleImageClick} className={styles.menuItem}>
              TitleImage
            </button>
          </div>
        )}
     
      </div>
    </Link>
  );
};

export default DocumentItem;
