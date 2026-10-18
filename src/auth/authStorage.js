import { notifyAuthChange } from '@/context/authContextValue';
import { normalizeProvider } from './provider';

/*
 * 인증 저장소 모듈 — 인증 키(accessToken, userInfo)를 읽고 쓰는 유일한 곳
 * - 자동 로그인이면 localStorage, 아니면 sessionStorage 에 저장한다.
 *   이후 읽기/갱신은 "토큰이 들어 있는 저장소"를 따라간다.
 * - 사용자 정보의 provider 는 저장·조회 시 대문자 정규형으로 맞춘다(서버 응답과 동일).
 * - 사용자/세션이 바뀌는 쓰기(setSession, updateUser, clearSession) 뒤에는
 *   AUTH_CHANGE_EVENT 를 발생시켜 같은 탭의 AuthProvider 가 다시 읽게 한다.
 *   (다른 탭은 브라우저의 'storage' 이벤트로 동기화)
 * - 인증과 무관한 키(결제 진행 정보, 가입 이메일 등)는 건드리지 않는다.
 */

const TOKEN_KEY = 'accessToken';
const USER_KEY = 'userInfo';
const AUTH_KEYS = [TOKEN_KEY, USER_KEY];

// 저장소 접근이 막힌 환경(사생활 보호 모드 등)에서도 앱이 죽지 않도록 감싼다
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

// 현재 세션이 저장된 저장소 (토큰이 localStorage 에 있으면 자동 로그인 세션)
const getActiveStorage = () =>
    safeGet(localStorage, TOKEN_KEY) ? localStorage : sessionStorage;

const isValidRaw = (v) => v && v !== 'undefined' && v !== 'null' && v.trim() !== '';

// provider 를 정규형으로 맞춘 사용자 객체
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

// 현재 저장된 액세스 토큰 (없으면 null)
export const getAccessToken = () =>
    safeGet(localStorage, TOKEN_KEY) || safeGet(sessionStorage, TOKEN_KEY);

// 재발급받은 액세스 토큰을 기존 세션 저장소에 덮어쓴다 (사용자 정보는 그대로라 알림 없음)
export const setAccessToken = (token) => {
    safeSet(getActiveStorage(), TOKEN_KEY, token);
};

// 저장된 사용자 정보 (sessionStorage 우선 → localStorage). 없거나 형식이 잘못되면 null
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

// 로그인 직후 세션 저장 (이전 세션 흔적은 양쪽 저장소에서 모두 지운 뒤 기록)
export const setSession = ({ token, user, autoLogin }) => {
    removeAuthKeys();
    const storage = autoLogin ? localStorage : sessionStorage;
    safeSet(storage, TOKEN_KEY, token);
    safeSet(storage, USER_KEY, JSON.stringify(normalizeUser(user)));
    notifyAuthChange();
};

// 서버에서 받은 최신 사용자 정보로 갱신 (현재 세션 저장소 유지)
export const updateUser = (user) => {
    safeSet(getActiveStorage(), USER_KEY, JSON.stringify(normalizeUser(user)));
    notifyAuthChange();
};

// 로그아웃·세션 만료·회원 탈퇴 시 인증 키만 삭제
export const clearSession = () => {
    removeAuthKeys();
    notifyAuthChange();
};
