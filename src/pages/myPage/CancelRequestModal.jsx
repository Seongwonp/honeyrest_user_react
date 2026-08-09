import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '@/api/axios';
import { toast } from 'react-toastify';
import { HiXCircle, HiDocumentText, HiCheckCircle, HiInformationCircle } from 'react-icons/hi';

const mockAgreements = [
    { id: 1, title: '환불 규정을 확인하였으며, 이에 동의합니다.' },
    { id: 2, title: '취소 가능 기간을 확인하였으며, 이에 동의합니다.' },
    { id: 3, title: '취소 승인 절차를 확인하였으며, 이에 동의합니다.' },
    { id: 4, title: '취소 거부 가능성을 확인하였으며, 이에 동의합니다.' },
];

const mockReasons = [
    '개인 사정',
    '일정 변경',
    '숙소 불만족',
    '예약 실수',
    '기타'
];

function AgreementItem({ item, checked, onToggle }) {
    return (
        <div className="py-2 flex items-center gap-2 text-gray-800">
            <input
                type="checkbox"
                checked={checked}
                onChange={() => onToggle(item.id)}
                className="mt-1"
            />
            <span className="font-medium">{item.title}</span>
        </div>
    );
}

export default function CancelRequestPage() {
    const { reservationId } = useParams();
    const navigate = useNavigate();
    const [reservation, setReservation] = useState(null);
    const [policies, setPolicies] = useState([]);
    const [reason, setReason] = useState('');
    const [customReason, setCustomReason] = useState('');
    const [agreements, setAgreements] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (reservationId) fetchReservation();
    }, [reservationId]);

    useEffect(() => {
        if (reservation?.accommodationId) {
            fetchCancellationPolicies(reservation.accommodationId);
        }
    }, [reservation]);

    const fetchReservation = async () => {
        try {
            const res = await api.get(`/api/user/reservations/${reservationId}`);
            setReservation(res.data);
        } catch {
            toast.error('예약 정보를 불러오지 못했습니다.');
        }
    };

    const fetchCancellationPolicies = async (accommodationId) => {
        try {
            const res = await api.get(`/api/accommodations/${accommodationId}/cancellation-policies`);
            setPolicies(res.data);
        } catch {
            toast.error('취소 규정을 불러오지 못했습니다.');
        }
    };

    const handleAgreementToggle = (id) => {
        setAgreements((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const allAgreed = mockAgreements.every((item) => agreements[item.id]);

    const handleSubmit = async () => {
        const finalReason = reason === '기타' ? customReason.trim() : reason;
        if (!finalReason) {
            toast.error('취소 사유를 입력해주세요.');
            return;
        }
        if (!allAgreed) {
            toast.error('모든 안내사항에 동의해주세요.');
            return;
        }

        setLoading(true);
        try {
            await api.post(`/api/user/reservations/${reservationId}/cancel-request`, { reason: finalReason });
            toast.success('취소 요청이 접수되었습니다.');
            navigate('/user/mypage/reservations');
        } catch {
            toast.error('요청 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    if (!reservation) return <p className="text-center text-gray-500">예약 정보를 불러오는 중...</p>;

    return (
        <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <HiXCircle className="text-red-500" />
                예약 취소 요청
            </h2>

            <div className="border rounded-md p-4 space-y-2 text-sm bg-white shadow text-gray-800">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    {reservation.thumbnailUrl && (
                        <img
                            src={reservation.thumbnailUrl}
                            alt="숙소 썸네일"
                            className="w-full sm:w-20 h-20 object-cover rounded-md border"
                        />
                    )}
                    <div className="space-y-1 text-sm sm:text-base">
                        <p><strong>{reservation.accommodationName}</strong> - {reservation.roomName}</p>
                        <p>예약번호: <span className="font-mono text-blue-700">{reservation.reservationCode}</span></p>
                        <p>체크인: {reservation.checkIn} / 체크아웃: {reservation.checkOut}</p>
                        <p>인원: {reservation.guests}명</p>
                        <p>예약자: {reservation.guestName} / 연락처: {reservation.guestPhone}</p>
                        <p>결제: {reservation.paymentMethod} / {reservation.paymentStatus === 'DONE' ? '완료' : '실패'}</p>
                        <p>결제 금액: <strong className="text-red-500">{reservation.finalPrice.toLocaleString()}원</strong></p>
                    </div>
                </div>
            </div>

            {/* 취소 안내사항 */}
            <div className="bg-gray-50 border rounded-md p-4 space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2 font-semibold text-gray-700">
                    <HiInformationCircle className="text-gray-500" />
                    <span>취소 안내사항</span>
                </div>
                <ul className="list-disc list-inside space-y-1">
                    <li>환불은 카드사 처리 일정에 따라 다소 지연될 수 있습니다.</li>
                    <li>체크인 3일 전까지 취소 시 전액 환불이 가능합니다.</li>
                    <li>체크인 2일 전 취소 시 50% 환불이 적용됩니다.</li>
                    <li>체크인 당일 취소 또는 No-Show 시 환불이 불가합니다.</li>
                    <li>환불 금액은 결제 시 적용된 결제 수단으로 환불됩니다.</li>
                    <li>취소 요청 시 숙소 관리자 승인 절차가 필요할 수 있습니다.</li>
                    <li>기타 세부 사항은 예약 확정 시 안내되는 규정을 참고해주세요.</li>
                </ul>
            </div>

            {policies.length > 0 && (
                <div className="bg-gray-50 border rounded-md p-4 space-y-2 text-sm text-gray-800">
                    <div className="flex items-center gap-2 font-semibold text-gray-800">
                        <HiDocumentText className="text-gray-600" />
                        <span>숙소 취소 규정</span>
                    </div>
                    <ul className="list-disc list-inside space-y-1">
                        {policies.map((policy, index) => (
                            <li key={policy.policyId ?? `policy-${index}`}>
                                <strong>{policy.policyName}</strong>: {policy.detail}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="flex flex-col gap-2">
                <label className="font-medium text-gray-800 flex items-center gap-2">
                    <HiDocumentText className="text-gray-600" />
                    취소 사유
                </label>
                <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
                >
                    <option value="">선택해주세요</option>
                    {mockReasons.map((r, idx) => (
                        <option key={idx} value={r}>{r}</option>
                    ))}
                </select>
                {reason === '기타' && (
                    <textarea
                        rows={4}
                        placeholder="취소 사유를 입력해주세요..."
                        value={customReason}
                        onChange={(e) => setCustomReason(e.target.value)}
                        className="w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-300 mt-1"
                    />
                )}
            </div>

            <div className="space-y-2">
                <div className="flex items-center gap-2 font-semibold text-gray-800">
                    <HiCheckCircle className="text-gray-600" />
                    <span>동의 항목</span>
                </div>
                {mockAgreements.map((item) => (
                    <AgreementItem
                        key={item.id}
                        item={item}
                        checked={agreements[item.id] || false}
                        onToggle={handleAgreementToggle}
                    />
                ))}
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
                <button
                    onClick={() => navigate(-1)}
                    className="px-4 py-2 rounded-md text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 w-full sm:w-auto"
                >
                    돌아가기
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={loading || !allAgreed}
                    className={`px-4 py-2 rounded-md text-sm font-semibold w-full sm:w-auto ${
                        loading || !allAgreed
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-red-500 hover:bg-red-600 text-white'
                    }`}
                >
                    {loading ? '처리 중...' : '요청하기'}
                </button>
            </div>
        </div>
    );
}
