import axios from 'axios';
import { toast } from 'react-toastify';
import { getAccessToken, setAccessToken, clearSession } from '@/auth/authStorage';

const baseURL = import.meta.env.VITE_BACKEND_URL; // 백엔드 주소

const api = axios.create({
    baseURL,
    withCredentials: true,
});

/*
 * 토큰 재발급
 * - 재발급은 인터셉터 없는 refreshClient 로 보낸다(만료 토큰이 안 붙고, 실패해도 401 처리로 재귀하지 않음).
 * - refreshAccessToken() 은 진행 중인 Promise 를 공유해서 동시에 불려도 요청은 한 번만 나간다.
 * - 재발급이 끝난 뒤 도착한 401 은 보낸 토큰과 현재 토큰을 비교해, 다르면 재발급 없이 재시도만 한다.
 */

const REFRESH_URL = '/api/auth/refresh';

// 재발급 전용 인스턴스 (인터셉터 없음)
const refreshClient = axios.create({
    baseURL,
    withCredentials: true,
});

let responseInterceptorId = null;
let refreshPromise = null;

export const refreshAccessToken = () => {
    if (!refreshPromise) {
        refreshPromise = refreshClient.post(REFRESH_URL)
            .then(res => {
                const newAccessToken = res.data;
                setAccessToken(newAccessToken);
                return newAccessToken;
            })
            .catch(err => {
                clearSession();
                throw err;
            })
            .finally(() => {
                // 늦게 온 401 은 토큰 비교로 처리하므로 여기서 해제
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
    clearSession();
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
            // 취소된 요청은 에러 페이지/재발급 없이 호출부로 넘긴다
            if (axios.isCancel(err)) {
                return Promise.reject(err);
            }

            const status = err.response?.status;
            const skipRedirect = err.config?.skipRedirect;
            const isRefreshRequest = err.config?.url?.includes(REFRESH_URL);

            // api 인스턴스로 재발급을 직접 호출한 경우
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
