import { createContext } from 'react';

// Fast Refresh 때문에 Provider(.jsx)와 파일을 분리
export const AuthContext = createContext(null);

// 'storage' 이벤트는 다른 탭에서만 오므로, 같은 탭의 React 밖 변경은 이 이벤트로 알린다
export const AUTH_CHANGE_EVENT = 'honeyrest:auth-change';

export const notifyAuthChange = () => {
    window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
};
