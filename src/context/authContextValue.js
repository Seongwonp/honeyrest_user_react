import { createContext } from 'react';

// 인증 컨텍스트 객체
// - Provider 컴포넌트(AuthContext.jsx)와 분리해 둔 이유: .jsx 파일이 컴포넌트만 export 해야
//   React Fast Refresh(eslint react-refresh 규칙)가 정상 동작하기 때문
export const AuthContext = createContext(null);

// 같은 탭에서 (React 트리 밖의 코드가) 인증 저장소를 바꿨을 때 Provider 에 알리는 커스텀 이벤트 이름
// - 'storage' 이벤트는 다른 탭에서만 발생하므로, axios 인터셉터처럼 컴포넌트 밖에서
//   토큰/사용자 정보를 지운 경우에는 이 이벤트로 Provider 가 다시 읽어 들이도록 한다.
export const AUTH_CHANGE_EVENT = 'honeyrest:auth-change';

export const notifyAuthChange = () => {
    window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
};
