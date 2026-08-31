import uuid
from datetime import datetime
from typing import Dict, Optional
from pydantic import BaseModel, ConfigDict, Field


class AssessmentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    user_id: uuid.UUID

    # 13 Input variables
    age: int
    sex: int
    trestbps: float
    chol: float
    fbs: int
    thalach: float
    oldpeak: float
    cp: int
    restecg: int
    exang: int
    slope: int
    ca: int
    thal: int

    # Prediction results
    risk_class: int
    result: str
    lower_risk: float
    higher_risk: float
    model_percentage: float
    model_name: str
    model_version: str
    created_at: datetime

    # Convenience properties
    probabilities: Optional[Dict[str, float]] = None


class AssessmentCreateResponse(BaseModel):
    success: bool = True
    assessment: AssessmentResponse
    result: str
    risk_class: int
    probabilities: Dict[str, float]
    model_percentage: float
    model_name: str
    model_version: str
    human_required: bool = True
    disclaimer: str
