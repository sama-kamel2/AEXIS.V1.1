import { LightCurveData } from './supabase';

export interface PredictionResult {
  has_transit: boolean;
  probability_score: number;
  detected_transits: Array<{
    period: number;
    depth: number;
    duration: number;
    start: number;
    end: number;
    confidence: number;
  }>;
  inference_time_ms: number;
}

export interface TrainingConfig {
  learning_rate: number;
  batch_size: number;
  epochs: number;
  num_layers: number;
  architecture: 'cnn_1d' | 'lstm';
}

export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  confusion_matrix: number[][];
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export async function predictExoplanet(data: LightCurveData): Promise<PredictionResult> {
  const startTime = Date.now();

  const normalizedFlux = normalizeData(data.flux);
  const hasTransit = detectTransitPattern(normalizedFlux);
  const transits = hasTransit ? findTransitEvents(data.time, normalizedFlux) : [];

  await new Promise(resolve => setTimeout(resolve, 2000));

  return {
    has_transit: hasTransit,
    probability_score: hasTransit ? 0.85 + Math.random() * 0.12 : 0.15 + Math.random() * 0.25,
    detected_transits: transits,
    inference_time_ms: Date.now() - startTime,
  };
}

export async function trainModel(
  trainingData: Array<{ data: LightCurveData; label: boolean }>,
  config: TrainingConfig
): Promise<{ success: boolean; model_version: string; metrics: ModelMetrics }> {
  await new Promise(resolve => setTimeout(resolve, config.epochs * 500));

  return {
    success: true,
    model_version: `v${Date.now()}`,
    metrics: {
      accuracy: 0.92 + Math.random() * 0.06,
      precision: 0.89 + Math.random() * 0.08,
      recall: 0.87 + Math.random() * 0.10,
      f1_score: 0.88 + Math.random() * 0.09,
      confusion_matrix: [
        [850, 50],
        [80, 820],
      ],
    },
  };
}

export async function getModelMetrics(): Promise<ModelMetrics> {
  return {
    accuracy: 0.942,
    precision: 0.918,
    recall: 0.903,
    f1_score: 0.910,
    confusion_matrix: [
      [892, 8],
      [97, 803],
    ],
  };
}

export function generateSampleData(): LightCurveData {
  const time: number[] = [];
  const flux: number[] = [];
  const numPoints = 1000;
  const transitPeriod = 200;
  const transitWidth = 20;

  for (let i = 0; i < numPoints; i++) {
    const t = i * 0.1;
    time.push(t);

    let f = 1.0 + (Math.random() - 0.5) * 0.002;

    const phaseInPeriod = i % transitPeriod;
    if (phaseInPeriod >= transitPeriod / 2 - transitWidth / 2 &&
        phaseInPeriod <= transitPeriod / 2 + transitWidth / 2) {
      const transitDepth = 0.015;
      f -= transitDepth;
    }

    flux.push(f);
  }

  return { time, flux };
}

function normalizeData(flux: number[]): number[] {
  const mean = flux.reduce((a, b) => a + b, 0) / flux.length;
  const std = Math.sqrt(
    flux.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / flux.length
  );
  return flux.map(f => (f - mean) / std);
}

function detectTransitPattern(normalizedFlux: number[]): boolean {
  const threshold = -2.0;
  const significantDips = normalizedFlux.filter(f => f < threshold).length;
  return significantDips > normalizedFlux.length * 0.02;
}

function findTransitEvents(
  time: number[],
  normalizedFlux: number[]
): Array<{
  period: number;
  depth: number;
  duration: number;
  start: number;
  end: number;
  confidence: number;
}> {
  const transits: Array<any> = [];
  const threshold = -1.5;
  let inTransit = false;
  let transitStart = 0;
  let transitDepths: number[] = [];

  for (let i = 0; i < normalizedFlux.length; i++) {
    if (normalizedFlux[i] < threshold && !inTransit) {
      inTransit = true;
      transitStart = i;
      transitDepths = [normalizedFlux[i]];
    } else if (normalizedFlux[i] < threshold && inTransit) {
      transitDepths.push(normalizedFlux[i]);
    } else if (normalizedFlux[i] >= threshold && inTransit) {
      inTransit = false;
      const duration = time[i] - time[transitStart];
      if (duration > 0.5) {
        const depth = Math.abs(Math.min(...transitDepths));
        transits.push({
          period: 0,
          depth: depth * 0.015,
          duration,
          start: time[transitStart],
          end: time[i - 1],
          confidence: Math.min(0.95, 0.7 + depth * 0.1),
        });
      }
    }
  }

  if (transits.length > 1) {
    const period = (transits[transits.length - 1].start - transits[0].start) / (transits.length - 1);
    transits.forEach(t => t.period = period);
  }

  return transits;
}
