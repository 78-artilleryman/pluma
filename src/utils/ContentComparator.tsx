import React from "react";
import DiffViewer, { DiffMethod } from "react-diff-viewer";
import { htmlToText } from "html-to-text";

interface VersionComparatorProps {
  firstContent: string | undefined;
  currentContent: string | undefined;
  onDiffLineClick: (lineNumber: number) => void;
}

function ContentComparator({
  firstContent,
  currentContent,
  onDiffLineClick,
}: VersionComparatorProps): React.JSX.Element {
  const convertedFirstContent = htmlToText(firstContent || "", { preserveNewlines: true });
  const convertedCurrentContent = htmlToText(currentContent || "", { preserveNewlines: true });
  const fixedFirstContent = convertedFirstContent.replace(/\n{2,}/g, "\n");
  const fixedCurrentContent = convertedCurrentContent.replace(/\n{2,}/g, "\n");

  return (
    <div style={{ height: "92vh", overflowY: "auto" }}>
      <DiffViewer
        oldValue={fixedFirstContent}
        newValue={fixedCurrentContent}
        splitView={false}
        useDarkTheme={true}
        compareMethod={DiffMethod.CHARS}
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
