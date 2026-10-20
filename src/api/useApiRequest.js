import { useState, useRef, useCallback } from 'react';
import api from './axios.js';
import { toast } from 'react-toastify';

/*
 * 실패하면 이 훅이 toast.error 를 띄운 뒤 다시 throw 한다. 호출부 catch 에서 토스트를 또 띄우지 말 것.
 * 직접 알림하려면 options.silent = true (successMessage 토스트도 꺼짐). 요청 취소는 토스트 없이 throw.
 */
const useApiRequest = () => {
    const [loadingMap, setLoadingMap] = useState({});
    const controllerRef = useRef(null);

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
