import { Navigate } from 'react-router-dom';

function PublicRoute({ children }) {
    const rawUser =
        localStorage.getItem('userInfo') || sessionStorage.getItem('userInfo');
    const userInfo = rawUser ? JSON.parse(rawUser) : null;

    return userInfo ? <Navigate to="/error/403" replace /> : children;
}

export default PublicRoute;