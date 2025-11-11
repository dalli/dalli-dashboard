"""
데이터베이스 모델 정의
"""
from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from database import Base
import bcrypt


class User(Base):
    """사용자 모델"""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    is_admin = Column(Boolean, default=False)
    two_factor_enabled = Column(Boolean, default=False)
    two_factor_secret = Column(String, nullable=True)
    reset_token = Column(String, nullable=True)
    reset_token_expires = Column(DateTime, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    def verify_password(self, password: str) -> bool:
        """비밀번호 검증"""
        return bcrypt.checkpw(password.encode('utf-8'), self.hashed_password.encode('utf-8'))

    def set_password(self, password: str):
        """비밀번호 해싱 및 저장"""
        hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        self.hashed_password = hashed.decode('utf-8')


class Profile(Base):
    """사용자 프로필 모델"""
    __tablename__ = "profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, unique=True, index=True, nullable=False)
    
    # Personal Information
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    bio = Column(String, nullable=True)
    job_title = Column(String, nullable=True)
    location = Column(String, nullable=True)
    profile_image_url = Column(String, nullable=True)
    
    # Address
    country = Column(String, nullable=True)
    city_state = Column(String, nullable=True)
    postal_code = Column(String, nullable=True)
    tax_id = Column(String, nullable=True)
    
    # Social Links
    facebook_url = Column(String, nullable=True)
    twitter_url = Column(String, nullable=True)
    linkedin_url = Column(String, nullable=True)
    instagram_url = Column(String, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

