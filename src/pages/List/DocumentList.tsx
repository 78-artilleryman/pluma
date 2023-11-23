import React, { useEffect, useState, ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectIsAuthenticated, selectLoading, selectUserInfo } from "../../store/auth/authSelectors";
import { deleteDocumentRequest, loadDocumentsRequest} from "../../store/document/documentActions";
import {
  selectDocumentsList,
  selectDocumentLoading,
  selectDocumentError,
  selectSingleDocument,
} from "../../store/document/documentSelectors";
import Modal from "../../utils/Modal";
import DocumentItem from "../../components/Document/DocumentItem";

import styles from "../../components/Document/Document.module.scss";
import Layout from "../../components/Layout/Layout";
import AddDocument from "../../components/Document/AddDocumentItem";
import CreateModal from "src/utils/CreateModal";
import { generateImageRequest, saveImageRequest ,imageReset} from "src/store/image/imageActions";
import {selectImage, selectImageLoading} from "src/store/image/imageSelectors"

const DocumentList: React.FC = () => {
  const dispatch = useDispatch();
  const documents = useSelector(selectDocumentsList);
  const singleDocument = useSelector(selectSingleDocument);
  const loading = useSelector(selectDocumentLoading);
  const error = useSelector(selectDocumentError);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirmModalOpen, setDeleteConfirmModalOpen] = useState(false);
  const [params, setParams] = useState({
    model_name: "dreamshaper_8_93211.safetensors",
    prompt: "",
    negative_prompt: "BadDream, FastNegativeV2",
    width: 512,
    height: 512,
    sampler_name: "DPM++ 2M Karras",
    cfg_scale: 8.5,
    steps: 40,
    batch_size: 1,
    n_iter: 3,
    seed: -1,
  });
  const [isTitleImageModalOpen, setIsTitleImageModalOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);
  const [titleImageDocumentId,setTitleImageDocumentId] = useState<number | null>(null);
  const [titleImage, setTitleImage] = useState<string | undefined>("");
  const userInfo = useSelector(selectUserInfo);
  const aiImage = useSelector(selectImage);


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
        dispatch(imageReset());
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
    const handleEscapeKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        // ESC 키를 눌렀을 때 실행할 동작들
        setIsModalOpen(false);
        setIsTitleImageModalOpen(false);
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

  // AI 이미지
  const onTitleImageDocument = (documentId: number) => {
    setTitleImageDocumentId(documentId)
    setIsTitleImageModalOpen(true);
  };
  const onChangePrompt = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    setParams((prevParams) => ({
      ...prevParams,
      prompt: value,
    }));
  };
  // 이미지 생성 액션 디스패치
  const onGenerateImage = () => {
    dispatch(generateImageRequest(params));
  };

  // 이미지 저장 액션 디스패치
  const onSaveImage = (src: undefined | string) => {
    console.log(titleImageDocumentId, src)
    setTitleImage(src);
    dispatch(saveImageRequest({documentId: titleImageDocumentId, imageURL: src}))
    setIsTitleImageModalOpen(false);
  };

  const modalImageReset = () => {
    setIsTitleImageModalOpen(false)
    dispatch(imageReset());
  }
  
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
              onTitleImageDocument={onTitleImageDocument}
              titleImage={titleImage}
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

      {isTitleImageModalOpen && (
        <CreateModal isOpen={isTitleImageModalOpen} onClose={() => setIsTitleImageModalOpen(false)}>
          <div>
            <div>
              <h2>이미지 묘사</h2>
              <textarea
                placeholder="원하는 의상이나 동작, 배경을 입력해보세요."
                className={styles.prompt}
                onChange={onChangePrompt}
              />
             {aiImage?.imageLoadData && aiImage.imageLoadData.length === 3 && (
              <div>
                {aiImage.imageLoadData.map((src, index) => (
                  src !== null && src !== undefined && (
                    <img
                      key={index}
                      className={styles.aiImage}
                      src={src}
                      alt=""
                      onClick={() => onSaveImage(src)}
                    />
                  )
                ))}
              </div>
              )}    

            </div>
            {aiImage && aiImage.imageLoadData  ? (
              <button
                className={styles.button}
                style={{ marginRight: "10px" }}
                onClick={onGenerateImage}
              >
                다시 만들기
              </button>
            ) : (
              <button
                className={styles.button}
                style={{ marginRight: "10px" }}
                onClick={onGenerateImage}
              >
                이미지 생성
              </button>
            )}
            <button className={styles.button} onClick={modalImageReset}>
              취소
            </button>
          </div>
        </CreateModal>
      )}
    </Layout>
  );
};

export default DocumentList;
