# 📦 Database 디렉토리 재구성 마이그레이션 가이드

## 🎯 변경 사항 개요

데이터베이스 관련 파일들을 체계적으로 관리하기 위해 `backend/database/` 디렉토리로 재구성하였습니다.

## 📂 변경된 파일 구조

### Before (이전)
```
backend/
├── database.py               # DB 연결
├── models.py                 # DB 모델
├── schemas.py                # API 스키마
├── create_test_users.py      # 테스트 유저 생성
├── migrate_add_is_admin.py   # 마이그레이션
├── main.py
├── auth.py
└── routers/
```

### After (변경 후)
```
backend/
├── database/                 # 📁 새 패키지
│   ├── __init__.py          # DB 연결 및 세션 관리
│   ├── models.py            # DB 모델
│   ├── schemas.py           # API 스키마
│   └── scripts/             # 📁 DB 스크립트
│       ├── __init__.py
│       ├── init_db.py       # 🆕 DB 초기화
│       ├── create_test_users.py
│       ├── migrate_add_is_admin.py
│       └── README.md        # 🆕 스크립트 가이드
├── main.py
├── auth.py
└── routers/
```

## 🔄 Import 경로 변경

### 1. 모델 Import
```python
# Before
from models import User, Profile

# After
from database.models import User, Profile
```

### 2. 스키마 Import
```python
# Before
from schemas import UserCreate, UserResponse

# After
from database.schemas import UserCreate, UserResponse
```

### 3. 데이터베이스 세션
```python
# Before
from database import get_db, init_db

# After
from database import get_db, init_db  # 동일 (database 패키지의 __init__.py)
```

## 📝 영향받는 파일들

다음 파일들의 import가 자동으로 업데이트되었습니다:

- ✅ `backend/auth.py`
- ✅ `backend/routers/auth.py`
- ✅ `backend/routers/profile.py`
- ✅ `backend/routers/users.py`
- ✅ `backend/main.py` (변경 없음, 이미 올바른 import 사용)

## 🚀 데이터베이스 스크립트 실행 방법

### Before (이전 방법)
```bash
cd backend
python create_test_users.py
python migrate_add_is_admin.py
```

### After (새로운 방법)
```bash
cd backend

# 방법 1: 모듈로 실행 (권장)
python -m database.scripts.init_db
python -m database.scripts.create_test_users
python -m database.scripts.migrate_add_is_admin

# 방법 2: 직접 실행
python database/scripts/init_db.py
python database/scripts/create_test_users.py
python database/scripts/migrate_add_is_admin.py
```

## 🆕 새로운 기능

### 1. init_db.py 스크립트
데이터베이스를 처음 설정할 때 사용하는 전용 스크립트가 추가되었습니다.

```bash
cd backend
python -m database.scripts.init_db
```

### 2. Scripts README
모든 데이터베이스 스크립트에 대한 상세한 설명이 포함된 README가 추가되었습니다.
- 위치: `backend/database/scripts/README.md`

### 3. 개선된 문서화
- 각 스크립트에 실행 방법이 명시됨
- 더 나은 오류 메시지 및 성공 메시지
- 작업 진행 상황 표시 (✓, ⚠️, ❌ 이모지 사용)

## 📋 체크리스트

기존 프로젝트를 업데이트하는 경우:

- [x] ✅ 모든 파일이 `backend/database/` 디렉토리로 이동됨
- [x] ✅ Import 경로가 자동으로 업데이트됨
- [x] ✅ 기존 파일 삭제됨
- [x] ✅ 린터 오류 없음
- [ ] 📝 로컬에서 서버 실행 테스트 필요
- [ ] 📝 Docker 환경에서 테스트 필요

## 🧪 테스트 방법

### 1. 로컬 환경 테스트
```bash
cd backend

# 1. 데이터베이스 초기화
python -m database.scripts.init_db

# 2. 테스트 사용자 생성
python -m database.scripts.create_test_users

# 3. 서버 실행
uvicorn main:app --reload

# 4. API 문서 확인
# http://localhost:8000/docs 접속
```

### 2. Docker 환경 테스트
```bash
# 프로젝트 루트에서
docker-compose down -v  # 기존 컨테이너 및 볼륨 삭제
docker-compose up --build

# 테스트 사용자는 자동으로 생성되지 않으므로 수동 생성:
docker-compose exec backend python -m database.scripts.create_test_users
```

## ❓ FAQ

### Q: 기존 데이터베이스는 어떻게 되나요?
A: 데이터베이스 내용은 영향받지 않습니다. 코드 구조만 변경되었습니다.

### Q: Docker Compose는 자동으로 작동하나요?
A: 네, `main.py`의 `init_db()` 호출로 테이블이 자동 생성됩니다. 테스트 사용자만 수동 생성이 필요합니다.

### Q: 이전 스크립트 경로로 실행하면?
A: 기존 파일들이 삭제되었으므로 새로운 경로를 사용해야 합니다.

### Q: 커스텀 마이그레이션을 추가하려면?
A: `backend/database/scripts/` 디렉토리에 새 스크립트를 추가하고, `database/scripts/README.md`의 템플릿을 참고하세요.

## 🎉 장점

1. **체계적인 구조**: 데이터베이스 관련 파일이 한 곳에 모임
2. **명확한 책임 분리**: 모델, 스키마, 스크립트가 논리적으로 구성됨
3. **쉬운 유지보수**: 새로운 마이그레이션이나 스크립트를 쉽게 추가 가능
4. **더 나은 문서화**: 각 디렉토리와 스크립트에 README 제공
5. **표준 패키지 구조**: Python 모듈 시스템을 활용한 명확한 import

## 📞 문제 발생 시

문제가 발생하면 다음을 확인하세요:

1. Python 경로 확인
   ```bash
   cd backend
   python -c "import database; print(database.__file__)"
   ```

2. 린터 오류 확인
   ```bash
   # 프로젝트에서 사용하는 린터 실행
   ```

3. 데이터베이스 연결 확인
   ```bash
   python -c "from database import engine; print(engine.url)"
   ```

---

**마이그레이션 완료일**: 2025-11-11
**영향받는 버전**: v1.0.0+

