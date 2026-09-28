# 🐝 HoneyRest – 사용자 예약 프론트엔드

**박성원 (Seongwon Park)** – 사용자(User) 영역 총괄

> 감성 숙소 예약 플랫폼 HoneyRest의 사용자(User) 영역 프론트엔드입니다.  
> 숙소 검색부터 예약, 결제, 마이페이지까지 사용자 중심의 전체 흐름을 React로 구현했습니다.

---

## ⚙️ 기술 스택

| 구분 | 기술 / 라이브러리 | 버전 | 역할 |
|------|------------------|------|------|
| **런타임** | Node.js | ≥ 20.19.0 | 빌드 환경 |
| **프레임워크** | React | 19 | SPA 컴포넌트 기반 개발 |
| **빌드 도구** | Vite | 7 | HMR, 빠른 빌드, 환경변수 관리 |
| **스타일링** | Tailwind CSS | 4 | 유틸리티 기반 CSS, 커스텀 테마 |
| **라우팅** | React Router DOM | 7 | SPA 라우팅, PrivateRoute / PublicRoute |
| **HTTP 통신** | Axios | 1.16 | JWT 자동 주입, 토큰 재발급 인터셉터 |
| **애니메이션** | Framer Motion | 12 | 모달, 페이지 전환, 인트로 애니메이션 |
| **스크롤 효과** | AOS | 2 | 스크롤 기반 fade/slide 등장 효과 |
| **알림** | React Toastify | 11 | 상태 메시지 토스트 |
| **다이얼로그** | SweetAlert2 | 11 | 확인/취소 모달 처리 |
| **지도** | @vis.gl/react-google-maps | 1.8 | 숙소 위치 마커, 지도 검색 |
| **결제** | Toss Payments SDK | 2.7 | 카드·간편결제·가상계좌 PG 연동 |
| **아이콘** | React Icons | 5 | FA, HI, RI, MD, FI, BS 계열 아이콘 |
| **날짜** | date-fns + dayjs | 4 / 1.11 | 날짜 계산 및 포맷 |
| **캘린더** | react-date-range | 2 | 체크인/아웃 날짜 범위 선택 |
| **슬라이더** | react-slick | 0.31 | 이미지 / 컨텐츠 슬라이더 |
| **날씨** | weather-icons | 1.3 | 날씨 아이콘 표시 |

---

## 🚀 로컬 개발 시작하기

### 1. 사전 요구사항

```bash
node --version   # 20.19.0 이상 필요
```

> nvm 사용 시: `nvm use 20`

### 2. 패키지 설치

```bash
npm install
```

### 3. 환경변수 설정

`.env.example`을 복사해 `.env` 파일을 만들고 값을 채워주세요.

```bash
cp .env.example .env
```

```env
# 백엔드 URL (예: http://localhost:8080)
VITE_BACKEND_URL=

# 관리자 페이지 URL (예: http://localhost:8082, 미설정 시 헤더의 관리자 버튼 숨김)
VITE_ADMIN_URL=

# OAuth 콜백/로그아웃 리다이렉트 기준 URL (예: http://localhost:5173)
# 미설정 시 window.location.origin 사용. 뒤에 /login/kakao/callback 등의 경로가 붙음
VITE_OAUTH_REDIRECT_URI=

# 소셜 로그인
VITE_KAKAO_CLIENT_ID=
VITE_GOOGLE_CLIENT_ID=

# Google Maps
VITE_APP_GOOGLE_MAPS_KEY=
VITE_GOOGLE_MAP_ID=

# Toss Payments
VITE_TOSS_WIDGET_CLIENT_KEY=

# 공휴일 API
VITE_HOLIDAY_API_KEY=
```

### 4. 개발 서버 실행

```bash
npm run dev       # 개발 서버 (http://localhost:5173)
npm run build     # 프로덕션 빌드
npm run preview   # 빌드 결과 미리보기
npm run lint      # ESLint 검사
```

---

## 📁 프로젝트 구조

```
src/
├── api/
│   ├── axios.js            # Axios 인스턴스 + JWT 인터셉터 + 에러 핸들러
│   └── useApiRequest.js    # 공통 API 요청 훅 (로딩/재시도/취소 처리)
│
├── components/             # 공통 컴포넌트
│   ├── Header.jsx
│   ├── Footer.jsx
│   ├── Layout.jsx
│   ├── Modal.jsx
│   ├── IntroModal.jsx
│   ├── InquiryModal.jsx
│   ├── PasswordVerifyModal.jsx
│   ├── WishToggleButton.jsx
│   └── SafeImage.jsx       # 이미지 로딩 실패 시 대체 이미지 표시
│
├── hooks/
│   └── useAuth.js          # 인증 상태 관리 (로그인/로그아웃/서버 동기화)
│
├── routes/
│   ├── PrivateRoute.jsx    # 로그인 필수 라우트 가드
│   └── PublicRoute.jsx     # 비로그인 전용 라우트 가드
│
├── pages/
│   ├── Home/               # 메인 홈 화면
│   │   ├── BannerSection   # 히어로 배너 + 검색창
│   │   ├── searchBox/      # 날짜·지역·인원 검색 컴포넌트
│   │   ├── HotPlacesSection
│   │   ├── HotSpots/
│   │   ├── PlaceList/      # 추천 숙소 리스트
│   │   ├── DomesticSpotsList/
│   │   ├── Event/          # 이벤트 슬라이더
│   │   └── Weather/        # 날씨 위젯
│   │
│   ├── Accommodations/     # 숙소 목록 / 상세
│   │   ├── Accommodation/  # 숙소 상세 (사진, 방 목록, 지도, 리뷰)
│   │   │   └── Room/       # 방 상세
│   │   └── Map/            # 지도 검색
│   │
│   ├── Reservation/        # 예약 흐름
│   │   └── guest/          # 비회원 예약
│   │
│   ├── Payment/            # 결제
│   │   ├── PaymentProcess  # Toss Payments 위젯 렌더링
│   │   ├── PaymentSuccess
│   │   └── PaymentFail
│   │
│   ├── Login/              # 로그인 / 비밀번호 재설정
│   │   ├── google/         # Google OAuth 콜백
│   │   └── kakao/          # Kakao 로그인 콜백
│   │
│   ├── SignUp/             # 회원가입 + 이메일 인증
│   │
│   ├── Review/             # 리뷰 작성
│   │
│   ├── myPage/             # 마이페이지
│   │   ├── Profile         # 프로필 수정
│   │   ├── ReservationList / ReservationDetail
│   │   ├── ReviewList
│   │   ├── MyWishList
│   │   ├── Inquiry/        # 1:1 문의
│   │   ├── Coupon/         # 쿠폰 목록
│   │   └── Point/          # 포인트 내역
│   │
│   └── Error/              # 에러 페이지 (400/401/403/404/408/422/429/500/503)
│
├── App.jsx                 # BrowserRouter + 전역 인증 가드 (GlobalGuard)
├── AppWrapper.jsx          # Route 정의 전체
└── main.jsx                # React 진입점
```

---

## 🔐 인증 구조

```
로그인 성공
  └── accessToken → localStorage or sessionStorage
  └── userInfo    → localStorage or sessionStorage

요청 시
  └── axios 인터셉터가 Authorization: Bearer {token} 자동 주입

401 응답 시
  └── /api/auth/refresh 로 토큰 재발급 시도
      └── 성공 → 원래 요청 재시도
      └── 실패 → 로그아웃 후 /login 이동

토큰 만료 시
  └── JWT exp 파싱 → setTimeout으로 자동 로그아웃

라우트 보호
  ├── PrivateRoute → 미로그인 시 /error/401 리디렉트
  └── PublicRoute  → 로그인 상태에서 접근 시 /error/403 리디렉트
```

---

## 💳 결제 흐름

```
예약 폼 작성
  └── /reserve → Reservation.jsx

결제 요청
  └── /payment/process → PaymentProcess.jsx
      └── Toss Payments SDK 위젯 렌더링

결제 완료
  ├── 성공 → /payment/success → PaymentSuccess.jsx
  └── 실패 → /payment/fail   → PaymentFail.jsx
```

---

## 🖥️ 주요 화면

| 화면 | 경로 | 설명 |
|------|------|------|
| 메인 홈 | `/` | 배너, 검색창, 추천 숙소, 이벤트, 날씨 |
| 숙소 목록 | `/accommodations` | 지역/날짜/인원 필터, 지도 검색 |
| 숙소 상세 | `/accommodations/:id` | 사진, 방 목록, 리뷰, 구글 지도 |
| 방 상세 | `/room/:roomId` | 방 정보, 예약 버튼 |
| 예약 | `/reserve` | 예약 폼 |
| 결제 | `/payment/process` | Toss Payments 위젯 |
| 마이페이지 | `/user/mypage` | 예약/리뷰/쿠폰/포인트/문의 |
| 로그인 | `/login` | 일반 + Google + Kakao |
| 회원가입 | `/signup` | 이메일 인증 포함 |

---

## 📸 최신 화면

### 메인 홈

![HoneyRest 메인 홈](docs/screenshots/home-hero.png)

[메인 홈 전체 화면 보기](docs/screenshots/home-full.png)

### 숙소 검색

가격 캘린더가 적용된 전체 숙소 검색과 이미지 로드 실패 시 로컬 대체 이미지가 표시됩니다.

![HoneyRest 숙소 검색](docs/screenshots/accommodation-list.png)

### 숙소 상세 · 객실 선택

![HoneyRest 숙소 상세 객실 선택](docs/screenshots/accommodation-detail.png)

### 고객 리뷰

![HoneyRest 고객 리뷰](docs/screenshots/accommodation-reviews.png)

### 로그인 · 회원가입

| 로그인 | 회원가입 |
|---|---|
| ![HoneyRest 로그인](docs/screenshots/login.png) | ![HoneyRest 회원가입](docs/screenshots/signup.png) |

### 마이페이지

![HoneyRest 마이페이지](docs/screenshots/mypage.png)

---

## 🎬 시연 영상 / 발표 자료

📺 [User 시연 영상 보러가기](#)  
📄 [HoneyRest 발표 자료 (PDF)](https://github.com/user-attachments/files/22292418/HoneyRest.pdf)

---

## 🔗 관련 저장소

📦 [User API 백엔드 (Spring Boot)](https://github.com/Seongwonp/honeyRest_user)

---

## 🙋‍♂️ 개발자

**박성원 (Seongwon Park)** – 사용자(User) 영역 총괄

- User API 백엔드 및 프론트엔드 전체 설계·개발
- DB 설계 및 ERD 작성
- API 명세서 작성 및 문서화
- 광고 영상 및 일러스트 제작
- 프로젝트 발표 PPT 기획·디자인 총괄
