import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectIsAuthenticated, selectUser, selectUserInfo } from "../../store/auth/authSelectors";
import { loadDocumentsRequest } from "../../store/document/documentActions";
import {
  selectDocumentsList,
  selectDocumentLoading,
  selectDocumentError,
} from "../../store/document/documentSelectors";
import Modal from "../../utils/Modal";
import DocumentItem from "../../components/Document/DocumentItem";

import styles from "../../components/Document/Document.module.scss";
import Layout from "../../components/Layout/Layout";
import AddDocument from "../../components/Document/AddDocumentItem";

const DocumentList: React.FC = () => {
  const dispatch = useDispatch();
  const documents = useSelector(selectDocumentsList);
  const loading = useSelector(selectDocumentLoading);
  const error = useSelector(selectDocumentError);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // 모달 상태 추가
  const [isModalOpen, setIsModalOpen] = useState(false);
  const userInfo = useSelector(selectUserInfo);
  useEffect(() => {
    // 문서 목록을 불러오는 액션 디스패치
    if (!isAuthenticated) {
      setIsModalOpen(true); // 사용자가 로그인하지 않은 경우 모달 열기
    } else {
      setIsModalOpen(false);
      dispatch(loadDocumentsRequest(userInfo?.userId || ""));
    }
  }, [userInfo, isAuthenticated]);
  // 모달을 닫기 위한 함수
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <Layout>
      <h2 style={{ textAlign: "center", fontWeight: "600" }}>문서 목록</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : documents.length === 0 ? (
        <div style={{ textAlign: "center", marginTop: "100px" }}>
          <h1>문서가 없습니다.</h1>
        </div>
      ) : (
        <div className={styles.documentCardContainer}>
          {documents?.map((document) => (
            <DocumentItem key={document.documentId} documentData={document} />
          ))}
          <AddDocument />
        </div>
      )}
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <h2>로그인이 필요합니다</h2>
          <p>문서를 보려면 먼저 로그인하세요.</p>
        </Modal>
      )}
    </Layout>
  );
};

export default DocumentList;
