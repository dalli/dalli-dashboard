from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from typing import List

from database import init_db
from routers import auth, profile

app = FastAPI(title="Dashboard API", version="1.0.0")

# CORS 설정
allowed_origins: List[str] = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:3000,http://localhost:3001,http://localhost:80"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 라우터 등록
app.include_router(auth.router)
app.include_router(profile.router)

# 데이터베이스 초기화
@app.on_event("startup")
async def startup_event():
    init_db()


@app.get("/")
async def root():
    return {"message": "Welcome to Dashboard API"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


@app.get("/api/status")
async def get_status():
    return {"status": "ok", "version": "1.0.0"}

