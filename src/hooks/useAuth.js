import { useState, useEffect } from 'react';

export const useAuth = () => {
    const [user, setUser] = useState(null);

    const loadUser = () => {
        try {
            const raw =
                localStorage.getItem('userInfo') || sessionStorage.getItem('userInfo');

            if (!raw || raw === 'undefined') {
                setUser(null);
                return;
            }

            const parsed = JSON.parse(raw);
            if (parsed?.userId) {
                setUser(parsed);
            } else {
                setUser(null);
            }
        } catch (err) {
            console.error('userInfo 파싱 실패:', err);
            setUser(null);
        }
    };

    useEffect(() => {
        loadUser();
        window.addEventListener('storage', loadUser);
        return () => window.removeEventListener('storage', loadUser);
    }, []);

    const isLoggedIn = !!user?.userId;

    return { user, isLoggedIn, loadUser };
};