# HoneyRest User Frontend – Claude Code 가이드

## 프로젝트 개요

Vite 7 + React 19 + Tailwind CSS 4 기반 SPA. Next.js 없음 (순수 Vite SPA).  
사용자 숙소 예약 플랫폼의 프론트엔드.

## 환경 요구사항

- **Node.js ≥ 20.19.0** 필수 (vite 7 + tailwindcss 4 요구)
- `nvm use 20` 또는 `.nvmrc` 참조
- `.env.example` → `.env` 복사 후 값 입력

## 주요 명령어

```bash
npm run dev      # 개발 서버 (localhost:5173)
npm run build    # 프로덕션 빌드
npm run lint     # ESLint
npm run test:e2e # Playwright 사용자 여정 E2E (API e2e 프로필 + 개발 서버 자동 기동, ../honeyRest_user 필요)
```

## 아키텍처 핵심

### 인증 흐름
- `src/context/AuthContext.jsx` — 앱 전체 단일 `AuthProvider` (App.jsx 에서 GlobalGuard/라우트 위에 마운트). 다른 탭은 `storage` 이벤트, 같은 탭의 React 밖 변경은 `honeyrest:auth-change` 이벤트(`notifyAuthChange()`)로 동기화
- `src/hooks/useAuth.js` — `useContext(AuthContext)` 래퍼 (API: `user, isLoggedIn, isLoadingUser, loadUser, syncUserFromServer, logout`). 컴포넌트에서 storage 의 `userInfo` 를 직접 읽지 말 것
- `src/api/axios.js` — JWT 자동 주입 + 401 시 토큰 재발급 인터셉터. `refreshAccessToken()` 은 single-flight(진행 중 Promise 공유), 재발급 요청은 Bearer 없이 전용 인스턴스로 전송, 늦은 401 은 이미 갱신된 토큰으로 재시도. 토큰 조회는 `getAccessToken()`
- `src/App.jsx` (GlobalGuard) — 앱 마운트 시 1회 `refreshAccessToken()` + 새 토큰 기준 JWT 만료 타이머
- `src/routes/PrivateRoute.jsx` / `PublicRoute.jsx` — 라우트 가드. PrivateRoute 는 비로그인 시 `/login` 으로 보내며 `state.redirectTo` 로 원래 경로를 넘긴다(로그인 후 복귀)

### API 통신
- `src/api/axios.js` — baseURL은 `VITE_BACKEND_URL`, 프록시는 vite.config.js에서 `/api` 경로 설정
- `src/api/useApiRequest.js` — 공통 요청 훅: 로딩 상태, 재시도, AbortController 지원

### 환경변수
- Vite 내장 `loadEnv` 사용 (dotenv 미사용)
- 앱 코드에서는 `import.meta.env.VITE_*` 패턴
- Firebase SDK는 제거됨 (이미지 URL은 백엔드 응답 사용, `SafeImage`로 폴백)
- `VITE_E2E` — **E2E 전용 플래그.** `'true'` 일 때만 `src/pages/Payment/PaymentProcess.jsx` 가 토스 위젯 대신 "테스트 결제" 버튼(`data-testid="e2e-test-payment"`)을 렌더링해 가짜 paymentKey 로 `/payment/success` 에 진입한다(승인은 API e2e 프로필의 토스 스텁). Playwright `webServer` 만 설정하며 `.env`·운영 빌드에 넣지 말 것. 빌드 시 상수 치환이라 미설정 번들에는 버튼 코드가 남지 않는다
- 운영 빌드 — `honeyRest_user` 저장소의 `deploy/caddy/Dockerfile` 이 이 저장소를 빌드해 Caddy 가 서빙한다(API 와 같은 Origin). `VITE_BACKEND_URL` 은 비움(상대 경로 `/api`), 나머지 `VITE_*` 는 빌드 인자. 예시: `.env.production.example`. `.dockerignore` 가 `.env*`·`node_modules` 를 제외하고, 번들에 E2E 버튼 코드가 있으면 이미지 빌드가 실패한다

### E2E (Playwright)
- `playwright.config.js` — `webServer` 로 사용자 API(`E2E_API_DIR`, 기본 `../honeyRest_user`, `bootRun --spring.profiles.active=e2e`, 8080)와 `npm run dev`(5173, `VITE_E2E=true`)를 함께 띄운다. 포트는 백엔드 CORS 때문에 고정
- `e2e/user-journey.spec.js` — 가입·검색·예약·결제·409·취소 요청·리뷰·로그아웃 시나리오 (직렬 실행, 같은 DB 상태를 이어 씀)
- `e2e/support/` — 시드 상수(`seed.js`, API 의 `db/e2e-seed.sql` 과 동기화), 날짜(Asia/Seoul), `/e2e/**` 보조 API 호출, 화면 조작 도우미
- 선택자는 라벨/역할/텍스트 우선. 화면 문구를 바꾸면 E2E 도 함께 확인할 것

### 라우트 구조
- `src/AppWrapper.jsx` — 전체 Route 정의
- 마이페이지: `/user/mypage` 하위에 중첩 라우트 (Outlet 구조)
- 에러 페이지: `/error/400`, `/error/401`, `/error/403`, `/error/404` 등

## 주의사항

- **아이콘**: `react-icons` 사용 (`@fortawesome` 미사용, 제거됨)
- **Next.js**: 이 프로젝트에 없음. `import ... from 'next'` 금지
- **Tailwind**: v4 문법 사용 — `@import "tailwindcss"`, `@theme {}` 블록
- **환경변수**: `.env` 는 `.gitignore`에 포함됨. `.env.example`만 커밋
- **결제**: `@tosspayments/tosspayments-sdk`만 사용 (`payment-sdk` 제거됨)

## 파일 위치 빠른 참조

| 목적 | 파일 |
|------|------|
| Axios 설정 / 인터셉터 | `src/api/axios.js` |
| 인증 Provider / 훅 | `src/context/AuthContext.jsx`, `src/hooks/useAuth.js` |
| 전역 가드 / 자동 로그인 | `src/App.jsx` |
| 전체 라우트 | `src/AppWrapper.jsx` |
| Tailwind 커스텀 테마 | `src/index.css` |
| Vite 설정 | `vite.config.js` |
| E2E 설정 / 시나리오 | `playwright.config.js`, `e2e/` |
| 운영 빌드 값 예시 / 이미지 제외 목록 | `.env.production.example`, `.dockerignore` (배포 절차: honeyRest_user `docs/DEPLOY.md`) |
