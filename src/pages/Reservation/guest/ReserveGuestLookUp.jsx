import React, { useState } from 'react';
import api from '@/api/axios';
import { FaClipboardList } from 'react-icons/fa';

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
        <div className="max-w-xl mx-auto px-4 py-12 space-y-10">
            {/* 헤더 */}
            <div className="text-center space-y-2">
                <FaClipboardList className="mx-auto text-4xl text-yellow-500" />
                <h2 className="text-3xl font-bold text-gray-800">비회원 예약 조회</h2>
                <p className="text-sm text-gray-500">예약번호와 전화번호, 비밀번호를 입력해주세요.</p>
            </div>

            {/* 입력 폼 */}
            <div className="space-y-5">
                <Input label="예약번호" name="reservationCode" value={form.reservationCode} onChange={handleChange} />
                <Input label="전화번호" name="guestPhone" value={form.guestPhone} onChange={handleChange} />
                <Input label="예약 비밀번호" name="guestPassword" value={form.guestPassword} onChange={handleChange} />

                <button
                    onClick={handleLookup}
                    disabled={loading}
                    className="w-full px-4 py-3 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-lg shadow transition"
                >
                    {loading ? '조회 중...' : '조회하기'}
                </button>

                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            </div>

            {/* 조회 결과 */}
            {result && (
                <div className="bg-white border border-yellow-200 rounded-xl shadow-lg p-6 space-y-4">
                    <h3 className="text-lg font-bold text-gray-900">📋 예약 정보</h3>
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
                    {result.receiptUrl && (
                        <div className="text-sm">
                            <a
                                href={result.receiptUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline hover:text-blue-800"
                            >
                                영수증 보기
                            </a>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function Input({ label, name, value, onChange }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <input
                type="text"
                name={name}
                value={value}
                onChange={onChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition"
            />
        </div>
    );
}

function Info({ label, value }) {
    return (
        <div className="text-sm text-gray-700">
            <span className="font-medium text-gray-800">{label}:</span> {value}
        </div>
    );
}
