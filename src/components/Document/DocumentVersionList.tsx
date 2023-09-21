import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  loadDocumentVersionsRequest,
  addDocumentVersionRequest,
  loadDocumentVersionRequest,
} from "../../store/version/versionActions";
import {
  selectVersionsList,
  selectVersionLoading,
  selectSingleVersion,
} from "../../store/version/versionSelectors";
import styles from "./DocumentVersionList.module.scss";
import { timeSince } from "../../utils/TimeSince";

interface VersionListProps {
  content: string | undefined;
  setContent: React.Dispatch<React.SetStateAction<string | undefined>>;
  handleVersionSelect: (subtitle: string | undefined, createdAt: string | undefined) => void;
  setSelectedVersionSubtitle: React.Dispatch<React.SetStateAction<string | undefined>>;
  setSelectedVersionDate: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const DocumentVersionList: React.FC<VersionListProps> = ({
  content,
  setContent,
  handleVersionSelect,
  setSelectedVersionSubtitle,
  setSelectedVersionDate,
}) => {
  const { documentId } = useParams();
  const dispatch = useDispatch();
  const versions = useSelector(selectVersionsList);
  const loading = useSelector(selectVersionLoading);
  const versionInfo = useSelector(selectSingleVersion);
  const [selectedVersionId, setSelectedVersionId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subtitle, setSubtitle] = useState("");

  const handleCtrlS = (event: KeyboardEvent) => {
    if ((event.ctrlKey && event.key === "s") || (event.metaKey && event.key === "s")) {
      event.preventDefault(); // 브라우저의 기본 저장 동작을 막습니다.
      if (versionInfo?.content === content) {
        alert("수정된 내용이 없습니다.");
        return;
      }
      setIsModalOpen(true); // Ctrl + S 눌렀을 때 실행할 함수 호출
    }
  };

  useEffect(() => {
    if (versions && versions.length > 0) {
      const latestVersion = versions[0];
      fetchVersionInfo(latestVersion.id);
      setSelectedVersionSubtitle(latestVersion.subtitle);
      setSelectedVersionDate(latestVersion.createdAt);
      setSelectedVersionId(latestVersion.id); // 초기 선택 버전 설정
    }
  }, [setContent, setSelectedVersionDate, setSelectedVersionSubtitle, versions]);
  useEffect(() => {
    // 컴포넌트가 마운트될 때 Ctrl + S 키 이벤트 핸들러 등록
    window.addEventListener("keydown", handleCtrlS);

    // 컴포넌트가 언마운트될 때 이벤트 핸들러 제거
    return () => {
      window.removeEventListener("keydown", handleCtrlS);
    };
  }, [content]);

  const handleAddVersion = () => {
    if (versionInfo?.content === content) {
      alert("수정된 내용이 없습니다.");
      return;
    }

    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSubtitle("");
  };

  const handleModalSubmit = () => {
    if (documentId) {
      const newVersionInfo = {
        subtitle: subtitle,
        documentId: Number(documentId),
        content: content || "",
      };
      dispatch(addDocumentVersionRequest(newVersionInfo));
      setIsModalOpen(false);
      setSubtitle("");
    }
  };

  const fetchVersionInfo = (versionId: number) => {
    // 선택한 버전의 정보를 요청합니다.
    dispatch(loadDocumentVersionRequest(versionId));
  };

  useEffect(() => {
    if (documentId) {
      dispatch(loadDocumentVersionsRequest(documentId));
    }
  }, [documentId, dispatch]);

  useEffect(() => {
    if (versions.length !== 0) {
      setContent(versionInfo?.content);
    }
  }, [versionInfo, setContent, versions]);

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center" }}>
        <h3>문서 버전</h3>
        <button onClick={handleAddVersion} style={{ height: "30px" }}>
          +
        </button>
      </div>

      <div className={styles.versionList}>
        {versions?.map((version) => (
          <div
            key={version.id}
            className={`${styles.versionItem} ${
              selectedVersionId === version.id ? styles.selectedVersion : ""
            }`}
            onClick={() => {
              handleVersionSelect(version.subtitle, version.createdAt);
              setSelectedVersionId(version.id); // 선택한 버전 갱신
              fetchVersionInfo(version.id); // 선택한 버전의 정보를 요청
            }}
          >
            <span> {version.subtitle}</span>
            <span> {timeSince(version.createdAt)}</span>
          </div>
        ))}
      </div>
      {isModalOpen && (
        <div className={styles.modalContainer}>
          <div className={styles.modalContent}>
            <div>서브타이틀 입력</div>
            <input type="text" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
            <button onClick={handleModalSubmit}>확인</button>
            <button onClick={handleModalClose}>취소</button>
          </div>
        </div>
      )}
    </>
  );
};

export default DocumentVersionList;
