import React, { useEffect, useState, ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectIsAuthenticated, selectUserInfo } from "../../store/auth/authSelectors";
import { deleteDocumentRequest, loadDocumentsRequest, documentTitleImageRequest } from "../../store/document/documentActions";
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
import { NovitaSDK } from "novita-sdk";

const DocumentList: React.FC = () => {
  const dispatch = useDispatch();
  const documents = useSelector(selectDocumentsList);
  const singleDocument = useSelector(selectSingleDocument)
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
      n_iter: 1,
      seed: -1,
  });
  const [isTitleImageModalOpen, setIsTitleImageModalOpen] = useState(false);
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
  const onTitleImageDocument = () =>{
    setIsTitleImageModalOpen(true)
  }
  const onChangePrompt = (event: ChangeEvent<HTMLInputElement>) =>{
    const value = event.target.value;
    setParams((prevParams) => ({
      
      ...prevParams,
      prompt: value,
    }));
    console.log(params)
  }
  const confirmTitleImageDocument = () => {
    try {
      const novitaClient = new NovitaSDK("f4af0d1e-afab-47df-a195-99a36656ad18")
 
     
        // API 호출을 실행하고 응답을 가져옵니다.
        novitaClient.txt2Img(params)
        .then((res) => {
          if (res && res.task_id) {
            const timer = setInterval(() => {
              novitaClient.progress({
                task_id: res.task_id,
              })
                .then((progressRes) => {
                  if (progressRes.status === 2) {
                    console.log("finished!", progressRes.imgs);
                    clearInterval(timer);

                  }
                  if (progressRes.status === 3 || progressRes.status === 4) {
                    console.warn("failed!", progressRes.failed_reason);
                    clearInterval(timer);
                  }
                  if (progressRes.status === 1) {
                    console.log("progress", progressRes.current_images);
                  }
                })
                .catch((err) => {
                  console.error("progress error:", err);
                })
            }, 1000);
          }
        })
        .catch((err) => {
          console.error("txt2Img error:", err);
        })
              
    
    } catch (error) {
    
    }
    
      dispatch(documentTitleImageRequest(params))

      
  
  
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

      {isTitleImageModalOpen &&(
           <CreateModal isOpen={isTitleImageModalOpen} onClose={() => setIsTitleImageModalOpen(false)}>
             <div>
              <div>
                <h2>이미지 묘사</h2>
                <input 
                type="text" 
                placeholder='원하는 의상이나 동작, 배경을 입력해보세요.' 
                style={{ width: '400px' , height: '150px'}}
                onChange={onChangePrompt}
                />
              </div>
              <button
                className={styles.button}
                style={{ marginRight: "10px" }}
                onClick={confirmTitleImageDocument}
              >
                이미지생성
              </button>
              <button className={styles.button} onClick={() => setIsTitleImageModalOpen(false)}>
                취소
              </button>
            </div>
           
         </CreateModal>
        )}
    </Layout>
  );
};

export default DocumentList;
