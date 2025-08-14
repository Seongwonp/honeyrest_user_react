import {useEffect, useState} from "react";
import WeatherInfo from "./WeatherInfo";

function WeatherWidget({coords, locationError}) {
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
        <div className="p-6 rounded-xl w-full shadow-xl  max-w-md mx-auto">
            <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
                <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="도시 이름을 입력하세요"
                    className="flex-1 px-2 py-1 border rounded"
                />
                <button type="submit" className="px-4 py-1 bg-blue-500 text-white rounded">
                    검색
                </button>
            </form>


            {locationError && !searchCity && (
                <div className="text-center text-yellow-600 bg-yellow-50 p-3 border border-yellow-300 rounded mb-4">
                    현재 위치 정보를 불러올 수 없어요!! <br/>
                    도시 이름을 직접 입력해 주세요 😊<br/>
                    <span className="text-blue-600 font-medium text-sm">
            혹시 위치 권한이 꺼져 있다면 브라우저 설정도 한번 확인해 주세요!
        </span>
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
            ) : null}
        </div>
    );
}

export default WeatherWidget;