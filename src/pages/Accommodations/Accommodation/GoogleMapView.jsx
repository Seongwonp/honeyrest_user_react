import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";

function GoogleMapView({ lat, lng }) {
    const apiKey = import.meta.env.VITE_APP_GOOGLE_MAPS_KEY;
    const mapId = import.meta.env.VITE_GOOGLE_MAP_ID;

    if (typeof lat !== "number" || typeof lng !== "number") {
        console.warn("GoogleMapView: 유효하지 않은 좌표", lat, lng);
        return null;
    }

    // API 키 없이 Google Maps를 초기화하면 오류 대화상자가 자동으로 포커스를
    // 가져가 상세 페이지가 위치 섹션까지 스크롤된다. 로컬/데모 환경에서는
    // 포커스를 이동시키지 않는 안내 화면을 대신 보여준다.
    if (!apiKey) {
        return (
            <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-honey-yellow/10 to-leaf-green/10 text-center">
                <span className="text-4xl" aria-hidden="true">📍</span>
                <p className="text-sm font-black text-deep-gray">숙소 위치</p>
                <p className="text-xs font-bold text-gray-400">자세한 주소는 지도 아래에서 확인해 주세요.</p>
            </div>
        );
    }

    return (
        <APIProvider apiKey={apiKey}>
            <Map
                defaultCenter={{ lat, lng }}
                defaultZoom={15}
                mapId={mapId} // 고급 마커용 mapId 추가
                style={{ width: "100%", height: "100%", borderRadius: "0.5rem" }}
            >
                <AdvancedMarker position={{ lat, lng }} />
            </Map>
        </APIProvider>
    );
}

export default GoogleMapView;
