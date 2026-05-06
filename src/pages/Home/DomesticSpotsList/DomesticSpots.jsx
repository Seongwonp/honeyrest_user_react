import DomesticSpotsList from "./DomesticSpotsList";
import { HiMap } from "react-icons/hi";

function DomesticSpots({ userInfo, navigate }) {
    return (
        <section className="space-y-10 pb-20">
            <div className="flex flex-col items-center text-center space-y-2">
                <div className="flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-leaf-green/10 text-leaf-green-dark text-xs font-bold uppercase tracking-widest">
                    <HiMap />
                    <span>Regional Guide</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-deep-gray tracking-tight">
                    전국 <span className="text-leaf-green">여행지</span> 둘러보기
                </h2>
                <p className="text-gray-400 font-medium">대한민국 구석구석, 당신이 찾던 숨은 명소들을 지역별로 확인해보세요.</p>
            </div>

            <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100">
                <DomesticSpotsList userInfo={userInfo} navigate={navigate} />
            </div>
        </section>
    );
}

export default DomesticSpots;
