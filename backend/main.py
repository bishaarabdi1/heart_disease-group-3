from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from database import FRONTEND_ORIGIN
import auth.models  # noqa: F401
import assessments.models  # noqa: F401

from auth.routes import router as auth_router
from assessments.routes import router as assessments_router
from helpers.api_helper import HeartInputData, run_prediction

# Create the HeartGuard API
app = FastAPI(
    title="HeartGuard AI API",
    version="1.0.0",
    description="Heart Disease Risk Intelligence & Authentication API",
)

# Origins for CORS - allow configured origin + localhost on any port
allowed_origins = [
    FRONTEND_ORIGIN.rstrip("/"),
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3001",
]
origins = list(dict.fromkeys(allowed_origins))

# Allow the Next.js frontend with credentials
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"^https?://(localhost|127\.0\.0\.1)(:\d+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth_router)
app.include_router(assessments_router)


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
        "input_features": 13,
    }


@app.post("/api/predict")
def predict_heart_risk(
    heart_data: HeartInputData
):
    """Public guest prediction endpoint (does not persist data)."""
    try:
        _, _, result = run_prediction(heart_data)
        return result
    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Prediction could not be completed."
        )