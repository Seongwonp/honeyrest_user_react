import { APIProvider, Map, AdvancedMarker, InfoWindow } from "@vis.gl/react-google-maps";
import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SafeImage from "@/components/SafeImage.jsx";

function GoogleMapSearchBox({ initialCenter, onCenterChange, markers = [] }) {
    const mapRef = useRef(null);
    const navigate = useNavigate();
    const [selectedId, setSelectedId] = useState(null);

    useEffect(() => {
        if (!mapRef.current) return;
        const map = mapRef.current.map;
        const listener = map.addListener("idle", () => {
            const center = map.getCenter();
            onCenterChange({ lat: center.lat(), lng: center.lng() });
        });
        return () => listener.remove();
    }, [onCenterChange]);

    return (
        <APIProvider apiKey={import.meta.env.VITE_APP_GOOGLE_MAPS_KEY}>
            <Map
                ref={mapRef}
                defaultCenter={initialCenter}
                defaultZoom={14}
                mapId={import.meta.env.VITE_GOOGLE_MAP_ID}
                style={{ width: "100%", height: "100%" }}
            >
                {/* 중심 마커 */}
                <AdvancedMarker position={initialCenter}>
                    <div className="bg-blue-600 text-white px-2 py-1 rounded text-xs shadow">
                        검색 위치
                    </div>
                </AdvancedMarker>

                {/* 숙소 마커들 */}
                {markers.map(item => (
                    <AdvancedMarker
                        key={item.id}
                        position={{ lat: item.lat, lng: item.lng }}
                        onClick={() => setSelectedId(item.id)}
                    >
                        <div className="bg-white px-2 py-1 rounded shadow text-sm font-semibold">
                            {item.title}
                        </div>

                        {/* InfoWindow 표시 */}
                        {selectedId === item.id && (
                            <InfoWindow
                                position={{ lat: item.lat, lng: item.lng }}
                                onCloseClick={() => setSelectedId(null)}
                            >
                                <div className="w-64">
                                    <SafeImage
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-32 object-cover rounded"
                                    />
                                    <h3 className="font-bold mt-2 text-sm">{item.title}</h3>
                                    <p className="text-xs text-gray-600">{item.location}</p>
                                    <p className="text-blue-600 font-semibold mt-1">
                                        {item.price.toLocaleString()}원
                                    </p>
                                    <button
                                        onClick={() => navigate(`/accommodations/${item.id}`)}
                                        className="mt-2 px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                                    >
                                        상세 보기
                                    </button>
                                </div>
                            </InfoWindow>
                        )}
                    </AdvancedMarker>
                ))}
            </Map>
        </APIProvider>
    );
}

export default GoogleMapSearchBox;