import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ImageState {
  imageLoadData: string[] | null;
  imageSaveData: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: ImageState = {
  imageLoadData: null,
  imageSaveData: null,
  loading: false,
  error: null,
};

const imageReducers = createSlice({
  name: "image",
  initialState,
  reducers: {
    generateImageRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    generateImageSuccess: (state, action: PayloadAction<string[]>) => {
      state.loading = false;
      state.imageLoadData = action.payload;
    },
    generateImageFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    saveImageRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    saveImageSuccess: (state, action: PayloadAction<string>) => {
      state.loading = true;
      state.imageSaveData = action.payload;
    },
    saveImageFailure: (state, action: PayloadAction<string>) => {
      state.loading = true;
      state.error = action.payload;
    },
    // imageReset:(state) => {
    //   state.imageLoadData = null;
    // }
  },
});

export default imageReducers.reducer;
