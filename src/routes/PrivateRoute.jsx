import { Navigate } from 'react-router-dom';

function PrivateRoute({ children }) {
    const rawUser =
        localStorage.getItem('userInfo') || sessionStorage.getItem('userInfo');
    const userInfo = rawUser ? JSON.parse(rawUser) : null;

    return userInfo ? children : <Navigate to="/error/401" replace />;
}

export default PrivateRoute;