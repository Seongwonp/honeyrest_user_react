import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./App.css";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Signup from "./pages/SignUp/SignUp.jsx";
import VerifyEmail from "./pages/SignUp/VerifyEmail.jsx";
import EmailVerifyPage from "./pages/SignUp/EmailVerifyPage.jsx";
import ErrorPages from "./pages/Error/ErrorPages.jsx";
import Logout from "./pages/Login/Logout.jsx";
import KakaoCallback from "./pages/Login/kakao/KakaoCallback.jsx";
import GoogleCallback from "./pages/Login/google/GoogleCallback.jsx";
import MyPageMain from "./pages/myPage/MyPageMain.jsx";

function App() {


    useEffect(() => {
        AOS.init({
            duration: 800,
            once: true,
        });
    }, []);

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/verify-email" element={<VerifyEmail />} />
                <Route path="/verify" element={<EmailVerifyPage />} />
                <Route path="/login/kakao/callback" element={<KakaoCallback />} />
                <Route path="/login/google/callback" element={<GoogleCallback />} />
                {ErrorPages()}
                <Route element={<Layout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/user/mypage" element={<MyPageMain />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;