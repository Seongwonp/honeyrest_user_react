// 사용자 여정 E2E — 회원가입부터 예약·결제·취소 요청·리뷰·로그아웃까지.
//
// 전제: playwright.config.js 의 webServer 가 사용자 API(e2e 프로필, 새 H2 DB + 시드)와
//       프론트 개발 서버(VITE_E2E=true)를 띄운다. 시드 값은 support/seed.js 참고.
//
// 시나리오
//   (a) 회원가입 → e2e 전용 엔드포인트로 인증 토큰 조회 → 이메일 인증 → 로그인
//   (b) 지역/날짜 검색 → 숙소 상세 → 객실 선택 → 예약 정보 입력 → 테스트 결제 → 마이페이지 예약 목록
//   (c) 같은 날짜에 total_rooms=1 객실을 다시 결제 → 409 안내
//   (d) 예약 상세에서 취소 요청 → 상태 "취소 요청"
//   (e) 이용 완료 전 리뷰 작성 차단(토스트) → e2e 전용 엔드포인트로 COMPLETED 처리 → 리뷰 작성 → 숙소 상세에 노출
//   (f) 로그아웃 → 보호 라우트 접근 시 로그인 페이지로 이동
import { test, expect } from '@playwright/test';
import { SEED_USER, REGION_SEARCH_KEYWORD, OCEAN_HOTEL, JEJU_PENSION, SEED_COUPON_NAME } from './support/seed.js';
import { daysFromToday } from './support/dates.js';
import { fetchVerificationToken, completeReservation, fetchTossCancellations } from './support/api.js';
import {
    loginViaUi,
    pickDateRange,
    proceedFromRoomToPayment,
    payWithTestPayment,
    reservationCard,
    reservationIdFromCard,
} from './support/flows.js';

const toast = (page, text) => page.locator('.Toastify').getByText(text);

test.describe('회원가입', () => {
    test('(a) 회원가입 → 인증 토큰 조회 → 이메일 인증 → 로그인', async ({ page, request }) => {
        const email = `e2e.signup.${Date.now()}@honeyrest.test`;
        const password = 'Signup1234!';

        await page.goto('/signup');
        const form = page.locator('form');
        await form.locator('input[name="name"]').fill('가입테스트');
        await form.locator('input[name="email"]').fill(email);
        await form.locator('input[name="password"]').fill(password);
        await form.locator('input[name="confirmPassword"]').fill(password);
        await form.locator('input[name="phone"]').fill('01098765432');
        await form.locator('input[name="birthDate"]').fill('1990-01-01');
        await form.locator('#signup-gender').selectOption('FEMALE');
        await form.getByLabel('전체 동의').check();
        await form.getByRole('button', { name: '회원가입' }).click();

        await expect(page).toHaveURL(/\/verify-email$/);
        await expect(page.getByText('이메일 인증을 완료해 주세요')).toBeVisible();

        // 메일 대신 e2e 프로필 전용 엔드포인트에서 가입 인증 토큰을 받는다.
        const token = await fetchVerificationToken(request, email);
        expect(token).toBeTruthy();

        await page.goto(`/verify?token=${encodeURIComponent(token)}`);
        await expect(page.getByText('이메일 인증이 완료되었습니다!')).toBeVisible();

        await loginViaUi(page, { email, password });
        await expect(page.getByText('가입테스트님')).toBeVisible();
    });
});

test.describe.serial('예약 여정 (시드 회원)', () => {
    /** @type {import('@playwright/test').BrowserContext} */
    let context;
    /** @type {import('@playwright/test').Page} */
    let page;
    /** (b) 결제 직전까지 진행해 둔 두 번째 탭 — (c) 에서 같은 객실·날짜로 결제한다. */
    let stalePage;

    // (b)(c)(d): 1실 한정 객실, 오늘+7 ~ 오늘+9 (2박). 취소 요청 가능 기한(체크인 전날)보다 충분히 앞선다.
    const oceanStay = { checkIn: daysFromToday(7), checkOut: daysFromToday(9) };
    // (e): 펜션 패밀리 룸, 오늘+14 ~ 오늘+15 (1박)
    const pensionStay = { checkIn: daysFromToday(14), checkOut: daysFromToday(15) };
    const stayQuery = (stay) => `checkIn=${stay.checkIn.iso}&checkOut=${stay.checkOut.iso}&guests=2`;

    let oceanReservationId;
    let pensionReservationId;

    test.beforeAll(async ({ browser }, testInfo) => {
        const { baseURL, locale, timezoneId, viewport, userAgent, deviceScaleFactor } = testInfo.project.use;
        // 여러 테스트가 로그인 상태·탭을 이어 쓰므로 컨텍스트를 직접 만든다 (트레이스는 config 의 trace 설정이 자동 적용).
        context = await browser.newContext({ baseURL, locale, timezoneId, viewport, userAgent, deviceScaleFactor });
        // 홈 첫 방문 소개 영상 모달("오늘 하루 보지 않기" 쿠키)을 미리 꺼 둔다. 검색창을 가리기 때문.
        await context.addCookies([{ name: 'hideIntroModal', value: 'true', url: baseURL }]);
        page = await context.newPage();
    });

    test.afterAll(async () => {
        await context?.close();
    });

    test('(b) 지역·날짜 검색 → 상세 → 객실 선택 → 예약 → 테스트 결제 → 마이페이지 예약 목록', async () => {
        await loginViaUi(page, SEED_USER);

        // 홈 검색: 지역 + 날짜(달력) + 기본 인원 2명
        await page.goto('/');
        await page.getByPlaceholder('어디로 떠나시나요?').fill(REGION_SEARCH_KEYWORD);
        await page.getByRole('button', { name: /날짜를 선택하세요/ }).click();
        await pickDateRange(page, oceanStay.checkIn, oceanStay.checkOut);
        await expect(page.getByText(`${oceanStay.checkIn.iso} - ${oceanStay.checkOut.iso} (2박)`)).toBeVisible();
        await page.getByRole('button', { name: /검색하기/ }).click();

        // 검색 결과: 강릉 숙소만
        await expect(page).toHaveURL(/\/accommodations\?/);
        const hotelCard = page.getByRole('link').filter({ hasText: OCEAN_HOTEL.name });
        await expect(hotelCard).toBeVisible();
        await expect(page.getByRole('link').filter({ hasText: JEJU_PENSION.name })).toHaveCount(0);
        await hotelCard.click();

        // 숙소 상세 → 객실 선택
        await expect(page).toHaveURL(new RegExp(`/accommodations/${OCEAN_HOTEL.id}\\?`));
        await expect(page.getByRole('heading', { name: OCEAN_HOTEL.name }).first()).toBeVisible();
        await page.getByRole('link').filter({ hasText: OCEAN_HOTEL.singleRoom.name }).click();
        await expect(page).toHaveURL(new RegExp(`/room/${OCEAN_HOTEL.singleRoom.id}\\?${stayQuery(oceanStay)}`));

        // 예약 정보 입력 → 결제 페이지 (시드 쿠폰이 선택지에 보이는지만 확인하고 사용하지 않는다)
        await proceedFromRoomToPayment(page, {
            roomName: OCEAN_HOTEL.singleRoom.name,
            beforeSubmit: async () => {
                await expect(page.locator('#reservation-couponId')).toContainText(SEED_COUPON_NAME);
            },
        });
        await expect(page.getByText('200,000원').first()).toBeVisible();

        // (c) 준비: 다른 탭에서 같은 객실·날짜로 결제 직전까지 진행해 둔다 (아직 재고가 남아 있을 때 연 화면).
        stalePage = await context.newPage();
        await stalePage.goto(`/room/${OCEAN_HOTEL.singleRoom.id}?${stayQuery(oceanStay)}`);
        await proceedFromRoomToPayment(stalePage, { roomName: OCEAN_HOTEL.singleRoom.name });

        // 테스트 결제 → 서버 토스 스텁 승인 → 예약 완료
        await payWithTestPayment(page);
        await expect(page).toHaveURL(/\/reservation\/complete$/);
        await expect(page.getByRole('heading', { name: '예약이 완료되었습니다!' })).toBeVisible();

        // 마이페이지 예약 목록
        await page.goto('/user/mypage/reservations');
        const card = reservationCard(page, { accommodationName: OCEAN_HOTEL.name, roomName: OCEAN_HOTEL.singleRoom.name });
        await expect(card).toBeVisible();
        await expect(card).toContainText('예약 완료');
        await expect(card).toContainText(`${oceanStay.checkIn.iso} ~ ${oceanStay.checkOut.iso}`);
        await expect(card).toContainText('200,000');
        oceanReservationId = await reservationIdFromCard(card);
    });

    test('(c) 같은 날짜에 1실 한정 객실을 다시 결제하면 409 안내', async ({ request }) => {
        test.skip(!stalePage, '(b) 에서 준비한 탭이 없음');

        await payWithTestPayment(stalePage);
        await expect(stalePage).toHaveURL(/\/payment\/success\?/);
        await expect(stalePage.getByText('결제 승인에 실패했습니다')).toBeVisible();
        await expect(stalePage.getByText('선택하신 날짜에 예약 가능한 객실이 없습니다.')).toBeVisible();
        await expect(stalePage.getByText('오류 코드: 409')).toBeVisible();

        // 재고 사전 검증에서 막혀 결제 승인 자체가 일어나지 않았으므로 보상 취소도 없어야 한다.
        expect(await fetchTossCancellations(request)).toEqual([]);

        // 지금 새로 연 객실 상세는 예약 불가로 보인다.
        await stalePage.goto(`/room/${OCEAN_HOTEL.singleRoom.id}?${stayQuery(oceanStay)}`);
        await expect(stalePage.getByText('예약 불가', { exact: true })).toBeVisible();
        await stalePage.close();
    });

    test('(d) 예약 상세에서 취소 요청 → 상태 "취소 요청"', async () => {
        await page.goto(`/user/mypage/reservations/${oceanReservationId}`);
        await expect(page.getByTestId('reservation-status')).toHaveText('예약 완료');
        await page.getByRole('link', { name: '예약 취소 요청' }).click();

        await expect(page).toHaveURL(new RegExp(`/user/reservations/${oceanReservationId}/cancel-request$`));
        await page.locator('#cancel-reason').selectOption('일정 변경');
        for (const agreement of [
            '환불 규정을 확인하였으며, 이에 동의합니다.',
            '취소 가능 기간을 확인하였으며, 이에 동의합니다.',
            '취소 승인 절차를 확인하였으며, 이에 동의합니다.',
            '취소 거부 가능성을 확인하였으며, 이에 동의합니다.',
        ]) {
            await page.getByLabel(agreement).check();
        }
        await page.getByRole('button', { name: '요청하기' }).click();

        await expect(toast(page, '취소 요청이 접수되었습니다.')).toBeVisible();
        await expect(page).toHaveURL(/\/user\/mypage\/reservations$/);
        await expect(
            reservationCard(page, { accommodationName: OCEAN_HOTEL.name, roomName: OCEAN_HOTEL.singleRoom.name }),
        ).toContainText('취소 요청');

        await page.goto(`/user/mypage/reservations/${oceanReservationId}`);
        await expect(page.getByTestId('reservation-status')).toHaveText('취소 요청');
        await expect(page.getByRole('link', { name: '예약 취소 요청' })).toHaveCount(0);
    });

    test('(e) 이용 완료 전 리뷰 차단 → COMPLETED 처리 → 리뷰 작성 → 숙소 상세에 노출', async ({ request }) => {
        const reviewContent = `E2E 리뷰: 귤밭 뷰가 정말 좋았고 객실도 깨끗했어요. (${Date.now()})`;
        const fillReview = async () => {
            for (const [label, score] of [['청결도', 5], ['서비스', 5], ['시설', 4], ['위치', 5]]) {
                await page.getByRole('button', { name: `${label} ${score}점`, exact: true }).click();
            }
            await page.locator('#review-write-content').fill(reviewContent);
        };

        // 리뷰 대상 예약 만들기 (펜션 패밀리 룸, 객실 상세에서 바로 예약)
        await page.goto(`/room/${JEJU_PENSION.familyRoom.id}?${stayQuery(pensionStay)}`);
        await proceedFromRoomToPayment(page, { roomName: JEJU_PENSION.familyRoom.name });
        await payWithTestPayment(page);
        await expect(page.getByRole('heading', { name: '예약이 완료되었습니다!' })).toBeVisible();

        await page.goto('/user/mypage/reservations');
        const card = reservationCard(page, { accommodationName: JEJU_PENSION.name, roomName: JEJU_PENSION.familyRoom.name });
        await expect(card).toContainText('예약 완료');
        pensionReservationId = await reservationIdFromCard(card);

        // 이용 완료 전: 예약 상세에 리뷰 버튼이 없고, 작성 화면에 직접 들어가 제출해도 서버가 거절한다.
        await page.goto(`/user/mypage/reservations/${pensionReservationId}`);
        await expect(page.getByTestId('reservation-status')).toHaveText('예약 완료');
        await expect(page.getByRole('link', { name: '리뷰 작성하기' })).toHaveCount(0);

        await page.goto(`/user/mypage/reviews/write/${pensionReservationId}`);
        await fillReview();
        await page.getByRole('button', { name: '리뷰 등록' }).click();
        await expect(toast(page, '이용이 완료된 예약만 리뷰를 작성할 수 있습니다.')).toBeVisible();
        // 에러 페이지로 튕기지 않고 작성 화면에 머문다.
        await expect(page).toHaveURL(new RegExp(`/reviews/write/${pensionReservationId}$`));

        // 호스트 체크아웃 처리 대신 e2e 전용 엔드포인트로 이용 완료 처리
        await completeReservation(request, pensionReservationId);

        await page.goto(`/user/mypage/reservations/${pensionReservationId}`);
        await expect(page.getByTestId('reservation-status')).toHaveText('이용 완료');
        await page.getByRole('link', { name: '리뷰 작성하기' }).click();
        await expect(page).toHaveURL(new RegExp(`/reviews/write/${pensionReservationId}$`));
        await fillReview();
        await page.getByRole('button', { name: '리뷰 등록' }).click();
        await expect(toast(page, '리뷰가 등록되었습니다.')).toBeVisible();
        await expect(page).toHaveURL(/\/user\/mypage\/reservations$/);

        // 숙소 상세 리뷰 영역에 노출
        await page.goto(`/accommodations/${JEJU_PENSION.id}?${stayQuery(pensionStay)}`);
        await expect(page.getByText(reviewContent)).toBeVisible();

        // 같은 예약으로는 다시 작성할 수 없다 (상세에서 버튼 사라짐)
        await page.goto(`/user/mypage/reservations/${pensionReservationId}`);
        await expect(page.getByRole('link', { name: '리뷰 작성하기' })).toHaveCount(0);
    });

    test('(f) 로그아웃 → 보호 라우트 접근 시 로그인 페이지로 이동', async () => {
        await page.goto('/');
        page.once('dialog', (dialog) => dialog.accept()); // "로그아웃하시겠습니까?" 확인
        await page.getByRole('button', { name: '로그아웃' }).click();
        await expect(page.getByRole('heading', { name: /로그아웃되었습니다/ })).toBeVisible();

        await page.goto('/user/mypage/reservations');
        await expect(page).toHaveURL(/\/login$/);
        await expect(page.locator('form').getByRole('button', { name: '로그인', exact: true })).toBeVisible();
        await expect(page.getByRole('button', { name: '로그아웃' })).toHaveCount(0);

        // 다시 로그인하면 원래 가려던 보호 라우트로 돌아간다.
        await page.getByLabel('이메일').fill(SEED_USER.email);
        await page.getByLabel('비밀번호').fill(SEED_USER.password);
        await page.locator('form').getByRole('button', { name: '로그인', exact: true }).click();
        await page.getByRole('dialog').getByRole('button', { name: '확인' }).click();
        await expect(page).toHaveURL(/\/user\/mypage\/reservations$/);
    });
});
