# Database Scripts

데이터베이스 초기화, 마이그레이션, 테스트 데이터 생성 스크립트 모음입니다.

## 📁 스크립트 목록

### 1. init_db.py
데이터베이스를 초기화하고 모든 테이블을 생성합니다.

```bash
# backend 디렉토리에서 실행
cd backend
python -m database.scripts.init_db

# 또는 직접 실행
python database/scripts/init_db.py
```

### 2. create_test_users.py
테스트용 사용자 계정을 생성합니다.

```bash
# backend 디렉토리에서 실행
cd backend
python -m database.scripts.create_test_users

# 또는 직접 실행
python database/scripts/create_test_users.py
```

**생성되는 사용자:**
- **admin@example.com** / admin123 (관리자 권한)
- **test@example.com** / test123 (일반 사용자)

### 3. migrate_add_is_admin.py
기존 데이터베이스에 관리자 권한 필드와 프로필 테이블을 추가합니다.

```bash
# backend 디렉토리에서 실행
cd backend
python -m database.scripts.migrate_add_is_admin

# 또는 직접 실행
python database/scripts/migrate_add_is_admin.py
```

**수행 작업:**
- `users` 테이블에 `is_admin` 컬럼 추가
- `profiles` 테이블 생성

## 🚀 권장 실행 순서

### 새 프로젝트 시작 시

```bash
cd backend

# 1. 데이터베이스 초기화
python -m database.scripts.init_db

# 2. 테스트 사용자 생성
python -m database.scripts.create_test_users
```

### 기존 데이터베이스 마이그레이션

```bash
cd backend

# 마이그레이션 실행
python -m database.scripts.migrate_add_is_admin
```

## 📝 새 스크립트 추가하기

새로운 데이터베이스 스크립트를 추가할 때는 다음 템플릿을 사용하세요:

```python
#!/usr/bin/env python3
"""
스크립트 설명

실행 방법:
    python -m database.scripts.your_script
    또는
    cd backend && python database/scripts/your_script.py
"""
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from database import SessionLocal, init_db
from database.models import User, Profile


def main():
    """메인 함수"""
    db = SessionLocal()
    
    try:
        # 여기에 로직 구현
        db.commit()
        print("✅ 작업이 완료되었습니다!")
        
    except Exception as e:
        db.rollback()
        print(f"❌ 오류 발생: {e}")
        sys.exit(1)
    finally:
        db.close()


if __name__ == "__main__":
    main()
```

## ⚠️ 주의사항

1. **프로덕션 환경에서는 반드시 백업을 먼저 수행하세요**
2. 마이그레이션 스크립트는 한 번만 실행하세요
3. 스크립트는 반드시 backend 디렉토리에서 실행하세요
4. DATABASE_URL 환경 변수가 올바르게 설정되어 있는지 확인하세요

## 🔗 환경 변수

스크립트 실행 시 필요한 환경 변수:

```bash
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=dashboard_user
POSTGRES_PASSWORD=dashboard_password
POSTGRES_DB=dashboard_db

# 또는 통합 URL 사용
DATABASE_URL=postgresql://dashboard_user:dashboard_password@localhost:5432/dashboard_db
```

