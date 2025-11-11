from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from database.models import User, Profile
from database.schemas import ProfileResponse, ProfileUpdate
from auth import get_current_user

router = APIRouter(prefix="/api/profile", tags=["profile"])


def can_edit_profile(current_user: User, profile_user_id: int) -> bool:
    """프로파일 편집 권한 확인: 자신의 프로파일이거나 관리자인 경우"""
    return current_user.id == profile_user_id or current_user.is_admin


@router.get("/{user_id}")
async def get_profile(user_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """사용자 프로파일 조회 (모든 인증된 사용자 가능)"""
    # 사용자 존재 확인
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # 프로파일 조회 또는 생성
    profile = db.query(Profile).filter(Profile.user_id == user_id).first()
    if not profile:
        # 프로파일이 없으면 기본 프로파일 생성
        profile = Profile(
            user_id=user_id,
            first_name=user.full_name.split()[0] if user.full_name else None,
            last_name=" ".join(user.full_name.split()[1:]) if user.full_name and len(user.full_name.split()) > 1 else None,
        )
        db.add(profile)
        db.commit()
        db.refresh(profile)
    
    # 프로파일 응답에 사용자 정보 포함
    from database.schemas import ProfileResponse
    profile_dict = {
        "id": profile.id,
        "user_id": profile.user_id,
        "first_name": profile.first_name,
        "last_name": profile.last_name,
        "phone": profile.phone,
        "bio": profile.bio,
        "job_title": profile.job_title,
        "location": profile.location,
        "profile_image_url": profile.profile_image_url,
        "country": profile.country,
        "city_state": profile.city_state,
        "postal_code": profile.postal_code,
        "tax_id": profile.tax_id,
        "facebook_url": profile.facebook_url,
        "twitter_url": profile.twitter_url,
        "linkedin_url": profile.linkedin_url,
        "instagram_url": profile.instagram_url,
        "created_at": profile.created_at,
        "updated_at": profile.updated_at,
        "email": user.email,
        "full_name": user.full_name,
    }
    return profile_dict


@router.get("/me")
async def get_my_profile(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """현재 사용자의 프로파일 조회"""
    return await get_profile(current_user.id, current_user, db)


@router.put("/{user_id}")
async def update_profile(
    user_id: int,
    profile_data: ProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """프로파일 업데이트 (자신의 프로파일이거나 관리자만 가능)"""
    # 권한 확인
    if not can_edit_profile(current_user, user_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to edit this profile"
        )
    
    # 사용자 존재 확인
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # 프로파일 조회 또는 생성
    profile = db.query(Profile).filter(Profile.user_id == user_id).first()
    if not profile:
        profile = Profile(user_id=user_id)
        db.add(profile)
    
    # 프로파일 업데이트
    update_data = profile_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(profile, field, value)
    
    db.commit()
    db.refresh(profile)
    
    # 프로파일 응답에 사용자 정보 포함
    profile_dict = {
        "id": profile.id,
        "user_id": profile.user_id,
        "first_name": profile.first_name,
        "last_name": profile.last_name,
        "phone": profile.phone,
        "bio": profile.bio,
        "job_title": profile.job_title,
        "location": profile.location,
        "profile_image_url": profile.profile_image_url,
        "country": profile.country,
        "city_state": profile.city_state,
        "postal_code": profile.postal_code,
        "tax_id": profile.tax_id,
        "facebook_url": profile.facebook_url,
        "twitter_url": profile.twitter_url,
        "linkedin_url": profile.linkedin_url,
        "instagram_url": profile.instagram_url,
        "created_at": profile.created_at,
        "updated_at": profile.updated_at,
        "email": user.email,
        "full_name": user.full_name,
    }
    return profile_dict


@router.put("/me")
async def update_my_profile(
    profile_data: ProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """현재 사용자의 프로파일 업데이트"""
    return await update_profile(current_user.id, profile_data, current_user, db)

