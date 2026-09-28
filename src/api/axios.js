import axios from 'axios';
import { toast } from 'react-toastify';
import { notifyAuthChange } from '@/context/authContextValue';

const baseURL = import.meta.env.VITE_BACKEND_URL; // 백엔드 주소

const api = axios.create({
    baseURL,
    withCredentials: true,
});

/*
 * ─────────────────────────────────────────────────────────────────────────────
 * 액세스 토큰 재발급 흐름 (refresh single-flight)
 * ─────────────────────────────────────────────────────────────────────────────
 * 1) 재발급 요청은 전용 인스턴스(refreshClient)로 보낸다.
 *    - api 의 요청 인터셉터를 거치지 않으므로 만료된 Bearer 헤더가 붙지 않는다.
 *      (재발급은 HttpOnly 리프레시 쿠키만으로 인증)
 *    - api 의 응답 인터셉터도 거치지 않으므로 재발급 실패가 다시 401 처리/에러 페이지
 *      리다이렉트로 재귀하지 않는다.
 *
 * 2) refreshAccessToken() 은 진행 중인 재발급 Promise 를 모듈 변수 하나로 공유한다.
 *    - 앱 마운트 시 GlobalGuard(App.jsx) 의 자동 로그인과 응답 인터셉터의 401 처리가
 *      같은 함수를 쓰므로, 동시에 호출돼도 서버에는 재발급 요청이 한 번만 나간다.
 *    - Promise 가 정착(성공/실패)할 때 단 한 번 해제한다. 개별 대기자가 해제하지 않는다.
 *
 * 3) "늦게 도착한 401" 처리
 *    - 재발급 전에 이전 토큰으로 보낸 요청이 재발급이 끝난 뒤에 401 로 돌아올 수 있다.
 *      이때 in-flight Promise 는 이미 해제되어 있으므로, 그대로 재발급하면 불필요한
 *      두 번째 재발급이 일어난다(리프레시 토큰 회전 시 세션이 끊길 수도 있음).
 *    - 그래서 401 을 받으면 "그 요청이 실제로 보낸 토큰"과 "현재 저장된 토큰"을 비교한다.
 *        · 다르면 → 이미 다른 경로에서 재발급이 끝난 것이므로 현재 토큰으로 재시도만 한다.
 *        · 같으면 → refreshAccessToken() 호출 (진행 중이면 그 Promise 를 그대로 기다림).
 *    - 요청마다 _retry 플래그로 한 번만 재시도하므로 무한 루프가 생기지 않는다.
 *
 * 4) 재발급 실패 시 저장소의 인증 정보를 지우고 AUTH_CHANGE_EVENT 를 발생시켜
 *    AuthProvider 가 같은 탭에서도 즉시 로그아웃 상태로 바뀌게 한다.
 *    세션 만료 토스트는 toastId 로 중복 표시를 막는다.
 * ─────────────────────────────────────────────────────────────────────────────
 */

const REFRESH_URL = '/api/auth/refresh';
const AUTH_KEYS = ['accessToken', 'userInfo'];

// 재발급 전용 인스턴스 (인터셉터 없음)
const refreshClient = axios.create({
    baseURL,
    withCredentials: true,
});

let responseInterceptorId = null;
let refreshPromise = null;

// 🔧 토큰 저장소 결정 (자동 로그인이면 localStorage, 아니면 sessionStorage)
const getStorage = () =>
    localStorage.getItem('accessToken') ? localStorage : sessionStorage;

// 현재 저장된 액세스 토큰 (없으면 null)
export const getAccessToken = () =>
    localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');

const clearAuthStorage = () => {
    AUTH_KEYS.forEach(key => {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
    });
    notifyAuthChange();
};

/**
 * 액세스 토큰 재발급 (single-flight)
 * - 진행 중인 재발급이 있으면 같은 Promise 를 반환
 * - 성공 시 새 토큰을 기존 저장소에 저장하고 토큰 문자열로 resolve
 * - 실패 시 인증 저장소를 비우고 reject
 */
export const refreshAccessToken = () => {
    if (!refreshPromise) {
        refreshPromise = refreshClient.post(REFRESH_URL)
            .then(res => {
                const newAccessToken = res.data;
                getStorage().setItem('accessToken', newAccessToken);
                return newAccessToken;
            })
            .catch(err => {
                clearAuthStorage();
                throw err;
            })
            .finally(() => {
                // 정착 시점에 한 번만 해제 → 이후의 늦은 401 은 토큰 비교(3번)로 처리
                refreshPromise = null;
            });
    }
    return refreshPromise;
};

// 요청 설정에서 실제로 전송한 Bearer 토큰을 꺼낸다.
const getSentToken = (config) => {
    const headers = config?.headers;
    const auth = headers?.get?.('Authorization') ?? headers?.Authorization;
    return typeof auth === 'string' && auth.startsWith('Bearer ') ? auth.slice(7) : null;
};

const handleLogout = (navigate) => {
    clearAuthStorage();
    toast.error('세션이 만료되었습니다. 다시 로그인해주세요.', { toastId: 'session-expired' });
    navigate('/login');
};

// 요청 인터셉터: JWT 자동 주입 (재발급 엔드포인트는 제외)
const requestInterceptor = (config) => {
    if (config.url?.includes(REFRESH_URL)) {
        return config;
    }
    const token = getAccessToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
};

api.interceptors.request.use(requestInterceptor);

// 응답 인터셉터: 에러 핸들링 + 재발급 + 로그아웃
export const attachErrorInterceptor = (navigate) => {
    if (responseInterceptorId !== null) {
        api.interceptors.response.eject(responseInterceptorId);
    }

    responseInterceptorId = api.interceptors.response.use(
        res => res,
        async err => {
            const status = err.response?.status;
            const skipRedirect = err.config?.skipRedirect;
            const isRefreshRequest = err.config?.url?.includes(REFRESH_URL);

            // 누군가 api 인스턴스로 직접 재발급을 호출한 경우의 안전장치
            if (status === 401 && isRefreshRequest) {
                handleLogout(navigate);
                return Promise.reject(err);
            }

            // 401 처리: 토큰 재발급 후 원 요청 1회 재시도
            if (status === 401 && err.config && !err.config._retry) {
                err.config._retry = true;
                try {
                    const sentToken = getSentToken(err.config);
                    const currentToken = getAccessToken();

                    // 이미 다른 요청/GlobalGuard 가 재발급을 끝냈다면 새 토큰으로 재시도만
                    const newAccessToken =
                        sentToken && currentToken && sentToken !== currentToken
                            ? currentToken
                            : await refreshAccessToken();

                    err.config.headers = err.config.headers || {};
                    err.config.headers.Authorization = `Bearer ${newAccessToken}`;
                    return api(err.config);
                } catch (refreshErr) {
                    handleLogout(navigate);
                    return Promise.reject(refreshErr);
                }
            }

            //에러 페이지 리디렉션
            if (!skipRedirect) {
                const errorRoutes = {
                    400: '/error/400',
                    403: '/error/403',
                    404: '/error/404',
                    408: '/error/408',
                    422: '/error/422',
                    429: '/error/429',
                    500: '/error/500',
                    503: '/error/503',
                };
                const redirectPath = errorRoutes[status] || '/error/400';
                navigate(redirectPath);
            }

            return Promise.reject(err);
        }
    );
};

export default api;
