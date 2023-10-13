import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loadDocumentRequest } from "../../store/document/documentActions";
import { selectSingleDocument } from "../../store/document/documentSelectors";
import { getInitialTheme } from "../../utils/theme";
import Editor from "../../components/Editor";
import styles from "../../components/Document/Document.module.scss";
import { formatDate } from "../../utils/dateUtils";
import Modal from "../../utils/Modal";
import { selectIsAuthenticated } from "../../store/auth/authSelectors";
import DocumentVersionList from "../../components/Document/DocumentVersionList";
import { selectSingleVersion } from "../../store/version/versionSelectors";

import ContentComparator from "src/utils/ContentComparator";
import Layout from "src/components/Layout/Layout";
import ReactQuill from "react-quill";

const DocumentDetailPage: React.FC = () => {
  const { documentId } = useParams();
  const dispatch = useDispatch();
  const detailDocument = useSelector(selectSingleDocument);
  const detailVersion = useSelector(selectSingleVersion);
  const [content, setContent] = useState<string | null>(detailVersion?.content || null);
  const [comparatorContent, setComparatorContent] = useState<string | null>(null);

  const editorRef = useRef<ReactQuill | null>(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", getInitialTheme());
    if (documentId) {
      dispatch(loadDocumentRequest(documentId));
    }
  }, [documentId, dispatch]);

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      setIsModalOpen(true);
    } else {
      setIsModalOpen(false);
    }
  }, [isAuthenticated]);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const [selectedVersionSubtitle, setSelectedVersionSubtitle] = useState<string | undefined>("");
  const [selectedVersionDate, setSelectedVersionDate] = useState<string | undefined>("");
  const [selectedLineNumber, setSelectedLineNumber] = useState<number | null>(null);

  const [isComparatorVisible, setIsComparatorVisible] = useState(false);
  const toggleComparator = () => {
    setIsComparatorVisible(!isComparatorVisible);
  };

  const handleDiffLineClick = (lineNumber: number) => {
    setSelectedLineNumber(lineNumber);
  };

  if (!detailDocument) {
    return (
      <Layout>
        <div
          style={{
            margin: "0 auto ",
            textAlign: "center",
            display: "flex",
            height: "80vh",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          해당 문서를 찾을 수 없습니다.
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={styles.container}>
        <div className={`${styles.slideContainer} ${isComparatorVisible ? styles.visible : ""}`}>
          <ContentComparator
            currentContent={content}
            firstContent={comparatorContent || ""}
            onDiffLineClick={handleDiffLineClick}
          />
        </div>
        <div className={styles.editorContainer}>
          <Editor
            editorRef={editorRef}
            content={content}
            setContent={setContent}
            selectedLineNumber={selectedLineNumber}
            toggleComparator={toggleComparator}
            isComparatorVisible={isComparatorVisible}
          />
        </div>
        <div className={styles.documentInfo}>
          <div className={styles.documentInfoLeft}>
            <h3 style={{ margin: "0" }}>제목: {detailDocument.title}</h3>
            <p style={{ margin: "0" }}>작성일: {formatDate(new Date(detailDocument.regDate))}</p>
            <h4 style={{ margin: "0" }}>선택한 버전</h4>
            <p style={{ margin: "0" }}>{selectedVersionSubtitle}</p>
            <h4 style={{ margin: "0" }}>선택한 버전 날짜</h4>
            <p style={{ margin: "0" }}>
              {selectedVersionDate ? formatDate(new Date(selectedVersionDate)) : ""}
            </p>
          </div>
          <div className={styles.documentInfoRight}>
            <button
              onClick={toggleComparator}
              className={styles.button}
              style={{ marginLeft: "16px" }}
            >
              {isComparatorVisible ? "숨기기" : "비교 보기"}
            </button>
            <DocumentVersionList
              setIsComparatorVisible={setIsComparatorVisible}
              content={content}
              setContent={setContent}
              setComparatorContent={setComparatorContent}
              setSelectedVersionSubtitle={setSelectedVersionSubtitle}
              setSelectedVersionDate={setSelectedVersionDate}
            />
          </div>
        </div>
        {isModalOpen && (
          <Modal isOpen={isModalOpen} onClose={closeModal}>
            <h2>로그인이 필요합니다</h2>
            <p>문서를 보려면 먼저 로그인하세요.</p>
          </Modal>
        )}
      </div>
    </Layout>
  );
};

export default DocumentDetailPage;
