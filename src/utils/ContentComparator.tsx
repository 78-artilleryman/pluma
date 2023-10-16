import React, { useEffect, useState } from "react";
import DiffViewer, { DiffMethod } from "react-diff-viewer";
import { getInitialTheme, toggleTheme } from "./theme";
import parse from "html-react-parser"; // 추가
import "react-quill/dist/quill.snow.css"; // 필요한 스타일을 가져옵니다.
import ReactQuill from "react-quill";

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
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const currentTheme = getInitialTheme();
    setIsDarkMode(currentTheme === "dark");
  }, []);

  const renderContent = (content: string) => {
    return (
      <ReactQuill
        value={content}
        readOnly={true}
        modules={{
          toolbar: false,
        }}
        theme="snow"
      />
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
