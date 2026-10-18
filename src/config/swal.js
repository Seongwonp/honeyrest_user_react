import Swal from "sweetalert2";

// SweetAlert2 공통 확인 버튼 설정
// - 배경색은 브랜드 honey 톤(노랑)을 유지
// - SweetAlert2 기본 흰 글자는 노란 배경에서 대비가 낮으므로(약 1.5:1)
//   customClass 로 진한 글자색을 적용한다 (스타일은 src/index.css 의 .swal-honey-confirm)

// 확인 버튼 배경색 (단일 상수)
export const SWAL_CONFIRM_COLOR = "#FDD835";

// Swal.fire 옵션에 펼쳐서 사용: Swal.fire({ ...SWAL_CONFIRM_OPTIONS, title, ... })
export const SWAL_CONFIRM_OPTIONS = {
    confirmButtonColor: SWAL_CONFIRM_COLOR,
    customClass: { confirmButton: "swal-honey-confirm" },
};

// 확인/취소 대화상자 (window.confirm 대체) — 확인을 누르면 true
// 예: if (!(await confirmSwal({ title: "정말 삭제하시겠습니까?" }))) return;
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
