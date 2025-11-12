#!/usr/bin/env python3
"""
게시글의 카테고리를 등록하고 각 게시글에 댓글을 추가하는 스크립트

실행 방법:
    python -m database.scripts.setup_categories_and_comments
    또는
    cd backend && python database/scripts/setup_categories_and_comments.py
"""
import sys
import os
from datetime import datetime, timedelta
import random
import re

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from database import SessionLocal
from database.models import User, Post, Category, Comment
import re


def slugify(text: str) -> str:
    """텍스트를 slug로 변환"""
    slug = text.lower()
    slug = re.sub(r'[^\w\s-]', '', slug)
    slug = re.sub(r'[-\s]+', '-', slug)
    return slug.strip('-')


def setup_categories_and_comments():
    """게시글의 카테고리를 등록하고 댓글 추가"""
    db = SessionLocal()
    try:
        print("🔄 카테고리 및 댓글 설정 시작...\n")
        
        # 모든 게시글 가져오기
        posts = db.query(Post).all()
        
        if not posts:
            print("⚠️  게시글이 없습니다. 먼저 게시글을 생성해주세요.")
            return
        
        print(f"✓ {len(posts)}개의 게시글을 찾았습니다.\n")
        
        # 게시글에서 사용된 카테고리 추출
        category_names = set()
        for post in posts:
            if post.category:
                category_names.add(post.category.name)
        
        # 게시글 제목에서 카테고리 추출 (카테고리가 없는 경우)
        category_keywords = {
            "React": "프론트엔드",
            "TypeScript": "프론트엔드",
            "Docker": "DevOps",
            "API": "백엔드",
            "REST": "백엔드",
            "마이크로서비스": "아키텍처",
            "데이터베이스": "백엔드",
            "CI/CD": "DevOps",
            "보안": "보안",
            "프론트엔드": "프론트엔드",
            "GraphQL": "백엔드",
            "테스트": "개발 방법론",
            "클라우드": "DevOps",
            "접근성": "프론트엔드",
            "모니터링": "DevOps",
            "코드 리뷰": "개발 방법론",
            "애자일": "개발 방법론",
        }
        
        # 카테고리 생성
        created_categories = {}
        for post in posts:
            if not post.category:
                # 게시글 제목에서 카테고리 추출
                category_name = None
                for keyword, cat_name in category_keywords.items():
                    if keyword in post.title:
                        category_name = cat_name
                        break
                
                if not category_name:
                    category_name = "기타"
                
                # 카테고리가 이미 생성되었는지 확인
                if category_name not in created_categories:
                    # 기존 카테고리 확인
                    existing_category = db.query(Category).filter(Category.name == category_name).first()
                    if existing_category:
                        created_categories[category_name] = existing_category
                    else:
                        # 새 카테고리 생성
                        slug = slugify(category_name)
                        # slug 중복 확인
                        existing_slug = db.query(Category).filter(Category.slug == slug).first()
                        if existing_slug:
                            slug = f"{slug}-{len(created_categories)}"
                        
                        new_category = Category(
                            name=category_name,
                            slug=slug,
                            description=f"{category_name} 관련 게시글"
                        )
                        db.add(new_category)
                        db.commit()
                        db.refresh(new_category)
                        created_categories[category_name] = new_category
                        print(f"✓ 카테고리 '{category_name}' 생성 완료")
                
                # 게시글에 카테고리 연결
                post.category_id = created_categories[category_name].id
                db.commit()
                print(f"✓ 게시글 '{post.title}'에 카테고리 '{category_name}' 연결 완료")
            else:
                created_categories[post.category.name] = post.category
        
        print(f"\n✅ 총 {len(created_categories)}개의 카테고리가 설정되었습니다.\n")
        
        # 사용자 가져오기 (댓글 작성자용)
        users = db.query(User).filter(User.is_active == True).all()
        if not users:
            print("⚠️  활성 사용자가 없습니다. 댓글을 생성할 수 없습니다.")
            return
        
        # 각 게시글에 댓글 추가
        sample_comments = [
            "정말 유용한 정보네요! 감사합니다.",
            "좋은 글 잘 읽었습니다. 도움이 많이 되었어요.",
            "추가로 궁금한 점이 있는데, 더 자세한 설명이 가능할까요?",
            "이 내용을 실제 프로젝트에 적용해보고 싶습니다.",
            "다른 관점에서도 접근해볼 수 있을 것 같아요.",
            "예제 코드가 특히 도움이 되었습니다.",
            "이 주제에 대해 더 깊이 다뤄주시면 좋을 것 같습니다.",
            "실무에서 바로 적용 가능한 내용이네요!",
            "초보자도 이해하기 쉽게 설명해주셔서 감사합니다.",
            "관련 자료나 참고 링크가 있으면 공유해주세요.",
        ]
        
        comment_count = 0
        for post in posts:
            # 각 게시글마다 3개의 댓글 추가
            for i in range(3):
                # 랜덤 사용자 선택
                user = random.choice(users)
                
                # 랜덤 댓글 선택
                comment_text = random.choice(sample_comments)
                
                # 댓글 생성 시간 (게시글 생성 이후)
                days_after = random.randint(0, 7)
                hours_after = random.randint(0, 23)
                created_at = post.created_at + timedelta(days=days_after, hours=hours_after)
                
                # 기존 댓글 확인 (중복 방지)
                existing_comment = db.query(Comment).filter(
                    Comment.post_id == post.id,
                    Comment.user_id == user.id,
                    Comment.content == comment_text
                ).first()
                
                if not existing_comment:
                    new_comment = Comment(
                        post_id=post.id,
                        user_id=user.id,
                        content=comment_text,
                        created_at=created_at
                    )
                    db.add(new_comment)
                    comment_count += 1
        
        db.commit()
        print(f"✅ 총 {comment_count}개의 댓글이 생성되었습니다!")
        print(f"   (각 게시글당 최대 3개씩)\n")
        
        print("🎉 카테고리 및 댓글 설정이 완료되었습니다!")
        
    except Exception as e:
        db.rollback()
        print(f"❌ 오류 발생: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
    finally:
        db.close()


if __name__ == "__main__":
    setup_categories_and_comments()

