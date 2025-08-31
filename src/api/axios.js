import axios from 'axios';
import { toast } from 'react-toastify';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
    withCredentials: true,
});

// 요청 인터셉터: JWT 토큰 자동 주입
api.interceptors.request.use((config) => {
    const token =
        localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`[API 요청] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
});

// 응답 인터셉터: 에러 핸들링 + 자동 로그아웃
export const attachErrorInterceptor = (navigate) => {
    api.interceptors.response.use(
        res => res,
        err => {
            const skipRedirect = err.config?.skipRedirect;
            const status = err.response?.status;

            if (status === 401) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('userInfo');
                sessionStorage.removeItem('accessToken');
                sessionStorage.removeItem('userInfo');
                toast.error('세션이 만료되었습니다. 다시 로그인해주세요.');
                navigate('/login');
                return Promise.reject(err);
            }

            if (!skipRedirect) {
                switch (status) {
                    case 400: navigate('/error/400'); break;
                    case 403: navigate('/error/403'); break;
                    case 404: navigate('/error/404'); break;
                    case 408: navigate('/error/408'); break;
                    case 422: navigate('/error/422'); break;
                    case 429: navigate('/error/429'); break;
                    case 500: navigate('/error/500'); break;
                    case 503: navigate('/error/503'); break;
                    default: navigate('/error/400');
                }
            }

            return Promise.reject(err);
        }
    );
};

export default api;