import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-toastify";
import useApiRequest from "@/api/useApiRequest";
import PasswordVerifyModal from "@/components/PasswordVerifyModal";
import PasswordChangeModal from "@/pages/myPage/PasswordChangeModal.jsx";
import Swal from 'sweetalert2';
import {
    FaUserAlt, FaPhoneAlt, FaEnvelope, FaCamera, FaEdit,
    FaSave, FaLock, FaTrashAlt
} from "react-icons/fa";
import SafeImage from "@/components/SafeImage.jsx";
import SectionTitle from "@/components/ui/SectionTitle.jsx";
import Card from "@/components/ui/Card.jsx";
import Button from "@/components/ui/Button.jsx";
import { inputClass, badgeClass, eyebrowClass } from "@/components/ui/styles";

export default function Profile() {
    const { user, syncUserFromServer } = useAuth();
    const { request, isLoading } = useApiRequest();

    const isSocialLogin = user?.provider === "KAKAO" || user?.provider === "GOOGLE";

    const [isEditing, setIsEditing] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showPasswordChange, setShowPasswordChange] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [form, setForm] = useState({ name: "", phone: "", email: "" });
    const [additionalInfo, setAdditionalInfo] = useState({ point: 0, isVerified: false, createdAt: "" });
    const [originalEmail, setOriginalEmail] = useState("");
    const [pendingAccountDeletion, setPendingAccountDeletion] = useState(false);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await request({ method: "GET", url: "/api/user/info" }, { label: "fetchUserInfo" });
                if (response) {
                    setForm({
                        name: response.name || "",
                        phone: response.phone || "",
                        email: response.email || ""
                    });
                    setOriginalEmail(response.email || "");
                    setAdditionalInfo({
                        point: response.point || 0,
                        isVerified: response.isVerified || false,
                        createdAt: response.createdAt || ""
                    });
                }
            } catch (err) {
                console.error("유저 정보 불러오기 실패:", err);
                toast.error("유저 정보를 불러오는 중 오류가 발생했습니다.");
            }
        };
        fetchUserInfo();
        // request는 참조가 고정되어 있어 마운트 시 1회만 실행됨
    }, [request]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
            const isEmailChanged = form.email !== originalEmail;

            if (isEmailChanged) {
                await request(
                    { method: "POST", url: "/api/user/request-email-change", data: { newEmail: form.email, isPasswordVerified: isVerified } },
                    { label: "emailChangeRequest", successMessage: "입력하신 이메일로 인증 메일을 보냈습니다!" }
                );
            }

            await request(
                { method: "PUT", url: "/api/user/profile", data: { name: form.name, phone: form.phone, email: form.email, isPasswordVerified: isVerified } },
                {
                    label: "profileUpdate",
                    successMessage: isEmailChanged ? undefined : "회원 정보가 수정되었습니다!",
                    onSuccess: () => {
                        setIsEditing(false);
                        setIsVerified(false);
                        syncUserFromServer();
                    }
                }
            );
        } catch (err) {
            console.error("프로필 수정 실패:", err);
            toast.error("회원 정보 수정 중 오류가 발생했습니다.");
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("profileImage", file);

        try {
            await request(
                { method: "POST", url: "/api/user/profile-image", data: formData, headers: { "Content-Type": "multipart/form-data" } },
                {
                    label: "profileImageUpload",
                    successMessage: "프로필 이미지가 변경되었습니다!",
                    onSuccess: () => syncUserFromServer()
                }
            );
        } catch (err) {
            console.error("프로필 이미지 업로드 실패:", err);
            toast.error("이미지 업로드에 실패했습니다.");
        }
    };

    const handleAccountDeletion = async () => {
        try {
            await request({ method: "DELETE", url: "/api/user/delete-account" }, { label: "accountDeletion" });
            localStorage.clear();
            sessionStorage.clear();
            await Swal.fire('탈퇴 완료', '회원 탈퇴가 정상적으로 처리되었습니다.', 'success');
            window.location.href = "/login";
        } catch (err) {
            console.error("회원 탈퇴 실패:", err);
            toast.error("회원 탈퇴 중 오류가 발생했습니다.");
        }
    };

    const onDeleteClick = () => {
        setPendingAccountDeletion(true);
        setShowPasswordModal(true);
    };

    const onPasswordVerified = async (verified) => {
        setShowPasswordModal(false);
        setIsVerified(verified);
        if (verified) {
            if (pendingAccountDeletion) {
                setPendingAccountDeletion(false);
                await handleAccountDeletion();
            } else {
                // 일반 회원 정보 수정 활성화
                setIsEditing(true);
            }
        }
    };

    const isSaving = isLoading("profileUpdate") || isLoading("emailChangeRequest");

    return (
        <section>
            {/* 타이틀 + 탈퇴 버튼 */}
            <SectionTitle
                eyebrow="Profile"
                title="내 정보"
                action={
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onDeleteClick}
                        aria-label="회원 탈퇴"
                        title="회원 탈퇴 시 모든 정보가 삭제됩니다"
                    >
                        <FaTrashAlt />
                        탈퇴
                    </Button>
                }
            />

            <Card className="flex flex-col md:flex-row gap-8">
                {/* 프로필 이미지 */}
                <div className="flex flex-col items-center text-center md:w-1/3 md:border-r md:border-gray-50 md:pr-8">
                    <div className="relative">
                        <SafeImage kind="profile"
                            src={user?.profileImage}
                            alt="프로필"
                            className="w-28 h-28 rounded-full object-cover ring-4 ring-honey-yellow/20 shadow-lg"
                        />
                        {!isSocialLogin && (
                            <>
                                <button
                                    type="button"
                                    onClick={() => document.getElementById("profileImageInput").click()}
                                    aria-label="프로필 이미지 변경"
                                    className="absolute bottom-0 right-0 w-9 h-9 flex items-center justify-center bg-honey-yellow hover:bg-honey-yellow-dark text-white rounded-full shadow-lg shadow-honey-yellow/30 transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-honey-yellow/40"
                                >
                                    <FaCamera className="text-sm" />
                                </button>
                                <input
                                    type="file"
                                    id="profileImageInput"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                            </>
                        )}
                    </div>
                    <h3 className="mt-4 text-xl font-black text-deep-gray break-keep">{form.name || user?.name}</h3>
                    <p className="text-gray-400 mt-1 text-sm break-all">{form.email || user?.email}</p>
                    <span className={`${badgeClass} mt-3 bg-gray-50 text-gray-500`}>
                        {user?.provider === "local" ? "일반 회원" : user?.provider?.toUpperCase() || "알 수 없음"}
                    </span>
                </div>

                {/* 상세 정보 */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {[
                            { label: "이름", name: "name", icon: <FaUserAlt /> },
                            { label: "연락처", name: "phone", icon: <FaPhoneAlt /> },
                            { label: "이메일", name: "email", icon: <FaEnvelope /> }
                        ].map(({ label, name, icon }) => (
                            <div key={name} className="flex flex-col min-w-0">
                                <label
                                    htmlFor={isEditing ? `profile-${name}` : undefined}
                                    className="flex items-center gap-2 text-xs font-bold text-gray-500 mb-2"
                                >
                                    <span className="text-honey-yellow-dark">{icon}</span>
                                    <span>{label}</span>
                                </label>
                                {isEditing ? (
                                    <input
                                        id={`profile-${name}`}
                                        type="text"
                                        name={name}
                                        value={form[name]}
                                        onChange={handleChange}
                                        disabled={isSocialLogin}
                                        className={inputClass}
                                        placeholder="정보를 입력하세요"
                                    />
                                ) : (
                                    <div className="w-full rounded-2xl bg-off-white px-4 py-3 text-sm font-bold text-deep-gray min-h-[46px] flex items-center break-all">
                                        {form[name] || <span className="text-gray-300 font-medium">정보 없음</span>}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* 추가 정보 섹션 */}
                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="rounded-2xl bg-honey-yellow/10 px-4 py-3">
                            <p className={eyebrowClass}>포인트</p>
                            <p className="text-lg font-black text-honey-yellow-dark">{additionalInfo.point}</p>
                        </div>
                        <div className="rounded-2xl bg-off-white px-4 py-3">
                            <p className={eyebrowClass}>이메일 인증</p>
                            {additionalInfo.isVerified ? (
                                <span className={`${badgeClass} mt-1 bg-leaf-green/10 text-leaf-green-dark`}>인증 완료</span>
                            ) : (
                                <span className={`${badgeClass} mt-1 bg-red-50 text-red-500`}>미인증</span>
                            )}
                        </div>
                        <div className="rounded-2xl bg-off-white px-4 py-3">
                            <p className={eyebrowClass}>가입일</p>
                            <p className="text-sm font-black text-deep-gray mt-1">{additionalInfo.createdAt ? new Date(additionalInfo.createdAt).toLocaleDateString() : "정보 없음"}</p>
                        </div>
                    </div>

                    {/* 버튼 그룹 */}
                    <div className="mt-6 flex flex-wrap justify-end gap-3">
                        {!isSocialLogin && (
                            <Button variant="secondary" onClick={() => setShowPasswordChange(true)}>
                                <FaLock />
                                비밀번호 변경
                            </Button>
                        )}

                        {!isSocialLogin && (
                            isEditing ? (
                                <Button onClick={handleSubmit} disabled={isSaving}>
                                    <FaSave />
                                    {isSaving ? "처리 중..." : "저장하기"}
                                </Button>
                            ) : (
                                <Button variant="dark" onClick={() => setShowPasswordModal(true)}>
                                    <FaEdit />
                                    수정하기
                                </Button>
                            )
                        )}
                    </div>
                </div>
            </Card>

            {/* 모달들 */}
            {showPasswordModal && (
                <PasswordVerifyModal
                    onSuccess={onPasswordVerified}
                    onClose={() => {
                        setShowPasswordModal(false);
                        setPendingAccountDeletion(false);
                    }}
                />
            )}
            {showPasswordChange && (
                <PasswordChangeModal
                    isOpen={showPasswordChange}
                    onClose={() => setShowPasswordChange(false)}
                    onSuccess={() => {
                        toast.success("비밀번호가 변경되었습니다!");
                        setShowPasswordChange(false);
                    }}
                />
            )}
        </section>
    );
}