import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
    withCredentials: true,
});

export const attachErrorInterceptor = (navigate) => {
    api.interceptors.response.use(
        res => res,
        err => {
            const status = err.response?.status;
            switch (status) {
                case 401: navigate('/error/401'); break;
                case 403: navigate('/error/403'); break;
                case 500: navigate('/error/500'); break;
                case 404: navigate('/error/404'); break;
                default: navigate('/error/400');
            }
            return Promise.reject(err);
        }
    );
};

export default api;