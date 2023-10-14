import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { VersionInfo, VersionDetailInfo } from "./versionTypes";

interface VersionState {
  versionsList: VersionInfo[];
  singleVersion: VersionDetailInfo | null;
  compareVersion: VersionDetailInfo | null;
  latestAddedVersion: VersionDetailInfo | null;
  loading: boolean;
  imageUrl: string | null;
  error: string | null;
  imgUrl: any | null;
}

const initialState: VersionState = {
  versionsList: [],
  singleVersion: null,
  compareVersion: null,
  latestAddedVersion: null,
  loading: false,
  imageUrl: null,
  error: null,
  imgUrl: null,
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
    addDocumentVersionSuccess: (state, action: PayloadAction<VersionDetailInfo>) => {
      state.loading = false;
      state.versionsList.unshift({
        id: action.payload.versionId,
        subtitle: action.payload.subtitle,
        createdAt: action.payload.createdAt,
        content: action.payload.content,
      });
      state.latestAddedVersion = action.payload;
      state.singleVersion = action.payload;
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

    loadCompareDocumentVersionRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.compareVersion = null;
    },
    loadCompareDocumentVersionSuccess: (state, action: PayloadAction<VersionDetailInfo | null>) => {
      state.loading = false;
      state.compareVersion = action.payload;
    },
    loadCompareDocumentVersionFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    uploadPictureRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.imgUrl = null;
    },
    uploadPictureSuccess: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.imgUrl = action.payload;

    },
    uploadPictureFailure: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export default versionReducer.reducer;
