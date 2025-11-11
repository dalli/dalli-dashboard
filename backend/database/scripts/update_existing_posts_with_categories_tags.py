#!/usr/bin/env python3
"""
기존 포스트에 카테고리와 태그 연결 스크립트

실행 방법:
    python -m database.scripts.update_existing_posts_with_categories_tags
    또는
    cd backend && python database/scripts/update_existing_posts_with_categories_tags.py
"""
import sys
import os
import random

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from database import SessionLocal
from database.models import Post, Category, Tag, PostTag


def update_existing_posts():
    """기존 포스트에 카테고리와 태그 연결"""
    db = SessionLocal()
    try:
        print("🔄 기존 포스트 업데이트 시작...\n")
        
        # 카테고리와 태그 가져오기
        categories = db.query(Category).all()
        tags = db.query(Tag).all()
        
        if not categories:
            print("⚠️  카테고리가 없습니다.")
            return
        
        if not tags:
            print("⚠️  태그가 없습니다.")
            return
        
        # 카테고리나 태그가 없는 포스트 찾기
        posts = db.query(Post).all()
        updated_count = 0
        
        for post in posts:
            updated = False
            
            # 카테고리가 없으면 랜덤 카테고리 할당
            if not post.category_id:
                category = random.choice(categories)
                post.category_id = category.id
                updated = True
                print(f"✓ 포스트 '{post.title}'에 카테고리 '{category.name}' 연결")
            
            # 태그가 없으면 랜덤 태그 연결 (2-5개)
            existing_tags = db.query(PostTag).filter(PostTag.post_id == post.id).all()
            if not existing_tags:
                num_tags = random.randint(2, min(5, len(tags)))
                selected_tags = random.sample(tags, num_tags)
                for tag in selected_tags:
                    post_tag = PostTag(post_id=post.id, tag_id=tag.id)
                    db.add(post_tag)
                updated = True
                tag_names = [t.name for t in selected_tags]
                print(f"✓ 포스트 '{post.title}'에 태그 연결: {', '.join(tag_names)}")
            
            if updated:
                updated_count += 1
        
        if updated_count > 0:
            db.commit()
            print(f"\n✅ 총 {updated_count}개의 포스트가 업데이트되었습니다!")
        else:
            print("✓ 모든 포스트가 이미 카테고리와 태그를 가지고 있습니다.")
        
    except Exception as e:
        db.rollback()
        print(f"❌ 오류 발생: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
    finally:
        db.close()


if __name__ == "__main__":
    update_existing_posts()

