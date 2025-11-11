#!/usr/bin/env python3
"""
테스트용 블로그 포스트 생성 스크립트
15개의 샘플 포스트를 생성합니다.

실행 방법:
    python -m database.scripts.create_test_posts
    또는
    cd backend && python database/scripts/create_test_posts.py
"""
import sys
import os
from datetime import datetime, timedelta
import random

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from database import SessionLocal
from database.models import User, Post, Category, Tag, PostTag
import re


def slugify(text: str) -> str:
    """텍스트를 slug로 변환"""
    slug = text.lower()
    slug = re.sub(r'[^\w\s-]', '', slug)
    slug = re.sub(r'[-\s]+', '-', slug)
    return slug.strip('-')


def create_test_posts():
    """테스트 포스트 생성"""
    db = SessionLocal()
    try:
        print("🔄 테스트 포스트 생성 시작...\n")
        
        # 편집자 또는 관리자 권한을 가진 사용자 찾기
        editor = db.query(User).filter(
            (User.is_editor == True) | (User.is_admin == True)
        ).first()
        
        if not editor:
            # 편집자 권한을 가진 사용자가 없으면 관리자 생성
            admin = db.query(User).filter(User.is_admin == True).first()
            if admin:
                editor = admin
                admin.is_editor = True
                db.commit()
                print(f"✓ 사용자 '{admin.email}'에 편집자 권한을 부여했습니다.")
            else:
                print("❌ 편집자 또는 관리자 권한을 가진 사용자가 없습니다.")
                print("   먼저 관리자 계정을 생성하거나 기존 사용자에게 편집자 권한을 부여해주세요.")
                return
        
        # 기존 포스트 개수 확인
        existing_count = db.query(Post).count()
        if existing_count >= 15:
            print(f"✓ 이미 {existing_count}개의 포스트가 존재합니다.")
            return
        
        # 생성할 포스트 개수
        posts_to_create = 15 - existing_count
        
        # 카테고리와 태그 가져오기
        categories = db.query(Category).all()
        tags = db.query(Tag).all()
        
        if not categories:
            print("⚠️  카테고리가 없습니다. 먼저 카테고리를 생성해주세요.")
            print("   python -m database.scripts.create_test_categories_tags 실행")
            return
        
        if not tags:
            print("⚠️  태그가 없습니다. 먼저 태그를 생성해주세요.")
            print("   python -m database.scripts.create_test_categories_tags 실행")
            return
        
        # 샘플 포스트 데이터
        sample_posts = [
            {
                "title": "React와 TypeScript로 시작하는 모던 웹 개발",
                "content": """# React와 TypeScript로 시작하는 모던 웹 개발

React와 TypeScript를 함께 사용하면 더 안전하고 유지보수하기 쉬운 웹 애플리케이션을 만들 수 있습니다.

## 주요 장점

1. **타입 안정성**: 컴파일 타임에 오류를 발견할 수 있습니다.
2. **향상된 개발 경험**: IDE의 자동완성과 리팩토링 기능을 활용할 수 있습니다.
3. **더 나은 문서화**: 타입이 코드의 문서 역할을 합니다.

## 시작하기

\`\`\`typescript
import React from 'react';

interface Props {
  name: string;
}

const Greeting: React.FC<Props> = ({ name }) => {
  return <h1>Hello, {name}!</h1>;
};
\`\`\`

이제 React와 TypeScript로 더 안전한 코드를 작성해보세요!""",
                "is_published": True
            },
            {
                "title": "Docker를 활용한 효율적인 개발 환경 구축",
                "content": """# Docker를 활용한 효율적인 개발 환경 구축

Docker는 컨테이너 기술을 통해 일관된 개발 환경을 제공합니다.

## Docker의 장점

- **환경 일관성**: 개발, 테스트, 프로덕션 환경이 동일합니다.
- **빠른 배포**: 컨테이너 이미지를 통해 빠르게 배포할 수 있습니다.
- **리소스 효율성**: 가상머신보다 가볍고 빠릅니다.

## 기본 사용법

\`\`\`dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "start"]
\`\`\`

Docker로 더 나은 개발 경험을 만들어보세요!""",
                "is_published": True
            },
            {
                "title": "RESTful API 설계 베스트 프랙티스",
                "content": """# RESTful API 설계 베스트 프랙티스

좋은 API 설계는 개발자 경험과 시스템 성능에 큰 영향을 미칩니다.

## 주요 원칙

1. **명확한 리소스 네이밍**: 명사 사용, 동사 피하기
2. **적절한 HTTP 메서드 사용**: GET, POST, PUT, DELETE
3. **일관된 응답 형식**: JSON 표준화
4. **에러 처리**: 명확한 에러 메시지와 상태 코드

## 예시

\`\`\`
GET    /api/users          # 사용자 목록
GET    /api/users/1        # 특정 사용자
POST   /api/users          # 사용자 생성
PUT    /api/users/1        # 사용자 수정
DELETE /api/users/1        # 사용자 삭제
\`\`\`

이러한 원칙을 따르면 더 나은 API를 만들 수 있습니다.""",
                "is_published": True
            },
            {
                "title": "마이크로서비스 아키텍처 이해하기",
                "content": """# 마이크로서비스 아키텍처 이해하기

마이크로서비스는 대규모 애플리케이션을 작은 독립적인 서비스로 분해하는 아키텍처 패턴입니다.

## 장점

- **독립적 배포**: 각 서비스를 독립적으로 배포할 수 있습니다.
- **기술 다양성**: 서비스마다 다른 기술 스택 사용 가능
- **확장성**: 필요한 서비스만 확장 가능

## 고려사항

- 서비스 간 통신 복잡도 증가
- 데이터 일관성 관리
- 분산 시스템의 복잡성

마이크로서비스는 모든 프로젝트에 적합하지 않습니다. 프로젝트 규모와 요구사항을 고려하여 선택하세요.""",
                "is_published": True
            },
            {
                "title": "데이터베이스 최적화 전략",
                "content": """# 데이터베이스 최적화 전략

데이터베이스 성능은 애플리케이션의 전체 성능에 직접적인 영향을 미칩니다.

## 인덱싱

적절한 인덱스는 쿼리 성능을 크게 향상시킵니다.

- 자주 조회되는 컬럼에 인덱스 생성
- WHERE 절에서 자주 사용되는 컬럼
- JOIN에 사용되는 외래키

## 쿼리 최적화

- 불필요한 SELECT * 피하기
- 적절한 JOIN 사용
- 서브쿼리 최소화

## 모니터링

정기적인 쿼리 성능 분석과 모니터링이 중요합니다.""",
                "is_published": True
            },
            {
                "title": "CI/CD 파이프라인 구축하기",
                "content": """# CI/CD 파이프라인 구축하기

지속적인 통합과 배포는 현대적인 개발 워크플로우의 핵심입니다.

## CI/CD의 이점

- **자동화된 테스트**: 코드 변경 시 자동으로 테스트 실행
- **빠른 피드백**: 문제를 빠르게 발견하고 수정
- **자동 배포**: 수동 배포 과정 제거

## 기본 파이프라인

1. 코드 커밋
2. 자동 빌드
3. 테스트 실행
4. 배포

GitHub Actions, GitLab CI, Jenkins 등 다양한 도구를 활용할 수 있습니다.""",
                "is_published": True
            },
            {
                "title": "보안 코딩 가이드라인",
                "content": """# 보안 코딩 가이드라인

보안은 애플리케이션 개발에서 가장 중요한 고려사항 중 하나입니다.

## 주요 보안 원칙

1. **입력 검증**: 모든 사용자 입력 검증
2. **인증과 권한**: 적절한 인증 및 권한 관리
3. **암호화**: 민감한 데이터 암호화
4. **SQL Injection 방지**: 파라미터화된 쿼리 사용

## 일반적인 취약점

- XSS (Cross-Site Scripting)
- CSRF (Cross-Site Request Forgery)
- SQL Injection
- 인증 우회

보안은 처음부터 고려해야 합니다.""",
                "is_published": True
            },
            {
                "title": "프론트엔드 성능 최적화",
                "content": """# 프론트엔드 성능 최적화

사용자 경험을 향상시키기 위한 프론트엔드 최적화 기법들입니다.

## 이미지 최적화

- 적절한 이미지 포맷 선택 (WebP, AVIF)
- 이미지 압축
- Lazy loading 구현

## 코드 최적화

- 코드 분할 (Code Splitting)
- 번들 크기 최소화
- 불필요한 리렌더링 방지

## 캐싱 전략

- 브라우저 캐싱 활용
- CDN 사용
- 서비스 워커를 통한 오프라인 지원

성능 최적화는 지속적인 과정입니다.""",
                "is_published": True
            },
            {
                "title": "GraphQL vs REST API",
                "content": """# GraphQL vs REST API

두 가지 API 아키텍처 스타일의 비교입니다.

## REST API

**장점:**
- 간단하고 직관적
- 널리 사용되는 표준
- 캐싱 용이

**단점:**
- Over-fetching/Under-fetching 문제
- 여러 엔드포인트 필요

## GraphQL

**장점:**
- 필요한 데이터만 요청
- 단일 엔드포인트
- 강력한 타입 시스템

**단점:**
- 학습 곡선
- 복잡한 쿼리 최적화 필요

프로젝트 요구사항에 따라 적절한 방식을 선택하세요.""",
                "is_published": True
            },
            {
                "title": "테스트 주도 개발 (TDD)",
                "content": """# 테스트 주도 개발 (TDD)

TDD는 테스트를 먼저 작성하고 코드를 작성하는 개발 방법론입니다.

## TDD 사이클

1. **Red**: 실패하는 테스트 작성
2. **Green**: 테스트를 통과하는 최소한의 코드 작성
3. **Refactor**: 코드 리팩토링

## 장점

- 높은 코드 커버리지
- 더 나은 설계
- 리팩토링에 대한 자신감

## 도전과제

- 초기 개발 속도 저하
- 테스트 작성 시간 필요
- 팀 전체의 이해 필요

TDD는 모든 상황에 적합하지 않지만, 장기적으로 코드 품질을 향상시킵니다.""",
                "is_published": True
            },
            {
                "title": "클라우드 네이티브 애플리케이션",
                "content": """# 클라우드 네이티브 애플리케이션

클라우드 환경에 최적화된 애플리케이션 개발 방법입니다.

## 주요 특징

- **컨테이너화**: Docker, Kubernetes 활용
- **마이크로서비스**: 작은 독립적인 서비스
- **자동화**: CI/CD 파이프라인
- **확장성**: 수평 확장 가능

## 클라우드 서비스

- AWS, Azure, GCP 등 주요 클라우드 제공자
- 서버리스 아키텍처
- 관리형 서비스 활용

클라우드 네이티브 접근 방식은 현대적인 애플리케이션 개발의 표준이 되고 있습니다.""",
                "is_published": True
            },
            {
                "title": "웹 접근성 (A11y) 가이드",
                "content": """# 웹 접근성 (A11y) 가이드

모든 사용자가 웹사이트를 사용할 수 있도록 하는 것이 중요합니다.

## 주요 원칙

1. **인식 가능**: 모든 콘텐츠를 인식할 수 있어야 함
2. **조작 가능**: 모든 기능을 조작할 수 있어야 함
3. **이해 가능**: 정보와 UI 조작을 이해할 수 있어야 함
4. **견고함**: 보조 기술과 호환되어야 함

## 실천 방법

- 시맨틱 HTML 사용
- 키보드 네비게이션 지원
- 적절한 색상 대비
- 스크린 리더 지원

접근성은 선택이 아닌 필수입니다.""",
                "is_published": True
            },
            {
                "title": "모니터링과 로깅 전략",
                "content": """# 모니터링과 로깅 전략

시스템의 건강 상태를 파악하고 문제를 빠르게 해결하기 위한 전략입니다.

## 모니터링 지표

- **성능 지표**: 응답 시간, 처리량
- **에러율**: 실패한 요청 비율
- **리소스 사용량**: CPU, 메모리, 디스크

## 로깅 모범 사례

- 구조화된 로그 형식
- 적절한 로그 레벨
- 민감한 정보 제외
- 중앙화된 로그 관리

## 도구

- Prometheus, Grafana
- ELK Stack
- CloudWatch, Datadog

효과적인 모니터링은 시스템 안정성의 기반입니다.""",
                "is_published": True
            },
            {
                "title": "코드 리뷰 문화 만들기",
                "content": """# 코드 리뷰 문화 만들기

코드 리뷰는 코드 품질을 향상시키고 지식을 공유하는 중요한 과정입니다.

## 코드 리뷰의 가치

- 버그 조기 발견
- 코드 품질 향상
- 지식 공유
- 팀 협업 강화

## 효과적인 리뷰

- 구체적이고 건설적인 피드백
- 긍정적인 톤 유지
- 작은 PR 선호
- 자동화된 검사 활용

## 리뷰 체크리스트

- 기능이 요구사항을 만족하는가?
- 테스트가 충분한가?
- 코드가 읽기 쉬운가?
- 성능 문제는 없는가?

코드 리뷰는 학습과 성장의 기회입니다.""",
                "is_published": False
            },
            {
                "title": "애자일 개발 방법론",
                "content": """# 애자일 개발 방법론

변화에 빠르게 대응하고 고객 가치를 우선시하는 개발 방법론입니다.

## 애자일 원칙

- 개인과 상호작용을 프로세스와 도구보다 중시
- 작동하는 소프트웨어를 포괄적인 문서보다 중시
- 고객과의 협력을 계약 협상보다 중시
- 계획을 따르기보다 변화에 대응

## 스크럼 프레임워크

- 스프린트: 1-4주 단위의 반복
- 데일리 스탠드업
- 스프린트 리뷰
- 회고

## 장점

- 빠른 피드백
- 변화에 유연한 대응
- 팀 협업 강화

애자일은 마음가짐과 문화입니다.""",
                "is_published": True
            }
        ]
        
        created_count = 0
        base_date = datetime.utcnow()
        
        for i, post_data in enumerate(sample_posts[:posts_to_create]):
            # slug 생성
            slug = slugify(post_data["title"])
            
            # 기존 slug와 중복 확인
            existing_post = db.query(Post).filter(Post.slug == slug).first()
            if existing_post:
                slug = f"{slug}-{i+1}"
            
            # 생성 날짜를 다양하게 설정 (최근 30일 내)
            days_ago = random.randint(0, 30)
            created_at = base_date - timedelta(days=days_ago)
            
            # Published 포스트는 published_at도 설정
            published_at = None
            if post_data.get("is_published"):
                published_at = created_at + timedelta(hours=random.randint(1, 24))
            
            # 랜덤 카테고리 선택
            category = random.choice(categories)
            
            new_post = Post(
                title=post_data["title"],
                content=post_data["content"],
                slug=slug,
                author_id=editor.id,
                category_id=category.id,
                is_published=post_data.get("is_published", False),
                published_at=published_at,
                created_at=created_at
            )
            
            db.add(new_post)
            db.commit()
            db.refresh(new_post)
            
            # 랜덤 태그 연결 (2-5개)
            num_tags = random.randint(2, min(5, len(tags)))
            selected_tags = random.sample(tags, num_tags)
            for tag in selected_tags:
                post_tag = PostTag(post_id=new_post.id, tag_id=tag.id)
                db.add(post_tag)
            
            db.commit()
            created_count += 1
            tag_names = [t.name for t in selected_tags]
            print(f"✓ '{post_data['title']}' 포스트 생성 완료 (카테고리: {category.name}, 태그: {', '.join(tag_names)})")
        
        db.commit()
        print(f"\n✅ 총 {created_count}개의 테스트 포스트가 생성되었습니다!")
        
    except Exception as e:
        db.rollback()
        print(f"❌ 오류 발생: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
    finally:
        db.close()


if __name__ == "__main__":
    create_test_posts()

