import { FaMapMarkerAlt } from "react-icons/fa";
import GoogleMapView from "@/pages/Accommodations/Accommodation/GoogleMapView.jsx";

// 위치 안내 (지도 + 주소)
function MapSection({ location, address, sectionRefs }) {
    return (
        <section id="location" ref={(el) => (sectionRefs.current["location"] = el)} className="space-y-6">
            <h2 className="text-2xl font-black text-deep-gray">위치 안내</h2>
            <div className="w-full h-[400px] rounded-[2.5rem] overflow-hidden shadow-xl border border-gray-100">
                {location && (
                    <GoogleMapView
                        lat={location.latitude}
                        lng={location.longitude}
                    />
                )}
            </div>
            <div className="flex items-center gap-3 px-6 py-4 bg-gray-50 rounded-2xl">
                <FaMapMarkerAlt className="text-red-500" />
                <span className="text-sm font-bold text-deep-gray">{address}</span>
            </div>
        </section>
    );
}

export default MapSection;
