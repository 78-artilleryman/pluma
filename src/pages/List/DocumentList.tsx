import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectIsAuthenticated, selectUserInfo } from "../../store/auth/authSelectors";
import { deleteDocumentRequest, loadDocumentsRequest } from "../../store/document/documentActions";
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
import CreateModal from "src/utils/CreateModal";

const DocumentList: React.FC = () => {
  const dispatch = useDispatch();
  const documents = useSelector(selectDocumentsList);
  const loading = useSelector(selectDocumentLoading);
  const error = useSelector(selectDocumentError);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirmModalOpen, setDeleteConfirmModalOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);
  const userInfo = useSelector(selectUserInfo);

  useEffect(() => {
    if (!isAuthenticated) {
      setIsModalOpen(true);
    } else {
      setIsModalOpen(false);
      dispatch(loadDocumentsRequest(userInfo?.userId || ""));
    }
  }, [userInfo, isAuthenticated]);

  useEffect(() => {
    const handleEscapeKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        // ESC 키를 눌렀을 때 실행할 동작들
        setIsModalOpen(false);
        setDeleteConfirmModalOpen(false);
      }
    };

    // ESC 키 이벤트 리스너를 등록합니다.
    document.addEventListener("keydown", handleEscapeKeyPress);

    // 컴포넌트 언마운트 시 이벤트 리스너를 제거합니다.
    return () => {
      document.removeEventListener("keydown", handleEscapeKeyPress);
    };
  }, []);

  useEffect(() => {
    console.log("Document Updated: ", documents);
  }, [documents]);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const onDeleteDocument = (documentId: number) => {
    setDocumentToDelete(String(documentId));
    setDeleteConfirmModalOpen(true);
  };

  const confirmDeleteDocument = () => {
    if (documentToDelete !== null) {
      dispatch(
        deleteDocumentRequest({ userId: String(userInfo?.userId), documentId: documentToDelete })
      );
    }
    setDeleteConfirmModalOpen(false);
    setDocumentToDelete(null);
  };

  const cancelDeleteDocument = () => {
    setDeleteConfirmModalOpen(false);
    setDocumentToDelete(null);
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
          <AddDocument />
        </div>
      ) : (
        <div className={styles.documentCardContainer}>
          {documents.map((document) => (
            <DocumentItem
              key={document.documentId}
              documentData={document}
              onDeleteDocument={onDeleteDocument}
            />
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

      {deleteConfirmModalOpen && (
        <CreateModal isOpen={deleteConfirmModalOpen} onClose={cancelDeleteDocument}>
          <h2>문서 삭제</h2>
          <p>정말로 이 문서를 삭제하시겠습니까?</p>
          <button
            className={styles.dangerBtn}
            style={{ marginRight: "10px" }}
            onClick={confirmDeleteDocument}
          >
            네, 삭제합니다
          </button>
          <button className={styles.button} onClick={cancelDeleteDocument}>
            아니오, 취소합니다
          </button>
        </CreateModal>
      )}
    </Layout>
  );
};

export default DocumentList;
