# 🐝 HoneyRest – 사용자 예약 프론트엔드
**박성원 (Seongwon Park)** – 사용자(User) 영역 총괄


> 감성 숙소 예약 플랫폼 HoneyRest의 사용자(User) 영역 프론트엔드입니다.  
> 숙소 검색부터 예약, 마이페이지까지 사용자 중심의 흐름을 React로 구현했습니다.

---

## ⚙️ 기술 스택 요약

| 구분           | 기술 / 라이브러리                              | 역할 / 설명                   | 사용처 / 특징 |
|----------------|--------------------------------------------------|-------------------------------|----------------|
| **프레임워크** | React 18 + Vite                                  | SPA 개발                      | JSX, 컴포넌트 기반 구조, 빠른 빌드(HMR) |
| **스타일링**   | Tailwind CSS                                     | 유틸리티 기반 CSS             | 반응형, 모듈화, 모션 지원 |
| **애니메이션** | Framer Motion                                     | UI 모션 / 트랜지션            | 모달, 버튼, 페이지 전환, 인트로 애니메이션 |
| **스크롤 효과**| AOS (Animate On Scroll)                          | 스크롤 애니메이션             | fade, slide 등 다양한 효과 |
| **알림 / UI**  | SweetAlert2, React Toastify                      | 모달 / 토스트 알림            | Swal: 예외 처리 / Toast: 짧은 상태 메시지 |
| **지도**       | Google Maps JavaScript API                       | 지도 렌더링                   | 숙소 리스트, 상세정보, 방 위치 표시 / 마커 활용 / 반응형 지원 |
| **결제**       | Toss Payments Widget                             | PG 결제 연동                  | 카드, 가상계좌, 간편 결제 지원 |
| **소셜 로그인**| Kakao JS SDK, Google OAuth JS                    | 소셜 로그인 연동              | Client ID, Redirect URI 사용 |
| **HTTP 통신**  | Axios + Custom Hook                              | REST API 호출                 | JWT 자동 주입, 인터셉터, 토큰 만료 처리 |
| **환경변수**   | Vite 환경변수                                    | API URL, 키 관리              | `.env` 파일 활용, 외부 API 키 및 로그인 키 관리 |

---

## 🖥️ 주요 화면 캡처

> 사용자 중심의 직관적인 UI와 예약 흐름을 제공합니다.

### 🏠 메인 페이지
- 숙소 검색, 지역 필터, 추천 태그 등 핵심 기능이 배치된 메인 화면  
- 반응형 디자인으로 모바일에서도 최적화된 UI 제공

### 📍 지도 기능
- Google Maps API를 활용해 숙소 위치를 시각적으로 표시  
- 상세정보 페이지에 마커 및 위치 안내 적용

### 📅 예약 흐름
- Toss Payments 연동으로 간편 결제  
- 예약 후 이메일 알림 및 마이페이지에서 확인 가능

### 🧑‍💼 마이페이지
- 예약 내역, 리뷰 작성, 프로필 수정, 쿠폰 확인 등  
- 사용자 경험을 고려한 기능 배치와 인터페이스 구성

---

## 🎬 사용자 시연 영상

> 실제 사용자 흐름을 담은 시연 영상입니다.

📺 [User 시연 영상 보러가기](#)

---

## 📝 프로젝트 발표 자료

> HoneyRest의 전체 기획, 기능 흐름, 기술 스택, 시연 화면 등을 담은 발표용 PPT입니다.  
> 자세한 내용은 아래 PDF를 참고해주세요.

📄 [HoneyRest 발표 자료 (PDF)](https://github.com/user-attachments/files/22292418/HoneyRest.pdf)

---

## 🔗 사용자 API 백엔드 바로가기

> HoneyRest의 사용자(User) 영역 API 서버는 Spring Boot 기반으로 구성되어 있으며,  
> 프론트엔드와 연동되는 모든 기능을 RESTful API로 제공합니다.

📦 [User API GitHub 저장소 바로가기](https://github.com/Seongwonp/honeyRest_user)

---

### 📌 주요 기능 요약

- 사용자 회원가입 / 로그인 / 소셜 로그인 (Google, Kakao)  
- 숙소 검색 / 예약 / 리뷰 작성 / 마이페이지 관리  
- Toss 결제 연동 / 이메일 인증 / Redis 기반 추천  
- Swagger UI를 통한 API 문서 제공 (`/swagger-ui.html`)

---

## 🙋‍♂️ 개발자 정보

**박성원 (Seongwon Park)** – 사용자(User) 영역 총괄

- User API 백엔드 및 프론트엔드 전체 설계 및 개발  
- DB 설계 및 ERD 작성  
- API 명세서 작성 및 문서화  
- 광고 영상 및 일러스트 제작  
- 프로젝트 발표용 PPT 기획 및 디자인 총괄

---
