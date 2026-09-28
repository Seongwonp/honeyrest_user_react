import React, {useState, useEffect, useRef} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {
    FaUserAlt,
    FaPhoneAlt,
    FaStickyNote,
    FaTicketAlt,
    FaBed,
    FaCalendarAlt,
    FaUserFriends,
    FaShieldAlt,
    FaMapMarkerAlt,
    FaCreditCard,
    FaMobileAlt,
    FaMoneyCheckAlt,
    FaArrowLeft, FaCoins,
} from "react-icons/fa";
import SafeImage from "@/components/SafeImage.jsx";

export default function Reservation() {
    const navigate = useNavigate();
    const {state} = useLocation();
    const [agree, setAgree] = useState(false);

    // 새로고침이나 이 URL로 직접 접근하면 location.state가 없어 이전에는 구조분해 단계에서
    // 바로 크래시가 났다(백지 화면, P0-1). 안전한 페이지로 되돌려보낸다.
    useEffect(() => {
        if (!state) {
            navigate("/accommodations", {replace: true});
        }
    }, [state, navigate]);

    // 동의 항목 및 상태 관리
    const [agreements, setAgreements] = useState({
        privacy: false,
        cancellation: false,
        email: false
    });
    const [expanded, setExpanded] = useState({
        privacy: false,
        cancellation: false,
        email: false
    });
    // toggle 세부내용
    const toggleDetail = (key) => {
        setExpanded(prev => ({...prev, [key]: !prev[key]}));
    };
    // 전체 동의 체크
    const allRequiredAgreed = agreements.privacy && agreements.cancellation;
    // 외부 상태 연동 (결제 버튼 등)
    useEffect(() => {
        setAgree(allRequiredAgreed);
    }, [allRequiredAgreed]);

    const {
        roomId,
        checkIn,
        checkOut,
        guests,
        userId,
        userName,
        userPhone,
        accommodationName,
        accommodationThumbnail,
        accommodationAddress,
        roomName,
        cancellationPolicy = [],
        availableCoupons = [],
        availablePoints = 0
    } = state ?? {};

    // 결제 기준 금액은 서버(/api/reserve/form-info)가 계산한 originalPrice(객실가 + 추가 인원 요금)를 그대로 사용한다.
    // 클라이언트에서 다시 계산하지 않으며, 서버 값이 없을 때만 상세 페이지의 totalPrice로 대체한다.
    const originalPrice = Number(state?.originalPrice ?? state?.totalPrice ?? 0) || 0;

    // 결제 버튼 중복 클릭 방지
    const submittingRef = useRef(false);
    const [submitting, setSubmitting] = useState(false);

    const [form, setForm] = useState({
        guestName: userName || "",
        guestPhone: userPhone || "",
        specialRequest: "",
        couponId: "",
        usedPoint:0
    });

    const [selectedCoupon, setSelectedCoupon] = useState(null);
    const [discountAmount, setDiscountAmount] = useState(0);
    const [finalPrice, setFinalPrice] = useState(originalPrice);

    useEffect(() => {
        let discount = 0;
        if (form.couponId) {
            const coupon = availableCoupons.find(c => String(c.couponId) === String(form.couponId));
            if (coupon) {
                setSelectedCoupon(coupon);
                if (coupon.discountType === "PERCENT") {
                    discount = originalPrice * (coupon.discountValue / 100);
                    if (coupon.maxOrderAmount && discount > coupon.maxOrderAmount) {
                        discount = coupon.maxOrderAmount;
                    }
                } else {
                    discount = coupon.discountValue;
                }
            }
        }

        const pointDiscount = Math.min(form.usedPoint || 0, availablePoints);
        const totalDiscount = Math.floor(discount) + pointDiscount;
        const final = Math.max(originalPrice - totalDiscount, 0);

        setDiscountAmount(Math.floor(discount));
        setFinalPrice(final);
    }, [form.couponId, form.usedPoint, originalPrice, availableCoupons, availablePoints]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        // 포인트 입력일 경우 제한 처리
        if (name === "usedPoint") {
            let point = parseInt(value, 10);
            if (isNaN(point)) point = 0;
            if (point < 0) point = 0;
            if (point > availablePoints) point = availablePoints;

            setForm((prev) => ({ ...prev, usedPoint: point }));
            return;
        }

        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handlePayment = () => {
        if (submittingRef.current) return;
        if (!form.guestName.trim() || !form.guestPhone.trim()) {
            alert("예약자 이름과 전화번호는 필수입니다.");
            return;
        }

        if (!paymentMethod) {
            alert("결제 수단을 선택해주세요.");
            return;
        }

        const payload = {
            roomId,
            checkIn,
            checkOut,
            guests,
            guestName: form.guestName,
            guestPhone: form.guestPhone,
            specialRequest: form.specialRequest,
            originalPrice: originalPrice,       // 추가
            discountAmount: discountAmount,     // 추가
            couponName: selectedCoupon?.name || null, // 추가
            couponId: form.couponId || null,
            usedPoint: form.usedPoint || 0,
            userId,
            isEmailSend: agreements.email,
            paymentMethod,
            finalPrice,
            accommodationName,
            roomName
        };

        submittingRef.current = true;
        setSubmitting(true);
        navigate("/payment/process", { state: payload });
    };


    const [paymentMethod, setPaymentMethod] = useState("");

    const paymentOptions = [
        {value: "CARD", label: "카드 결제", icon: <FaCreditCard/>},
        {value: "TOSS", label: "간편 결제", icon: <FaMobileAlt/>},
        {value: "BANK", label: "무통장 입금", icon: <FaMoneyCheckAlt/>}
    ];

    // 위 useEffect가 리다이렉트를 시작하는 동안 잘못된 값으로 렌더링하지 않는다.
    if (!state) {
        return null;
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-10">
            <div className="mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
                >
                    <FaArrowLeft className="mr-2"/> 이전으로
                </button>
                <h2 className="text-2xl font-bold">예약 정보 입력 및 결제</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* 좌측 영역 */}
                <div className="lg:col-span-2 space-y-8">

                    {/* 예약자 이름 */}
                    <div className="bg-white shadow rounded-lg p-6">
                        <label className="font-semibold mb-1 flex items-center gap-2">
                            <FaUserAlt className="text-gray-500" />
                            예약자 이름 <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="guestName"
                            value={form.guestName}
                            onChange={handleChange}
                            className="w-full border px-3 py-2 rounded"
                            placeholder="홍길동"
                            required
                        />
                    </div>

                    {/* 전화번호 */}
                    <div className="bg-white shadow rounded-lg p-6">
                        <label className="font-semibold mb-1 flex items-center gap-2">
                            <FaPhoneAlt className="text-gray-500" />
                            전화번호 <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="guestPhone"
                            value={form.guestPhone}
                            onChange={handleChange}
                            className="w-full border px-3 py-2 rounded"
                            placeholder="01012345678"
                            required
                        />
                        <div className="text-xs text-gray-400 mt-1">
                            ※ 하이픈(-) 없이 숫자만 입력해주세요.
                        </div>
                    </div>

                    {/* 특별 요청사항 */}
                    <div className="bg-white shadow rounded-lg p-6">
                        <label className="font-semibold mb-1 flex items-center gap-2">
                            <FaStickyNote className="text-gray-500" /> 특별 요청사항
                        </label>
                        <textarea
                            name="specialRequest"
                            value={form.specialRequest}
                            onChange={handleChange}
                            className="w-full border px-3 py-2 rounded"
                            placeholder="예: 창가 자리 부탁드려요"
                        />
                    </div>

                    {/* 쿠폰 선택 */}
                    <div className="bg-white shadow rounded-lg p-6">
                        <label className="font-semibold mb-1 flex items-center gap-2">
                            <FaTicketAlt className="text-gray-500" /> 쿠폰 선택 (선택)
                        </label>
                        {availableCoupons.length > 0 ? (
                            <select
                                name="couponId"
                                value={form.couponId}
                                onChange={handleChange}
                                className="w-full border px-3 py-2 rounded"
                            >
                                <option value="">쿠폰을 선택하세요</option>
                                {availableCoupons.map((coupon) => (
                                    <option key={coupon.couponId} value={coupon.couponId}>
                                        {coupon.name} - {coupon.discountType === "PERCENT"
                                        ? `${coupon.discountValue}% 할인`
                                        : `${coupon.discountValue.toLocaleString()}원 할인`}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <p className="text-sm text-gray-500">사용 가능한 쿠폰이 없습니다.</p>
                        )}
                    </div>

                    {/* 포인트 사용 */}
                    {availablePoints !== null && (
                        <div className="bg-white shadow rounded-lg p-6">
                            <label className="font-semibold mb-1 flex items-center gap-2">
                                <FaCoins className="text-yellow-500" />
                                포인트 사용 <span className="text-gray-400 text-sm">(선택)</span>
                            </label>
                            <div className="text-sm text-gray-500 mb-2">
                                사용 가능한 포인트: <span className="font-semibold text-yellow-500">{availablePoints.toLocaleString()}P</span>
                            </div>
                            <input
                                type="number"
                                name="usedPoint"
                                value={form.usedPoint}
                                onChange={handleChange}
                                className="w-full border px-3 py-2 rounded"
                                placeholder="사용할 포인트 입력"
                                min={0}
                                max={availablePoints}
                            />
                            <div className="text-xs text-gray-400 mt-1">
                                ※ 최대 {availablePoints.toLocaleString()}P까지 사용 가능
                            </div>
                        </div>
                    )}

                    {/* 취소 정책 */}
                    <div className="bg-white shadow rounded-lg p-6">
                        <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                            <FaShieldAlt className="text-gray-500" /> 취소 정책
                        </h3>
                        <ul className="list-disc list-inside text-sm text-gray-600">
                            {cancellationPolicy.map((policy, idx) => (
                                <li key={idx}>
                                    <strong>{policy.policyName}</strong>: {policy.detail}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* 결제 수단 선택 */}
                    <div className="bg-white shadow rounded-lg p-6">
                        <h3 className="font-semibold text-lg mb-3">결제 수단 선택</h3>
                        <div className="flex gap-3 flex-wrap">
                            {paymentOptions.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => setPaymentMethod(option.value)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded border transition ${
                                        paymentMethod === option.value
                                            ? "bg-yellow-400 text-white border-yellow-400"
                                            : "bg-white text-gray-700 hover:bg-gray-100"
                                    }`}
                                >
                                    {option.icon}
                                    {option.label}
                                </button>
                            ))}
                        </div>

                        {paymentMethod && (
                            <p className="mt-3 text-sm text-gray-600 flex items-center gap-2">
                                선택된 결제 방식: <strong>{paymentOptions.find(opt => opt.value === paymentMethod)?.label}</strong>
                            </p>
                        )}
                    </div>
                </div>

                {/* 우측 영역 */}
                <div className="space-y-6 sticky top-6">
                    {/* 숙소 및 객실 정보 요약 카드 */}
                    <div className="bg-white shadow rounded-lg p-6">
                        {/* 숙소 썸네일 및 정보 */}
                        <div className="mb-6 flex items-center gap-4">
                            <SafeImage
                                src={accommodationThumbnail}
                                alt="숙소 썸네일"
                                className="w-16 h-16 object-cover rounded-lg shadow-sm"
                            />
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">{accommodationName}</h3>
                                <p className="text-sm text-gray-500 flex items-center gap-1">
                                    <FaMapMarkerAlt/> {accommodationAddress}
                                </p>
                            </div>
                        </div>

                        {/* 객실 정보 */}
                        <div className="mb-4">
                            <p className="text-gray-700 font-semibold flex items-center gap-2">
                                <FaBed className="text-gray-500"/> 객실명
                            </p>
                            <p>{roomName}</p>
                        </div>

                        <div className="mb-4">
                            <p className="text-gray-700 font-semibold flex items-center gap-2">
                                <FaCalendarAlt className="text-gray-500"/> 체크인 / 체크아웃
                            </p>
                            <p>{checkIn} ~ {checkOut}</p>
                        </div>

                        <div className="mb-4">
                            <p className="text-gray-700 font-semibold flex items-center gap-2">
                                <FaUserFriends className="text-gray-500"/> 인원
                            </p>
                            <p>{guests}명</p>
                        </div>
                    </div>

                    {/* 동의 항목 UI (카드 형태) */}
                    <div className="bg-white shadow rounded-lg p-6 mb-4">
                        <div className="space-y-3">
                            {/* 전체 동의 체크박스 */}
                            <label className="flex items-center cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={agreements.privacy && agreements.cancellation && agreements.email}
                                    onChange={e => {
                                        const checked = e.target.checked;
                                        setAgreements({
                                            privacy: checked,
                                            cancellation: checked,
                                            email: checked
                                        });
                                    }}
                                    className="mr-3 accent-yellow-400"
                                />
                                <span className="text-sm text-gray-800 font-semibold">전체 동의</span>
                            </label>
                            {[
                                {
                                    key: "privacy",
                                    label: "개인정보 수집 및 이용 동의",
                                    required: true,
                                    detail: (
                                        <div className="bg-gray-50 p-3 rounded text-xs text-gray-600 mt-2">
                                            - 수집 항목: 예약자 이름, 전화번호 등<br />
                                            - 이용 목적: 예약 진행 및 확인, 고객 상담 등<br />
                                            - 보유 기간: 관련 법령에 따라 일정 기간 보관 후 파기<br />
                                            자세한 내용은 <a href="/privacy" className="underline text-blue-600" target="_blank" rel="noopener noreferrer">개인정보 처리방침</a>을 참고하세요.
                                        </div>
                                    )
                                },
                                {
                                    key: "cancellation",
                                    label: "취소/환불 정책 동의",
                                    required: true,
                                    detail: (
                                        <div className="bg-gray-50 p-3 rounded text-xs text-gray-600 mt-2">
                                            <div className="mb-2">
                                                숙소의 취소 및 환불 정책을 충분히 숙지하신 후 동의해 주세요.<br />
                                                아래 각 정책은 예약 취소 시 적용되는 조건, 환불 가능 여부, 환불 금액 산정 방식 등을 상세히 안내합니다.<br />
                                                예약 확정 이후에는 해당 정책에 따라 취소 및 환불이 처리되며, 일부 시점 이후에는 환불이 불가할 수 있습니다.<br />
                                                <span className="font-semibold text-gray-700">아래 정책을 반드시 확인하시고, 궁금한 점은 고객센터로 문의해 주세요.</span>
                                            </div>
                                            <ul className="list-disc list-inside space-y-2">
                                                {cancellationPolicy.map((policy, idx) => (
                                                    <li key={idx} className="mb-1">
                                                        <strong>{policy.policyName}</strong>:<br />
                                                        {policy.detail}<br />
                                                        <span className="text-gray-500">
                                                            {
                                                                // 정책별 상세 설명 추가
                                                                policy.policyName.includes("무료 취소") ? (
                                                                    <>
                                                                        무료 취소 가능 기간 내에는 별도의 수수료 없이 예약을 취소하실 수 있습니다. 해당 기간이 경과하면 취소 수수료가 발생할 수 있으니, 반드시 기간을 확인해 주세요.
                                                                    </>
                                                                ) : policy.policyName.includes("부분 환불") ? (
                                                                    <>
                                                                        부분 환불 정책은 체크인 또는 예약 일정에 따라 환불 금액이 달라집니다. 각 시점별 환불 비율 및 조건을 꼼꼼히 확인해 주세요.
                                                                    </>
                                                                ) : policy.policyName.includes("환불 불가") ? (
                                                                    <>
                                                                        본 정책이 적용되는 경우, 예약 취소 시 환불이 불가하오니 신중하게 예약을 진행해 주시기 바랍니다.
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        상세 환불 조건 및 적용 시점은 숙소별로 상이할 수 있습니다. 각 정책명을 클릭하거나 숙소 안내 페이지를 통해 더욱 자세한 내용을 확인하실 수 있습니다.
                                                                    </>
                                                                )
                                                            }
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                            <div className="mt-2">
                                                <span className="font-semibold text-red-500">※ 환불 규정은 숙소 또는 객실별로 다를 수 있으니, 반드시 상세 내용을 확인 후 예약해 주세요.</span>
                                            </div>
                                        </div>
                                    )
                                },
                                {
                                    key: "email",
                                    label: "결제 정보 이메일 전송 동의",
                                    required: false,
                                    detail: (
                                        <div className="bg-gray-50 p-3 rounded text-xs text-gray-600 mt-2">
                                            - 결제 완료 시, 현재 계정에 등록된 이메일 주소로 결제 내역(예약 정보, 결제 금액 등)이 자동 전송됩니다.<br />
                                            - 결제 내역 이메일은 예약 확인 및 증빙 자료로 활용하실 수 있습니다.<br />
                                            - 이메일 전송 동의는 선택 사항이며, 동의하지 않으실 경우 결제 내역 이메일이 발송되지 않습니다.<br />
                                            - 이메일 주소는 회원 정보에서 확인 및 수정 가능합니다.
                                        </div>
                                    )
                                }
                            ].map(item => (
                                <div key={item.key} className="flex flex-col">
                                    <label className="flex items-center cursor-pointer select-none">
                                        <input
                                            type="checkbox"
                                            checked={agreements[item.key]}
                                            onChange={e => setAgreements(prev => ({...prev, [item.key]: e.target.checked}))}
                                            className="mr-3 accent-yellow-400"
                                        />
                                        <span className="text-sm text-gray-700 font-medium">
                                            {item.label}
                                            {item.required
                                                ? <span className="ml-1 text-red-500 font-bold">(필수)</span>
                                                : <span className="ml-1 text-gray-400">(선택)</span>}
                                        </span>
                                        <button
                                            type="button"
                                            className="ml-2 text-gray-500 hover:text-gray-800 focus:outline-none"
                                            aria-label={expanded[item.key] ? "상세 닫기" : "상세 보기"}
                                            onClick={() => toggleDetail(item.key)}
                                        >
                                            <svg
                                                className={`w-4 h-4 transition-transform duration-200 ${expanded[item.key] ? "rotate-180" : ""}`}
                                                fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
                                            </svg>
                                        </button>
                                    </label>
                                    {expanded[item.key] && item.detail}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 결제 요약 및 버튼 카드 */}
                    <div className="bg-white shadow rounded-lg p-6">
                        <h3 className="font-semibold text-lg mb-2">결제 정보</h3>
                        <hr className="mb-4"/>
                        <div className="mb-6 text-sm text-gray-700 space-y-2">
                            <div className="flex justify-between">
                                <span>{roomName}</span>
                                <span>{originalPrice.toLocaleString()}원</span>
                            </div>
                            {selectedCoupon && (
                                <div className="flex justify-between text-yellow-500">
                                    <span>{selectedCoupon.name}</span>
                                    <span>-{discountAmount.toLocaleString()}원</span>
                                </div>
                            )}
                            {availablePoints && form.usedPoint > 0 && (
                                <div className="flex justify-between text-blue-500">
                                    <span>포인트 사용</span>
                                    <span>-{form.usedPoint.toLocaleString()}원</span>
                                </div>
                            )}
                            <div className="border-t pt-2 mt-2 flex justify-between font-bold text-lg">
                                <span>총 금액</span>
                                <span className="text-red-400">{finalPrice.toLocaleString()}원</span>
                            </div>
                        </div>

                        <button
                            onClick={handlePayment}
                            disabled={
                                !form.guestName.trim() ||
                                !form.guestPhone.trim() ||
                                !paymentMethod ||
                                !agree ||
                                submitting
                            }
                            className={`w-full font-bold py-3 rounded transition ${
                                !form.guestName.trim() || !form.guestPhone.trim() || !paymentMethod || !agree || submitting
                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    : "bg-yellow-400 hover:bg-yellow-500 text-white"
                            }`}
                        >
                            결제하고 예약하기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
