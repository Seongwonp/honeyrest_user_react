import axios from 'axios';
import { toast } from 'react-toastify';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://175.45.195.90:8080',
    withCredentials: true,
});

// 🔧 토큰 저장소 결정
const getStorage = () =>
    localStorage.getItem('accessToken') ? localStorage : sessionStorage;

// 로그아웃 처리 함수
const handleLogout = (navigate) => {
    localStorage.clear();
    sessionStorage.clear();
    toast.error('세션이 만료되었습니다. 다시 로그인해주세요.');
    navigate('/login');
};

// 요청 인터셉터: JWT 자동 주입
const requestInterceptor = (config) => {
    const token = getStorage().getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`[API 요청] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
};

api.interceptors.request.use(requestInterceptor);

// 응답 인터셉터: 에러 핸들링 + 재발급 + 로그아웃
export const attachErrorInterceptor = (navigate) => {
    let isRefreshing = false;

    api.interceptors.response.use(
        res => res,
        async err => {
            const status = err.response?.status;
            const skipRedirect = err.config?.skipRedirect;

            // 401 처리: 토큰 재발급
            if (status === 401 && !isRefreshing) {
                isRefreshing = true;
                try {
                    const res = await api.post('/api/auth/refresh');
                    const newAccessToken = res.data;
                    getStorage().setItem('accessToken', newAccessToken);

                    err.config.headers.Authorization = `Bearer ${newAccessToken}`;
                    isRefreshing = false;
                    return api(err.config);
                } catch (refreshErr) {
                    console.error('[API] ❌ 토큰 재발급 실패:', refreshErr);
                    isRefreshing = false;
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