-- NASA Exoplanet Detection Platform Database Schema
-- 
-- Overview:
-- This migration creates the complete database schema for the NASA Space Apps
-- exoplanet detection AI platform supporting both researcher and novice users.
--
-- Tables Created:
-- 1. datasets - Stores uploaded light curve datasets
-- 2. predictions - Stores AI model prediction results
-- 3. models - Tracks trained model versions
-- 4. hyperparameter_experiments - Logs hyperparameter tuning attempts
-- 5. user_sessions - Optional user activity tracking
--
-- Security: RLS enabled on all tables with public read access

CREATE TABLE IF NOT EXISTS datasets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  source text NOT NULL DEFAULT 'user_upload',
  file_path text,
  row_count integer DEFAULT 0,
  time_range_start numeric,
  time_range_end numeric,
  flux_mean numeric,
  flux_std numeric,
  uploaded_by text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dataset_id uuid REFERENCES datasets(id) ON DELETE CASCADE,
  model_version text NOT NULL,
  has_transit boolean DEFAULT false,
  probability_score numeric,
  detected_transits jsonb DEFAULT '[]'::jsonb,
  inference_time_ms integer,
  user_feedback text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS models (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  version text UNIQUE NOT NULL,
  architecture text NOT NULL DEFAULT 'cnn_1d',
  num_layers integer DEFAULT 3,
  parameters jsonb DEFAULT '{}'::jsonb,
  training_samples integer DEFAULT 0,
  accuracy numeric,
  precision_score numeric,
  recall_score numeric,
  f1_score numeric,
  confusion_matrix jsonb,
  file_path text,
  is_active boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS hyperparameter_experiments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  model_version text,
  architecture text NOT NULL,
  learning_rate numeric NOT NULL,
  batch_size integer NOT NULL,
  epochs integer NOT NULL,
  num_layers integer DEFAULT 3,
  optimizer text DEFAULT 'adam',
  training_samples integer DEFAULT 0,
  validation_accuracy numeric,
  training_time_seconds integer,
  status text DEFAULT 'running',
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

CREATE TABLE IF NOT EXISTS user_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_identifier text NOT NULL,
  user_type text DEFAULT 'novice',
  preferences jsonb DEFAULT '{}'::jsonb,
  last_active timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE datasets ENABLE ROW LEVEL SECURITY;
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE models ENABLE ROW LEVEL SECURITY;
ALTER TABLE hyperparameter_experiments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on datasets"
  ON datasets FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert on datasets"
  ON datasets FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public read access on predictions"
  ON predictions FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert on predictions"
  ON predictions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public read access on models"
  ON models FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert on models"
  ON models FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update on models"
  ON models FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public read access on experiments"
  ON hyperparameter_experiments FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert on experiments"
  ON hyperparameter_experiments FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update on experiments"
  ON hyperparameter_experiments FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public read access on sessions"
  ON user_sessions FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert on sessions"
  ON user_sessions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update on sessions"
  ON user_sessions FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_datasets_created_at ON datasets(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_datasets_source ON datasets(source);
CREATE INDEX IF NOT EXISTS idx_predictions_dataset_id ON predictions(dataset_id);
CREATE INDEX IF NOT EXISTS idx_predictions_created_at ON predictions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_models_is_active ON models(is_active);
CREATE INDEX IF NOT EXISTS idx_models_version ON models(version);
CREATE INDEX IF NOT EXISTS idx_experiments_status ON hyperparameter_experiments(status);
CREATE INDEX IF NOT EXISTS idx_sessions_user_identifier ON user_sessions(user_identifier);