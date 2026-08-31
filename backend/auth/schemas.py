import uuid
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator


class UserRegister(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=80, description="Full name of the user")
    email: EmailStr = Field(..., description="Valid email address")
    password: str = Field(..., min_length=8, description="Password with at least 8 characters")

    @field_validator("email")
    @classmethod
    def email_to_lower(cls, v: str) -> str:
        return v.strip().lower()

    @field_validator("full_name")
    @classmethod
    def strip_full_name(cls, v: str) -> str:
        stripped = v.strip()
        if len(stripped) < 2 or len(stripped) > 80:
            raise ValueError("Full name must be between 2 and 80 characters.")
        return stripped


class UserLogin(BaseModel):
    email: EmailStr = Field(..., description="Email address")
    password: str = Field(..., min_length=1, description="Password")

    @field_validator("email")
    @classmethod
    def email_to_lower(cls, v: str) -> str:
        return v.strip().lower()


class UserUpdate(BaseModel):
    full_name: Optional[str] = Field(None, min_length=2, max_length=80)
    email: Optional[EmailStr] = None

    @field_validator("email")
    @classmethod
    def email_to_lower(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            return v.strip().lower()
        return v

    @field_validator("full_name")
    @classmethod
    def strip_full_name(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            stripped = v.strip()
            if len(stripped) < 2 or len(stripped) > 80:
                raise ValueError("Full name must be between 2 and 80 characters.")
            return stripped
        return v


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    full_name: str
    email: str
    role: str
    is_active: bool
    created_at: datetime
    updated_at: datetime
