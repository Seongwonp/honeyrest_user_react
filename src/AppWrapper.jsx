import {lazy, Suspense, useEffect} from 'react';
import {Routes, Route, useNavigate} from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './App.css';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import Layout from './components/Layout';
import ErrorPages from './pages/Error/ErrorPages.jsx';
import {attachErrorInterceptor} from './api/axios.js';

import PublicRoute from './routes/PublicRoute.jsx';
import PrivateRoute from './routes/PrivateRoute.jsx';
import PageLoader from './components/PageLoader.jsx';

// 라우트 단위 페이지는 지연 로딩하여 초기 번들 크기를 줄인다 (Layout/Header 는 즉시 로딩)
const Home = lazy(() => import("./pages/Home/Home"));
const Login = lazy(() => import("./pages/Login/Login"));
const Signup = lazy(() => import("./pages/SignUp/SignUp.jsx"));
const VerifyEmail = lazy(() => import("./pages/SignUp/VerifyEmail.jsx"));
const EmailVerifyPage = lazy(() => import("./pages/SignUp/EmailVerifyPage.jsx"));
const Logout = lazy(() => import("./pages/Login/Logout.jsx"));
const KakaoCallback = lazy(() => import("./pages/Login/kakao/KakaoCallback.jsx"));
const GoogleCallback = lazy(() => import("./pages/Login/google/GoogleCallback.jsx"));
const MyPageMain = lazy(() => import("./pages/myPage/MyPageMain.jsx"));
const AccommodationLayout = lazy(() => import("./pages/Accommodations/AccommodationLayOut.jsx"));
const AccommodationDetailWrapper = lazy(() => import("./pages/Accommodations/Accommodation/AccommodationDetailWrapper.jsx"));
const RoomDetail = lazy(() => import("./pages/Accommodations/Accommodation/Room/RoomDetail.jsx"));
const Reservation = lazy(() => import("@/pages/Reservation/Reservation.jsx"));
const PaymentProcess = lazy(() => import("@/pages/Payment/PaymentProcess.jsx"));
const PaymentSuccess = lazy(() => import("@/pages/Payment/PaymentSuccess.jsx"));
const PaymentFail = lazy(() => import("@/pages/Payment/PaymentFail.jsx"));
const ReservationComplete = lazy(() => import("@/pages/Reservation/ReservationComplete.jsx"));
const GuestEntryChoice = lazy(() => import("@/pages/Reservation/guest/GuestEntryChoice.jsx"));
const ReserveGuestForm = lazy(() => import("@/pages/Reservation/guest/ReserveGuestForm.jsx"));
const ReserveGuestLookUp = lazy(() => import("@/pages/Reservation/guest/ReserveGuestLookUp.jsx"));
const ReservationList = lazy(() => import("@/pages/myPage/ReservationList.jsx"));
const ReservationDetail = lazy(() => import("@/pages/myPage/ReservationDetail.jsx"));
const Profile = lazy(() => import("@/pages/myPage/Profile.jsx"));
const ReviewList = lazy(() => import("@/pages/myPage/ReviewList.jsx"));
const ReviewWrite = lazy(() => import("@/pages/Review/ReviewWrite.jsx"));
const MyWishList = lazy(() => import("@/pages/myPage/MyWishList.jsx"));
const VerifyEmailChange = lazy(() => import("@/pages/myPage/VerifyEmailChange.jsx"));
const CancelRequestPage = lazy(() => import("@/pages/myPage/CancelRequestModal.jsx"));
const PasswordChange = lazy(() => import("@/pages/Login/PasswordChange.jsx"));
const ResetPassword = lazy(() => import("@/pages/Login/ResetPassword.jsx"));
const InquiryEditModal = lazy(() => import("@/pages/myPage/Inquiry/InquiryEditModal.jsx"));
const InquiryList = lazy(() => import("@/pages/myPage/Inquiry/InquiryList.jsx"));
const CouponList = lazy(() => import("@/pages/myPage/Coupon/CouponList.jsx"));
const Inquiry = lazy(() => import("@/pages/myPage/Inquiry/Inquiry.jsx"));
const PointHistory = lazy(() => import("@/pages/myPage/Point/PointHistory.jsx"));
const EventDetail = lazy(() => import("@/pages/Home/Event/EventDetail.jsx"));

function AppWrapper() {
    const navigate = useNavigate();

    useEffect(() => {
        AOS.init({duration: 800, once: true});
        attachErrorInterceptor(navigate);
    }, [navigate]);

    return (
        <>
            <Suspense fallback={<PageLoader/>}>
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

                            <Route path="points" element={<PointHistory/>}/>
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

                        <Route path="/events/:id" element={<EventDetail />} />
                    </Route>
                </Routes>
            </Suspense>
            <ToastContainer position="top-right" autoClose={3000}/>
        </>
    );
}

export default AppWrapper;