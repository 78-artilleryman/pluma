import React, { useEffect, useState } from "react";
import DiffViewer, { DiffMethod } from "react-diff-viewer";
import ReactQuill from "react-quill";
import { getInitialTheme, toggleTheme } from "./theme";

interface VersionComparatorProps {
  firstContent: string | null;
  currentContent: string | null;
  onDiffLineClick: (lineNumber: number) => void;
}

function ContentComparator({
  firstContent,
  currentContent,
  onDiffLineClick,
}: VersionComparatorProps): React.JSX.Element {
  const [isDarkMode, setIsDarkMode] = useState(false); // 다크모드 상태를 관리하는 state

  useEffect(() => {
    const currentTheme = getInitialTheme(); // theme.js의 getInitialTheme 함수를 통해 현재 테마 얻기
    setIsDarkMode(currentTheme === "dark"); // 얻은 테마를 기반으로 isDarkMode 상태 설정
  }, []);
  const renderContent = (content: string) => {
    return (
      <>
        <ReactQuill
          value={content}
          readOnly={true}
          modules={{
            toolbar: false,
          }}
        />
      </>
    );
  };

  return (
    <div>
      <h3 style={{ paddingLeft: "16px" }}>변경사항</h3>
      <DiffViewer
        oldValue={firstContent || ""}
        newValue={currentContent || ""}
        splitView={false}
        useDarkTheme={isDarkMode}
        compareMethod={DiffMethod.CHARS}
        renderContent={renderContent}
        onLineNumberClick={(lineString) => {
          const parts = lineString.split("-");
          const lineNumber = parts.length > 1 ? Number(parts[1]) : NaN;
          if (!isNaN(lineNumber)) {
            onDiffLineClick(lineNumber);
          }
        }}
      />
    </div>
  );
}

export default ContentComparator;
