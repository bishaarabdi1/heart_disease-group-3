from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from database import (
    ACCESS_TOKEN_EXPIRE_MINUTES,
    AUTH_COOKIE_SAMESITE,
    AUTH_COOKIE_SECURE,
    get_db,
)
from auth.dependencies import get_current_user
from auth.models import User
from auth.schemas import UserLogin, UserRegister, UserResponse, UserUpdate
from auth.security import create_access_token, hash_password, verify_password

router = APIRouter(prefix="/api/auth", tags=["auth"])


def _set_auth_cookie(response: Response, user_id: str) -> None:
    token = create_access_token(subject=str(user_id))
    response.set_cookie(
        key="heartguard_access_token",
        value=token,
        httponly=True,
        secure=AUTH_COOKIE_SECURE,
        samesite=AUTH_COOKIE_SAMESITE,
        max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        path="/",
    )


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user account",
)
def register(
    user_in: UserRegister,
    response: Response,
    db: Session = Depends(get_db),
):
    # Check for existing email
    existing = db.query(User).filter(User.email == user_in.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email is already registered.",
        )

    # Hash password with Argon2
    hashed_pwd = hash_password(user_in.password)

    user = User(
        full_name=user_in.full_name,
        email=user_in.email,
        password_hash=hashed_pwd,
        role="user",
        is_active=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Automatically log the user in
    _set_auth_cookie(response, str(user.id))

    return user


@router.post(
    "/login",
    response_model=UserResponse,
    summary="Authenticate user and set auth cookie",
)
def login(
    user_in: UserLogin,
    response: Response,
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.email == user_in.email).first()
    if not user or not verify_password(user_in.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    _set_auth_cookie(response, str(user.id))

    return user


@router.post(
    "/logout",
    summary="Clear authentication cookie",
)
def logout(response: Response):
    response.delete_cookie(
        key="heartguard_access_token",
        path="/",
        httponly=True,
        secure=AUTH_COOKIE_SECURE,
        samesite=AUTH_COOKIE_SAMESITE,
    )
    return {"message": "Logged out successfully"}


@router.get(
    "/me",
    response_model=UserResponse,
    summary="Get current authenticated user profile",
)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.patch(
    "/me",
    response_model=UserResponse,
    summary="Update current user profile (full_name, email only)",
)
def update_me(
    profile_in: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if profile_in.full_name is not None:
        current_user.full_name = profile_in.full_name

    if profile_in.email is not None and profile_in.email != current_user.email:
        existing = db.query(User).filter(User.email == profile_in.email).first()
        if existing and existing.id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Email is already registered by another account.",
            )
        current_user.email = profile_in.email

    db.commit()
    db.refresh(current_user)

    return current_user
