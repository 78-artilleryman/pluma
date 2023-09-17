import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { VersionInfo, VersionDetailInfo } from "./versionTypes";

interface VersionState {
  versionsList: VersionInfo[];
  singleVersion: VersionDetailInfo | null;
  loading: boolean;
  error: string | null;
}

const initialState: VersionState = {
  versionsList: [],
  singleVersion: null,
  loading: false,
  error: null,
};

const versionReducer = createSlice({
  name: "version",
  initialState,
  reducers: {
    loadDocumentVersionsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    loadDocumentVersionsSuccess: (state, action: PayloadAction<VersionInfo[]>) => {
      state.loading = false;
      state.versionsList = action.payload;
    },
    loadDocumentVersionsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    addDocumentVersionRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    addDocumentVersionSuccess: (state, action: PayloadAction<VersionInfo>) => {
      state.loading = false;
      state.versionsList = [...state.versionsList, action.payload]; // 배열을 변경하지 않고 새로운 배열로 업데이트
    },
    addDocumentVersionFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    loadDocumentVersionRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    loadDocumentVersionSuccess: (state, action: PayloadAction<VersionDetailInfo | null>) => {
      state.loading = false;
      state.singleVersion = action.payload;
    },
    loadDocumentVersionFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export default versionReducer.reducer;
