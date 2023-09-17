import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import {
  loadDocumentVersionsRequest,
  addDocumentVersionRequest,
} from "../../store/version/versionActions";
import { selectVersionsList, selectVersionLoading } from "../../store/version/versionSelectors";
import styles from "./DocumentVersionList.module.scss";

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
  useEffect(() => {
    if (versions && versions.length > 0) {
      const latestVersion = versions[0]; // 가장 최근 버전 선택
      setContent(latestVersion.content);
      setSelectedVersionSubtitle(latestVersion.subtitle);
      setSelectedVersionDate(latestVersion.createdAt);
    }
  }, [versions]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subtitle, setSubtitle] = useState("");

  // documentId를 기준으로 버전 배열 정렬
  const sortedVersions = versions?.slice().sort((a, b) => a.documentId - b.documentId);

  const handleAddVersion = () => {
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

  useEffect(() => {
    if (documentId) {
      dispatch(loadDocumentVersionsRequest(documentId));
    }
  }, [documentId, dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!versions || versions.length === 0) {
    return (
      <div>
        <div>No versions available.</div>
        <button onClick={handleAddVersion}>버전 추가</button>
      </div>
    );
  }

  return (
    <div>
      <h3>문서 버전</h3>
      <div className={styles["version-list"]}>
        {sortedVersions.map((version) => (
          <div
            key={version.versionId}
            className={styles["version-item"]}
            onClick={() => {
              setContent(version.content || "");
              handleVersionSelect(version.subtitle, version.createdAt); // subtitle, createdAt 콜백으로 호출합니다
            }}
          >
            {version.subtitle}
          </div>
        ))}
      </div>
      <button onClick={handleAddVersion}>버전 추가</button>

      {isModalOpen && (
        <div className={styles["modal-container"]}>
          <div className={styles["modal-content"]}>
            <div>서브타이틀 입력:</div>
            <input type="text" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
            <button onClick={handleModalSubmit}>확인</button>
            <button onClick={handleModalClose}>취소</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentVersionList;
