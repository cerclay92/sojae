export const SUBSCRIPTION_TYPES = [
  {
    id: 'monthly',
    name: '월간 구독',
    price: 1100,
    description: '매월 새로운 콘텐츠를 이메일로 받아보세요.',
    duration: 1, // 개월 단위
  },
  {
    id: 'yearly',
    name: '연간 구독',
    price: 11000,
    description: '1개월 무료 혜택이 포함된 연간 구독입니다.',
    duration: 12, // 개월 단위
  },
] as const;

export type SubscriptionType = (typeof SUBSCRIPTION_TYPES)[number]['id'];

export const SUBSCRIPTION_STATUS = {
  ACTIVE: 'active',
  EXPIRED: 'expired',
  CANCELED: 'canceled',
} as const;

export type SubscriptionStatus =
  (typeof SUBSCRIPTION_STATUS)[keyof typeof SUBSCRIPTION_STATUS]; 