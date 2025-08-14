function DomesticSpots({ domesticSpots }) {
    return (
        <div className="max-w-screen-xl mx-auto px-4 py-10 mb-30" data-aos="fade-up">
            <h3 className="text-xl font-bold text-[#4B5563] mb-4">📍 국내 여행지</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {domesticSpots.map((spot, idx) => (
                    <div key={idx} className="text-sm text-gray-700 hover:text-yellow-500 transition">
                        {spot}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default DomesticSpots;