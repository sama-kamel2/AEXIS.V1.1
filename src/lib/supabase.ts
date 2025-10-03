import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Dataset {
  id: string;
  name: string;
  source: string;
  file_path?: string;
  row_count: number;
  time_range_start?: number;
  time_range_end?: number;
  flux_mean?: number;
  flux_std?: number;
  uploaded_by?: string;
  metadata: any;
  created_at: string;
}

export interface Prediction {
  id: string;
  dataset_id: string;
  model_version: string;
  has_transit: boolean;
  probability_score: number;
  detected_transits: any[];
  inference_time_ms: number;
  user_feedback?: string;
  created_at: string;
}

export interface Model {
  id: string;
  version: string;
  architecture: string;
  num_layers: number;
  parameters: any;
  training_samples: number;
  accuracy?: number;
  precision_score?: number;
  recall_score?: number;
  f1_score?: number;
  confusion_matrix?: any;
  file_path?: string;
  is_active: boolean;
  created_at: string;
}

export interface HyperparameterExperiment {
  id: string;
  model_version?: string;
  architecture: string;
  learning_rate: number;
  batch_size: number;
  epochs: number;
  num_layers: number;
  optimizer: string;
  training_samples: number;
  validation_accuracy?: number;
  training_time_seconds?: number;
  status: string;
  created_at: string;
  completed_at?: string;
}

export interface LightCurveData {
  time: number[];
  flux: number[];
}
