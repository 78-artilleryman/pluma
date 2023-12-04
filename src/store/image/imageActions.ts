import { createAction } from "@reduxjs/toolkit";
import { TitleImage } from "./imageTypes";
import { SaveImage } from "./imageTypes";

// 이미지 생성 요청
export const generateImageRequest = createAction<TitleImage>("image/generateImageRequest");
export const generateImageSuccess = createAction<string>("image/generateImageSuccess");
export const generateImageFailure = createAction<string>("image/generateImageFailure");

// 이미지 저장 요청
export const saveImageRequest = createAction<SaveImage>("image/saveImageRequest")
export const saveImageSuccess = createAction<string>("image/saveImageSuccess")
export const saveImageFailure = createAction<string>("image/saveImageFailure")

//이미지 초기화
export const imageReset = createAction<void>("image/imageReset")
