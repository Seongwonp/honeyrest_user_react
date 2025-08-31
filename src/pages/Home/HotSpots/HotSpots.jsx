import HotSpatsList from "./HotSpotsList.jsx";
import { MdTravelExplore } from "react-icons/md";

function HotSpots({ userInfo, navigate }) {
    return (
        <section className="bg-white py-10 px-4 max-w-screen-xl mx-auto mb-6">
            {/* 타이틀 */}
            <div className="max-w-2xl mx-auto text-center mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-700 flex items-center justify-center gap-2">
                    <MdTravelExplore className="text-blue-500 text-2xl" />
                    인기 여행지
                </h2>
            </div>

            {/* 슬라이더 */}
            <div className="max-w-screen-xl mx-auto">
                <HotSpatsList userInfo={userInfo} navigate={navigate} />
            </div>
        </section>
    );
}

export default HotSpots;