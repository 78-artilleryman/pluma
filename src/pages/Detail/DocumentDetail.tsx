import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import { loadDocumentRequest } from "../../store/document/documentActions";
import { selectSingleDocument } from "../../store/document/documentSelectors";
import { getInitialTheme } from "../../utils/theme";
import Editor from "../../components/Editor";
import styles from "../../components/Document/Document.module.scss";
import { formatDate } from "src/utils/dateUtils";

const DocumentDetailPage: React.FC = () => {
  const { documentId } = useParams();
  const dispatch = useDispatch();
  const detailDocument = useSelector(selectSingleDocument);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", getInitialTheme());
    if (documentId) {
      dispatch(loadDocumentRequest(documentId));
    }
  }, [documentId, dispatch]);

  if (!detailDocument) {
    return <Layout>해당 문서를 찾을 수 없습니다.</Layout>;
  }

  return (
    <Layout>
      <div className={styles.container}>
        <h2>문서 상세 페이지</h2>
        <h3>제목: {detailDocument.title}</h3>
        <p>작성자: {detailDocument.username}</p>
        <p>작성일: {formatDate(new Date(detailDocument.regDate))}</p>

        {/* Editor 컴포넌트 추가 */}

        <div className={styles.editorContainer}>
          <Editor htmlStr={detailDocument.content} setHtmlStr={() => {}} />
        </div>
      </div>
      {/* 다른 문서 정보를 표시할 수 있음 */}
    </Layout>
  );
};

export default DocumentDetailPage;
