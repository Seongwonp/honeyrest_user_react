import { useEffect, useState } from "react";
import api from "@/api/axios";

// 응답이 이 시간 안에 오지 않으면 실패로 보고 대체 화면을 보여 준다 (무한 로딩 방지)
const WEATHER_TIMEOUT_MS = 8000;

function WeatherInfo({ city, displayName, coords }) {
    // status: loading | ready | notFound | error
    const [status, setStatus] = useState("loading");
    const [weather, setWeather] = useState(null);
    // 다시 시도 버튼을 누르면 값이 바뀌어 요청을 새로 보낸다
    const [attempt, setAttempt] = useState(0);

    const iconClassMap = {
        "01d": "wi-day-sunny",
        "01n": "wi-night-clear",
        "02d": "wi-day-cloudy",
        "02n": "wi-night-alt-cloudy",
        "03d": "wi-cloud",
        "04d": "wi-cloudy",
        "09d": "wi-showers",
        "10d": "wi-rain",
        "11d": "wi-thunderstorm",
        "13d": "wi-snow",
        "50d": "wi-fog",
    };

    const colorMap = {
        "맑음": "text-honey-yellow-dark",
        "흐림": "text-gray-400",
        "비": "text-blue-400",
        "눈": "text-blue-100",
        "뇌우": "text-indigo-500",
        "안개": "text-gray-300",
    };

    useEffect(() => {
        let url = "";

        if (city) {
            url = `/api/weather?city=${encodeURIComponent(city)}`;
        } else if (coords) {
            url = `/api/weather?lat=${coords.lat}&lon=${coords.lon}`;
        } else {
            return;
        }

        // 장식용 요청: 실패해도 에러 페이지로 보내지 않고 위젯 안에서 대체 문구를 보여 준다.
        // 위치가 바뀌면 이전 위치의 응답이 늦게 와서 덮어쓰지 않도록 취소한다.
        const controller = new AbortController();
        setStatus("loading");
        api.get(url, { skipRedirect: true, signal: controller.signal, timeout: WEATHER_TIMEOUT_MS })
            .then(({ data }) => {
                if (controller.signal.aborted) return;
                if (data && data.temp !== undefined && data.temp !== null) {
                    setWeather(data);
                    setStatus("ready");
                } else {
                    setWeather(null);
                    setStatus("error");
                }
            })
            .catch((err) => {
                if (controller.signal.aborted) return;
                console.warn("날씨 정보 오류:", err?.message);
                setWeather(null);
                setStatus(err?.response?.status === 404 ? "notFound" : "error");
            });
        return () => controller.abort();
    }, [city, coords, attempt]);

    if (status === "loading") {
        return (
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl animate-pulse" role="status" aria-live="polite">
                <div className="space-y-2">
                    <div className="h-2 w-12 bg-gray-200 rounded" />
                    <div className="h-7 w-16 bg-gray-200 rounded" />
                    <div className="h-2 w-10 bg-gray-200 rounded" />
                </div>
                <div className="w-10 h-10 bg-gray-200 rounded-full" />
                <span className="sr-only">날씨 정보를 불러오는 중...</span>
            </div>
        );
    }

    if (status === "notFound") {
        return (
            <div className="p-4 rounded-2xl bg-gray-50 text-center" role="status">
                <p className="text-xs font-bold text-gray-500">도시를 찾을 수 없어요</p>
                <p className="text-[10px] text-gray-400">서울, 부산, 제주처럼 도시 이름으로 검색해 보세요.</p>
            </div>
        );
    }

    if (status === "error" || !weather) {
        return (
            <div className="p-4 rounded-2xl bg-gray-50 text-center" role="status">
                <i className="wi wi-cloud text-3xl text-gray-300" aria-hidden="true" />
                <p className="mt-1 text-xs font-bold text-gray-500">날씨 정보를 불러올 수 없어요</p>
                <p className="text-[10px] text-gray-400">잠시 후 다시 시도하거나 다른 도시를 검색해 보세요.</p>
                <button
                    type="button"
                    onClick={() => setAttempt((n) => n + 1)}
                    className="mt-2 px-3 py-1 text-[11px] font-bold text-leaf-green bg-white border border-leaf-green/30 rounded-full hover:bg-leaf-green/10 transition-colors"
                >
                    다시 시도
                </button>
            </div>
        );
    }

    // 밤(n) 아이콘이 따로 없으면 낮(d) 아이콘으로 대신한다
    const iconClass = iconClassMap[weather.icon] || iconClassMap[String(weather.icon || "").replace(/n$/, "d")] || "wi-na";
    const iconColor = colorMap[weather.description] || "text-gray-400";

    return (
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
            <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    {city ? displayName || city : weather.name || 'Current'}
                </p>
                <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-deep-gray">{Math.round(Number(weather.temp))}</span>
                    <span className="text-lg font-bold text-gray-400">°C</span>
                </div>
                <p className="text-xs font-medium text-gray-500 mt-1">
                    {weather.description}
                    {/* 데모 서버의 예시 날씨(실제 관측값 아님) */}
                    {weather.sample && (
                        <span className="ml-1.5 px-1.5 py-0.5 rounded bg-gray-200 text-[9px] font-bold text-gray-500 align-middle" title="데모용 예시 날씨입니다">예시</span>
                    )}
                </p>
            </div>
            
            <div className="flex flex-col items-center">
                <i className={`wi ${iconClass} ${iconColor} text-4xl mb-1`} />
                {weather.humidity !== undefined && weather.humidity !== null && (
                    <div className="flex flex-col items-center">
                        <span className="text-[8px] font-bold text-gray-300">습도</span>
                        <span className="text-[10px] font-bold text-gray-500">{weather.humidity}%</span>
                    </div>
                )}
            </div>
        </div>
    );
}

export default WeatherInfo;
