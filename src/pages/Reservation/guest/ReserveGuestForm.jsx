import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    FaCreditCard,
    FaMobileAlt,
    FaMoneyCheckAlt
} from "react-icons/fa";
import SafeImage from "@/components/SafeImage.jsx";

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
            alert("필수 정보를 모두 입력하고 약관에 동의해주세요.");
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
        <div className="max-w-6xl mx-auto py-10 px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 좌측: 예약자 정보 입력 */}
            <div className="bg-white shadow-md rounded-lg p-6 space-y-5">
                <h2 className="text-lg font-bold text-gray-800">예약자 정보 입력</h2>

                {[
                    { label: "예약자 이름", name: "guestName", required: true },
                    { label: "연락처", name: "guestPhone", required: true },
                    { label: "예약 확인용 비밀번호", name: "guestPassword", required: true, placeholder: "숫자 4자리" }
                ].map(({ label, name, required, placeholder }) => (
                    <div key={name}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {label} {required && <span className="text-red-500">*</span>}
                        </label>
                        <input
                            type={name === "guestPassword" ? "password" : "text"}
                            name={name}
                            required={required}
                            value={form[name]}
                            onChange={handleChange}
                            placeholder={placeholder || ""}
                            className="w-full border px-4 py-2 rounded focus:ring-2 focus:ring-yellow-300"
                        />
                    </div>
                ))}

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        요청사항 (선택)
                    </label>
                    <textarea
                        name="specialRequest"
                        value={form.specialRequest}
                        onChange={handleChange}
                        className="w-full border px-4 py-2 rounded"
                    />
                </div>

                {/* 결제 수단 */}
                <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">결제 수단</h3>
                    <div className="flex gap-3 flex-wrap">
                        {paymentOptions.map(option => (
                            <button
                                key={option.value}
                                onClick={() => setPaymentMethod(option.value)}
                                className={`flex items-center gap-2 px-4 py-2 rounded border ${
                                    paymentMethod === option.value
                                        ? "bg-yellow-400 text-white"
                                        : "bg-white text-gray-700"
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
            <div className="space-y-6">
                <div className="bg-white shadow-md rounded-lg p-6">
                    <div className="flex items-center gap-4 mb-4">
                        <SafeImage
                            src={accommodationThumbnail}
                            alt="숙소 썸네일"
                            className="w-16 h-16 object-cover rounded"
                        />
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800">{accommodationName}</h3>
                            <p className="text-sm text-gray-500">{accommodationAddress}</p>
                        </div>
                    </div>
                    <p className="text-sm"><strong>객실:</strong> {roomName}</p>
                    <p className="text-sm"><strong>날짜:</strong> {checkIn} ~ {checkOut}</p>
                    <p className="text-sm"><strong>인원:</strong> {guests}명</p>
                    <p className="text-sm font-semibold mt-2 text-yellow-600">
                        총 금액: {originalPrice.toLocaleString()}원
                    </p>
                </div>

                {/* 약관 아코디언 */}
                <div className="bg-white shadow-sm rounded-lg p-4 space-y-2 text-sm">
                    {/* 전체 동의 */}
                    <label className="flex items-center gap-2 font-semibold">
                        <input
                            type="checkbox"
                            checked={Object.values(agreements).every(Boolean)}
                            onChange={handleAllAgree}
                        />
                        전체 동의
                    </label>

                    {/* 각 약관 */}
                    {agreementsData.map(({ key, label, required, content }) => (
                        <div key={key} className="border-b py-2">
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={agreements[key]}
                                    onChange={() =>
                                        setAgreements(prev => ({ ...prev, [key]: !prev[key] }))
                                    }
                                />
                                {label} {required && <span className="text-red-500">*</span>}
                            </label>

                            {/* 자세히보기 버튼 */}
                            <button
                                onClick={() => setOpen(prev => ({ ...prev, [key]: !prev[key] }))}
                                className="text-blue-500 text-xs mt-1 flex items-center gap-1"
                            >
                                자세히보기
                                <span className={`inline-block transition-transform ${open[key] ? "rotate-180" : "rotate-0"}`}>
                                    ▼
                                </span>
                            </button>

                            {/* 내용 펼치기 */}
                            {open[key] && (
                                <div className="bg-gray-50 p-2 mt-1 text-xs text-gray-700 rounded whitespace-pre-line">
                                    {content}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={!isFormValid}
                    className={`w-full mt-2 py-3 rounded font-semibold ${
                        isFormValid
                            ? "bg-yellow-400 hover:bg-yellow-500 text-white"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                >
                    예약 진행하기 ({originalPrice.toLocaleString()}원)
                </button>
            </div>
        </div>
    );
}