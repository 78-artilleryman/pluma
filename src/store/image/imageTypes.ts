export interface TitleImage {
  model_name: string;
  prompt: string;
  negative_prompt: string;
  width: number;
  height: number;
  sampler_name: string;
  cfg_scale: number;
  steps: number;
  batch_size: number;
  n_iter: number;
  seed: number;
}
