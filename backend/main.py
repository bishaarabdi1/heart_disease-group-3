from pathlib import Path

import joblib
import pandas as pd

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from helpers.api_helper import (
    HeartInputData,
    prepare_result
)


# Load the heart-disease model
project_folder = Path(__file__).resolve().parent.parent

model_path = (
    project_folder
    / "models"
    / "heart_disease_logistic_model.joblib"
)

model = joblib.load(model_path)


# Model input columns
features = [
    "age",
    "trestbps",
    "chol",
    "thalach",
    "oldpeak",
    "sex",
    "cp",
    "fbs",
    "restecg",
    "exang",
    "slope",
    "ca",
    "thal"
]


# Create the HeartGuard API
app = FastAPI(
    title="HeartGuard AI API",
    version="1.0.0"
)
# Allow the Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.get("/")
def home():
    return {
        "message": "HeartGuard AI API is running"
    }


@app.get("/api/health")
def health():
    return {
        "status": "online",
        "model_ready": True,
        "model_name": "Logistic Regression",
        "input_features": 13
    }


@app.post("/api/predict")
def predict_heart_risk(
    heart_data: HeartInputData
):
    try:
        input_df = pd.DataFrame(
            [heart_data.model_dump()],
            columns=features
        )

        prediction = model.predict(input_df)[0]
        probability = model.predict_proba(input_df)[0]

        return prepare_result(
            prediction,
            probability
        )

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Prediction could not be completed."
        )