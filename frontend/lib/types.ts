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

export interface User {
  id: string;
  full_name: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Assessment {
  id: string;
  user_id: string;
  age: number;
  sex: number;
  trestbps: number;
  chol: number;
  fbs: number;
  thalach: number;
  oldpeak: number;
  cp: number;
  restecg: number;
  exang: number;
  slope: number;
  ca: number;
  thal: number;
  risk_class: number;
  result: string;
  lower_risk: number;
  higher_risk: number;
  model_percentage: number;
  model_name: string;
  model_version: string;
  created_at: string;
  probabilities?: {
    lower_risk: number;
    higher_risk: number;
  };
}

export interface AssessmentCreateResponse {
  success: boolean;
  assessment: Assessment;
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
