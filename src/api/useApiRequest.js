import { useState, useRef, useCallback } from 'react';
import api from './axios.js';
import { toast } from 'react-toastify';

const useApiRequest = () => {
    const [loadingMap, setLoadingMap] = useState({});
    const controllerRef = useRef(null);

    // setState 함수와 ref만 사용하므로 참조를 고정해 useEffect 의존성에 안전하게 넣을 수 있게 함
    const setLoading = useCallback((label, value) => {
        setLoadingMap(prev => ({ ...prev, [label]: value }));
    }, []);

    const request = useCallback(async (config, options = {}) => {
        const {
            onSuccess,
            onError,
            retry = 0,
            abortable = false,
            successMessage,
            errorMessage,
            silent = false,
            label = 'default',
        } = options;

        setLoading(label, true);

        if (abortable) {
            controllerRef.current = new AbortController();
            config.signal = controllerRef.current.signal;
        }

        let attempt = 0;
        let lastError;

        while (attempt <= retry) {
            try {
                const response = await api(config);

                if (successMessage && !silent) {
                    toast.success(successMessage);
                }

                if (onSuccess) onSuccess(response.data);
                setLoading(label, false);
                return response.data;
            } catch (error) {
                lastError = error;

                if (error.name === 'CanceledError') break;

                if (attempt < retry) {
                    attempt += 1;
                    continue;
                }

                const message =
                    error.response?.data?.message ||
                    error.message ||
                    '알 수 없는 오류가 발생했습니다.';

                if (!silent) {
                    toast.error(errorMessage || message);
                }

                if (onError) onError(error);
                break;
            }
        }

        setLoading(label, false);
        if (lastError) throw lastError;
    }, [setLoading]);

    const abort = useCallback(() => {
        if (controllerRef.current) {
            controllerRef.current.abort();
        }
    }, []);

    return {
        request,
        loadingMap,
        isLoading: (label = 'default') => !!loadingMap[label],
        abort,
    };
};

export default useApiRequest;
