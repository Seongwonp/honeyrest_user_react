// 여러 시나리오에서 반복되는 화면 조작 도우미.
// 선택자는 가능한 한 사용자가 보는 라벨/역할/텍스트 기준으로 잡는다.
import { expect } from '@playwright/test';

/** 로그인 화면에서 이메일/비밀번호로 로그인하고 환영 알림(SweetAlert)을 닫는다. */
export async function loginViaUi(page, { email, password }) {
    await page.goto('/login');
    await page.getByLabel('이메일').fill(email);
    await page.getByLabel('비밀번호').fill(password);
    await page.locator('form').getByRole('button', { name: '로그인', exact: true }).click();

    const welcome = page.getByRole('dialog');
    await expect(welcome).toContainText('환영합니다');
    await welcome.getByRole('button', { name: '확인' }).click();
    await expect(page.getByRole('button', { name: '로그아웃' })).toBeVisible();
}

/**
 * 홈 검색창의 날짜 선택 모달(react-date-range, 2개월 표시)에서 체크인/체크아웃을 고른다.
 * 첫 클릭 후 달력이 체크인 달로 이동하므로 매번 "N월 YYYY" 이름으로 해당 달을 다시 찾고,
 * 보이지 않으면 다음 달 버튼을 누른다.
 * @param {{year:number, month:number, day:number}} checkIn
 * @param {{year:number, month:number, day:number}} checkOut
 */
export async function pickDateRange(page, checkIn, checkOut) {
    for (const date of [checkIn, checkOut]) {
        const monthName = `${date.month}월 ${date.year}`;
        const month = page.locator('.rdrMonth').filter({
            has: page.locator('.rdrMonthName', { hasText: new RegExp(`^${monthName}$`) }),
        });
        for (let i = 0; i < 6 && (await month.count()) === 0; i++) {
            await page.locator('.rdrNextButton').click();
        }
        await month
            .locator('button.rdrDay:not(.rdrDayPassive):not(.rdrDayDisabled)')
            .filter({ hasText: new RegExp(`^${date.day}$`) })
            .click();
    }
}

/**
 * 객실 상세(/room/:id?checkIn&checkOut&guests)에서 "예약하기" → 예약 정보 입력 → 결제 페이지(/payment/process)까지 진행한다.
 * 예약자 정보는 로그인 회원 정보(form-info)로 미리 채워진다.
 * beforeSubmit: 예약 정보 화면에서 "결제하고 예약하기" 직전에 실행할 추가 확인(선택)
 */
export async function proceedFromRoomToPayment(page, { roomName, beforeSubmit }) {
    await expect(page.getByRole('heading', { name: roomName })).toBeVisible();
    await expect(page.getByText('예약 가능', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: '예약하기' }).click();

    await expect(page).toHaveURL(/\/reserve$/);
    await expect(page.getByRole('heading', { name: '예약 정보 입력 및 결제' })).toBeVisible();
    // 회원 예약은 form-info 응답으로 예약자 이름/전화번호가 미리 채워진다.
    await expect(page.locator('#reservation-guestName')).not.toHaveValue('');
    await expect(page.locator('#reservation-guestPhone')).not.toHaveValue('');

    await page.getByRole('radio', { name: '간편 결제' }).click();
    await page.getByLabel('전체 동의', { exact: true }).check();
    if (beforeSubmit) await beforeSubmit();
    await page.getByRole('button', { name: '결제하고 예약하기' }).click();

    await expect(page).toHaveURL(/\/payment\/process$/);
    await expect(page.getByText('결제 정보 확인')).toBeVisible();
}

/** 결제 페이지의 e2e 전용 "테스트 결제" 버튼으로 결제한다 (VITE_E2E=true 일 때만 렌더링). */
export async function payWithTestPayment(page) {
    await page.getByTestId('e2e-test-payment').click();
}

/** 마이페이지 예약 목록에서 예약 카드 링크를 찾는다. */
export function reservationCard(page, { accommodationName, roomName }) {
    return page
        .getByRole('link')
        .filter({ hasText: accommodationName })
        .filter({ hasText: roomName });
}

/** 예약 카드 링크(href=/user/mypage/reservations/{id})에서 예약 ID 를 꺼낸다. */
export async function reservationIdFromCard(card) {
    const href = await card.getAttribute('href');
    const match = href?.match(/\/reservations\/(\d+)$/);
    if (!match) throw new Error(`예약 링크에서 ID 를 찾지 못했습니다: ${href}`);
    return Number(match[1]);
}
