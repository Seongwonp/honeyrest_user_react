import { useEffect, useState } from "react";
import WeatherInfo from "./WeatherInfo";
import { HiSearch, HiLocationMarker } from "react-icons/hi";

function WeatherWidget({ coords, locationError }) {
    const [city, setCity] = useState("");
    const [searchCity, setSearchCity] = useState(null);
    const [displayCity, setDisplayCity] = useState("");

    useEffect(() => {
        setSearchCity(null);
    }, []);

    const cityMap = {
        서울: "Seoul", 대구: "Daegu", 부산: "Busan", 인천: "Incheon", 광주: "Gwangju", 울산: "Ulsan", 제주: "Jeju",
        제주도: "Jeju", 울릉도: "Ulleung", 수원: "Suwon", 청주: "Cheongju", 전주: "Jeonju", 강릉: "Gangneung",
        포항: "Pohang", 창원: "Changwon", 안양: "Anyang", 성남: "Seongnam", 고양: "Goyang", 용인: "Yongin",
        천안: "Cheonan", 김해: "Gimhae", 평택: "Pyeongtaek", 구미: "Gumi", 남양주: "Namyangju", 원주: "Wonju",
        군산: "Gunsan", 익산: "Iksan", 춘천: "Chuncheon", 경산: "Gyeongsan", 목포: "Mokpo", 여수: "Yeosu",
        순천: "Suncheon", 제천: "Jecheon", 충주: "Chungju", 속초: "Sokcho", 동해: "Donghae", 태백: "Taebaek"
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmed = city.trim();
        if (trimmed) {
            const mappedCity = cityMap[trimmed] || trimmed;
            setSearchCity(mappedCity);
            setDisplayCity(trimmed);
            setCity("");
        }
    };

    return (
        <div className="w-full bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <HiLocationMarker className="text-leaf-green text-xl" />
                    <h3 className="font-bold text-deep-gray">Local Weather</h3>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="relative mb-6 group">
                <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="도시를 입력하세요 (예: 서울)"
                    className="w-full pl-4 pr-12 py-3 bg-gray-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-leaf-green/20 transition-all outline-none"
                />
                <button 
                    type="submit" 
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-leaf-green text-white rounded-xl hover:bg-leaf-green-dark transition-colors shadow-lg shadow-leaf-green/20"
                >
                    <HiSearch size={16} />
                </button>
            </form>

            <div className="space-y-4">
                {locationError && !searchCity && (
                    <div className="p-4 rounded-2xl bg-orange-50 border border-orange-100 text-center">
                        <p className="text-xs font-bold text-orange-600 mb-1">위치 정보를 찾을 수 없어요!</p>
                        <p className="text-[10px] text-orange-400">도시 이름을 직접 입력해 보세요 😊</p>
                    </div>
                )}

                {searchCity ? (
                    <WeatherInfo
                        key={searchCity}
                        city={searchCity}
                        displayName={displayCity}
                    />
                ) : !locationError && coords ? (
                    <WeatherInfo
                        key={`${coords.lat}-${coords.lon}`}
                        coords={coords}
                    />
                ) : (
                    <div className="h-24 flex items-center justify-center border-2 border-dashed border-gray-100 rounded-2xl">
                        <p className="text-xs text-gray-300 font-medium italic">도시를 검색해 보세요</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default WeatherWidget;
