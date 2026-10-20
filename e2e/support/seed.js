// honeyRest_user 의 db/e2e-seed.sql 과 맞춘 상수 (시드 변경 시 함께 수정)

export const SEED_USER = {
    email: 'e2e.user@honeyrest.test',
    password: 'Honey1234!',
    name: '이투이',
    phone: '01012345678',
};

export const REGION_SEARCH_KEYWORD = '강릉';

export const OCEAN_HOTEL = {
    id: 1,
    name: '허니레스트 강릉 오션 호텔',
    // total_rooms=1 — 같은 날짜 두 번째 예약은 409
    singleRoom: { id: 101, name: '오션 스위트 (1실 한정)', price: 100_000 },
};

export const JEJU_PENSION = {
    id: 2,
    name: '허니레스트 서귀포 힐링 펜션',
    familyRoom: { id: 201, name: '패밀리 룸', price: 120_000 },
};

export const SEED_COUPON_NAME = 'E2E 5천원 할인';
