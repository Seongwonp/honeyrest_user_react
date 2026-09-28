import { FaPhoneAlt } from "react-icons/fa";

// 판매자(업체) 정보 + 전화/1:1 문의
function CompanySection({ company, onInquiry, sectionRefs }) {
    return (
        <section id="company" ref={(el) => (sectionRefs.current["company"] = el)} className="bg-deep-gray rounded-[2.5rem] p-10 text-white space-y-6 shadow-2xl">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Vendor Information</p>
                    <h2 className="text-2xl font-black">{company.name}</h2>
                </div>
                <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm">
                    <FaPhoneAlt className="text-honey-yellow" />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm font-medium text-gray-300">
                <p><strong>대표자:</strong> {company.ownerName}</p>
                <p><strong>전화:</strong> {company.phone}</p>
                <p className="md:col-span-2"><strong>이메일:</strong> {company.email}</p>
                <p className="md:col-span-2"><strong>주소:</strong> {company.address}</p>
            </div>
            <div className="pt-6 border-t border-white/10 flex gap-4">
                <a href={`tel:${company.phone}`} className="flex-1 py-4 bg-honey-yellow text-deep-gray rounded-2xl text-center font-black hover:bg-honey-yellow-dark transition-all">전화 문의</a>
                <button onClick={onInquiry} className="flex-1 py-4 bg-white/10 backdrop-blur-sm text-white rounded-2xl text-center font-black hover:bg-white/20 transition-all">1:1 문의하기</button>
            </div>
        </section>
    );
}

export default CompanySection;
