import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";

function GoogleMapView({ lat, lng }) {
    const mapId = import.meta.env.VITE_GOOGLE_MAP_ID;

    if (typeof lat !== "number" || typeof lng !== "number") {
        console.warn("GoogleMapView: 유효하지 않은 좌표", lat, lng);
        return null;
    }

    return (
        <APIProvider apiKey={import.meta.env.VITE_APP_GOOGLE_MAPS_KEY}>
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