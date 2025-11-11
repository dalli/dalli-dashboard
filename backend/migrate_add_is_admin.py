#!/usr/bin/env python3
"""
데이터베이스에 is_admin 컬럼 추가 마이그레이션
"""
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from database import engine, SessionLocal
from sqlalchemy import text

def migrate():
    db = SessionLocal()
    try:
        # is_admin 컬럼이 있는지 확인
        result = db.execute(text("""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name='users' AND column_name='is_admin'
        """))
        
        if result.fetchone():
            print("✓ is_admin 컬럼이 이미 존재합니다.")
        else:
            # is_admin 컬럼 추가
            db.execute(text("ALTER TABLE users ADD COLUMN is_admin BOOLEAN DEFAULT FALSE"))
            db.commit()
            print("✓ is_admin 컬럼을 추가했습니다.")
        
        # profiles 테이블이 있는지 확인
        result = db.execute(text("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_name='profiles'
        """))
        
        if result.fetchone():
            print("✓ profiles 테이블이 이미 존재합니다.")
        else:
            # profiles 테이블 생성
            from models import Profile
            from database import Base
            Profile.__table__.create(engine, checkfirst=True)
            print("✓ profiles 테이블을 생성했습니다.")
        
        print("\n✅ 마이그레이션이 완료되었습니다!")
        
    except Exception as e:
        db.rollback()
        print(f"❌ 오류 발생: {e}")
        sys.exit(1)
    finally:
        db.close()

if __name__ == "__main__":
    migrate()

