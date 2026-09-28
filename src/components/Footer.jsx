import { FaInstagram, FaFacebookF, FaTwitter, FaYoutube } from 'react-icons/fa';
import logo from '/public/images/logo-Photoroom.png';

function Footer() {
    return (
        <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* 브랜드 정보 */}
                    <div className="md:col-span-1 space-y-6">
                        <div className="flex items-center gap-2">
                            <img src={logo} alt="logo" className="w-8 h-8 object-contain" />
                            <span className="text-xl font-black text-deep-gray tracking-tight">HoneyRest</span>
                        </div>
                        <p className="text-sm text-gray-400 font-medium leading-relaxed">
                            달콤한 휴식과 잊지 못할 추억을 선사하는<br/>
                            프리미엄 숙소 예약 플랫폼, HoneyRest입니다.<br/>
                            당신의 여정을 가장 편안하게 만들어 드릴게요.
                        </p>
                        <div className="flex gap-4">
                            {[FaInstagram, FaFacebookF, FaTwitter, FaYoutube].map((Icon, idx) => (
                                <a 
                                    key={idx} 
                                    href="#" 
                                    className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-honey-yellow hover:text-deep-gray transition-all"
                                >
                                    <Icon size={16} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* 메뉴 그룹 */}
                    <div>
                        <h4 className="font-black text-deep-gray mb-6 uppercase tracking-widest text-xs">HoneyRest</h4>
                        <ul className="space-y-4">
                            {['서비스 소개', '공지사항', '채용 정보', '제휴 문의'].map(item => (
                                <li key={item}>
                                    <a href="#" className="text-sm text-gray-400 hover:text-leaf-green transition-colors font-medium">{item}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-black text-deep-gray mb-6 uppercase tracking-widest text-xs">Support</h4>
                        <ul className="space-y-4">
                            {['자주 묻는 질문', '예약 확인/취소', '포인트 안내', '고객센터'].map(item => (
                                <li key={item}>
                                    <a href="#" className="text-sm text-gray-400 hover:text-leaf-green transition-colors font-medium">{item}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-black text-deep-gray mb-6 uppercase tracking-widest text-xs">Contact Us</h4>
                        <div className="space-y-4">
                            <p className="text-sm text-gray-400 font-medium leading-relaxed">
                                서울특별시 강남구 테헤란로 123<br/>
                                허니레스트 타워 15층
                            </p>
                            <p className="text-sm font-black text-deep-gray">1588-1234</p>
                            <p className="text-sm text-gray-400">help@honeyrest.com</p>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-gray-300 font-medium">
                        © 2026 HoneyRest. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        {['이용약관', '개인정보처리방침', '운영정책'].map(item => (
                            <a key={item} href="#" className="text-xs text-gray-300 hover:text-deep-gray transition-colors font-medium">{item}</a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
