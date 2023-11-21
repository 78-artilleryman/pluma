export interface DocumentInfo {
  documentId: number;
  title: string;
  username: string;
  regDate: string;
  modDate: string;
}
export interface DocumentDetailInfo {
  documentId: number;
  title: string;
  username: string;
  content: string;
  regDate: string;
  modDate: string;
}

export interface AddDocument {
  title: string;
  userId: string;
}

export interface TitleImage {
  model_name: string,
  prompt: string,
  negative_prompt: string,
  width: number,
  height: number,
  sampler_name: string,
  cfg_scale: number,
  steps: number,
  batch_size: number,
  n_iter: number,
  seed: number,
}