import Swal from "sweetalert2";

// 노란 배경에 흰 글자는 대비가 낮아서 진한 글자색 클래스를 쓴다 (index.css .swal-honey-confirm)

export const SWAL_CONFIRM_COLOR = "#FDD835";

// Swal.fire({ ...SWAL_CONFIRM_OPTIONS, title }) 처럼 사용
export const SWAL_CONFIRM_OPTIONS = {
    confirmButtonColor: SWAL_CONFIRM_COLOR,
    customClass: { confirmButton: "swal-honey-confirm" },
};

// window.confirm 대신 사용. 확인이면 true
export const confirmSwal = async ({
    title,
    text,
    icon = "warning",
    confirmButtonText = "확인",
    cancelButtonText = "취소",
}) => {
    const result = await Swal.fire({
        ...SWAL_CONFIRM_OPTIONS,
        title,
        text,
        icon,
        showCancelButton: true,
        confirmButtonText,
        cancelButtonText,
        reverseButtons: true,
        focusCancel: true,
    });
    return result.isConfirmed;
};
