import Slider from "react-slick";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

function HotPlacesSection({ hotPlaces, isDropdownOpen, setIsDropdownOpen, verticalSliderSettings }) {
    return (
        <div className="w-full bg-white rounded-xl shadow-md p-6 relative">
            <div className="flex items-center gap-4">
                <h3 className="text-base font-bold text-gray-700 flex items-center gap-2 whitespace-nowrap">
                    <span role="img" aria-label="fire">🔥</span> 핫한 여행지
                </h3>

                <div className="flex-1 max-h-10 overflow-hidden">
                    <Slider {...verticalSliderSettings}>
                        {hotPlaces.map((place, idx) => (
                            <div key={idx} className="bg-gray-50 rounded-md px-3 py-1 text-sm text-gray-700 hover:bg-yellow-50 transition text-center">
                                {place}
                            </div>
                        ))}
                    </Slider>
                </div>

                <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="text-xs text-blue-500 hover:text-blue-600 flex items-center gap-1 whitespace-nowrap"
                >
                    {isDropdownOpen ? <FaChevronUp className="w-3 h-3" /> : <FaChevronDown className="w-3 h-3" />}
                </button>
            </div>

            {isDropdownOpen && (
                <div className="absolute top-full left-0 w-full z-10 mt-2">
                    <ul className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto bg-white border rounded-md shadow-sm p-2">
                        {hotPlaces.map((place, idx) => (
                            <li key={idx} className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded hover:bg-yellow-100 transition">
                                <span className="text-xs font-bold text-gray-500">{idx + 1}</span>
                                <span className="text-sm text-gray-800">{place}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default HotPlacesSection;