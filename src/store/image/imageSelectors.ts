import { RootState } from "../../configureStore";

// 이미지 관련 상태를 선택하는 셀렉터 함수들을 작성합니다.
export const selectImage = (state: RootState) => state.image;
export const selectImageData = (state: RootState) => state.image.imageData;
export const selectImageLoading = (state: RootState) => state.image.loading;
export const selectImageError = (state: RootState) => state.image.error;
