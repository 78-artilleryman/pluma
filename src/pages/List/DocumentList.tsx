// DocumentList.tsx

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectIsAuthenticated, selectUser } from "../../store/auth/authSelectors";
import { loadDocumentsRequest } from "../../store/document/documentActions";
import {
  selectDocumentsList,
  selectDocumentLoading,
  selectDocumentError,
} from "../../store/document/documentSelectors";
import Modal from "../../utils/Modal";
import DocumentItem from "../../components/Document/DocumentItem"; // Document 컴포넌트 임포트

import styles from "../../components/Document/Document.module.scss"; // SCSS 모듈 임포트
import Layout from "../../components/Layout/Layout";

const DocumentList: React.FC = () => {
  const dispatch = useDispatch();
  const documents = useSelector(selectDocumentsList);
  const loading = useSelector(selectDocumentLoading);
  const error = useSelector(selectDocumentError);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // 모달 상태 추가
  const [isModalOpen, setIsModalOpen] = useState(false);
  const user = useSelector(selectUser);
  useEffect(() => {
    // 문서 목록을 불러오는 액션 디스패치
    if (!isAuthenticated) {
      setIsModalOpen(true); // 사용자가 로그인하지 않은 경우 모달 열기
    } else {
      setIsModalOpen(false);
      dispatch(loadDocumentsRequest(user));
    }
  }, [user, isAuthenticated]);
  useEffect(() => console.log(documents), [documents]);
  // 모달을 닫기 위한 함수
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <Layout>
      <h2>문서 목록</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <div className={styles.documentCardContainer}>
          {documents?.map((document) => (
            <>
              <DocumentItem key={document.documentId} documentData={document} />
            </>
          ))}
        </div>
      )}

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <h2>로그인이 필요합니다</h2>
          <p>문서를 볼려면 먼저 로그인하세요.</p>
        </Modal>
      )}
    </Layout>
  );
};

export default DocumentList;
