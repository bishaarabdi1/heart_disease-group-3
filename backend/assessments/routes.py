import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
from auth.dependencies import get_current_user
from auth.models import User
from assessments.models import Assessment
from assessments.schemas import AssessmentCreateResponse, AssessmentResponse
from helpers.api_helper import HeartInputData, run_prediction

router = APIRouter(prefix="/api/assessments", tags=["assessments"])


def _format_assessment_response(a: Assessment) -> AssessmentResponse:
    resp = AssessmentResponse.model_validate(a)
    resp.probabilities = {
        "lower_risk": a.lower_risk,
        "higher_risk": a.higher_risk,
    }
    return resp


@router.post(
    "",
    response_model=AssessmentCreateResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Predict heart-disease risk and save assessment to database",
)
def create_assessment(
    heart_data: HeartInputData,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        prediction, probability, result_dict = run_prediction(heart_data)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Prediction could not be completed.",
        )

    lower_risk = float(probability[0])
    higher_risk = float(probability[1])

    assessment = Assessment(
        user_id=current_user.id,
        age=heart_data.age,
        sex=heart_data.sex,
        trestbps=heart_data.trestbps,
        chol=heart_data.chol,
        fbs=heart_data.fbs,
        thalach=heart_data.thalach,
        oldpeak=heart_data.oldpeak,
        cp=heart_data.cp,
        restecg=heart_data.restecg,
        exang=heart_data.exang,
        slope=heart_data.slope,
        ca=heart_data.ca,
        thal=heart_data.thal,
        risk_class=result_dict["risk_class"],
        result=result_dict["result"],
        lower_risk=round(lower_risk, 4),
        higher_risk=round(higher_risk, 4),
        model_percentage=result_dict["model_percentage"],
        model_name=result_dict["model_name"],
        model_version=result_dict["model_version"],
    )

    db.add(assessment)
    db.commit()
    db.refresh(assessment)

    return {
        "success": True,
        "assessment": _format_assessment_response(assessment),
        "risk_class": result_dict["risk_class"],
        "result": result_dict["result"],
        "probabilities": result_dict["probabilities"],
        "model_percentage": result_dict["model_percentage"],
        "model_name": result_dict["model_name"],
        "model_version": result_dict["model_version"],
        "human_required": True,
        "disclaimer": result_dict["disclaimer"],
    }


@router.get(
    "",
    response_model=List[AssessmentResponse],
    summary="List assessments for current authenticated user (newest first, limit 50)",
)
def list_assessments(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    assessments = (
        db.query(Assessment)
        .filter(Assessment.user_id == current_user.id)
        .order_by(Assessment.created_at.desc())
        .limit(50)
        .all()
    )
    return [_format_assessment_response(a) for a in assessments]


@router.get(
    "/{assessment_id}",
    response_model=AssessmentResponse,
    summary="Get single assessment by ID for current user",
)
def get_assessment(
    assessment_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    assessment = (
        db.query(Assessment)
        .filter(
            Assessment.id == assessment_id,
            Assessment.user_id == current_user.id,
        )
        .first()
    )
    if not assessment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assessment not found.",
        )
    return _format_assessment_response(assessment)


@router.delete(
    "/{assessment_id}",
    summary="Delete single assessment by ID for current user",
)
def delete_assessment(
    assessment_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    assessment = (
        db.query(Assessment)
        .filter(
            Assessment.id == assessment_id,
            Assessment.user_id == current_user.id,
        )
        .first()
    )
    if not assessment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assessment not found.",
        )
    db.delete(assessment)
    db.commit()
    return {"message": "Assessment deleted successfully"}
