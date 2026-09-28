// 숙소 소개 + 서비스/시설 + 이용 정보
function InfoSection({ intro, facilities, usage, sectionRefs }) {
    return (
        <>
            {/* 숙소 소개 */}
            <section id="intro" ref={(el) => (sectionRefs.current["intro"] = el)} className="space-y-6 bg-gray-50 rounded-[2.5rem] p-10 border border-gray-100">
                <h2 className="text-2xl font-black text-deep-gray">숙소 소개</h2>
                <div className="text-gray-600 leading-relaxed font-medium space-y-4">
                    {intro.split("\n\n").map((line, idx) => (
                        <p key={idx}>{line}</p>
                    ))}
                </div>
            </section>

            {/* 서비스 및 시설 / 이용 정보 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <section id="facilities" ref={(el) => (sectionRefs.current["facilities"] = el)} className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-4">
                    <h2 className="text-xl font-black text-deep-gray">서비스 및 시설</h2>
                    <ul className="grid grid-cols-1 gap-3">
                        {facilities.map((f, i) => (
                            <li key={i} className="flex items-center gap-3 text-sm font-bold text-gray-400">
                                <div className="w-1.5 h-1.5 rounded-full bg-honey-yellow" />
                                {f}
                            </li>
                        ))}
                    </ul>
                </section>
                <section id="usage" ref={(el) => (sectionRefs.current["usage"] = el)} className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-4">
                    <h2 className="text-xl font-black text-deep-gray">이용 정보</h2>
                    <p className="text-sm font-medium text-gray-500 leading-relaxed">{usage}</p>
                </section>
            </div>
        </>
    );
}

export default InfoSection;
