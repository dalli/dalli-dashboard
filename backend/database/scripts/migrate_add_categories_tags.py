#!/usr/bin/env python3
"""
데이터베이스에 Categories와 Tags 테이블 추가 마이그레이션

실행 방법:
    python -m database.scripts.migrate_add_categories_tags
    또는
    cd backend && python database/scripts/migrate_add_categories_tags.py
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
        
        # categories 테이블이 있는지 확인
        result = db.execute(text("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_name='categories'
        """))
        
        if result.fetchone():
            print("✓ categories 테이블이 이미 존재합니다.")
        else:
            # categories 테이블 생성
            from database.models import Category
            from database import Base
            Category.__table__.create(engine, checkfirst=True)
            print("✓ categories 테이블을 생성했습니다.")
        
        # tags 테이블이 있는지 확인
        result = db.execute(text("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_name='tags'
        """))
        
        if result.fetchone():
            print("✓ tags 테이블이 이미 존재합니다.")
        else:
            # tags 테이블 생성
            from database.models import Tag
            Tag.__table__.create(engine, checkfirst=True)
            print("✓ tags 테이블을 생성했습니다.")
        
        # post_tags 테이블이 있는지 확인
        result = db.execute(text("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_name='post_tags'
        """))
        
        if result.fetchone():
            print("✓ post_tags 테이블이 이미 존재합니다.")
        else:
            # post_tags 테이블 생성
            from database.models import PostTag
            PostTag.__table__.create(engine, checkfirst=True)
            print("✓ post_tags 테이블을 생성했습니다.")
        
        # posts 테이블에 category_id 컬럼이 있는지 확인
        result = db.execute(text("""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name='posts' AND column_name='category_id'
        """))
        
        if result.fetchone():
            print("✓ posts 테이블에 category_id 컬럼이 이미 존재합니다.")
        else:
            # category_id 컬럼 추가
            db.execute(text("ALTER TABLE posts ADD COLUMN category_id INTEGER REFERENCES categories(id)"))
            db.commit()
            print("✓ posts 테이블에 category_id 컬럼을 추가했습니다.")
        
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

