import uuid
from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from database import Base
import auth.models  # noqa: F401


class Assessment(Base):
    __tablename__ = "assessments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)

    # 13 Model Inputs
    age = Column(Integer, nullable=False)
    sex = Column(Integer, nullable=False)
    trestbps = Column(Float, nullable=False)
    chol = Column(Float, nullable=False)
    fbs = Column(Integer, nullable=False)
    thalach = Column(Float, nullable=False)
    oldpeak = Column(Float, nullable=False)
    cp = Column(Integer, nullable=False)
    restecg = Column(Integer, nullable=False)
    exang = Column(Integer, nullable=False)
    slope = Column(Integer, nullable=False)
    ca = Column(Integer, nullable=False)
    thal = Column(Integer, nullable=False)

    # Prediction outputs
    risk_class = Column(Integer, nullable=False)
    result = Column(String(50), nullable=False)
    lower_risk = Column(Float, nullable=False)
    higher_risk = Column(Float, nullable=False)
    model_percentage = Column(Float, nullable=False)
    model_name = Column(String(50), nullable=False, default="Logistic Regression")
    model_version = Column(String(20), nullable=False, default="1.0")

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    user = relationship("User", back_populates="assessments")
