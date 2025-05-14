import { Post } from '@/features/magazine/api';
import { getRandomImage } from '@/lib/utils';

// 임시 샘플 게시물 데이터
export const samplePosts: Post[] = [
  {
    id: '1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    title: '독서가 가져다 주는 마음의 평화',
    content: `<p>일상에 지친 현대인들에게 독서는 단순한 취미를 넘어 마음의 안식처가 됩니다. 책을 읽으면서 우리는 다른 세계로 여행할 수 있고, 다양한 관점에서 삶을 바라볼 수 있습니다.</p>
    <p>독서는 스트레스 해소에 탁월한 효과가 있습니다. 연구에 따르면 단 6분간의 독서만으로도 스트레스 수준이 68%까지 감소할 수 있다고 합니다. 이는 음악 감상이나 산책보다 더 효과적인 방법입니다.</p>
    <p>또한 독서는 공감 능력을 향상시킵니다. 소설을 통해 다양한 인물들의 삶과 감정을 경험함으로써 우리는 타인을 더 깊이 이해하게 됩니다. 이는 실제 인간관계에서도 더 나은 소통을 가능하게 합니다.</p>
    <p>매일 조금씩이라도 독서하는 습관을 들이면, 삶의 질이 향상되고 마음의 평화를 찾을 수 있을 것입니다.</p>`,
    thumbnail_url: getRandomImage(800, 600),
    category: '에세이',
    excerpt: '독서가 가져다 주는 스트레스 해소와 정서적 안정에 대한 에세이',
    slug: 'peace-of-mind-from-reading',
    likes: 42,
    published: true,
    is_premium: false,
  },
  {
    id: '2',
    created_at: new Date(Date.now() - 86400000).toISOString(), // 1일 전
    updated_at: new Date(Date.now() - 86400000).toISOString(),
    title: '철학이 일상에 주는 가치',
    content: `<p>철학은 때로 어렵고 추상적인 학문으로 여겨지지만, 실제로는 우리의 일상생활에 깊이 관련되어 있습니다. 철학적 사고는 우리가 세상을 바라보는 방식을 넓히고, 삶의 의미에 대해 더 깊이 생각하게 만듭니다.</p>
    <p>소크라테스의 "검토되지 않은 삶은 살 가치가 없다"라는 말처럼, 우리의 행동과 생각을 비판적으로 검토하는 것은 더 의미 있는 삶을 살기 위한 첫걸음입니다. 이는 일상에서 마주하는 작은 결정부터 인생의 큰 선택까지 모든 영역에 적용됩니다.</p>
    <p>스토아 철학에서는 우리가 통제할 수 없는 일에 대해 초연함을 유지하면서도, 우리가 영향을 미칠 수 있는 일에 최선을 다하라고 가르칩니다. 이러한 관점은 현대 사회의 스트레스와 불안에 대처하는 데 큰 도움이 됩니다.</p>
    <p>철학은 단지 과거의 위대한 사상가들의 생각을 배우는 것이 아니라, 그들의 통찰을 바탕으로 우리 자신의 삶을 더 깊이 이해하고 풍요롭게 만드는 실천적인 도구입니다.</p>`,
    thumbnail_url: getRandomImage(800, 600),
    category: '인문학',
    excerpt: '철학적 사고가 일상 생활에 어떤 실질적인 가치를 주는지 탐구합니다.',
    slug: 'value-of-philosophy-in-daily-life',
    likes: 38,
    published: true,
    is_premium: true,
  },
  {
    id: '3',
    created_at: new Date(Date.now() - 172800000).toISOString(), // 2일 전
    updated_at: new Date(Date.now() - 172800000).toISOString(),
    title: '현대 미술의 이해: 왜 저것이 예술인가?',
    content: `<p>현대 미술 전시회에서 흔히 "이게 왜 예술이지?"라는 의문이 들곤 합니다. 단색 캔버스나 일상적인 물건을 그대로 전시한 작품들이 왜 수백만 달러에 거래되는지 이해하기 어려울 수 있습니다.</p>
    <p>현대 미술은 20세기 초반 마르셀 뒤샹이 소변기에 서명하고 '샘(Fountain)'이라는 제목을 붙여 전시했을 때부터 큰 변화를 겪었습니다. 이 행위는 예술이 꼭 기술적 솜씨나 미적 아름다움을 갖추어야 하는 것이 아니라, 관념과 맥락에 관한 것일 수 있다는 혁명적인 개념을 제시했습니다.</p>
    <p>현대 미술은 종종 사회적, 정치적, 철학적 질문을 던지며, 관객들이 작품과 상호작용하고 자신만의 해석을 발전시키도록 초대합니다. 이는 단순한 시각적 즐거움을 넘어서는 지적, 정서적 경험을 제공합니다.</p>
    <p>다음번 현대 미술 전시회를 방문할 때는, "이것이 예술인가?"라고 묻기보다 "이 작품이 나에게 어떤 생각과 감정을 불러일으키는가?"라고 물어보세요. 그렇게 하면 현대 미술의 풍요로운 세계를 더 깊이 경험할 수 있을 것입니다.</p>`,
    thumbnail_url: getRandomImage(800, 600),
    category: '문화',
    excerpt: '현대 미술을 이해하는 방법과 그 가치에 대한 안내',
    slug: 'understanding-modern-art',
    likes: 27,
    published: true,
    is_premium: false,
  },
  {
    id: '4',
    created_at: new Date(Date.now() - 259200000).toISOString(), // 3일 전
    updated_at: new Date(Date.now() - 259200000).toISOString(),
    title: '관계 회복을 위한 효과적인 대화법',
    content: `<p>인간관계에서 갈등은 피할 수 없는 부분입니다. 하지만 갈등 자체보다 중요한 것은 그것을 어떻게 해결하느냐입니다. 대화는 관계 회복의 가장 기본적이면서도 강력한 도구입니다.</p>
    <p>효과적인 대화의 첫 번째 단계는 경청입니다. 상대방의 말을 차단하거나 방어적인 태도를 취하지 않고, 진심으로 이해하려는 노력이 필요합니다. "내가 이해한 바로는..."이라고 시작하는 말로 상대방의 입장을 요약해보는 것이 도움이 됩니다.</p>
    <p>'나' 메시지를 사용하는 것도 중요합니다. "너는 항상..."이라는 비난 대신 "나는 ~할 때 ~라고 느껴"라는 방식으로 자신의 감정과 필요를 표현하세요. 이는 상대방의 방어적인 반응을 줄이고 진정한 대화를 가능하게 합니다.</p>
    <p>또한 타협할 준비가 되어 있어야 합니다. 완벽한 해결책이 아니더라도, 양쪽 모두가 어느 정도 만족할 수 있는 중간지점을 찾는 것이 지속적인 관계 유지에 도움이 됩니다.</p>
    <p>마지막으로, 관계 회복은 시간이 필요한 과정임을 인정하세요. 한 번의 대화로 모든 것이 해결되지 않을 수 있으며, 지속적인 노력과 인내가 필요합니다.</p>`,
    thumbnail_url: getRandomImage(800, 600),
    category: '상담',
    excerpt: '갈등 상황에서 관계를 회복하기 위한 효과적인 대화 방법',
    slug: 'effective-communication-for-relationship-healing',
    likes: 56,
    published: true,
    is_premium: true,
  },
  {
    id: '5',
    created_at: new Date(Date.now() - 345600000).toISOString(), // 4일 전
    updated_at: new Date(Date.now() - 345600000).toISOString(),
    title: '베스트셀러 작가와의 대화: 창작의 비밀',
    content: `<p>오늘 우리는 최근 출간된 소설 '시간의 틈새'로 큰 화제를 모으고 있는 김민수 작가를 만나 창작 과정과 작가로서의 삶에 대해 이야기를 나누었습니다.</p>
    <p><strong>Q: 작가님의 창작 루틴은 어떻게 되나요?</strong></p>
    <p>A: 저는 아침형 인간입니다. 보통 새벽 5시에 일어나 커피 한 잔과 함께 하루를 시작합니다. 그 시간이 가장 방해받지 않고 집중할 수 있어요. 오전 중에 3-4시간 정도 글을 쓰고, 오후에는 주로 리서치와 독서에 시간을 씁니다. 매일 일정한 시간에 글을 쓰는 습관이 중요하다고 생각해요.</p>
    <p><strong>Q: 작가의 길을 걷게 된 계기가 있으신가요?</strong></p>
    <p>A: 어릴 때부터 이야기를 만들고 글을 쓰는 것을 좋아했어요. 하지만 전업 작가가 되기까지는 오랜 시간이 걸렸습니다. 대학에서는 경영학을 전공했고, 10년 가까이 회사원으로 일했죠. 그러다 서른다섯 살에 첫 단편소설이 문학상을 받으면서 새로운 가능성을 보게 되었고, 결국 회사를 그만두고 작가의 길로 들어섰습니다.</p>
    <p><strong>Q: '시간의 틈새'를 쓰게 된 영감은 어디서 얻으셨나요?</strong></p>
    <p>A: 우연히 할아버지의 오래된 일기장을 발견했는데, 거기에는 제가 알지 못했던 가족의 역사가 담겨 있었어요. 그 일기를 읽으면서 '기억'과 '시간'에 대해 깊이 생각하게 되었고, 그것이 이 소설의 씨앗이 되었습니다. 우리가 기억하는 과거와 실제 일어난 일 사이의 간극, 그리고 그 틈새에서 발생하는 이야기들이 저를 매료시켰죠.</p>
    <p><strong>Q: 작가 지망생들에게 해주고 싶은 조언이 있으신가요?</strong></p>
    <p>A: 많이 읽고, 많이 쓰고, 많이 살아보세요. 독서는 좋은 글을 쓰기 위한 필수 조건이고, 꾸준히 글을 쓰는 습관은 기술을 향상시키는 유일한 방법입니다. 그리고 다양한 경험을 통해 세상을 관찰하는 눈을 키우는 것도 중요합니다. 마지막으로, 거절과 실패를 두려워하지 마세요. 제 첫 원고는 일곱 번이나 반려되었지만, 포기하지 않고 계속 도전했기 때문에 지금 여기 있을 수 있습니다.</p>`,
    thumbnail_url: getRandomImage(800, 600),
    category: '인터뷰',
    excerpt: '베스트셀러 작가와 나눈 창작 과정과 작가의 삶에 대한 대화',
    slug: 'conversation-with-bestselling-author',
    likes: 34,
    published: true,
    is_premium: false,
  }
];

// 인기 게시물
export const samplePopularPosts = samplePosts.sort((a, b) => b.likes - a.likes).slice(0, 3);

// 카테고리별 게시물
export function getSamplePostsByCategory(category: string): Post[] {
  return samplePosts.filter(post => post.category === category);
}

// 게시물 상세 조회
export function getSamplePostBySlug(slug: string): Post | undefined {
  return samplePosts.find(post => post.slug === slug);
} 