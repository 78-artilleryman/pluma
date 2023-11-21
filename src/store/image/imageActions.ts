import { createAction } from "@reduxjs/toolkit";
import { TitleImage } from "./imageTypes";

// 이미지 생성 요청
export const generateImageRequest = createAction<TitleImage>("image/generateImageRequest");
export const generateImageSuccess = createAction<string>("image/generateImageSuccess");
export const generateImageFailure = createAction<string>("image/generateImageFailure");
