"""
Pydantic 스키마 정의
API 요청/응답 데이터 검증에 사용됩니다.
"""
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class UserBase(BaseModel):
    """사용자 기본 스키마"""
    email: EmailStr
    full_name: Optional[str] = None


class UserCreate(UserBase):
    """사용자 생성 스키마"""
    password: Optional[str] = None
    is_admin: Optional[bool] = False
    is_active: Optional[bool] = True


class UserLogin(BaseModel):
    """사용자 로그인 스키마"""
    email: EmailStr
    password: str


class UserResponse(UserBase):
    """사용자 응답 스키마"""
    id: int
    is_active: bool
    is_verified: bool
    is_admin: bool
    two_factor_enabled: bool
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    """JWT 토큰 스키마"""
    access_token: str
    token_type: str


class ResetPasswordRequest(BaseModel):
    """비밀번호 재설정 요청 스키마"""
    email: EmailStr


class ResetPassword(BaseModel):
    """비밀번호 재설정 스키마"""
    token: str
    new_password: str


class TwoFactorVerify(BaseModel):
    """2단계 인증 검증 스키마"""
    code: str


class TwoFactorSetup(BaseModel):
    """2단계 인증 설정 스키마"""
    secret: str
    qr_code: str


class ProfileBase(BaseModel):
    """프로필 기본 스키마"""
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    bio: Optional[str] = None
    job_title: Optional[str] = None
    location: Optional[str] = None
    profile_image_url: Optional[str] = None
    country: Optional[str] = None
    city_state: Optional[str] = None
    postal_code: Optional[str] = None
    tax_id: Optional[str] = None
    facebook_url: Optional[str] = None
    twitter_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    instagram_url: Optional[str] = None


class ProfileCreate(ProfileBase):
    """프로필 생성 스키마"""
    pass


class ProfileUpdate(ProfileBase):
    """프로필 업데이트 스키마"""
    pass


class ProfileResponse(ProfileBase):
    """프로필 응답 스키마"""
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

