export const SUBSCRIPTION_TYPES = [
  {
    id: 'monthly',
    name: '월간 구독',
    price: 1000,
    description: '매월 새로운 콘텐츠를 이메일로 받아보세요.',
    duration: 1, // 개월 단위
  },
  {
    id: 'yearly',
    name: '연간 구독',
    price: 10000,
    description: '20% 할인된 가격으로 1년간 모든 콘텐츠를 이메일로 받아보세요.',
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