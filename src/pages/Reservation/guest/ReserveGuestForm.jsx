import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    FaCreditCard,
    FaMobileAlt,
    FaMoneyCheckAlt
} from "react-icons/fa";
import SafeImage from "@/components/SafeImage.jsx";
import { toast } from "react-toastify";
import { FaChevronDown, FaMapMarkerAlt, FaBed, FaCalendarAlt, FaUsers } from "react-icons/fa";
import Button from "@/components/ui/Button.jsx";
import Input from "@/components/ui/Input.jsx";
import SectionTitle from "@/components/ui/SectionTitle.jsx";
import { cardClass, inputClass, labelClass, eyebrowClass } from "@/components/ui/styles";

export default function ReserveGuestForm() {
    const navigate = useNavigate();
    const { state } = useLocation();

    const {
        roomId,
        checkIn,
        checkOut,
        guests,
        originalPrice,
        accommodationName,
        accommodationThumbnail,
        accommodationAddress,
        roomName
    } = state;

    const [form, setForm] = useState({
        guestName: "",
        guestPhone: "",
        guestPassword: "",
        specialRequest: ""
    });

    const [paymentMethod, setPaymentMethod] = useState("");

    // 약관 상태
    const [agreements, setAgreements] = useState({
        privacy: false,
        cancellation: false,
        marketing: false
    });

    const [open, setOpen] = useState({
        privacy: false,
        cancellation: false,
        marketing: false
    });

    const agreementsData = [
        {
            key: "privacy",
            label: "개인정보 수집 및 이용 동의",
            required: true,
            content: `1. 수집 항목: 이름, 연락처, 예약 확인용 비밀번호 등
2. 수집 목적: 예약 확인, 고객 문의 처리, 서비스 개선
3. 보관 기간: 예약 완료 후 1년간 보관 후 폐기
4. 제3자 제공: 법적 의무가 있는 경우 외에는 제공하지 않음
5. 동의 거부 권리: 동의 거부 시 예약 진행 불가`
        },
        {
            key: "cancellation",
            label: "취소 및 환불 정책 동의",
            required: true,
            content: `1. 취소 요청은 체크인 전까지 가능
2. 체크인 7일 전 취소: 100% 환불
3. 체크인 3~6일 전 취소: 50% 환불
4. 체크인 2일 전 ~ 당일 취소: 환불 불가
5. 예약 변경 시, 동일 정책 적용`
        },
        {
            key: "marketing",
            label: "마케팅 정보 수신 동의",
            required: false,
            content: `1. 프로모션, 이벤트, 할인 정보 제공
2. 수신 거부 가능
3. 동의 여부와 관계없이 서비스 이용 가능`
        }
    ];

    const handleAllAgree = () => {
        const allChecked = Object.values(agreements).every(Boolean);
        setAgreements({
            privacy: !allChecked,
            cancellation: !allChecked,
            marketing: !allChecked
        });
    };

    const isFormValid =
        form.guestName.trim() &&
        form.guestPhone.trim() &&
        form.guestPassword.trim() &&
        paymentMethod &&
        agreements.privacy &&
        agreements.cancellation;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        if (!isFormValid) {
            toast.error("필수 정보를 모두 입력하고 약관에 동의해주세요.");
            return;
        }

        const payload = {
            roomId,
            checkIn,
            checkOut,
            guests,
            guestName: form.guestName,
            guestPhone: form.guestPhone,
            guestPassword: form.guestPassword,
            specialRequest: form.specialRequest,
            paymentMethod,
            finalPrice: originalPrice,
            accommodationName,
            accommodationAddress,
            roomName
        };

        navigate("/payment/process", { state: payload });
    };

    const paymentOptions = [
        { value: "CARD", label: "카드 결제", icon: <FaCreditCard /> },
        { value: "TOSS", label: "간편 결제", icon: <FaMobileAlt /> },
        { value: "BANK", label: "무통장 입금", icon: <FaMoneyCheckAlt /> }
    ];

    return (
        <div className="max-w-6xl mx-auto px-4 py-10">
            <SectionTitle eyebrow="Guest Reservation" title="비회원 예약" description="예약자 정보를 입력하고 결제를 진행해 주세요." className="mb-8" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 좌측: 예약자 정보 입력 */}
                <div className="lg:col-span-2 space-y-6 min-w-0">
                    <div className={`${cardClass} p-6 space-y-5`}>
                        <h2 className="text-lg font-black text-deep-gray">예약자 정보 입력</h2>

                        {[
                            { label: "예약자 이름", name: "guestName", required: true, autoComplete: "name" },
                            { label: "연락처", name: "guestPhone", required: true, autoComplete: "tel" },
                            { label: "예약 확인용 비밀번호", name: "guestPassword", required: true, placeholder: "숫자 4자리", autoComplete: "new-password" }
                        ].map(({ label, name, required, placeholder, autoComplete }) => (
                            <Input
                                key={name}
                                label={<>{label} {required && <span className="text-red-400">*</span>}</>}
                                type={name === "guestPassword" ? "password" : name === "guestPhone" ? "tel" : "text"}
                                name={name}
                                required={required}
                                value={form[name]}
                                onChange={handleChange}
                                placeholder={placeholder || ""}
                                autoComplete={autoComplete}
                            />
                        ))}

                        <div>
                            <label htmlFor="guest-specialRequest" className={labelClass}>
                                요청사항 <span className="text-gray-300">(선택)</span>
                            </label>
                            <textarea
                                id="guest-specialRequest"
                                name="specialRequest"
                                value={form.specialRequest}
                                onChange={handleChange}
                                className={`${inputClass} h-28 resize-none`}
                            />
                        </div>
                    </div>

                    {/* 결제 수단 */}
                    <div className={`${cardClass} p-6`}>
                        <h3 className="text-sm font-black text-deep-gray mb-3">결제 수단 선택</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3" role="radiogroup" aria-label="결제 수단">
                            {paymentOptions.map(option => (
                                <button
                                    type="button"
                                    key={option.value}
                                    role="radio"
                                    aria-checked={paymentMethod === option.value}
                                    onClick={() => setPaymentMethod(option.value)}
                                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-honey-yellow/30 ${
                                        paymentMethod === option.value
                                            ? "bg-honey-yellow text-deep-gray border-honey-yellow shadow-lg shadow-honey-yellow/20"
                                            : "bg-white text-deep-gray border-gray-100 hover:border-honey-yellow"
                                    }`}
                                >
                                    {option.icon}
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 우측: 숙소 정보 카드 + 약관 + 결제 */}
                <div className="space-y-6 lg:sticky lg:top-24 self-start min-w-0">
                    <div className={`${cardClass} p-6`}>
                        <div className="flex items-center gap-4 mb-6">
                            <SafeImage
                                src={accommodationThumbnail}
                                alt="숙소 썸네일"
                                className="w-16 h-16 shrink-0 object-cover rounded-2xl"
                            />
                            <div className="min-w-0">
                                <h3 className="text-lg font-black text-deep-gray leading-tight break-keep">{accommodationName}</h3>
                                <p className="text-xs text-gray-400 flex items-start gap-1 mt-1">
                                    <FaMapMarkerAlt className="shrink-0 mt-0.5" />
                                    <span className="break-keep">{accommodationAddress}</span>
                                </p>
                            </div>
                        </div>
                        <dl className="space-y-4">
                            <div>
                                <dt className={`${eyebrowClass} flex items-center gap-1.5`}><FaBed /> 객실</dt>
                                <dd className="text-sm font-bold text-deep-gray mt-1 break-keep">{roomName}</dd>
                            </div>
                            <div>
                                <dt className={`${eyebrowClass} flex items-center gap-1.5`}><FaCalendarAlt /> 날짜</dt>
                                <dd className="text-sm font-bold text-deep-gray mt-1">{checkIn} ~ {checkOut}</dd>
                            </div>
                            <div>
                                <dt className={`${eyebrowClass} flex items-center gap-1.5`}><FaUsers /> 인원</dt>
                                <dd className="text-sm font-bold text-deep-gray mt-1">{guests}명</dd>
                            </div>
                        </dl>
                        <div className="border-t border-gray-100 pt-4 mt-6 flex justify-between items-end gap-2">
                            <span className="font-black text-deep-gray">총 금액</span>
                            <span className="text-2xl font-black text-deep-gray">{originalPrice.toLocaleString()}원</span>
                        </div>
                    </div>

                    {/* 약관 아코디언 */}
                    <div className={`${cardClass} p-6 space-y-3`}>
                        {/* 전체 동의 */}
                        <label className="flex items-center gap-3 cursor-pointer select-none pb-3 border-b border-gray-100">
                            <input
                                type="checkbox"
                                checked={Object.values(agreements).every(Boolean)}
                                onChange={handleAllAgree}
                                className="w-4 h-4 shrink-0 accent-leaf-green"
                            />
                            <span className="text-sm font-black text-deep-gray">전체 동의</span>
                        </label>

                        {/* 각 약관 */}
                        {agreementsData.map(({ key, label, required, content }) => (
                            <div key={key} className="flex flex-col">
                                <div className="flex items-center gap-2">
                                    <label className="flex items-center gap-3 cursor-pointer select-none min-w-0">
                                        <input
                                            type="checkbox"
                                            checked={agreements[key]}
                                            onChange={() =>
                                                setAgreements(prev => ({ ...prev, [key]: !prev[key] }))
                                            }
                                            className="w-4 h-4 shrink-0 accent-leaf-green"
                                        />
                                        <span className="text-sm text-gray-600 font-medium break-keep">
                                            {label}
                                            {required
                                                ? <span className="ml-1 text-red-400 font-bold">(필수)</span>
                                                : <span className="ml-1 text-gray-400">(선택)</span>}
                                        </span>
                                    </label>

                                    {/* 자세히보기 버튼 */}
                                    <button
                                        type="button"
                                        onClick={() => setOpen(prev => ({ ...prev, [key]: !prev[key] }))}
                                        aria-expanded={open[key]}
                                        aria-label={`${label} ${open[key] ? "상세 닫기" : "상세 보기"}`}
                                        className="ml-auto shrink-0 p-1 rounded-lg text-gray-400 hover:text-deep-gray hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-honey-yellow/40"
                                    >
                                        <FaChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${open[key] ? "rotate-180" : ""}`} />
                                    </button>
                                </div>

                                {/* 내용 펼치기 */}
                                {open[key] && (
                                    <div className="bg-off-white p-4 mt-2 text-xs text-gray-500 leading-relaxed rounded-2xl whitespace-pre-line break-words">
                                        {content}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <Button
                        onClick={handleSubmit}
                        disabled={!isFormValid}
                        size="lg"
                        fullWidth
                    >
                        예약 진행하기 ({originalPrice.toLocaleString()}원)
                    </Button>
                </div>
            </div>
        </div>
    );
}
