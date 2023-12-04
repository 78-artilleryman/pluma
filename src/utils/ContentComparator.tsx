import React, { useState, useEffect } from "react";
import DiffViewer, { DiffMethod } from "react-diff-viewer";
import { htmlToText } from "html-to-text";
import { getInitialTheme } from "./theme"; // theme.js 파일의 위치에 맞게 경로를 조정하세요.

import { useSelector } from "react-redux";
import { getTheme } from "src/store/theme/themeSelectors";

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
  const theme = useSelector(getTheme); // Redux 스토어에서 현재 테마 상태를 가져옵니다.

  // HTML 문자열을 텍스트로 변환하는 함수
  const convertContentToText = (htmlString: string | null) => {
    return htmlToText(htmlString || "", { preserveNewlines: true }).replace(/\n{2,}/g, "\n");
  };

  // 고정된 첫 번째 및 현재 컨텐츠
  const fixedFirstContent = convertContentToText(firstContent);
  const fixedCurrentContent = convertContentToText(currentContent);

  // DiffViewer 컴포넌트를 렌더링하고, 다크모드를 적용합니다.
  return (
    <div style={{ height: "92vh", overflowY: "auto", overflowX: "auto" }}>
      <h3 style={{ paddingLeft: "16px" }}>변경사항</h3>
      <p style={{ paddingLeft: "16px" }}>변경사항에는 텍스트 비교만 가능합니다</p>
      <DiffViewer
        oldValue={fixedFirstContent}
        newValue={fixedCurrentContent}
        splitView={false}
        useDarkTheme={theme === "dark"} // 테마 상태에 따라 다크모드를 적용합니다.
        compareMethod={DiffMethod.CHARS}
        onLineNumberClick={(lineString) => {
          const parts = lineString.split("-");
          const lineNumber = parts.length > 1 ? Number(parts[1]) : NaN;
          if (!isNaN(lineNumber)) {
            onDiffLineClick(lineNumber);
          }
        }}
        styles={{
          diffContainer: {
            diffViewer: {
              whiteSpace: "pre",
              overflowWrap: "normal",
              wordBreak: "keep-all",
            },
          },
        }}
      />
    </div>
  );
}

export default ContentComparator;
