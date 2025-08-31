import { Navigate } from 'react-router-dom';

function PrivateRoute({ children }) {
    const rawUser =
        localStorage.getItem('userInfo') || sessionStorage.getItem('userInfo');
    const token =
        localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');

    const userInfo = rawUser ? JSON.parse(rawUser) : null;

    const isAuthenticated = userInfo?.userId && token;

    return isAuthenticated ? children : <Navigate to="/error/401" replace />;
}

export default PrivateRoute;