#!/usr/bin/env python3
"""
데이터베이스에 is_editor 컬럼 및 Posts 관련 테이블 추가 마이그레이션
기존 데이터베이스에 편집자 권한 필드와 블로그 포스트 관련 테이블을 추가합니다.

실행 방법:
    python -m database.scripts.migrate_add_posts
    또는
    cd backend && python database/scripts/migrate_add_posts.py
"""
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from database import engine, SessionLocal
from sqlalchemy import text


def migrate():
    """마이그레이션 실행 함수"""
    db = SessionLocal()
    try:
        print("🔄 마이그레이션 시작...\n")
        
        # is_editor 컬럼이 있는지 확인
        result = db.execute(text("""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name='users' AND column_name='is_editor'
        """))
        
        if result.fetchone():
            print("✓ is_editor 컬럼이 이미 존재합니다.")
        else:
            # is_editor 컬럼 추가
            db.execute(text("ALTER TABLE users ADD COLUMN is_editor BOOLEAN DEFAULT FALSE"))
            db.commit()
            print("✓ is_editor 컬럼을 추가했습니다.")
        
        # posts 테이블이 있는지 확인
        result = db.execute(text("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_name='posts'
        """))
        
        if result.fetchone():
            print("✓ posts 테이블이 이미 존재합니다.")
        else:
            # posts 테이블 생성
            from database.models import Post
            from database import Base
            Post.__table__.create(engine, checkfirst=True)
            print("✓ posts 테이블을 생성했습니다.")
        
        # post_editors 테이블이 있는지 확인
        result = db.execute(text("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_name='post_editors'
        """))
        
        if result.fetchone():
            print("✓ post_editors 테이블이 이미 존재합니다.")
        else:
            # post_editors 테이블 생성
            from database.models import PostEditor
            PostEditor.__table__.create(engine, checkfirst=True)
            print("✓ post_editors 테이블을 생성했습니다.")
        
        # comments 테이블이 있는지 확인
        result = db.execute(text("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_name='comments'
        """))
        
        if result.fetchone():
            print("✓ comments 테이블이 이미 존재합니다.")
        else:
            # comments 테이블 생성
            from database.models import Comment
            Comment.__table__.create(engine, checkfirst=True)
            print("✓ comments 테이블을 생성했습니다.")
        
        print("\n✅ 마이그레이션이 완료되었습니다!")
        
    except Exception as e:
        db.rollback()
        print(f"❌ 오류 발생: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
    finally:
        db.close()


if __name__ == "__main__":
    migrate()

