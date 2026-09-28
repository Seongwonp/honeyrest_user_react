// 외부 연동 URL 설정 (환경변수 기반)

const trimSlash = (url) => (url || "").replace(/\/+$/, "");

// OAuth 콜백/로그아웃 리다이렉트 기준 URL (미설정 시 현재 접속 origin 사용)
export const getOAuthRedirectBase = () =>
    trimSlash(import.meta.env.VITE_OAUTH_REDIRECT_URI || window.location.origin);

// 관리자 페이지 URL (미설정 시 빈 문자열 → 관리자 버튼 숨김)
export const ADMIN_URL = trimSlash(import.meta.env.VITE_ADMIN_URL);
