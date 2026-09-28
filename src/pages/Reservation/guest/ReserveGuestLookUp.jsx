import React, { useState } from 'react';
import api from '@/api/axios';
import { FaClipboardList, FaSearch, FaExternalLinkAlt } from 'react-icons/fa';
import Input from '@/components/ui/Input.jsx';
import Button from '@/components/ui/Button.jsx';
import Card from '@/components/ui/Card.jsx';
import SectionTitle from '@/components/ui/SectionTitle.jsx';
import { eyebrowClass } from '@/components/ui/styles';

export default function ReserveGuestLookUp() {
    const [form, setForm] = useState({
        reservationCode: '',
        guestPhone: '',
        guestPassword: '',
    });
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleLookup = async () => {
        setLoading(true);
        setError('');
        setResult(null);

        try {
            const response = await api.post('/api/reserve/guest-lookup', form);
            setResult(response.data);
        } catch {
            setError('예약 정보를 찾을 수 없습니다. 입력값을 다시 확인해주세요.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto px-4 py-12 space-y-8">
            {/* 헤더 */}
            <div className="text-center">
                <div className="mx-auto mb-4 w-16 h-16 rounded-2xl bg-honey-yellow/15 text-honey-yellow-dark flex items-center justify-center text-3xl">
                    <FaClipboardList />
                </div>
                <p className={`${eyebrowClass} mb-1`}>Guest Lookup</p>
                <h1 className="text-2xl md:text-3xl font-black text-deep-gray break-keep">비회원 예약 조회</h1>
                <p className="mt-2 text-sm text-gray-400 break-keep">예약번호와 전화번호, 비밀번호를 입력해주세요.</p>
            </div>

            {/* 입력 폼 */}
            <Card className="space-y-4" padding="p-6 sm:p-8">
                <Input label="예약번호" name="reservationCode" value={form.reservationCode} onChange={handleChange} autoComplete="off" />
                <Input label="전화번호" name="guestPhone" type="tel" value={form.guestPhone} onChange={handleChange} autoComplete="tel" />
                <Input label="예약 비밀번호" name="guestPassword" value={form.guestPassword} onChange={handleChange} autoComplete="off" />

                <Button onClick={handleLookup} disabled={loading} size="lg" fullWidth className="mt-2">
                    <FaSearch />
                    {loading ? '조회 중...' : '조회하기'}
                </Button>

                {error && (
                    <p role="alert" className="text-sm font-bold text-red-500 bg-red-50 rounded-2xl px-4 py-3 text-center break-keep">
                        {error}
                    </p>
                )}
            </Card>

            {/* 조회 결과 */}
            {result && (
                <Card padding="p-6 sm:p-8" aria-live="polite">
                    <SectionTitle eyebrow="Reservation" title="예약 정보" as="h2" className="mb-5" />
                    <dl className="divide-y divide-gray-100">
                        <Info label="숙소명" value={result.accommodationName} />
                        <Info label="객실명" value={result.roomName} />
                        <Info label="체크인" value={result.checkIn} />
                        <Info label="체크아웃" value={result.checkOut} />
                        <Info label="예약자" value={result.guestName} />
                        <Info label="전화번호" value={result.guestPhone} />
                        <Info label="예약번호" value={result.reservationCode} />
                        <Info label="결제 금액" value={`${result.finalPrice?.toLocaleString()}원`} />
                        <Info label="결제 수단" value={result.paymentMethod || '정보 없음'} />
                        <Info label="결제 상태" value={result.paymentStatus || '정보 없음'} />
                    </dl>
                    {result.receiptUrl && (
                        <Button
                            as="a"
                            href={result.receiptUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            variant="secondary"
                            fullWidth
                            className="mt-6"
                        >
                            영수증 보기 <FaExternalLinkAlt className="text-xs" />
                        </Button>
                    )}
                </Card>
            )}
        </div>
    );
}

function Info({ label, value }) {
    return (
        <div className="flex justify-between gap-4 py-3 text-sm">
            <dt className="text-gray-400 font-bold shrink-0">{label}</dt>
            <dd className="text-deep-gray font-bold text-right break-all">{value}</dd>
        </div>
    );
}
