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
      state.singleVersion = null;
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
      state.versionsList.unshift(action.payload);
    },
    addDocumentVersionFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteDocumentVersionRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteDocumentVersionSuccess: (state, action: PayloadAction<{ id: string }>) => {
      state.loading = false;
      state.versionsList = state.versionsList.filter(
        (version) => version.id !== parseInt(action.payload.id)
      );
    },
    deleteDocumentVersionFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    loadDocumentVersionRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.singleVersion = null;
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
