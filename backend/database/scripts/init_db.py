#!/usr/bin/env python3
"""
데이터베이스 초기화 스크립트
모든 테이블을 생성하고 초기 데이터를 설정합니다.

실행 방법:
    python -m database.scripts.init_db
    또는
    cd backend && python database/scripts/init_db.py
"""
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from database import init_db


def main():
    """데이터베이스 초기화 메인 함수"""
    try:
        print("🔄 데이터베이스 초기화 시작...\n")
        init_db()
        print("✅ 데이터베이스 초기화가 완료되었습니다!")
        print("\n생성된 테이블:")
        print("  - users (사용자)")
        print("  - profiles (프로필)")
        print("\n다음 단계:")
        print("  1. 테스트 사용자 생성: python -m database.scripts.create_test_users")
        print("  2. 또는 회원가입을 통해 사용자 등록")
    except Exception as e:
        print(f"❌ 오류 발생: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()

