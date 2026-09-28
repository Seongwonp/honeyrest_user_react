import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '@/api/axios';
import { toast } from 'react-toastify';
import { HiXCircle, HiDocumentText, HiCheckCircle, HiInformationCircle } from 'react-icons/hi';
import SafeImage from "@/components/SafeImage.jsx";
import PageLoader from "@/components/PageLoader.jsx";
import SectionTitle from "@/components/ui/SectionTitle.jsx";
import Card from "@/components/ui/Card.jsx";
import Button from "@/components/ui/Button.jsx";
import { inputClass, labelClass, eyebrowClass } from "@/components/ui/styles";

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
        <label className="py-2 flex items-start gap-3 text-sm text-deep-gray cursor-pointer">
            <input
                type="checkbox"
                checked={checked}
                onChange={() => onToggle(item.id)}
                className="mt-0.5 w-4 h-4 shrink-0 accent-leaf-green"
            />
            <span className="font-medium break-keep">{item.title}</span>
        </label>
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
        if (!reservationId) return;

        // 예약 상세 조회 (effect 내부에 정의해 reservationId 변경 시에만 실행)
        const fetchReservation = async () => {
            try {
                const res = await api.get(`/api/user/reservations/${reservationId}`);
                setReservation(res.data);
            } catch {
                toast.error('예약 정보를 불러오지 못했습니다.');
            }
        };

        fetchReservation();
    }, [reservationId]);

    useEffect(() => {
        if (reservation?.accommodationId) {
            fetchCancellationPolicies(reservation.accommodationId);
        }
    }, [reservation]);

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

    if (!reservation) return <PageLoader />;

    return (
        <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
            <SectionTitle eyebrow="Cancel Request" title="예약 취소 요청" className="mb-0" />

            <Card padding="p-5 sm:p-6">
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                    {reservation.thumbnailUrl && (
                        <div className="w-full sm:w-28 h-32 sm:h-28 shrink-0 overflow-hidden rounded-2xl">
                            <SafeImage
                                src={reservation.thumbnailUrl}
                                alt="숙소 썸네일"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}
                    <div className="min-w-0 w-full space-y-2 text-sm">
                        <div>
                            <p className="text-lg font-black text-deep-gray leading-tight break-keep">{reservation.accommodationName}</p>
                            <p className="text-xs font-bold text-gray-400">{reservation.roomName}</p>
                        </div>
                        <p className="text-gray-500"><span className={eyebrowClass}>No.</span> <span className="font-mono text-leaf-green-dark break-all">{reservation.reservationCode}</span></p>
                        <p className="text-gray-500">체크인 {reservation.checkIn} / 체크아웃 {reservation.checkOut}</p>
                        <p className="text-gray-500">인원 {reservation.guests}명 · 예약자 {reservation.guestName} / {reservation.guestPhone}</p>
                        <p className="text-gray-500">결제 {reservation.paymentMethod} / {reservation.paymentStatus === 'DONE' ? '완료' : '실패'}</p>
                        <div className="flex items-center justify-between rounded-2xl bg-honey-yellow/10 px-4 py-3">
                            <span className="font-black text-deep-gray">결제 금액</span>
                            <strong className="text-lg font-black text-deep-gray">{reservation.finalPrice.toLocaleString()}원</strong>
                        </div>
                    </div>
                </div>
            </Card>

            {/* 취소 안내사항 */}
            <div className="bg-white/60 border border-gray-100 rounded-3xl p-5 space-y-2 text-sm text-gray-500">
                <div className="flex items-center gap-2 font-black text-deep-gray">
                    <HiInformationCircle className="text-honey-yellow-dark" />
                    <span>취소 안내사항</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm">
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
                <div className="bg-white/60 border border-gray-100 rounded-3xl p-5 space-y-2 text-sm text-gray-500">
                    <div className="flex items-center gap-2 font-black text-deep-gray">
                        <HiDocumentText className="text-honey-yellow-dark" />
                        <span>숙소 취소 규정</span>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm">
                        {policies.map((policy, index) => (
                            <li key={policy.policyId ?? `policy-${index}`}>
                                <strong className="text-deep-gray">{policy.policyName}</strong>: {policy.detail}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <Card padding="p-5 sm:p-6" className="space-y-6">
                <div className="flex flex-col gap-2">
                    <label htmlFor="cancel-reason" className="text-xs font-bold text-gray-500 flex items-center gap-2">
                        <HiDocumentText className="text-honey-yellow-dark" />
                        취소 사유
                    </label>
                    <select
                        id="cancel-reason"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className={inputClass}
                    >
                        <option value="">선택해주세요</option>
                        {mockReasons.map((r) => (
                            <option key={r} value={r}>{r}</option>
                        ))}
                    </select>
                    {reason === '기타' && (
                        <textarea
                            rows={4}
                            placeholder="취소 사유를 입력해주세요..."
                            aria-label="기타 취소 사유"
                            value={customReason}
                            onChange={(e) => setCustomReason(e.target.value)}
                            className={`${inputClass} mt-1 resize-none`}
                        />
                    )}
                </div>

                <fieldset>
                    <legend className={`${labelClass} flex items-center gap-2`}>
                        <HiCheckCircle className="text-leaf-green" />
                        <span>동의 항목</span>
                    </legend>
                    {mockAgreements.map((item) => (
                        <AgreementItem
                            key={item.id}
                            item={item}
                            checked={agreements[item.id] || false}
                            onToggle={handleAgreementToggle}
                        />
                    ))}
                </fieldset>
            </Card>

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2">
                <Button variant="secondary" onClick={() => navigate(-1)} className="w-full sm:w-auto">
                    돌아가기
                </Button>
                <Button
                    variant="dangerSolid"
                    onClick={handleSubmit}
                    disabled={loading || !allAgreed}
                    className="w-full sm:w-auto"
                >
                    <HiXCircle />
                    {loading ? '처리 중...' : '요청하기'}
                </Button>
            </div>
        </div>
    );
}
