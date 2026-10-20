import { notifyAuthChange } from '@/context/authContextValue';
import { normalizeProvider } from './provider';

/*
 * 인증 키(accessToken, userInfo)는 이 모듈에서만 읽고 쓴다.
 * 자동 로그인이면 localStorage, 아니면 sessionStorage 를 쓰고,
 * 세션이 바뀌면 notifyAuthChange() 로 같은 탭의 AuthProvider 에 알린다.
 */

const TOKEN_KEY = 'accessToken';
const USER_KEY = 'userInfo';
const AUTH_KEYS = [TOKEN_KEY, USER_KEY];

// 시크릿 모드 등에서 storage 접근이 막혀도 앱이 죽지 않게
const safeGet = (storage, key) => {
    try {
        return storage.getItem(key);
    } catch {
        return null;
    }
};

const safeSet = (storage, key, value) => {
    try {
        storage.setItem(key, value);
    } catch (err) {
        console.error('[authStorage] 저장 실패:', err);
    }
};

const safeRemove = (storage, key) => {
    try {
        storage.removeItem(key);
    } catch {
        // 무시
    }
};

// 토큰이 localStorage 에 있으면 자동 로그인 세션
const getActiveStorage = () =>
    safeGet(localStorage, TOKEN_KEY) ? localStorage : sessionStorage;

const isValidRaw = (v) => v && v !== 'undefined' && v !== 'null' && v.trim() !== '';

const normalizeUser = (user) => {
    const provider = normalizeProvider(user?.provider);
    return provider ? { ...user, provider } : { ...user };
};

const removeAuthKeys = () => {
    AUTH_KEYS.forEach(key => {
        safeRemove(localStorage, key);
        safeRemove(sessionStorage, key);
    });
};

export const getAccessToken = () =>
    safeGet(localStorage, TOKEN_KEY) || safeGet(sessionStorage, TOKEN_KEY);

// 사용자 정보는 그대로라 알림 없음
export const setAccessToken = (token) => {
    safeSet(getActiveStorage(), TOKEN_KEY, token);
};

export const getUser = () => {
    try {
        const rawSession = safeGet(sessionStorage, USER_KEY);
        const rawLocal = safeGet(localStorage, USER_KEY);
        const raw = isValidRaw(rawSession) ? rawSession : isValidRaw(rawLocal) ? rawLocal : null;
        if (!raw) return null;

        const parsed = JSON.parse(raw);
        return parsed?.userId ? normalizeUser(parsed) : null;
    } catch {
        return null;
    }
};

// 이전 세션 흔적은 양쪽 저장소에서 지운 뒤 기록
export const setSession = ({ token, user, autoLogin }) => {
    removeAuthKeys();
    const storage = autoLogin ? localStorage : sessionStorage;
    safeSet(storage, TOKEN_KEY, token);
    safeSet(storage, USER_KEY, JSON.stringify(normalizeUser(user)));
    notifyAuthChange();
};

export const updateUser = (user) => {
    safeSet(getActiveStorage(), USER_KEY, JSON.stringify(normalizeUser(user)));
    notifyAuthChange();
};

// 인증 키만 지운다(결제 진행 정보 등은 유지)
export const clearSession = () => {
    removeAuthKeys();
    notifyAuthChange();
};
