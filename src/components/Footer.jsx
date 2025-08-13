import { FaInstagram, FaFacebookF, FaTwitter } from 'react-icons/fa';

function Footer() {
    return (
        <footer className="bg-[#F5F5F5] text-[#4B5563] text-center py-6 mt-auto shadow-inner">
            <div className="max-w-screen-xl mx-auto px-4 space-y-4">
                {/* 브랜드 메시지 */}
                <p className="text-sm">
                    © 2025 HoneyRest. 달콤한 휴식 같은 하루를 보내세요 🍯🌿
                </p>

                {/* 링크 */}
                <div className="flex justify-center space-x-4 text-sm">
                    <a href="/terms" className="hover:text-[#FFEB3B] transition">이용약관</a>
                    <a href="/privacy" className="hover:text-[#FFEB3B] transition">개인정보처리방침</a>
                    <a href="/contact" className="hover:text-[#FFEB3B] transition">고객센터</a>
                </div>

                {/* SNS 아이콘 */}
                <div className="flex justify-center space-x-4 text-xl">
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#FFEB3B] transition">
                        <FaInstagram />
                    </a>
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#FFEB3B] transition">
                        <FaFacebookF />
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#FFEB3B] transition">
                        <FaTwitter />
                    </a>
                </div>
            </div>
        </footer>
    );
}

export default Footer;