import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "@/api/axios";
import { HiOutlineArrowNarrowLeft } from "react-icons/hi";
import { AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import InquiryModal from "@/components/InquiryModal.jsx";
import AccommodationGallery from "./sections/AccommodationGallery.jsx";
import AccommodationSummary from "./sections/AccommodationSummary.jsx";
import RoomList from "./sections/RoomList.jsx";
import InfoSection from "./sections/InfoSection.jsx";
import MapSection from "./sections/MapSection.jsx";
import CompanySection from "./sections/CompanySection.jsx";
import ReviewSection from "./sections/ReviewSection.jsx";
import BookingSidebar from "./sections/BookingSidebar.jsx";
import StayChangeModal from "./sections/StayChangeModal.jsx";
import { todayLocal, addDays } from "@/utils/date";

/**
 * 숙소 상세 페이지
 * - 상태(일정·인원, 상세 데이터, 모달 표시 등)는 이 컴포넌트가 소유하고
 *   화면 구역별 마크업은 ./sections/* 컴포넌트로 분리해 props 로 전달한다.
 */
function Accommodation({ accommodationId, sectionRefs }) {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    const { user } = useAuth();
    const userId = user?.userId;

    const today = todayLocal();
    const defaultCheckIn = searchParams.get("checkIn") || today;
    const defaultCheckOut = searchParams.get("checkOut") || addDays(today, 1);
    const defaultGuests = searchParams.get("guests") || 2;

    const [checkIn, setCheckIn] = useState(defaultCheckIn);
    const [checkOut, setCheckOut] = useState(defaultCheckOut);
    const [guests, setGuests] = useState(defaultGuests);

    const [data, setData] = useState(null);
    const [isWished, setIsWished] = useState(false);
    const [reviewStates, setReviewStates] = useState([]);
    const [showChangeModal, setShowChangeModal] = useState(false);
    const [showDateRangeModal, setShowDateRangeModal] = useState(false);
    const [tempCheckIn, setTempCheckIn] = useState(checkIn);
    const [tempCheckOut, setTempCheckOut] = useState(checkOut);
    const [tempGuests, setTempGuests] = useState(guests);
    const [showInquiryModal, setShowInquiryModal] = useState(false);
    const isChangeReady = Boolean(
        tempCheckIn
        && tempCheckOut
        && Number(tempGuests) > 0
        && new Date(tempCheckOut) > new Date(tempCheckIn)
    );

    useEffect(() => {
        if (!checkIn || !checkOut || !guests) return;
        const params = { checkIn, checkOut, guests };
        if (userId) params.userId = userId;

        // 일정·인원을 연달아 바꾸면 이전 조건의 응답이 늦게 도착해 최신 상세를 덮어쓸 수 있으므로
        // 정리(cleanup) 시 이전 요청을 취소한다.
        const controller = new AbortController();
        api.get(`/api/accommodations/${accommodationId}`, { params, signal: controller.signal })
            .then((res) => {
                if (controller.signal.aborted) return;
                setData(res.data);
                setIsWished(res.data.wished);
            })
            .catch((err) => {
                if (controller.signal.aborted) return;
                console.error("숙소 상세 불러오기 실패:", err);
            });
        return () => controller.abort();
    }, [accommodationId, checkIn, checkOut, guests, userId]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        // setActiveSection logic if needed
                    }
                });
            },
            { threshold: 0.3, rootMargin: "-80px 0px -40% 0px" }
        );
        Object.values(sectionRefs.current).forEach((ref) => { if (ref) observer.observe(ref); });
        return () => observer.disconnect();
        // sectionRefs는 부모의 useRef 객체라 참조가 고정 → 마운트 시 1회만 실행됨
    }, [sectionRefs]);

    useEffect(() => {
        if (data?.reviews) {
            setReviewStates(data.reviews.map((r) => ({
                reviewId: r.reviewId,
                isLiked: false,
                likeCount: r.likeCount ?? 0,
            })));
        }
    }, [data]);


    if (!data) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-honey-yellow/20 border-t-honey-yellow rounded-full animate-spin" />
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Loading Experience</p>
            </div>
        </div>
    );

    const applyStayChange = () => {
        setCheckIn(tempCheckIn);
        setCheckOut(tempCheckOut);
        setGuests(tempGuests);
        setShowChangeModal(false);
    };

    return (
        <div className="max-w-7xl mx-auto pb-20 space-y-12">

            {/* 1. Header Navigation */}
            <div className="flex justify-between items-center px-6 pt-4">
                <button
                    onClick={() => window.history.back()}
                    className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-deep-gray transition-colors group"
                >
                    <HiOutlineArrowNarrowLeft className="text-xl transition-transform group-hover:-translate-x-1" />
                    <span>Back to List</span>
                </button>
            </div>

            {/* 2. Image Gallery Slider */}
            <AccommodationGallery images={data.images} />

            {/* 3. Info & Floating Bar Wrapper */}
            <div className="px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

                {/* Left: Main Content */}
                <div className="lg:col-span-8 space-y-16">
                    <AccommodationSummary
                        data={data}
                        accommodationId={accommodationId}
                        isWished={isWished}
                        userId={userId}
                    />

                    <RoomList
                        rooms={data.rooms}
                        checkIn={checkIn}
                        checkOut={checkOut}
                        guests={guests}
                        sectionRefs={sectionRefs}
                    />

                    <InfoSection
                        intro={data.intro}
                        facilities={data.facilities}
                        usage={data.usage}
                        sectionRefs={sectionRefs}
                    />

                    <MapSection
                        location={data.location}
                        address={data.address}
                        sectionRefs={sectionRefs}
                    />

                    {data.company && (
                        <CompanySection
                            company={data.company}
                            onInquiry={() => setShowInquiryModal(true)}
                            sectionRefs={sectionRefs}
                        />
                    )}

                    <ReviewSection
                        reviews={data.reviews}
                        reviewStates={reviewStates}
                        sectionRefs={sectionRefs}
                    />
                </div>

                {/* Right: Sticky Booking Widget */}
                <BookingSidebar
                    checkIn={checkIn}
                    checkOut={checkOut}
                    guests={guests}
                    price={data.price}
                    onModify={() => setShowChangeModal(true)}
                />
            </div>

            {/* 일정·인원 변경 모달 (+ 날짜 선택 모달) */}
            <StayChangeModal
                isOpen={showChangeModal}
                onClose={() => setShowChangeModal(false)}
                isDateRangeOpen={showDateRangeModal}
                setIsDateRangeOpen={setShowDateRangeModal}
                tempCheckIn={tempCheckIn}
                tempCheckOut={tempCheckOut}
                tempGuests={tempGuests}
                setTempCheckIn={setTempCheckIn}
                setTempCheckOut={setTempCheckOut}
                setTempGuests={setTempGuests}
                isChangeReady={isChangeReady}
                onApply={applyStayChange}
            />

            {/* Inquiry Modal */}
            <AnimatePresence>
                {showInquiryModal && (
                    <InquiryModal
                        onClose={() => setShowInquiryModal(false)}
                        accommodationId={accommodationId}
                        userId={userId}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

export default Accommodation;
