// 예약 상태별 라벨 / 배지 색상 (예약 목록·예약 상세 공용)
// 서버 상태값은 honeyrest-domain 의 ReservationStatus 기준
export const RESERVATION_STATUS_META = {
    PENDING: { label: "결제 대기", className: "bg-gray-100 text-gray-500" },
    CONFIRMED: { label: "예약 완료", className: "bg-leaf-green/10 text-leaf-green-dark" },
    CANCEL_REQUEST: { label: "취소 요청", className: "bg-honey-yellow/15 text-honey-yellow-dark" },
    COMPLETED: { label: "이용 완료", className: "bg-leaf-green/10 text-leaf-green-dark" },
    NO_SHOW: { label: "노쇼", className: "bg-gray-100 text-gray-500" },
    CANCELLED: { label: "예약 취소됨", className: "bg-red-50 text-red-500" },
    REJECTED: { label: "취소 거절됨", className: "bg-gray-100 text-gray-500" },
};

export const getReservationStatusMeta = (status) =>
    RESERVATION_STATUS_META[status] || { label: status, className: "bg-gray-100 text-gray-500" };
