import { useEffect, useState } from "react";

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
        "맑음": "text-yellow-400",
        "흐림": "text-gray-500",
        "비": "text-blue-500",
        "눈": "text-blue-200",
        "뇌우": "text-purple-600",
        "안개": "text-gray-400",
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

    const iconClass = iconClassMap[weather.icon] || "wi-na";
    const iconColor = colorMap[weather.description] || "text-gray-600";

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
                <i className={`wi ${iconClass} ${iconColor} text-5xl`} title={weather.description} />
            </div>
            <div className="text-xl font-semibold">
                {weather.temp}°C
            </div>
            <div className="text-sm text-gray-600">
                상태: {weather.description}
            </div>
        </div>
    );
}

export default WeatherInfo;