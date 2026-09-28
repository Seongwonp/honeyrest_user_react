import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import useApiRequest from '@/api/useApiRequest';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Dialog from '@/components/ui/Dialog.jsx';
import Input from '@/components/ui/Input.jsx';
import Button from '@/components/ui/Button.jsx';

export default function PasswordChangeModal({ isOpen, onClose, onSuccess }) {
    const { request, isLoading } = useApiRequest();
    const { logout } = useAuth();
    const navigate = useNavigate();

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [strengthLevel, setStrengthLevel] = useState({ level: 0, label: '', description: '' });

    // ✅ 비밀번호 강도 분석 (길이 기반)
    const getPasswordStrengthLevel = (password) => {
        const length = password.length;
        if (length === 0) return { level: 0, label: '', description: '' };
        if (length < 8) return { level: 1, label: '매우 약함', description: '비밀번호가 너무 짧습니다.' };
        if (length < 10) return { level: 2, label: '약함', description: '최소 기준은 충족했지만 보안에 취약할 수 있습니다.' };
        if (length < 12) return { level: 3, label: '보통', description: '일반적인 보안 수준입니다.' };
        if (length < 14) return { level: 4, label: '강함', description: '안전한 비밀번호입니다.' };
        return { level: 5, label: '매우 강함', description: '매우 안전한 비밀번호입니다.' };
    };

    useEffect(() => {
        setStrengthLevel(getPasswordStrengthLevel(newPassword));
    }, [newPassword]);

    const handleSubmit = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            toast.error('모든 항목을 입력해주세요.');
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error('새 비밀번호가 일치하지 않습니다.');
            return;
        }
        if (newPassword.length < 8 || newPassword.length > 20) {
            toast.error('비밀번호는 8자 이상 20자 이하로 입력해주세요.');
            return;
        }

        try {
            await request(
                {
                    method: 'PUT',
                    url: '/api/user/password',
                    data: {
                        currentPassword,
                        newPassword
                    }
                },
                {
                    label: 'passwordChange',
                    successMessage: '비밀번호가 성공적으로 변경되었습니다!',
                    errorMessage: '현재 비밀번호가 올바르지 않습니다.'
                }
            );

            toast.success('비밀번호가 변경되었습니다. 다시 로그인해주세요.');
            logout();
            navigate('/login');

            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            onSuccess?.();
            onClose();
        } catch (err) {
            console.error('비밀번호 변경 실패:', err);
        }
    };

    if (!isOpen) return null;

    return (
        <Dialog onClose={onClose} title="비밀번호 변경" className="max-w-md" closeOnBackdrop>
            <div className="space-y-5">
                {/* ✅ 조건 설명 */}
                <div className="bg-off-white rounded-2xl p-4 space-y-2">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">비밀번호 조건</p>
                    <ul className="list-disc list-inside text-xs text-gray-500 space-y-1">
                        <li>8자 이상 20자 이하로 입력해주세요.</li>
                        <li>영문 대소문자, 숫자, 특수문자 중 2가지 이상 조합이 권장됩니다.</li>
                        <li>현재 비밀번호와 동일한 비밀번호는 사용할 수 없습니다.</li>
                        <li>보안을 위해 가능한 한 긴 비밀번호를 사용하는 것이 좋습니다.</li>
                    </ul>
                </div>

                <div className="space-y-4">
                    <Input
                        label="현재 비밀번호"
                        type="password"
                        placeholder="현재 비밀번호"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        autoComplete="current-password"
                    />
                    <Input
                        label="새 비밀번호"
                        type="password"
                        placeholder="새 비밀번호"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        autoComplete="new-password"
                    />

                    {/* ✅ 강도 시각화 */}
                    <div className="space-y-1.5 text-xs text-gray-500" aria-live="polite">
                        <div className="font-bold">
                            비밀번호 강도:{' '}
                            <span className={
                                strengthLevel.level >= 4 ? 'text-leaf-green-dark' :
                                    strengthLevel.level === 3 ? 'text-honey-yellow-dark' :
                                        'text-red-500'
                            }>
                                {strengthLevel.label}
                            </span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-300 ${
                                    strengthLevel.level === 1 ? 'bg-red-400 w-1/5' :
                                        strengthLevel.level === 2 ? 'bg-red-300 w-2/5' :
                                            strengthLevel.level === 3 ? 'bg-honey-yellow w-3/5' :
                                                strengthLevel.level === 4 ? 'bg-leaf-green w-4/5' :
                                                    strengthLevel.level === 5 ? 'bg-leaf-green-dark w-full' : 'w-0'
                                }`}
                            />
                        </div>
                        <p className="text-gray-400">{strengthLevel.description}</p>
                    </div>

                    <Input
                        label="새 비밀번호 확인"
                        type="password"
                        placeholder="새 비밀번호 확인"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        autoComplete="new-password"
                    />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                    <Button variant="secondary" onClick={onClose}>
                        취소
                    </Button>
                    <Button onClick={handleSubmit} disabled={isLoading('passwordChange')}>
                        {isLoading('passwordChange') ? '처리 중...' : '변경하기'}
                    </Button>
                </div>
            </div>
        </Dialog>
    );
}
