import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '@/api/axios';
import SafeImage from "@/components/SafeImage.jsx";

function EventDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);

    useEffect(() => {
        // 다른 이벤트로 이동하면 이전 요청을 취소해 늦게 온 응답이 화면을 덮어쓰지 않게 한다
        const controller = new AbortController();
        api.get(`/api/event/${id}`, { signal: controller.signal })
            .then(res => {
                if (!controller.signal.aborted) setEvent(res.data);
            })
            .catch(err => {
                if (!controller.signal.aborted) console.error('이벤트 조회 실패:', err);
            });
        return () => controller.abort();
    }, [id]);

    if (!event) return <div>로딩 중...</div>;

    // description을 /n 기준으로 분리
    const paragraphs = event.description.split('/n');

    return (
        <div className="p-8 max-w-4xl mx-auto bg-white shadow-md rounded-lg">
            <button
                onClick={() => navigate("/")}
                className="mb-4 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
            >
                ← 뒤로가기
            </button>
            <h1 className="text-3xl font-extrabold mb-6 text-gray-900">{event.title}</h1>
            <SafeImage kind="event" src={event.imageUrl} alt={event.title} className="w-full  rounded-lg mb-6 shadow-sm" />

            {/* 문단별로 출력 */}
            <div className="text-gray-700 space-y-6 leading-relaxed">
                {paragraphs.map((text, idx) => (
                    <p key={idx}>{text.trim()}</p>
                ))}
            </div>

            <div className="mt-6 text-sm text-gray-500 italic">
                {event.startDate.split("T")[0]} ~ {event.endDate.split("T")[0]}
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