import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Slider from "react-slick";
import axios from "axios";
import {
    AiOutlineLeft,
    AiOutlineRight,
} from "react-icons/ai";
import {
    FaCalendarAlt, FaEnvelope,
    FaMapMarkerAlt, FaPhoneAlt,
    FaStar,
    FaThumbsDown,
    FaThumbsUp,
    FaUserFriends,
} from "react-icons/fa";
import { HiLocationMarker, HiStar, HiInformationCircle, HiChevronRight, HiOutlineArrowNarrowLeft } from "react-icons/hi";
import * as FaIcons from "react-icons/fa";
import * as RiIcons from "react-icons/ri";
import * as MdIcons from "react-icons/md";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import WishToggleButton from "@/components/WishToggleButton.jsx";
import { useAuth } from "@/hooks/useAuth";
import GoogleMapView from "@/pages/Accommodations/Accommodation/GoogleMapView.jsx";
import DateRangeModal from "@/pages/Home/searchBox/DateRangeModal.jsx";
import {FiCalendar} from "react-icons/fi";
import InquiryModal from "@/components/InquiryModal.jsx";
import { motion, AnimatePresence } from "framer-motion";
import SafeImage from "@/components/SafeImage.jsx";

const MotionDiv = motion.div;

function Accommodation({ accommodationId, sectionRefs }) {
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    const { user } = useAuth();
    const userId = user?.userId;

    function formatDate(date) {
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const dd = String(date.getDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}`;
    }

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const defaultCheckIn = searchParams.get("checkIn") || formatDate(today);
    const defaultCheckOut = searchParams.get("checkOut") || formatDate(tomorrow);
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

        axios.get(`/api/accommodations/${accommodationId}`, { params })
            .then((res) => {
                setData(res.data);
                setIsWished(res.data.wished);
            })
            .catch((err) => console.error("숙소 상세 불러오기 실패:", err));
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
    }, []);

    useEffect(() => {
        if (data?.reviews) {
            setReviewStates(data.reviews.map((r) => ({
                reviewId: r.reviewId,
                isLiked: false,
                likeCount: r.likeCount ?? 0,
            })));
        }
    }, [data]);

    const SlickArrow = ({ direction, onClick }) => (
        <button
            onClick={onClick}
            className={`absolute top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-deep-gray hover:text-honey-yellow shadow-xl transition-all active:scale-90 ${direction === 'left' ? 'left-6' : 'right-6'}`}
        >
            {direction === 'left' ? <AiOutlineLeft /> : <AiOutlineRight />}
        </button>
    );

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 800,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000,
        prevArrow: <SlickArrow direction="left" />,
        nextArrow: <SlickArrow direction="right" />,
    };

    if (!data) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-honey-yellow/20 border-t-honey-yellow rounded-full animate-spin" />
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Loading Experience</p>
            </div>
        </div>
    );

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
            <section className="px-6">
                <div className="rounded-[3rem] overflow-hidden shadow-2xl shadow-gray-200">
                    <Slider {...sliderSettings}>
                        {data.images.map((src, i) => (
                            <div key={i} className="h-[400px] md:h-[600px]">
                                <SafeImage
                                    src={src}
                                    alt={`Gallery ${i + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ))}
                    </Slider>
                </div>
            </section>

            {/* 3. Info & Floating Bar Wrapper */}
            <div className="px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                
                {/* Left: Main Content */}
                <div className="lg:col-span-8 space-y-16">
                    
                    {/* Basic Info */}
                    <header className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-leaf-green">
                                <HiLocationMarker />
                                <span className="text-xs font-black uppercase tracking-widest">{data.category} · {data.address}</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-deep-gray tracking-tight leading-tight">
                                {data.name}
                            </h1>
                        </div>

                        <div className="flex flex-wrap items-center gap-6 pt-2">
                            <div className="flex items-center gap-2 px-4 py-2 bg-honey-yellow/10 rounded-2xl">
                                <HiStar className="text-honey-yellow text-xl" />
                                <span className="text-lg font-black text-honey-yellow-dark">{data.rating.toFixed(1)}</span>
                            </div>
                            <div className="h-4 w-px bg-gray-200" />
                            <p className="text-sm font-bold text-gray-400">리뷰 <span className="text-deep-gray">{data.reviewCount}개</span></p>
                            <div className="h-4 w-px bg-gray-200" />
                            <div className="flex items-center gap-2">
                                <WishToggleButton
                                    accommodationId={accommodationId}
                                    initialLiked={isWished}
                                    userId={userId}
                                />
                                <span className="text-sm font-bold text-gray-400">관심 숙소 등록</span>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 pt-4">
                            {data.tags.map((tag, i) => (
                                <span key={i} className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl flex items-center gap-2 text-xs font-bold text-gray-500">
                                    {tag.iconName && (FaIcons[tag.iconName] || RiIcons[tag.iconName] || MdIcons[tag.iconName]) &&
                                        React.createElement(FaIcons[tag.iconName] || RiIcons[tag.iconName] || MdIcons[tag.iconName], { className: "text-honey-yellow" })}
                                    {tag.name}
                                </span>
                            ))}
                        </div>
                    </header>

                    {/* Rooms Selection */}
                    <section id="rooms" ref={(el) => (sectionRefs.current["rooms"] = el)} className="space-y-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-leaf-green/10 flex items-center justify-center">
                                <HiInformationCircle className="text-leaf-green text-xl" />
                            </div>
                            <h2 className="text-2xl font-black text-deep-gray">객실 선택</h2>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            {data.rooms.map((room, i) => {
                                const isAvailable = room.available;
                                const imageUrl = room.images?.find((img) => img.includes("s_")) || room.images?.[0];
                                return (
                                    <MotionDiv
                                        key={i}
                                        whileHover={isAvailable ? { y: -5 } : {}}
                                        onClick={() => isAvailable && navigate(`/room/${room.roomId}?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`)}
                                        className={`flex flex-col md:flex-row gap-6 p-6 bg-white rounded-[2rem] border border-gray-100 shadow-sm transition-all duration-300 ${isAvailable ? "hover:shadow-2xl hover:shadow-leaf-green/5 cursor-pointer" : "opacity-40 grayscale pointer-events-none"}`}
                                    >
                                        <div className="w-full md:w-56 h-40 overflow-hidden rounded-2xl">
                                            <SafeImage src={imageUrl} alt={room.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between py-2">
                                            <div className="space-y-2">
                                                <h3 className="text-xl font-black text-deep-gray">{room.name}</h3>
                                                <div className="flex items-center gap-2 text-gray-400 text-sm font-bold uppercase tracking-wider">
                                                    <FaUserFriends size={14} />
                                                    <span>기준 {room.standardOccupancy}명 / 최대 {room.maxOccupancy}명</span>
                                                </div>
                                            </div>
                                            <div className="mt-4 flex items-center justify-between border-t border-gray-50 pt-4">
                                                <p className="text-2xl font-black text-leaf-green">
                                                    {isAvailable ? `₩${room.price.toLocaleString()}` : "예약 마감"}
                                                </p>
                                                {isAvailable && (
                                                    <div className="flex items-center gap-2 text-sm font-bold text-gray-300">
                                                        <span>객실 상세보기</span>
                                                        <HiChevronRight />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </MotionDiv>
                                );
                            })}
                        </div>
                    </section>

                    {/* Introduction */}
                    <section id="intro" ref={(el) => (sectionRefs.current["intro"] = el)} className="space-y-6 bg-gray-50 rounded-[2.5rem] p-10 border border-gray-100">
                        <h2 className="text-2xl font-black text-deep-gray">숙소 소개</h2>
                        <div className="text-gray-600 leading-relaxed font-medium space-y-4">
                            {data.intro.split("\n\n").map((line, idx) => (
                                <p key={idx}>{line}</p>
                            ))}
                        </div>
                    </section>

                    {/* Facilities & Policies */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <section id="facilities" ref={(el) => (sectionRefs.current["facilities"] = el)} className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-4">
                            <h2 className="text-xl font-black text-deep-gray">서비스 및 시설</h2>
                            <ul className="grid grid-cols-1 gap-3">
                                {data.facilities.map((f, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm font-bold text-gray-400">
                                        <div className="w-1.5 h-1.5 rounded-full bg-honey-yellow" />
                                        {f}
                                    </li>
                                ))}
                            </ul>
                        </section>
                        <section id="usage" ref={(el) => (sectionRefs.current["usage"] = el)} className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-4">
                            <h2 className="text-xl font-black text-deep-gray">이용 정보</h2>
                            <p className="text-sm font-medium text-gray-500 leading-relaxed">{data.usage}</p>
                        </section>
                    </div>

                    {/* Location Map */}
                    <section id="location" ref={(el) => (sectionRefs.current["location"] = el)} className="space-y-6">
                        <h2 className="text-2xl font-black text-deep-gray">위치 안내</h2>
                        <div className="w-full h-[400px] rounded-[2.5rem] overflow-hidden shadow-xl border border-gray-100">
                            {data.location && (
                                <GoogleMapView
                                    lat={data.location.latitude}
                                    lng={data.location.longitude}
                                />
                            )}
                        </div>
                        <div className="flex items-center gap-3 px-6 py-4 bg-gray-50 rounded-2xl">
                            <FaMapMarkerAlt className="text-red-500" />
                            <span className="text-sm font-bold text-deep-gray">{data.address}</span>
                        </div>
                    </section>

                    {/* Company Info */}
                    {data.company && (
                        <section id="company" ref={(el) => (sectionRefs.current["company"] = el)} className="bg-deep-gray rounded-[2.5rem] p-10 text-white space-y-6 shadow-2xl">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Vendor Information</p>
                                    <h2 className="text-2xl font-black">{data.company.name}</h2>
                                </div>
                                <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm">
                                    <FaPhoneAlt className="text-honey-yellow" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm font-medium text-gray-300">
                                <p><strong>대표자:</strong> {data.company.ownerName}</p>
                                <p><strong>전화:</strong> {data.company.phone}</p>
                                <p className="md:col-span-2"><strong>이메일:</strong> {data.company.email}</p>
                                <p className="md:col-span-2"><strong>주소:</strong> {data.company.address}</p>
                            </div>
                            <div className="pt-6 border-t border-white/10 flex gap-4">
                                <a href={`tel:${data.company.phone}`} className="flex-1 py-4 bg-honey-yellow text-white rounded-2xl text-center font-black hover:bg-honey-yellow-dark transition-all">전화 문의</a>
                                <button onClick={() => setShowInquiryModal(true)} className="flex-1 py-4 bg-white/10 backdrop-blur-sm text-white rounded-2xl text-center font-black hover:bg-white/20 transition-all">1:1 문의하기</button>
                            </div>
                        </section>
                    )}

                    {/* Reviews */}
                    <section id="reviews" ref={(el) => (sectionRefs.current["reviews"] = el)} className="space-y-8 pb-12">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-black text-deep-gray">고객 리뷰</h2>
                            <span className="px-4 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-400">{data.reviews.length} total reviews</span>
                        </div>
                        <div className="space-y-6">
                            {data.reviews.length === 0 ? (
                                <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-[2rem]">
                                    <p className="text-gray-300 font-bold uppercase tracking-widest text-xs">No reviews yet</p>
                                </div>
                            ) : (
                                data.reviews.map((r, i) => {
                                    const state = reviewStates.find((s) => s.reviewId === r.reviewId);
                                    const isLiked = state?.isLiked ?? false;
                                    const likeCount = state?.likeCount ?? 0;
                                    return (
                                        <div key={i} className="p-8 bg-white rounded-[2rem] border border-gray-50 shadow-sm space-y-6">
                                            <div className="flex justify-between items-start">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-full bg-honey-yellow/10 flex items-center justify-center font-black text-honey-yellow-dark">
                                                        {r.nickname[0]}
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-deep-gray">{r.nickname}</p>
                                                        <div className="flex items-center gap-1 text-honey-yellow mt-0.5">
                                                            <HiStar />
                                                            <span className="text-xs font-black">{r.rating}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <span className="text-xs font-bold text-gray-300 tracking-wider uppercase">
                                                    {new Date(r.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-gray-600 font-medium leading-relaxed">{r.content}</p>
                                            {r.images?.length > 0 && (
                                                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                                    {r.images.map((url, idx) => (
                                                        <SafeImage key={idx} src={url} alt="Review" className="w-24 h-24 rounded-2xl object-cover border border-gray-100" />
                                                    ))}
                                                </div>
                                            )}
                                            <div className="pt-4 border-t border-gray-50 flex items-center gap-6">
                                                <button className="flex items-center gap-2 text-gray-300 hover:text-red-400 transition-colors text-xs font-bold uppercase tracking-widest">
                                                    <FaThumbsDown />
                                                    <span>Helpful?</span>
                                                </button>
                                                <button onClick={() => {}} className={`flex items-center gap-2 ${isLiked ? 'text-leaf-green' : 'text-gray-300'} hover:text-leaf-green transition-colors text-xs font-bold uppercase tracking-widest`}>
                                                    <FaThumbsUp />
                                                    <span>Like {likeCount}</span>
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </section>
                </div>

                {/* Right: Sticky Booking Widget */}
                <aside className="lg:col-span-4 sticky top-24">
                    <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-2xl space-y-8">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Stay Duration</p>
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-black text-deep-gray tracking-tight">일정 및 인원</h3>
                                <button
                                    onClick={() => setShowChangeModal(true)}
                                    className="text-xs font-black text-honey-yellow-dark hover:underline"
                                >
                                    Modify
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="p-4 bg-gray-50 rounded-2xl space-y-3">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-bold text-gray-400">Check-in</span>
                                    <span className="font-black text-deep-gray">{checkIn}</span>
                                </div>
                                <div className="h-px bg-gray-200/50" />
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-bold text-gray-400">Check-out</span>
                                    <span className="font-black text-deep-gray">{checkOut}</span>
                                </div>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-2xl flex justify-between items-center text-sm">
                                <span className="font-bold text-gray-400">Guests</span>
                                <span className="font-black text-deep-gray">{guests}명</span>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Starts from</span>
                                <p className="text-3xl font-black text-leaf-green">₩{data.price.toLocaleString()}</p>
                            </div>
                            <button
                                onClick={() => document.getElementById('rooms').scrollIntoView({ behavior: 'smooth' })}
                                className="px-6 py-4 bg-honey-yellow text-white rounded-2xl font-black shadow-lg shadow-honey-yellow/20 hover:scale-105 active:scale-95 transition-all"
                            >
                                Book Now
                            </button>
                        </div>
                    </div>
                </aside>
            </div>

            {/* Change Modal */}
            <AnimatePresence>
                {showChangeModal && (
                    <>
                        <MotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowChangeModal(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]" />
                        <MotionDiv initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="fixed inset-0 z-[210] flex items-center justify-center p-6">
                            <div className="bg-white rounded-[2.5rem] shadow-2xl p-10 max-w-md w-full space-y-8 relative">
                                <div className="text-center space-y-2">
                                    <h2 className="text-2xl font-black text-deep-gray tracking-tight">예약 정보 변경</h2>
                                    <p className="text-sm text-gray-400 font-medium">원하시는 일정과 인원을 다시 선택해 주세요.</p>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">Date Range</label>
                                        <button onClick={() => setShowDateRangeModal(true)} className="w-full flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-honey-yellow/30 transition-all">
                                            <span className="font-bold text-deep-gray">{tempCheckIn && tempCheckOut ? `${tempCheckIn} - ${tempCheckOut}` : "날짜 선택"}</span>
                                            <FaCalendarAlt className="text-honey-yellow" />
                                        </button>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">Guests Count</label>
                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                                            <button onClick={() => setTempGuests(prev => Math.max(1, parseInt(prev) - 1))} className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center hover:bg-gray-100 active:scale-90 transition-all font-bold text-xl text-deep-gray">−</button>
                                            <span className="text-xl font-black text-deep-gray">{tempGuests}명</span>
                                            <button onClick={() => setTempGuests(prev => Math.min(10, parseInt(prev) + 1))} className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center hover:bg-gray-100 active:scale-90 transition-all font-bold text-xl text-deep-gray">＋</button>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => { setCheckIn(tempCheckIn); setCheckOut(tempCheckOut); setGuests(tempGuests); setShowChangeModal(false); }}
                                    className="w-full py-4 bg-honey-yellow text-white rounded-2xl font-black shadow-lg shadow-honey-yellow/20 hover:bg-honey-yellow-dark transition-all disabled:opacity-30"
                                    disabled={!isChangeReady}
                                >
                                    변경 사항 적용하기
                                </button>
                                <button onClick={() => setShowChangeModal(false)} className="absolute top-6 right-6 text-gray-300 hover:text-deep-gray transition-colors">Close</button>
                            </div>
                        </MotionDiv>
                    </>
                )}
            </AnimatePresence>

            {/* Date Range Modal (Nested) */}
            <AnimatePresence>
                {showDateRangeModal && (
                    <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
                        <MotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowDateRangeModal(false)} className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
                        <MotionDiv initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="relative bg-white rounded-[2.5rem] shadow-2xl p-6">
                            <DateRangeModal
                                isOpen={showDateRangeModal}
                                onClose={() => setShowDateRangeModal(false)}
                                onSelect={({ checkIn: ni, checkOut: no }) => { setTempCheckIn(ni); setTempCheckOut(no); setShowDateRangeModal(false); }}
                                startDate={tempCheckIn}
                                endDate={tempCheckOut}
                            />
                        </MotionDiv>
                    </div>
                )}
            </AnimatePresence>

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
