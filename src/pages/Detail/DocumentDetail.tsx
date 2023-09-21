import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import { loadDocumentRequest } from "../../store/document/documentActions";
import { selectSingleDocument } from "../../store/document/documentSelectors";
import { getInitialTheme } from "../../utils/theme";
import Editor from "../../components/Editor";
import styles from "../../components/Document/Document.module.scss";
import { formatDate } from "../../utils/dateUtils";
import Modal from "../../utils/Modal"; // 모달 컴포넌트 import
import { selectIsAuthenticated } from "../../store/auth/authSelectors";
import DocumentVersionList from "../../components/Document/DocumentVersionList";
import { selectSingleVersion } from "../../store/version/versionSelectors";

const DocumentDetailPage: React.FC = () => {
  const { documentId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const detailDocument = useSelector(selectSingleDocument);
  const detailVersion = useSelector(selectSingleVersion);
  const [content, setContent] = useState<string | undefined>(detailVersion?.content);
  useEffect(() => {
    console.log(detailVersion);
  }, [detailVersion]);
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", getInitialTheme());
    if (documentId) {
      dispatch(loadDocumentRequest(documentId));
    }
  }, [documentId, dispatch]);

  // 모달 상태 추가
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // 사용자가 로그인하지 않은 경우 모달 열기
    if (!isAuthenticated) {
      setIsModalOpen(true);
    } else {
      setIsModalOpen(false);
    }
  }, [isAuthenticated]);

  // 모달을 닫기 위한 함수
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const [selectedVersionSubtitle, setSelectedVersionSubtitle] = useState<string | undefined>("");
  const [selectedVersionDate, setSelectedVersionDate] = useState<string | undefined>("");

  // 버전 선택을 처리하는 함수를 업데이트합니다
  const handleVersionSelect = (subtitle: string | undefined, createdAt: string | undefined) => {
    setSelectedVersionSubtitle(subtitle || "");
    setSelectedVersionDate(createdAt || "");
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
        <div className={styles.editorContainer}>
          <Editor content={content} setContent={setContent} />
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
            <DocumentVersionList
              content={content}
              setContent={setContent}
              handleVersionSelect={handleVersionSelect}
              setSelectedVersionSubtitle={setSelectedVersionSubtitle}
              setSelectedVersionDate={setSelectedVersionDate}
            />
          </div>
        </div>
      </div>
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <h2>로그인이 필요합니다</h2>
          <p>문서를 보려면 먼저 로그인하세요.</p>
        </Modal>
      )}
    </Layout>
  );
};

export default DocumentDetailPage;
