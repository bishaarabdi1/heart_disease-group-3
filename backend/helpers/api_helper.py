from pathlib import Path
from typing import Any, Dict, Literal, Tuple
import joblib
import pandas as pd
from pydantic import BaseModel, Field

# Load the heart-disease model
project_folder = Path(__file__).resolve().parent.parent.parent
model_path = project_folder / "models" / "heart_disease_logistic_model.joblib"
model = joblib.load(model_path)

# Model input columns (order matters for the trained scikit-learn model)
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


class HeartInputData(BaseModel):
    age: int = Field(ge=18, le=100)
    sex: Literal[0, 1]

    trestbps: float = Field(ge=70, le=250)
    chol: float = Field(ge=80, le=700)
    fbs: Literal[0, 1]
    thalach: float = Field(ge=50, le=250)
    oldpeak: float = Field(ge=0, le=10)

    cp: Literal[1, 2, 3, 4]
    restecg: Literal[0, 1, 2]
    exang: Literal[0, 1]
    slope: Literal[1, 2, 3]
    ca: Literal[0, 1, 2, 3]
    thal: Literal[3, 6, 7]


def prepare_result(prediction: Any, probability: Any) -> Dict[str, Any]:
    prediction = int(prediction)

    lower_risk = round(float(probability[0]), 4)
    higher_risk = round(float(probability[1]), 4)

    if prediction == 1:
        result = "Higher Risk Class"
        confidence = higher_risk
    else:
        result = "Lower Risk Class"
        confidence = lower_risk

    return {
        "success": True,
        "risk_class": prediction,
        "result": result,
        "probabilities": {
            "lower_risk": lower_risk,
            "higher_risk": higher_risk
        },
        "model_percentage": round(confidence * 100, 2),
        "model_name": "Logistic Regression",
        "model_version": "1.0",
        "human_required": True,
        "disclaimer": (
            "Educational use only. "
            "This is not a medical diagnosis."
        )
    }


def run_prediction(heart_data: HeartInputData) -> Tuple[int, Any, Dict[str, Any]]:
    """Run model inference and return (prediction, probability, prepared_result)."""
    input_df = pd.DataFrame(
        [heart_data.model_dump()],
        columns=features
    )
    prediction = model.predict(input_df)[0]
    probability = model.predict_proba(input_df)[0]
    result_dict = prepare_result(prediction, probability)
    return int(prediction), probability, result_dict