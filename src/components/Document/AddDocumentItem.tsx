// Document.tsx

import React, { useEffect, useState } from "react";
import { getInitialTheme } from "../../utils/theme";
import styles from "./AddDocumentItem.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faSquarePlus, faCircleXmark} from "@fortawesome/free-solid-svg-icons";
import CreateModal from "src/utils/CreateModal";
import { useNavigate } from "react-router-dom";
import { addDocumentRequest } from "src/store/document/documentActions";




const AddDocument: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // useNavigate 훅을 사용하여 이동 처리

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newDocuments, setNewDocuments]= useState("");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", getInitialTheme());
  }, []);
  
  // useEffect(() => {
  //   console.log(isCreateModalOpen); // Log the updated value here
  // }, [isCreateModalOpen]);

  function createmodal(){
    setIsCreateModalOpen(true);
  }

  function closeModal(){
    setIsCreateModalOpen(false);
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 사용자가 입력한 값을 documentTitle 상태 변수에 저장합니다.
    setNewDocuments(e.target.value );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // 기본 폼 제출 동작을 막습니다.
    console.log(newDocuments)

    
    dispatch(addDocumentRequest(newDocuments))
    navigate(`/document/10`); //여기에 작품번호 들어가게 바꿔야함
  };

  

  return (
    <div className={styles.documentCard} > 
    
      <div className={styles.iconBox} onClick={createmodal}>
        <FontAwesomeIcon className={styles.faSquarePlus} icon={faSquarePlus} />
      </div>

       {isCreateModalOpen && (
        <CreateModal isOpen={isCreateModalOpen} onClose={closeModal}>
          <FontAwesomeIcon className={styles.faCircleXmark} icon={faCircleXmark} onClick={closeModal} />
          <form onSubmit={handleSubmit}>
            <input className={styles.title}
              type="text"
              onChange={handleInputChange}
            />
            <button type="submit" className={styles.linkDocument}>생성하기</button>
          </form>
        </CreateModal>
      )}
    </div>
  );
};

export default AddDocument;
