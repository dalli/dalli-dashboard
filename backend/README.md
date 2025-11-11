# Backend API

FastAPI 기반 백엔드 서버입니다.

## 프로젝트 구조

```
backend/
├── database/              # 데이터베이스 패키지
│   ├── __init__.py       # DB 연결 및 세션 관리
│   ├── models.py         # SQLAlchemy 모델
│   ├── schemas.py        # Pydantic 스키마
│   └── scripts/          # DB 초기화 및 마이그레이션 스크립트
│       ├── init_db.py
│       ├── create_test_users.py
│       └── migrate_add_is_admin.py
├── routers/              # API 라우터
│   ├── auth.py           # 인증 관련 API
│   ├── profile.py        # 프로필 API
│   └── users.py          # 사용자 관리 API
├── main.py               # FastAPI 애플리케이션
├── auth.py               # JWT 인증 로직
└── requirements.txt      # Python 패키지 의존성
```

## 설치

```bash
pip install -r requirements.txt
```

## 데이터베이스 설정

### 1. 데이터베이스 초기화

```bash
# 모든 테이블 생성
python -m database.scripts.init_db
```

### 2. 테스트 사용자 생성

```bash
# 테스트 계정 생성 (admin@example.com, test@example.com)
python -m database.scripts.create_test_users
```

### 3. 마이그레이션 (필요시)

```bash
# 기존 DB에 새 컬럼/테이블 추가
python -m database.scripts.migrate_add_is_admin
```

자세한 내용은 [database/scripts/README.md](database/scripts/README.md)를 참고하세요.

## 실행

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

서버는 `http://localhost:8000`에서 실행됩니다.

API 문서는 `http://localhost:8000/docs`에서 확인할 수 있습니다.

## API 엔드포인트

### 인증 API (`/api/auth`)
- `POST /api/auth/signup` - 회원가입
- `POST /api/auth/login` - 로그인
- `GET /api/auth/me` - 현재 사용자 정보
- `POST /api/auth/setup-2fa` - 2단계 인증 설정
- `POST /api/auth/enable-2fa` - 2단계 인증 활성화
- `POST /api/auth/verify-2fa` - 2단계 인증 검증
- `POST /api/auth/reset-password-request` - 비밀번호 재설정 요청
- `POST /api/auth/reset-password` - 비밀번호 재설정

### 사용자 API (`/api/users`) - 관리자 전용
- `GET /api/users` - 사용자 목록
- `GET /api/users/{user_id}` - 사용자 상세
- `POST /api/users` - 사용자 생성
- `PUT /api/users/{user_id}` - 사용자 수정
- `DELETE /api/users/{user_id}` - 사용자 삭제
- `POST /api/users/{user_id}/toggle-active` - 활성화 토글
- `POST /api/users/{user_id}/toggle-admin` - 관리자 권한 토글

### 프로필 API (`/api/profile`)
- `GET /api/profile/me` - 내 프로필 조회
- `GET /api/profile/{user_id}` - 사용자 프로필 조회
- `PUT /api/profile/me` - 내 프로필 수정
- `PUT /api/profile/{user_id}` - 사용자 프로필 수정 (본인 또는 관리자)

