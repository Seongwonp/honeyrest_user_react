import { DateRange } from "react-date-range";
import { format, differenceInCalendarDays, addDays } from "date-fns";
import { ko } from "date-fns/locale";
import { useEffect, useState } from "react";
import axios from "axios";

const formatDate = (locdate) => {
    const str = locdate.toString();
    return `${str.slice(0, 4)}-${str.slice(4, 6)}-${str.slice(6, 8)}`;
};

const normalize = (data) => Array.isArray(data) ? data : [data];

function DateRangeModal({ isOpen, onClose, onSelect }) {
    const serviceKey = import.meta.env.VITE_HOLIDAY_API_KEY;

    const today = new Date();
    const tomorrow = addDays(today, 1);

    const [isMobile, setIsMobile] = useState(false);
    const [holidays, setHolidays] = useState([]);
    const [visibleMonth, setVisibleMonth] = useState(today);
    const [selection, setSelection] = useState({
        startDate: today,
        endDate: tomorrow,
        key: "selection"
    });
    const [isSelecting, setIsSelecting] = useState(true);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 640);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
    }, [visibleMonth]);

    useEffect(() => {
        console.log("선택된 범위:", {
            start: format(selection.startDate, "yyyy-MM-dd"),
            end: format(selection.endDate, "yyyy-MM-dd")
        });
    }, [selection]);

    useEffect(() => {
        const monthsInRange = new Set();
        const start = selection.startDate;
        const end = selection.endDate;

        const current = new Date(start);
        while (current <= end) {
            const year = current.getFullYear();
            const month = current.getMonth() + 1;
            monthsInRange.add(`${year}-${month.toString().padStart(2, "0")}`);
            current.setMonth(current.getMonth() + 1);
        }

        const fetchHolidays = async () => {
            try {
                const baseUrl = "https://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getHoliDeInfo";

                const requests = Array.from(monthsInRange).map((ym) => {
                    const [year, month] = ym.split("-");
                    return axios.get(baseUrl, {
                        params: {
                            serviceKey,
                            solYear: year,
                            solMonth: month,
                            _type: "json",
                            numOfRows: 30
                        }
                    });
                });

                const responses = await Promise.all(requests);

                const merged = responses.flatMap(res => {
                    const items = res.data?.response?.body?.items?.item || [];
                    return normalize(items)
                        .filter(item => item.isHoliday === "Y")
                        .map(item => ({
                            date: formatDate(item.locdate),
                            name: item.dateName
                        }));
                });


                setHolidays(merged);
            } catch (err) {
                console.error("❌ 공휴일 병합 요청 실패:", err);
                setHolidays([]);
            }
        };

        fetchHolidays();
    }, [selection.startDate, selection.endDate, serviceKey]);

    const handleSelect = ({ selection: newSelection }) => {
        console.log("🖱️ handleSelect 진입:", {
            start: format(newSelection.startDate, "yyyy-MM-dd"),
            end: format(newSelection.endDate, "yyyy-MM-dd")
        });

        const start = newSelection.startDate;
        const end = newSelection.endDate;

        if (!start || !end || isNaN(start) || isNaN(end)) return;

        const isSameDay = format(start, "yyyy-MM-dd") === format(end, "yyyy-MM-dd");

        if (isSelecting || isSameDay) {
            setSelection({
                startDate: start,
                endDate: start,
                key: "selection"
            });
            setIsSelecting(false);
            return;
        }

        const nights = Math.max(1, differenceInCalendarDays(end, start));
        if (nights > 30) {
            alert(`최대 30박까지만 선택 가능합니다. 현재 ${nights}박 선택됨.`);
            return;
        }

        setSelection(newSelection);
        setIsSelecting(true);

        const checkIn = format(start, "yyyy-MM-dd");
        const checkOut = format(end, "yyyy-MM-dd");


        onSelect({ checkIn, checkOut, nights });
        onClose();
    };

    const maxCalendarDate = addDays(today, 180);

    const disabledDates = Array.from({ length: 365 }, (_, i) => addDays(today, i - 180))
        .filter((date) => {
            const diff = differenceInCalendarDays(date, selection.startDate);
            const isOutOfRange = diff < -30 || diff > 30;
            const isBeforeToday = differenceInCalendarDays(date, today) < 0;
            return isOutOfRange || isBeforeToday;
        });

    const dayContentRenderer = (date) => {
        const dateStr = format(date, "yyyy-MM-dd");
        const holiday = holidays.find(h => h.date === dateStr);
        const isHoliday = !!holiday;

        return (
            <div className="text-center relative h-16 w-full flex flex-col items-center justify-center px-1">
            <span
                style={{
                    color: isHoliday ? "#ef4444" : "#1f2937",
                    fontWeight: isHoliday ? "bold" : "500",
                    fontSize: "14px",
                    lineHeight: "1",
                    marginBottom: isHoliday ? "2px" : "5px"
                }}
            >
                {date.getDate()}
            </span>
                {isHoliday && (
                    <span
                        style={{
                            color: "#ef4444",
                            fontWeight: "bold",
                            fontSize: "8px",
                            lineHeight: "1",
                            marginTop: "0px",
                            textAlign: "center",
                        }}
                    >
                    {holiday.name}
                </span>
                )}
            </div>
        );
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 animate-fade-in">
            <div className={`bg-white rounded-xl shadow-lg transition-all duration-300 ${
                isMobile ? "w-full max-w-md max-h-screen overflow-y-auto scroll-smooth" : "p-6"
            }`}>
                <div className="text-center text-gray-700 font-semibold mb-4">날짜 선택</div>
                <DateRange
                    ranges={[selection]}
                    onChange={handleSelect}
                    shownDate={visibleMonth}
                    initialFocusedRange={false}
                    minDate={today}
                    maxDate={maxCalendarDate}
                    disabledDates={disabledDates}
                    months={isMobile ? 1 : 2}
                    direction="horizontal"
                    rangeColors={["#f59e0b"]}
                    locale={ko}
                    showMonthAndYearPickers={false}
                    showDateDisplay={false}
                    dayContentRenderer={dayContentRenderer}
                    moveRangeOnFirstSelection={false}
                    onShownDateChange={(date) => {
                        if (date instanceof Date && !isNaN(date)) {
                            setVisibleMonth(date);
                            setSelection((prev) => ({
                                ...prev,
                                startDate: date,
                                endDate: date
                            }));
                        }
                    }}
                />
                <div className="sticky bottom-0 bg-white pt-4 pb-6 px-6">
                    <button
                        onClick={onClose}
                        className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 rounded-lg transition duration-200"
                    >
                        닫기
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DateRangeModal;