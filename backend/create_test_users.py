#!/usr/bin/env python3
"""
테스트 사용자 생성 스크립트
admin@example.com과 test@example.com 사용자를 생성합니다.
"""
import sys
import os

# 프로젝트 루트를 Python 경로에 추가
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from database import SessionLocal, init_db
from models import User

def create_test_users():
    # 데이터베이스 초기화
    init_db()
    
    db = SessionLocal()
    
    try:
        # admin@example.com 사용자 생성
        admin_user = db.query(User).filter(User.email == "admin@example.com").first()
        if not admin_user:
            admin_user = User(
                email="admin@example.com",
                full_name="Admin User",
                is_active=True,
                is_verified=True,
                is_admin=True,
            )
            admin_user.set_password("admin123")
            db.add(admin_user)
            print("✓ admin@example.com 사용자 생성 완료 (비밀번호: admin123, 관리자 권한)")
        else:
            # 기존 사용자에게 관리자 권한 부여
            if not admin_user.is_admin:
                admin_user.is_admin = True
                print("✓ admin@example.com 사용자에게 관리자 권한 부여")
            else:
                print("⚠ admin@example.com 사용자가 이미 존재합니다.")
        
        # test@example.com 사용자 생성
        test_user = db.query(User).filter(User.email == "test@example.com").first()
        if not test_user:
            test_user = User(
                email="test@example.com",
                full_name="Test User",
                is_active=True,
                is_verified=True,
            )
            test_user.set_password("test123")
            db.add(test_user)
            print("✓ test@example.com 사용자 생성 완료 (비밀번호: test123)")
        else:
            print("⚠ test@example.com 사용자가 이미 존재합니다.")
        
        db.commit()
        print("\n✅ 테스트 사용자 생성이 완료되었습니다!")
        print("\n로그인 정보:")
        print("  - admin@example.com / admin123")
        print("  - test@example.com / test123")
        
    except Exception as e:
        db.rollback()
        print(f"❌ 오류 발생: {e}")
        sys.exit(1)
    finally:
        db.close()

if __name__ == "__main__":
    create_test_users()

