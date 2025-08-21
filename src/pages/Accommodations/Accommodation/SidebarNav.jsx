

import { FaBed, FaMapMarkerAlt, FaStar, FaInfoCircle, FaRegSmile } from "react-icons/fa";

function SidebarNav({ activeSection, onScrollTo }) {
    const sections = [
        { id: "rooms", label: "객실", icon: <FaBed className="inline-block mr-2 text-gray-500" /> },
        { id: "intro", label: "소개", icon: <FaInfoCircle className="inline-block mr-2 text-gray-500" /> },
        { id: "facilities", label: "시설", icon: <FaRegSmile className="inline-block mr-2 text-gray-500" /> },
        { id: "usage", label: "이용안내", icon: <FaMapMarkerAlt className="inline-block mr-2 text-gray-500" /> },
        { id: "location", label: "위치", icon: <FaMapMarkerAlt className="inline-block mr-2 text-gray-500" /> },
        { id: "reviews", label: "리뷰", icon: <FaStar className="inline-block mr-2 text-gray-500" /> },
        { id: "similar", label: "추천", icon: <FaStar className="inline-block mr-2 text-gray-500" /> },
    ];

    return (
        <aside className="flex flex-col justify-center h-screen w-40 bg-white rounded-xl shadow-lg p-4 space-y-3 text-base text-gray-700 md:flex">
            {sections.map(({ id, label, icon }) => (
                <button
                    key={id}
                    onClick={() => onScrollTo(id)}
                    className={`flex items-center w-full text-left px-6 py-2 rounded-lg transition transform ${
                        activeSection === id
                            ? "bg-yellow-100 text-yellow-600 font-bold shadow-inner"
                            : "hover:bg-yellow-50 hover:scale-105"
                    }`}
                >
                    {icon}
                    {label}
                </button>
            ))}
        </aside>
    );
}
export default SidebarNav;