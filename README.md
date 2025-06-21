# 🐾댕궁지도 - "작은 발걸음도 함께하는 행궁"

(2025 경희대학교 로커톤 - Frontend)

![메인화면](/public/댕궁지도.png)

* Backend GitHub: https://github.com/scbae18/KHUlocation2025_BE
* Frontend GitHub: https://github.com/k3vin7/KHUlocathon2025

---

## 👀 Overview

**댕궁지도**는 반려동물과 함께 행궁동을 탐방하기 위한 **반려동물 친화 웹 지도 플랫폼**입니다.  
행궁동의 다양한 장소에 대해 **반려동물 동반 가능 여부, 영업 정보, 산책로**,
그리고 사용자들이 직접 남긴 \*\*사진 기반 리뷰(아카이빙)\*\*를 통해 정보를 제공합니다.  
작은 발걸음도 함께하는 사회를 위한, 지역 기반 반려동물 리브랜딩 프로젝트입니다.

---

## 🔧 주요 기능

1. **장소 필터링 및 정보 확인**

   * 반려동물 동반 조건, 영업시간, SNS 링크 등 필터 적용 가능
2. **산책 코스 정보**

   * 산책로 필터 기능으로 추천 산책 코스 및 주의사항 안내
3. **아카이빙(사진 리뷰)**

   * 직접 찍은 사진을 업로드하여 후기를 공유하고, 스탬프와 칭호 획득
4. **스탬프 시스템**

   * 장소 방문 기록을 통해 스탬프를 쌓고, 칭호를 획득하는 게이미피케이션 요소

---

## ⚙️ 기술 스택

![기술스택](/public/기술스택.png)

### 프론트엔드 (Frontend)

* React.js + Vite – SPA 기반 PWA 구현
* TailwindCSS – 반응형 디자인 적용
* 네이버 지도 API – 위치 기반 장소 데이터 시각화

### 백엔드 (Backend)

* Node.js + Express.js – RESTful API 서버
* MongoDB + Mongoose – 장소, 사용자, 리뷰 등 데이터 관리
* JWT – 인증 및 보안 처리

### 배포 및 협업

* Git / GitHub – 협업 및 버전 관리
* AWS EC2 + Nginx – 서버 배포 및 운영
* PM2 – Node 앱 프로세스 관리
* Vercel – 프론트엔드 자동 배포

---

## 📌 API 명세

### ✨ Auth - 인증/사용자

| Method | Endpoint         | Description    |
| ------ | ---------------- | -------------- |
| POST   | `/auth/register` | 회원가입           |
| POST   | `/auth/login`    | 로그인            |
| GET    | `/auth/me`       | 현재 로그인된 사용자 조회 |
| GET    | `/auth/get/{id}` | 특정 사용자 정보 조회   |

---

### 🗺️ Places - 장소 정보

| Method | Endpoint             | Description |
| ------ | -------------------- | ----------- |
| GET    | `/places`            | 전체 장소 목록 조회 |
| GET    | `/places/walkcourse` | 산책코스 정보 조회  |
| GET    | `/places/{id}`       | 특정 장소 상세 조회 |

---

### 📸 Archives - 아카이빙(사진 리뷰)

| Method | Endpoint                    | Description            |
| ------ | --------------------------- | ---------------------- |
| POST   | `/archives`                 | 장소 URL 기반 아카이빙 업로드 (구) |
| POST   | `/archives/upload`          | 사진 파일 기반 아카이빙 업로드      |
| GET    | `/archives/mine`            | 내가 업로드한 리뷰 조회          |
| GET    | `/archives/all`             | 전체 리뷰 조회               |
| DELETE | `/archives/{id}`            | 내가 올린 리뷰 삭제            |
| GET    | `/archives/place/{placeId}` | 특정 장소의 리뷰 목록           |

---

### 🧭 Stamps - 스탬프 및 칭호

| Method | Endpoint            | Description     |
| ------ | ------------------- | --------------- |
| POST   | `/stamps/{placeId}` | 장소 스탬프 찍기       |
| GET    | `/stamps`           | 내가 찍은 장소 목록 조회  |
| GET    | `/stamps/status`    | 내 칭호 및 스탬프 수 조회 |

---

## 👨‍👩‍👧‍👦 팀원

**Backend**: 배승찬, 박태권  
**Frontend**: 정민재, 배승찬, 박태권

---
