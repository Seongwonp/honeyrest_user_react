import { useEffect, useState } from "react";

function WeatherInfo({ city, displayName, coords }) {
    const [weather, setWeather] = useState(null);
    const [error, setError] = useState(null);

    const conditionMap = {
        Clear: "맑음",
        Clouds: "흐림",
        Rain: "비",
        Snow: "눈",
        Thunderstorm: "뇌우",
        Drizzle: "이슬비",
        Mist: "안개",
        Smoke: "연기",
        Haze: "실안개",
        Dust: "먼지",
        Fog: "안개",
        Sand: "모래",
        Ash: "재",
        Squall: "돌풍",
        Tornado: "토네이도",
    };

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
        Clear: "text-yellow-400",
        Clouds: "text-gray-500",
        Rain: "text-blue-500",
        Snow: "text-blue-200",
        Thunderstorm: "text-purple-600",
        Fog: "text-gray-400",
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

        fetch(url)
            .then((res) => {
                if (!res.ok) {
                    return res.json().then((data) => {
                        throw new Error(data.message || "날씨 정보를 가져올 수 없습니다.");
                    }).catch(() => {
                        throw new Error("서버 응답을 처리할 수 없습니다.");
                    });
                }
                return res.json();
            })
            .then((data) => {
                setWeather(data);
                setError(null);
            })
            .catch((err) => {
                console.error("날씨 정보 오류:", err);
                setError(err.message);
                setWeather(null);
            });
    }, [city, coords]);

    if (error || !weather) {
        return (
            <div className="bg-white shadow-md rounded-lg p-4 w-full max-w-sm mx-auto text-gray-800 text-center">
                <p className="text-sm mb-2">현재 위치 정보를 불러올 수 없어요!</p>
                <p className="text-sm mb-2">도시 이름을 직접 입력해 주세요 😊</p>
                <p className="text-xs text-gray-500">혹시 위치 권한이 꺼져 있다면 브라우저 설정도 한번 확인해 주세요!</p>
            </div>
        );
    }

    const translatedCondition = conditionMap[weather.condition] || weather.condition;
    const iconClass = iconClassMap[weather.icon] || "wi-na";
    const iconColor = colorMap[weather.condition] || "text-gray-600";

    return (
        <div className="bg-white shadow-md rounded-lg p-4 w-full max-w-sm mx-auto text-gray-800">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold">
                    {city
                        ? `${displayName || city} 날씨`
                        : weather?.name
                            ? `${weather.name} 날씨`
                            : "현재 위치 날씨"}
                </h3>
                <i className={`wi ${iconClass} ${iconColor} text-5xl`} title={translatedCondition} />
            </div>
            <div className="text-xl font-semibold">
                {weather.temp}°C
            </div>
            <div className="text-sm text-gray-600">
                상태: {translatedCondition}
            </div>
        </div>
    );
}

export default WeatherInfo;