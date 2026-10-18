import { useEffect, useState } from "react";
import api from "@/api/axios";

function WeatherInfo({ city, displayName, coords }) {
    const [weather, setWeather] = useState(null);
    const [error, setError] = useState(null);

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

        // 장식용 요청: 실패해도 에러 페이지로 보내지 않고 위젯만 대기 문구를 유지
        // 위치가 바뀌면 이전 위치의 응답이 늦게 와서 덮어쓰지 않도록 취소한다
        const controller = new AbortController();
        api.get(url, { skipRedirect: true, signal: controller.signal })
            .then(({ data }) => {
                if (controller.signal.aborted) return;
                setWeather(data);
                setError(null);
            })
            .catch((err) => {
                if (controller.signal.aborted) return;
                console.error("날씨 정보 오류:", err);
                setError(err.response?.data?.message || err.message || "날씨 정보를 가져올 수 없습니다.");
                setWeather(null);
            });
        return () => controller.abort();
    }, [city, coords]);

    if (error || !weather) {
        return (
            <div className="text-center p-4">
                <p className="text-xs text-gray-400">날씨 정보를 불러오는 중...</p>
            </div>
        );
    }

    const iconClass = iconClassMap[weather.icon] || "wi-na";
    const iconColor = colorMap[weather.description] || "text-gray-400";

    return (
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
            <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    {city ? displayName || city : weather.name || 'Current'}
                </p>
                <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-deep-gray">{weather.temp}</span>
                    <span className="text-lg font-bold text-gray-400">°C</span>
                </div>
                <p className="text-xs font-medium text-gray-500 mt-1">{weather.description}</p>
            </div>
            
            <div className="flex flex-col items-center">
                <i className={`wi ${iconClass} ${iconColor} text-4xl mb-1`} />
                <div className="flex gap-2">
                    <div className="flex flex-col items-center">
                        <span className="text-[8px] font-bold text-gray-300">Humidity</span>
                        <span className="text-[10px] font-bold text-gray-500">{weather.humidity}%</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WeatherInfo;
