import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ImageState {
  imageData: string[] | null;
  loading: boolean;
  error: string | null;
}

const initialState: ImageState = {
  imageData: null,
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
      state.imageData = action.payload;
    },
    generateImageFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export default imageReducers.reducer;
