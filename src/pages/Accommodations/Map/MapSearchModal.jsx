import { useEffect, useState } from "react";
import GoogleMapSearchBox from "@/pages/Accommodations/Map/GoogleMapSearchBox.jsx"; // useState 추가

function MapSearchModal({ onClose, onSearch }) {
    const [center, setCenter] = useState(null);
    const [accommodations, setAccommodations] = useState([]);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude });
            },
            () => {
                setCenter({ lat: 37.5665, lng: 126.9780 }); // fallback: 서울
            }
        );
    }, []);

    const handleSearch = () => {
        fetch(`/api/accommodations/search?lat=${center.lat}&lng=${center.lng}`)
            .then(res => res.json())
            .then(data => setAccommodations(data.content))
            .catch(err => console.error("❌ 숙소 검색 실패:", err));
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-4 w-[90%] max-w-3xl">
                <h2 className="text-lg font-bold mb-4">지도에서 위치 선택</h2>
                <div className="w-full h-80 rounded overflow-hidden mb-4">
                    {center && (
                        <GoogleMapSearchBox
                            initialCenter={center}
                            onCenterChange={(newCenter) => setCenter(newCenter)}
                            markers={accommodations}
                        />
                    )}
                </div>
                <div className="flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:underline">
                        닫기
                    </button>
                    <button
                        onClick={handleSearch}
                        className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                    >
                        현재 위치에서 검색하기
                    </button>
                </div>
            </div>
        </div>
    );
}

export default MapSearchModal;