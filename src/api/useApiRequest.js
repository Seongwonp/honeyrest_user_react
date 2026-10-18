import { useState, useRef, useCallback } from 'react';
import api from './axios.js';
import { toast } from 'react-toastify';

/**
 * 공통 API 요청 훅
 *
 * request(config, options) 의 알림 계약
 * - 실패 시 이 훅이 기본으로 toast.error 를 띄운다
 *   (문구: options.errorMessage → 서버 message → error.message 순).
 *   그 다음 onError 를 호출하고 에러를 다시 throw 한다.
 * - 따라서 호출하는 쪽 catch 에서는 토스트를 또 띄우지 말 것(중복 토스트).
 *   catch 는 로그·화면 상태 변경(에러 화면 등)에만 쓴다.
 * - 직접 알림(Swal, 다른 문구 토스트 등)을 하고 싶으면 options.silent = true 로 끈다.
 *   silent 는 successMessage 토스트도 함께 끈다.
 * - 요청 취소(CanceledError)는 토스트 없이 throw 한다.
 */
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
