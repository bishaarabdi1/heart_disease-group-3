export interface PredictionRequest {
  age: number;
  sex: 0 | 1;
  trestbps: number;
  chol: number;
  fbs: 0 | 1;
  thalach: number;
  oldpeak: number;
  cp: 1 | 2 | 3 | 4;
  restecg: 0 | 1 | 2;
  exang: 0 | 1;
  slope: 1 | 2 | 3;
  ca: 0 | 1 | 2 | 3;
  thal: 3 | 6 | 7;
}

export interface PredictionResponse {
  success: boolean;
  risk_class: number;
  result: string;
  probabilities: {
    lower_risk: number;
    higher_risk: number;
  };
  model_percentage: number;
  model_name: string;
  model_version: string;
  human_required: boolean;
  disclaimer: string;
}

export interface HealthResponse {
  status: string;
  model_ready: boolean;
  model_name: string;
  input_features: number;
}
