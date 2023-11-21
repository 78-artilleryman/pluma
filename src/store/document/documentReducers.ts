// store/document/documentReducers.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DocumentDetailInfo, DocumentInfo } from "./types";

interface DocumentState {
  documentsList: DocumentInfo[];
  singleDocument: DocumentDetailInfo | null;
  newDocument: DocumentInfo | null;
  loading: boolean;
  error: string | null;
}

const initialState: DocumentState = {
  documentsList: [],
  singleDocument: null,
  newDocument: null,
  loading: false,
  error: null,
};

const documentReducer = createSlice({
  name: "document",
  initialState,
  reducers: {
    loadDocumentsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    loadDocumentsSuccess: (state, action: PayloadAction<DocumentInfo[]>) => {
      state.loading = false;
      state.documentsList = action.payload;
    },
    loadDocumentsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    loadDocumentRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    loadDocumentSuccess: (state, action: PayloadAction<DocumentDetailInfo | null>) => {
      state.loading = false;
      state.singleDocument = action.payload;
      state.newDocument = null;
    },
    loadDocumentFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    addEventListenerDocumentRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    addDocumentSuccess: (state, action: PayloadAction<DocumentInfo | null>) => {
      state.loading = false;
      state.newDocument = action.payload;
    },
    addDocumentFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteDocumentRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteDocumentSuccess: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.documentsList = state.documentsList.filter(
        (doc: DocumentInfo) => doc.documentId !== parseInt(action.payload)
      );
    },
    deleteDocumentFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    documentTitleImageRequest: (state) => {
    
      state.error = null;
    },
    documentTitleImageSuccess: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    documentTitleImageFailure: (state, action: PayloadAction<string>) => {
      state.loading = true;
      state.error = action.payload;
    },
  },
  
});

export default documentReducer.reducer;
