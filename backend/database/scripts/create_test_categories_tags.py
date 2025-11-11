#!/usr/bin/env python3
"""
테스트용 카테고리와 태그 생성 스크립트
10개의 카테고리와 여러 태그를 생성합니다.

실행 방법:
    python -m database.scripts.create_test_categories_tags
    또는
    cd backend && python database/scripts/create_test_categories_tags.py
"""
import sys
import os
import re

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from database import SessionLocal
from database.models import Category, Tag, Post
import random


def slugify(text: str) -> str:
    """텍스트를 slug로 변환"""
    slug = text.lower()
    slug = re.sub(r'[^\w\s-]', '', slug)
    slug = re.sub(r'[-\s]+', '-', slug)
    return slug.strip('-')


def create_test_categories_tags():
    """테스트 카테고리와 태그 생성"""
    db = SessionLocal()
    try:
        print("🔄 테스트 카테고리와 태그 생성 시작...\n")
        
        # 카테고리 목록
        categories_data = [
            {"name": "웹 개발", "description": "웹 애플리케이션 개발 관련"},
            {"name": "백엔드", "description": "서버 사이드 개발"},
            {"name": "프론트엔드", "description": "클라이언트 사이드 개발"},
            {"name": "데이터베이스", "description": "데이터베이스 설계 및 최적화"},
            {"name": "DevOps", "description": "개발 및 운영 자동화"},
            {"name": "보안", "description": "보안 및 암호화"},
            {"name": "아키텍처", "description": "시스템 아키텍처 설계"},
            {"name": "모바일", "description": "모바일 앱 개발"},
            {"name": "클라우드", "description": "클라우드 서비스 및 인프라"},
            {"name": "기타", "description": "기타 개발 관련 주제"}
        ]
        
        # 태그 목록
        tags_data = [
            "React", "TypeScript", "JavaScript", "Python", "Docker",
            "Kubernetes", "AWS", "Azure", "GCP", "Node.js",
            "FastAPI", "PostgreSQL", "MongoDB", "Redis", "GraphQL",
            "REST API", "Microservices", "CI/CD", "Git", "Linux",
            "Nginx", "TDD", "Agile", "Scrum", "Security",
            "Performance", "Optimization", "Testing", "Deployment", "Monitoring"
        ]
        
        # 카테고리 생성
        created_categories = []
        for cat_data in categories_data:
            existing = db.query(Category).filter(Category.slug == slugify(cat_data["name"])).first()
            if existing:
                created_categories.append(existing)
                print(f"✓ 카테고리 '{cat_data['name']}' 이미 존재")
            else:
                category = Category(
                    name=cat_data["name"],
                    slug=slugify(cat_data["name"]),
                    description=cat_data["description"]
                )
                db.add(category)
                db.commit()
                db.refresh(category)
                created_categories.append(category)
                print(f"✓ 카테고리 '{cat_data['name']}' 생성 완료")
        
        # 태그 생성
        created_tags = []
        for tag_name in tags_data:
            existing = db.query(Tag).filter(Tag.slug == slugify(tag_name)).first()
            if existing:
                created_tags.append(existing)
            else:
                tag = Tag(
                    name=tag_name,
                    slug=slugify(tag_name)
                )
                db.add(tag)
                db.commit()
                db.refresh(tag)
                created_tags.append(tag)
                print(f"✓ 태그 '{tag_name}' 생성 완료")
        
        print(f"\n✅ 총 {len(created_categories)}개의 카테고리와 {len(created_tags)}개의 태그가 생성되었습니다!")
        
    except Exception as e:
        db.rollback()
        print(f"❌ 오류 발생: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
    finally:
        db.close()


if __name__ == "__main__":
    create_test_categories_tags()

