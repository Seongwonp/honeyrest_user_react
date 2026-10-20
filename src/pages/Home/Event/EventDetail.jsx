import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '@/api/axios';
import SafeImage from "@/components/SafeImage.jsx";
import PageLoader from "@/components/PageLoader.jsx";

function EventDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [failed, setFailed] = useState(false);

    useEffect(() => {
        // 다른 이벤트로 이동하면 이전 요청 취소
        const controller = new AbortController();
        api.get(`/api/event/${id}`, { signal: controller.signal, skipRedirect: true })
            .then(res => {
                if (controller.signal.aborted) return;
                if (res.data?.eventId || res.data?.title) {
                    setEvent(res.data);
                    setFailed(false);
                } else {
                    setFailed(true);
                }
            })
            .catch(err => {
                if (controller.signal.aborted) return;
                console.error('이벤트 조회 실패:', err);
                setFailed(true);
            });
        return () => controller.abort();
    }, [id]);

    if (failed) {
        return (
            <div className="max-w-4xl mx-auto px-6 py-24 text-center space-y-4">
                <p className="text-lg font-bold text-deep-gray">이벤트 정보를 불러올 수 없어요.</p>
                <p className="text-sm text-gray-400">종료되었거나 잘못된 주소일 수 있습니다.</p>
                <button
                    onClick={() => navigate("/")}
                    className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                >
                    홈으로
                </button>
            </div>
        );
    }

    if (!event) return <PageLoader />;

    // description을 /n 기준으로 분리
    const paragraphs = String(event.description || '').split('/n');
    const dateOnly = (v) => (v ? String(v).split("T")[0] : "");

    return (
        <div className="p-8 max-w-4xl mx-auto bg-white shadow-md rounded-lg">
            <button
                onClick={() => navigate("/")}
                className="mb-4 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
            >
                ← 뒤로가기
            </button>
            <h1 className="text-3xl font-extrabold mb-6 text-gray-900">{event.title}</h1>
            {/* 글자가 있는 배너라 원본 비율 유지 */}
            <div className="mb-6 rounded-lg overflow-hidden bg-honey-yellow/10 shadow-sm">
                <SafeImage kind="event" src={event.imageUrl} alt={event.title} className="w-full h-auto max-h-[70vh] object-contain mx-auto" />
            </div>

            {/* 문단별로 출력 */}
            <div className="text-gray-700 space-y-6 leading-relaxed">
                {paragraphs.map((text, idx) => (
                    <p key={idx}>{text.trim()}</p>
                ))}
            </div>

            <div className="mt-6 text-sm text-gray-500 italic">
                {dateOnly(event.startDate)} ~ {dateOnly(event.endDate)}
            </div>

            {event.targetUrl && (
                <a
                    href={event.targetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-6 px-6 py-3 bg-yellow-500 text-deep-gray font-medium rounded-lg shadow hover:bg-yellow-600 transition"
                >
                    자세히 보기
                </a>
            )}
        </div>
    );
}

export default EventDetail;