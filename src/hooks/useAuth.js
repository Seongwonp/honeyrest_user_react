// src/hooks/useAuth.js
import { useState, useEffect } from 'react';

export const useAuth = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const loadUser = () => {
            try {
                const raw =
                    localStorage.getItem('userInfo') || sessionStorage.getItem('userInfo');
                console.log('raw userInfo:', raw); // 🔍 저장된 문자열 확인

                const parsed = JSON.parse(raw);
                console.log('parsed userInfo:', parsed); // 🔍 파싱된 객체 확인

                if (parsed && parsed.userId) {
                    setUser(parsed);
                } else {
                    setUser(null);
                }
            } catch (err) {
                console.error('userInfo 파싱 실패:', err);
                setUser(null);
            }
        };

        loadUser();

        window.addEventListener('storage', loadUser);
        return () => window.removeEventListener('storage', loadUser);
    }, []);

    return { user };
};