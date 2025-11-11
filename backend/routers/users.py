from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from sqlalchemy import or_

from database import get_db
from database.models import User
from database.schemas import UserCreate, UserResponse
from auth import get_current_user

router = APIRouter(prefix="/api/users", tags=["users"])


def require_admin(current_user: User = Depends(get_current_user)):
    """관리자 권한 확인"""
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return current_user


@router.get("", response_model=List[UserResponse])
async def get_users(
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = None,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """사용자 목록 조회 (관리자만)"""
    query = db.query(User)
    
    # 검색 기능
    if search:
        query = query.filter(
            or_(
                User.email.ilike(f"%{search}%"),
                User.full_name.ilike(f"%{search}%")
            )
        )
    
    users = query.offset(skip).limit(limit).all()
    return users


@router.get("/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: int,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """사용자 상세 조회 (관리자만)"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user


@router.post("", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def create_user(
    user_data: UserCreate,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """사용자 생성 (관리자만)"""
    # 이메일 중복 확인
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # 비밀번호 필수 확인
    if not user_data.password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password is required"
        )
    
    # 새 사용자 생성
    new_user = User(
        email=user_data.email,
        full_name=user_data.full_name,
        is_active=user_data.is_active if user_data.is_active is not None else True,
        is_verified=True,
        is_admin=user_data.is_admin if user_data.is_admin is not None else False,
    )
    new_user.set_password(user_data.password)
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return new_user


@router.put("/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: int,
    user_data: UserCreate,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """사용자 정보 업데이트 (관리자만)"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # 이메일 변경 시 중복 확인
    if user_data.email != user.email:
        existing_user = db.query(User).filter(User.email == user_data.email).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
    
    # 사용자 정보 업데이트
    user.email = user_data.email
    user.full_name = user_data.full_name
    
    # 관리자 권한 업데이트 (자신의 권한은 변경 불가)
    if user_data.is_admin is not None and user_id != current_user.id:
        user.is_admin = user_data.is_admin
    
    # 활성화 상태 업데이트 (자신의 상태는 변경 불가)
    if user_data.is_active is not None and user_id != current_user.id:
        user.is_active = user_data.is_active
    
    # 비밀번호가 제공된 경우에만 업데이트
    if user_data.password:
        user.set_password(user_data.password)
    
    db.commit()
    db.refresh(user)
    
    return user


@router.post("/{user_id}/toggle-active")
async def toggle_user_active(
    user_id: int,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """사용자 활성화/비활성화 토글 (관리자만)"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # 자신을 비활성화할 수 없음
    if user_id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot deactivate yourself"
        )
    
    user.is_active = not user.is_active
    db.commit()
    db.refresh(user)
    
    return {"message": f"User {'activated' if user.is_active else 'deactivated'}", "user": user}


@router.post("/{user_id}/toggle-admin")
async def toggle_user_admin(
    user_id: int,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """사용자 관리자 권한 토글 (관리자만)"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # 자신의 관리자 권한을 제거할 수 없음
    if user_id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot remove admin role from yourself"
        )
    
    user.is_admin = not user.is_admin
    db.commit()
    db.refresh(user)
    
    return {"message": f"User admin role {'granted' if user.is_admin else 'revoked'}", "user": user}


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(
    user_id: int,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """사용자 삭제 (관리자만)"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # 자신을 삭제할 수 없음
    if user_id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete yourself"
        )
    
    db.delete(user)
    db.commit()
    
    return None

