# Dashboard Project

프론트엔드와 백엔드가 분리된 대시보드 프로젝트입니다.

## 프로젝트 구조

```
dashboard/
├── frontend/     # React 프론트엔드
├── backend/      # FastAPI 백엔드
└── docker-compose.yaml  # Docker Compose 설정
```

## 🐳 Docker로 전체 실행 (권장)

Docker Compose를 사용하여 프론트엔드, 백엔드, PostgreSQL을 한 번에 실행할 수 있습니다.

### 사전 요구사항

- Docker
- Docker Compose

### 실행 방법

```bash
# 전체 서비스 빌드 및 실행
docker-compose up --build

# 백그라운드 실행
docker-compose up -d --build

# 서비스 중지
docker-compose down

# 볼륨까지 삭제 (데이터베이스 데이터 포함)
docker-compose down -v
```

### 접속 정보

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API 문서**: http://localhost:8000/docs
- **PostgreSQL**: localhost:5432

### 환경 변수 설정

`.env` 파일을 생성하여 환경 변수를 설정할 수 있습니다:

```env
POSTGRES_USER=dashboard_user
POSTGRES_PASSWORD=dashboard_password
POSTGRES_DB=dashboard_db
CORS_ORIGINS=http://localhost:3000,http://localhost:80
```

## 로컬 개발 환경

### Frontend

React 기반 프론트엔드 애플리케이션입니다.

```bash
cd frontend
npm install
npm start
```

프론트엔드는 `http://localhost:3000`에서 실행됩니다.

### Backend

FastAPI 기반 백엔드 API 서버입니다.

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

백엔드는 `http://localhost:8000`에서 실행됩니다.

API 문서는 `http://localhost:8000/docs`에서 확인할 수 있습니다.

### PostgreSQL

로컬에서 PostgreSQL을 실행하려면:

```bash
# Docker로 PostgreSQL 실행
docker run --name dashboard-postgres \
  -e POSTGRES_USER=dashboard_user \
  -e POSTGRES_PASSWORD=dashboard_password \
  -e POSTGRES_DB=dashboard_db \
  -p 5432:5432 \
  -d postgres:16-alpine
```
