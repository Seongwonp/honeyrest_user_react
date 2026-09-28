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
```

## 아키텍처 핵심

### 인증 흐름
- `src/hooks/useAuth.js` — 인증 상태 관리 (localStorage / sessionStorage)
- `src/api/axios.js` — JWT 자동 주입 + 401 시 토큰 재발급 인터셉터
- `src/App.jsx` (GlobalGuard) — 앱 마운트 시 1회 토큰 refresh + JWT 만료 타이머
- `src/routes/PrivateRoute.jsx` / `PublicRoute.jsx` — 라우트 가드

### API 통신
- `src/api/axios.js` — baseURL은 `VITE_BACKEND_URL`, 프록시는 vite.config.js에서 `/api` 경로 설정
- `src/api/useApiRequest.js` — 공통 요청 훅: 로딩 상태, 재시도, AbortController 지원

### 환경변수
- Vite 내장 `loadEnv` 사용 (dotenv 미사용)
- 앱 코드에서는 `import.meta.env.VITE_*` 패턴
- Firebase SDK는 제거됨 (이미지 URL은 백엔드 응답 사용, `SafeImage`로 폴백)

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
| 인증 훅 | `src/hooks/useAuth.js` |
| 전역 가드 / 자동 로그인 | `src/App.jsx` |
| 전체 라우트 | `src/AppWrapper.jsx` |
| Tailwind 커스텀 테마 | `src/index.css` |
| Vite 설정 | `vite.config.js` |
