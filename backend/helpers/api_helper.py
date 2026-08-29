from typing import Literal

from pydantic import BaseModel, Field


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


def prepare_result(prediction, probability):
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