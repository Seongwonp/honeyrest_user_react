import { HiOutlineSearch } from "react-icons/hi";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { todayLocal, addDays } from "@/utils/date";

function ListSearchBox() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [location, setLocation] = useState(searchParams.get("location") || "");
    const [checkIn, setCheckIn] = useState(searchParams.get("checkIn") || getToday());
    const [checkOut, setCheckOut] = useState(searchParams.get("checkOut") || getTomorrow(checkIn));
    const [guests, setGuests] = useState(Number(searchParams.get("guests")) || 2);

    const updateParams = () => {
        const params = new URLSearchParams();
        params.set("location", location);
        params.set("checkIn", checkIn);
        params.set("checkOut", checkOut);
        params.set("guests", guests.toString());
        params.set("page", "0"); // 검색 시 페이지 초기화

        navigate(`/accommodations?${params.toString()}`);
    };

    return (
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md mb-6">
            <h2 className="text-lg font-bold text-gray-700 mb-4">숙소 검색</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="지역 입력"
                    className="border px-3 py-2 rounded-md text-sm focus:ring-2 focus:ring-yellow-400 w-full"
                />
                <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => {
                        setCheckIn(e.target.value);
                        setCheckOut(addDays(e.target.value, 1));
                    }}
                    min={getToday()}
                    className="border px-3 py-2 rounded-md text-sm w-full"
                />
                <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    min={checkIn ? addDays(checkIn, 1) : getToday()}
                    className="border px-3 py-2 rounded-md text-sm w-full"
                />
                <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="border px-3 py-2 rounded-md text-sm w-full"
                >
                    {[...Array(10)].map((_, i) => (
                        <option key={i} value={i + 1}>
                            {i + 1}명
                        </option>
                    ))}
                </select>
            </div>
            <div className="flex justify-center mt-6">
                <button
                    onClick={updateParams}
                    className="flex items-center gap-2 bg-yellow-500 text-deep-gray px-8 py-3 rounded-md text-base font-semibold hover:bg-yellow-600 transition w-full sm:w-auto justify-center"
                >
                    <HiOutlineSearch className="text-xl" />
                    검색하기
                </button>
            </div>
        </div>
    );
}

// 로컬 날짜 기준 (toISOString 은 UTC)
function getToday() {
    return todayLocal();
}

function getTomorrow(checkInDate) {
    return addDays(checkInDate, 1);
}

export default ListSearchBox;