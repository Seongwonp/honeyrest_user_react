import { FaUserAlt, FaPhoneAlt, FaStickyNote } from "react-icons/fa";
import { cardClass, inputClass } from "@/components/ui/styles";

// 예약자 정보 입력 (이름·전화번호·특별 요청사항)
function GuestInfoSection({ form, onChange }) {
    return (
        <>
            {/* 예약자 이름 */}
            <div className={`${cardClass} p-6`}>
                <label htmlFor="reservation-guestName" className="text-sm font-black text-deep-gray mb-3 flex items-center gap-2">
                    <FaUserAlt className="text-honey-yellow-dark" />
                    예약자 이름 <span className="text-red-400">*</span>
                </label>
                <input
                    type="text"
                    id="reservation-guestName"
                    name="guestName"
                    value={form.guestName}
                    onChange={onChange}
                    className={inputClass}
                    placeholder="홍길동"
                    required
                />
            </div>

            {/* 전화번호 */}
            <div className={`${cardClass} p-6`}>
                <label htmlFor="reservation-guestPhone" className="text-sm font-black text-deep-gray mb-3 flex items-center gap-2">
                    <FaPhoneAlt className="text-honey-yellow-dark" />
                    전화번호 <span className="text-red-400">*</span>
                </label>
                <input
                    type="text"
                    id="reservation-guestPhone"
                    name="guestPhone"
                    value={form.guestPhone}
                    onChange={onChange}
                    className={inputClass}
                    placeholder="01012345678"
                    required
                />
                <div className="text-xs text-gray-400 mt-2">
                    ※ 하이픈(-) 없이 숫자만 입력해주세요.
                </div>
            </div>

            {/* 특별 요청사항 */}
            <div className={`${cardClass} p-6`}>
                <label htmlFor="reservation-specialRequest" className="text-sm font-black text-deep-gray mb-3 flex items-center gap-2">
                    <FaStickyNote className="text-honey-yellow-dark" /> 특별 요청사항
                </label>
                <textarea
                    id="reservation-specialRequest"
                    name="specialRequest"
                    value={form.specialRequest}
                    onChange={onChange}
                    className={inputClass}
                    placeholder="예: 창가 자리 부탁드려요"
                />
            </div>
        </>
    );
}

export default GuestInfoSection;
