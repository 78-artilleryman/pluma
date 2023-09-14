// Document.tsx

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { timeSince } from "src/utils/TimeSince";
import { DocumentInfo } from "../../store/document/types";
import { getInitialTheme } from "../../utils/theme";
import styles from "./Document.module.scss";

interface DocumentProps {
  documentData: DocumentInfo; // Document 인터페이스를 사용하여 타입 지정
}

const Document: React.FC<DocumentProps> = ({ documentData }) => {
  const [timeAgo, setTimeAgo] = useState("");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", getInitialTheme());
  }, []);
  useEffect(() => {
    // 문서의 날짜를 현재 시간을 기준으로 얼마나 지났는지로 변환
    const timeAgoString = timeSince(documentData.regDate);
    setTimeAgo(timeAgoString);
  }, [documentData.regDate]);

  return (
    <Link to={`/document/${documentData.documentId}`} className={styles.documentLink}>
      <div className={styles.documentCard}>
        {/* <p>{documentData.documentId}</p> */}
        <h3 className={styles.documentTitle}>{documentData.title}</h3>
        {/* <p>작성자: {documentData.username}</p> */}
        {/* <p>작성일: {documentData.regDate}</p>
      <p>수정일: {documentData.modDate}</p> */}
        <p className={styles.documentDescription}>{timeAgo}</p>
      </div>
    </Link>
  );
};

export default Document;
