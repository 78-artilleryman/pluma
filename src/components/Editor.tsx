import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Editor as ToastEditor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";
import colorSyntax from "@toast-ui/editor-plugin-color-syntax";
import "tui-color-picker/dist/tui-color-picker.css";
import "@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css";
import tableMergedCell from "@toast-ui/editor-plugin-table-merged-cell";

interface IEditor {
  htmlStr: string;
  setHtmlStr: React.Dispatch<React.SetStateAction<string>>;
}

const Editor: React.FC<IEditor> = ({ htmlStr, setHtmlStr }) => {
  const editorRef = useRef<ToastEditor | null>(null);

  // Editor Change 이벤트
  const onChangeEditor = () => {
    if (editorRef.current) {
      setHtmlStr(editorRef.current.getInstance().getHTML());
    }
  };

  useEffect(() => {
    if (editorRef.current) {
      // 전달받은 html값으로 초기화
      editorRef.current.getInstance().setHTML(htmlStr);

      // 기존 이미지 업로드 기능 제거
      editorRef.current.getInstance().removeHook("addImageBlobHook");
      // 이미지 서버로 데이터를 전달하는 기능 추가
      editorRef.current.getInstance().addHook("addImageBlobHook", (blob, callback) => {
        (async () => {
          const formData = new FormData();
          formData.append("multipartFiles", blob);

          try {
            const res = await axios.post("http://localhost:8080/uploadImage", formData); //이미지 업로드 준비
            callback(res.data, "이미지 설명");
          } catch (error) {
            console.error("이미지 업로드 실패:", error);
            callback(null);
          }
        })();
        return false;
      });
    }
  }, []);

  // Editor에 사용되는 plugin 추가
  const plugins = [colorSyntax, tableMergedCell]; // 글자 색상 및 테이블 병합 셀 플러그인 추가

  return (
    <ToastEditor
      initialValue={htmlStr}
      previewStyle="vertical"
      initialEditType="wysiwyg"
      useCommandShortcut={true}
      hideModeSwitch={true}
      ref={editorRef}
      plugins={plugins}
      onChange={onChangeEditor}
    />
  );
};

export default Editor;
