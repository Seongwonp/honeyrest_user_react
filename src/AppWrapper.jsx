import {useEffect} from 'react';
import {Routes, Route, useNavigate} from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './App.css';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Layout from './components/Layout';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Signup from './pages/SignUp/SignUp.jsx';
import VerifyEmail from './pages/SignUp/VerifyEmail.jsx';
import EmailVerifyPage from './pages/SignUp/EmailVerifyPage.jsx';
import ErrorPages from './pages/Error/ErrorPages.jsx';
import Logout from './pages/Login/Logout.jsx';
import KakaoCallback from './pages/Login/kakao/KakaoCallback.jsx';
import GoogleCallback from './pages/Login/google/GoogleCallback.jsx';
import MyPageMain from './pages/myPage/MyPageMain.jsx';
import AccommodationLayout from './pages/Accommodations/AccommodationLayout.jsx';
import {attachErrorInterceptor} from './api/axios.js';

import PublicRoute from './routes/PublicRoute.jsx';
import PrivateRoute from './routes/PrivateRoute.jsx';
import Accommodation from "./pages/Accommodations/Accommodation/Accommodation.jsx";
import AccommodationDetailWrapper from "./pages/Accommodations/Accommodation/AccommodationDetailWrapper.jsx";

function AppWrapper() {
    const navigate = useNavigate();

    useEffect(() => {
        AOS.init({duration: 800, once: true});
        attachErrorInterceptor(navigate);
    }, [navigate]);

    return (
        <>
            <Routes>
                {/* 비로그인 전용 */}
                <Route
                    path="/login"
                    element={
                        <PublicRoute>
                            <Login/>
                        </PublicRoute>
                    }
                />
                <Route
                    path="/signup"
                    element={
                        <PublicRoute>
                            <Signup/>
                        </PublicRoute>
                    }
                />
                <Route
                    path="/logout"
                    element={
                        <PrivateRoute>
                            <Logout />
                        </PrivateRoute>
                    }
                />
                {/* 인증 관련 */}
                <Route path="/verify-email" element={<VerifyEmail/>}/>
                <Route path="/verify" element={<EmailVerifyPage/>}/>
                <Route path="/login/kakao/callback" element={<KakaoCallback/>}/>
                <Route path="/login/google/callback" element={<GoogleCallback/>}/>

                {/* 에러 페이지 */}
                {ErrorPages()}


                <Route element={<Layout/>}>
                    <Route path="/" element={<Home/>}/>
                    <Route
                        path="/user/mypage"
                        element={
                            <PrivateRoute>
                                <MyPageMain/>
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/accommodations"
                        element={<AccommodationLayout />}
                    />
                    <Route path="/accommodations/:id" element={<AccommodationDetailWrapper />} />
                </Route>
            </Routes>
            <ToastContainer position="top-right" autoClose={3000}/>
        </>
    );
}

export default AppWrapper;