export interface Keyword {
  word: string;
  score: number;
}

export interface GeminiAnalysis {
  gemini_verdict: "REAL" | "FAKE" | "UNCERTAIN";
  gemini_confidence: number;
  credibility_score: number;
  red_flags: string[];
  credibility_signals: string[];
  language_analysis: string;
  fact_check_verdict: string;
  recommendation: string;
  gemini_available: boolean;
}

export interface PredictionResult {
  label: "REAL" | "FAKE";
  confidence: number;
  processed_text: string;
  model_name: string;
  model_accuracy: number | null;
  top_keywords: Keyword[];
  is_fake: boolean;
  response_time_ms: number;
  ml_time_ms?: number;
  gemini_time_ms?: number;
  gemini?: GeminiAnalysis;
}

export interface ModelMetric {
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  f1_fake_class?: number;
  val_accuracy?: number;
  val_f1?: number;
  error?: string;
}

export interface MetricsData {
  best_model: string;
  best_f1: number;
  train_size: number;
  test_size: number;
  models: Record<string, ModelMetric>;
}

export interface SystemStatus {
  status: string;
  model_ready: boolean;
  gemini_available: boolean;
  version: string;
}

export type TabType = "text" | "file" | "examples";
