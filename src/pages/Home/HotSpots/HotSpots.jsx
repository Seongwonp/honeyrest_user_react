import HotSpatsList from "./HotSpotsList.jsx";
import { MdTravelExplore } from "react-icons/md";

function HotSpots({ userInfo, navigate }) {
    return (
        <section className="space-y-10">
            {/* 타이틀 */}
            <div className="flex flex-col items-center text-center space-y-2">
                <div className="flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-honey-yellow/10 text-honey-yellow-dark text-xs font-bold uppercase tracking-widest">
                    <MdTravelExplore />
                    <span>Popular Destinations</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-deep-gray">
                    지금 가장 <span className="text-honey-yellow">핫한</span> 여행지
                </h2>
                <p className="text-gray-400 font-medium">실시간으로 가장 많이 검색되고 있는 인기 도시들을 확인해보세요.</p>
            </div>

            {/* 슬라이더 */}
            <div className="relative">
                <HotSpatsList userInfo={userInfo} navigate={navigate} />
            </div>
        </section>
    );
}

export default HotSpots;
