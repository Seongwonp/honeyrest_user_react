import DomesticSpotsList from "./DomesticSpotsList";

function DomesticSpots({ userInfo, navigate }) {
    return (
        <div className="max-w-screen-xl mx-auto px-4 py-10 mb-30" data-aos="fade-up">
            <h3 className="text-xl font-bold text-[#4B5563] mb-4">📍 국내 여행지</h3>
            <DomesticSpotsList userInfo={userInfo} navigate={navigate} />
        </div>
    );
}

export default DomesticSpots;