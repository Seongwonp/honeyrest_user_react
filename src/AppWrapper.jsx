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
import AccommodationDetailWrapper from "./pages/Accommodations/Accommodation/AccommodationDetailWrapper.jsx";
import RoomDetail from "./pages/Accommodations/Accommodation/Room/RoomDetail.jsx";
import Reservation from "@/pages/Reservation/Reservation.jsx";
import PaymentProcess from "@/pages/Payment/PaymentProcess.jsx";
import PaymentSuccess from "@/pages/Payment/PaymentSuccess.jsx";
import PaymentFail from "@/pages/Payment/PaymentFail.jsx";
import ReservationComplete from "@/pages/Reservation/ReservationComplete.jsx";
import GuestEntryChoice from "@/pages/Reservation/guest/GuestEntryChoice.jsx";
import ReserveGuestForm from "@/pages/Reservation/guest/ReserveGuestForm.jsx";
import ReserveGuestLookUp from "@/pages/Reservation/guest/ReserveGuestLookUp.jsx";
import ReservationList from "@/pages/myPage/ReservationList.jsx";
import ReservationDetail from "@/pages/myPage/ReservationDetail.jsx";
import Profile from "@/pages/myPage/Profile.jsx";
import ReviewList from "@/pages/myPage/ReviewList.jsx";
import ReviewWrite from "@/pages/Review/ReviewWrite.jsx";
import MyWishList from "@/pages/myPage/MyWishList.jsx";
import VerifyEmailChange from "@/pages/myPage/VerifyEmailChange.jsx";
import CancelRequestPage from "@/pages/myPage/CancelRequestModal.jsx";
import PasswordChange from "@/pages/Login/PasswordChange.jsx";
import ResetPassword from "@/pages/Login/ResetPassword.jsx";
import InquiryEditModal from "@/pages/myPage/Inquiry/InquiryEditModal.jsx";
import InquiryList from "@/pages/myPage/Inquiry/InquiryList.jsx";
import CouponList from "@/pages/myPage/Coupon/CouponList.jsx";
import Inquiry from "@/pages/myPage/Inquiry/Inquiry.jsx";
import IntroModal from "@/components/IntroModal.jsx";

function InquiryDetail() {
    return null;
}

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
                    path="/reset-password"
                    element={
                        <PublicRoute>
                            <ResetPassword />
                        </PublicRoute>
                    }
                />
                <Route
                    path="/reset-password/change"
                    element={
                        <PublicRoute>
                            <PasswordChange />
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

                {/* 결제 관련 */}
                <Route path="/payment/process" element={<PaymentProcess/>}/>
                <Route path="/payment/success" element={<PaymentSuccess />} />
                <Route path="/payment/fail" element={<PaymentFail />} />
                <Route path="/reservation/complete" element={<ReservationComplete/>}/>


                <Route path="/reserve/guest" element={<GuestEntryChoice/>}/>

                <Route element={<Layout/>}>
                    <Route path="/" element={<Home/>}/>

                    {/* 마이페이지 */}
                    <Route
                        path="/user/mypage"
                        element={<PrivateRoute><MyPageMain /></PrivateRoute>}
                    >
                        <Route path="profile" element={<Profile />} />
                        <Route path="reservations" element={<ReservationList />} />
                        <Route path="reservations/:reservationId" element={<ReservationDetail />} />
                        <Route path="reviews" element={<ReviewList />} />
                        <Route path="reviews/write/:reservationId" element={<ReviewWrite />} />
                        <Route path="wishList" element={<MyWishList />}/>

                        {/* 마이페이지 1:1 문의 관련 */}
                        <Route path="inquiries" element={<InquiryList />} />
                        <Route path="inquiries/:inquiryId" element={<Inquiry />} />
                        <Route path="inquiries/edit/:inquiryId" element={<InquiryEditModal />} />

                        {/* 쿠폰 페이지 */}
                        <Route path="coupons" element={<CouponList />} />
                    </Route>

                    <Route path="/verify-email-change" element={<VerifyEmailChange />} />
                    <Route path="/user/reservations/:reservationId/cancel-request" element={<CancelRequestPage/>}/>


                    <Route
                        path="/accommodations"
                        element={<AccommodationLayout />}
                    />
                    <Route path="/accommodations/:id" element={<AccommodationDetailWrapper />} />
                    <Route path="/room/:roomId" element={<RoomDetail />} />
                    <Route path="/reserve" element={<Reservation />} />
                    <Route path="/reserve/guest/form" element={<ReserveGuestForm/>}/>
                    <Route path="/reservation/lookup" element={<ReserveGuestLookUp/>}/>


                </Route>
            </Routes>
            <ToastContainer position="top-right" autoClose={3000}/>
        </>
    );
}

export default AppWrapper;