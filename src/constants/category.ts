export const CATEGORIES = [
  {
    id: '에세이',
    numericId: 1,
    name: '에세이',
    description: '일상과 생각을 담은 에세이',
  },
  {
    id: '인문학',
    numericId: 2,
    name: '인문학',
    description: '인문학적 통찰과 지식',
  },
  {
    id: '문화',
    numericId: 3,
    name: '문화',
    description: '다양한 문화 소식과 이야기',
  },
  {
    id: '상담',
    numericId: 4,
    name: '상담',
    description: '다양한 상담 사례와 조언',
  },
  {
    id: '인터뷰',
    numericId: 5,
    name: '인터뷰',
    description: '흥미로운 인물들과의 대화',
  },
] as const;

export type Category = (typeof CATEGORIES)[number]['id'];

export const CATEGORY_MAP = CATEGORIES.reduce(
  (acc, category) => {
    acc[category.id] = category;
    return acc;
  },
  {} as Record<Category, (typeof CATEGORIES)[number]>
);

// 카테고리 ID(문자열)를 숫자 ID로 매핑하는 객체
export const CATEGORY_ID_TO_NUMERIC: Record<Category, number> = CATEGORIES.reduce(
  (acc, category) => {
    acc[category.id] = category.numericId;
    return acc;
  },
  {} as Record<Category, number>
);

// 숫자 ID를 카테고리 객체로 매핑하는 객체
export const NUMERIC_ID_TO_CATEGORY: Record<number, (typeof CATEGORIES)[number]> = CATEGORIES.reduce(
  (acc, category) => {
    acc[category.numericId] = category;
    return acc;
  },
  {} as Record<number, (typeof CATEGORIES)[number]>
); 