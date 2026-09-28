import React from "react";
import { useNavigate } from "react-router-dom";
import { HiXCircle } from "react-icons/hi";
import StatusPanel from "@/components/ui/StatusPanel.jsx";
import Button from "@/components/ui/Button.jsx";

export default function PaymentFail() {
    const navigate = useNavigate();

    return (
        <StatusPanel
            role="alert"
            icon={<HiXCircle />}
            tone="red"
            eyebrow="Payment Failed"
            title="결제에 실패했습니다"
            message="결제가 정상적으로 완료되지 않았습니다. 다시 시도하거나 다른 결제 수단을 선택해주세요."
            actions={
                <>
                    <Button variant="secondary" onClick={() => navigate(-1)}>
                        이전 페이지로
                    </Button>
                    <Button onClick={() => navigate("/")}>
                        홈으로 이동
                    </Button>
                </>
            }
        />
    );
}
