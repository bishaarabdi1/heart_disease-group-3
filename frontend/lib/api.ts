import { PredictionRequest, PredictionResponse, HealthResponse } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3201";

export async function checkHealth(): Promise<HealthResponse> {
  try {
    const res = await fetch(`${API_URL}/api/health`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      throw new Error(`Health check failed with status: ${res.status}`);
    }
    return res.json();
  } catch (error) {
    console.error("Health check error:", error);
    throw error;
  }
}

export async function predictRisk(data: PredictionRequest): Promise<PredictionResponse> {
  try {
    const res = await fetch(`${API_URL}/api/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      throw new Error(`Prediction failed with status: ${res.status}`);
    }
    return res.json();
  } catch (error) {
    console.error("Prediction error:", error);
    throw error;
  }
}
