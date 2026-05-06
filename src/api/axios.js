import axios from 'axios';
import { toast } from 'react-toastify';

const baseURL = import.meta.env.VITE_BACKEND_URL; // 백엔드 주소

const api = axios.create({
    baseURL,
    withCredentials: true,
});

let responseInterceptorId = null;
let refreshPromise = null;

// 🔧 토큰 저장소 결정
const getStorage = () =>
    localStorage.getItem('accessToken') ? localStorage : sessionStorage;

const AUTH_KEYS = ['accessToken', 'userInfo'];

const handleLogout = (navigate) => {
    AUTH_KEYS.forEach(key => {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
    });
    toast.error('세션이 만료되었습니다. 다시 로그인해주세요.');
    navigate('/login');
};

// 요청 인터셉터: JWT 자동 주입
const requestInterceptor = (config) => {
    const token = getStorage().getItem('accessToken');
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
            const isRefreshRequest = err.config?.url?.includes('/api/auth/refresh');

            if (status === 401 && isRefreshRequest) {
                handleLogout(navigate);
                return Promise.reject(err);
            }

            // 401 처리: 토큰 재발급
            if (status === 401 && !err.config?._retry) {
                err.config._retry = true;
                try {
                    if (!refreshPromise) {
                        refreshPromise = api.post('/api/auth/refresh');
                    }

                    const res = await refreshPromise;
                    const newAccessToken = res.data;
                    getStorage().setItem('accessToken', newAccessToken);

                    err.config.headers = err.config.headers || {};
                    err.config.headers.Authorization = `Bearer ${newAccessToken}`;
                    return api(err.config);
                } catch (refreshErr) {
                    handleLogout(navigate);
                    return Promise.reject(refreshErr);
                } finally {
                    refreshPromise = null;
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