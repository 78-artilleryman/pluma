import React from "react";
import DiffViewer, { DiffMethod } from "react-diff-viewer";
import { htmlToText } from "html-to-text";

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
  const convertContentToText = (htmlString: string | null) =>
    htmlToText(htmlString || "", { preserveNewlines: true }).replace(/\n{2,}/g, "\n");

  const fixedFirstContent = convertContentToText(firstContent);
  const fixedCurrentContent = convertContentToText(currentContent);

  return (
    <div style={{ height: "92vh", overflowY: "auto", overflowX: "auto" }}>
      <h3 style={{ paddingLeft: "16px" }}>변경사항</h3>
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
