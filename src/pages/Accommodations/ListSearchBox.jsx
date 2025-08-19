import { HiOutlineSearch } from "react-icons/hi";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";

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
        <div className="bg-white p-6 rounded-xl shadow-md mb-6">
            <h2 className="text-lg font-bold text-gray-700 mb-4">숙소 검색</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="지역 입력"
                    className="border px-4 py-2 rounded-md text-sm focus:ring-2 focus:ring-yellow-400"
                />
                <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => {
                        setCheckIn(e.target.value);
                        const nextDay = new Date(e.target.value);
                        nextDay.setDate(nextDay.getDate() + 1);
                        setCheckOut(nextDay.toISOString().split("T")[0]);
                    }}
                    min={getToday()}
                    className="border px-4 py-2 rounded-md text-sm"
                />
                <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    min={checkIn}
                    className="border px-4 py-2 rounded-md text-sm"
                />
                <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="border px-4 py-2 rounded-md text-sm"
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
                    className="flex items-center gap-2 bg-yellow-500 text-white px-8 py-3 rounded-md text-base font-semibold hover:bg-yellow-600 transition"
                >
                    <HiOutlineSearch className="text-xl" />
                    검색하기
                </button>
            </div>
        </div>
    );
}

function getToday() {
    return new Date().toISOString().split("T")[0];
}

function getTomorrow(checkInDate) {
    const date = new Date(checkInDate);
    date.setDate(date.getDate() + 1);
    return date.toISOString().split("T")[0];
}

export default ListSearchBox;