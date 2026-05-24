const CONFIG = window.ARTBUS_CONFIG || {};
const STORAGE_BUCKET = 'artbus-media';
const ADMIN_EMAILS = ['freecompr20@gmail.com'];
const FALLBACK_UPLOAD_IMAGE = 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=1000&q=82';

const CATEGORY_LABELS = {
  all: '전체',
  photo: '사진',
  video: '영상',
  illustration: '일러스트',
  painting: '파인아트',
  ai_image: 'AI 이미지',
  ai_video: 'AI 영상',
};

const LICENSE_LABELS = {
  standard: 'Standard',
  extended: 'Extended',
  exclusive: 'Exclusive',
};

const QUICK_TAGS = ['제품 촬영', '서울 야경', '쇼츠 배경', '수채화', 'UI 그래픽', '브랜드'];

const SAMPLE_ASSETS = [
  ['네온 스카이라인', 'photo', 28000, 'extended', ['도시', '야경', '4K'], 'Studio Lumen', 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1000&q=82', 4920],
  ['몽환 수채 일러스트', 'illustration', 15000, 'standard', ['수채화', '포스터'], 'Mina Park', 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=1000&q=82', 1880],
  ['시네마틱 오션', 'video', 45000, 'extended', ['4K', '자연'], 'Frame & Tide', 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1000&q=82', 3812],
  ['황금 추상 회화', 'painting', 52000, 'exclusive', ['추상', '인테리어'], 'Studio Lumen', 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=1000&q=82', 902],
  ['미니멀 포트레이트', 'photo', 22000, 'standard', ['인물', '스튜디오'], 'Kai Chen', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1000&q=82', 2210],
  ['UI 아이콘 시스템', 'illustration', 12000, 'standard', ['UI', '벡터'], 'Pixel Forge', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&q=82', 1720],
  ['비즈니스 토크', 'photo', 18000, 'standard', ['비즈니스', '스피치'], 'Wave Stock', 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1000&q=82', 820],
  ['3D 메탈 텍스처', 'illustration', 35000, 'extended', ['3D', '메탈'], 'Pixel Forge', 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=1000&q=82', 2780],
  ['숲속 안개', 'photo', 26000, 'extended', ['자연', '숲'], 'Studio Lumen', 'https://images.unsplash.com/photo-1441974231530-c6227db76b6e?w=1000&q=82', 3110],
  ['제품 스튜디오', 'photo', 30000, 'extended', ['제품', '커머스'], 'Wave Stock', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1000&q=82', 1450],
  ['생화 포스터', 'painting', 32000, 'standard', ['생화', '포스터'], 'Color House', 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=1000&q=82', 760],
  ['도심 타임랩스', 'video', 62000, 'exclusive', ['타임랩스', '도시'], 'Motion Lab', 'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?w=1000&q=82', 3370],
].map((item, index) => ({
  id: `sample-${index + 1}`,
  title: item[0],
  category: item[1],
  price: item[2],
  license: item[3],
  tags: item[4],
  author_name: item[5],
  author_id: null,
  media_url: item[6],
  media_type: 'image',
  downloads: item[7],
  description: `${item[0]} 콘텐츠입니다. 광고, 상세페이지, SNS 제작에 바로 적용할 수 있도록 라이선스 정보를 정리했습니다.`,
  created_at: new Date(Date.now() - index * 86400000).toISOString(),
}));

const EXTRA_SAMPLE_ASSETS = [
  ['제품 스튜디오 컷', 'photo', 30000, 'extended', ['제품', '커머스', '상세페이지'], 'Wave Stock', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1000&q=82', 4450],
  ['비즈니스 프레젠테이션', 'photo', 18000, 'standard', ['비즈니스', '스피치', '오피스'], 'Wave Stock', 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1000&q=82', 3820],
  ['카페 브랜딩 무드', 'photo', 21000, 'standard', ['카페', '라이프스타일', '브랜드'], 'Seoul Archive', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1000&q=82', 2980],
  ['화장품 패키지 클로즈업', 'photo', 34000, 'extended', ['뷰티', '제품', '프리미엄'], 'Commerce Lab', 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1000&q=82', 2760],
  ['푸드 딜리버리 컷', 'photo', 19000, 'standard', ['푸드', '배달', 'SNS'], 'Table Studio', 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1000&q=82', 2610],
  ['호텔 로비 인테리어', 'photo', 36000, 'extended', ['공간', '호텔', '인테리어'], 'Space Stock', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1000&q=82', 2520],
  ['피트니스 캠페인', 'photo', 24000, 'extended', ['스포츠', '건강', '캠페인'], 'Active Frame', 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1000&q=82', 2380],
  ['친환경 라이프스타일', 'photo', 27000, 'extended', ['친환경', '생활', '브랜드'], 'Green Mood', 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1000&q=82', 2140],
  ['도심 드론 무드', 'video', 58000, 'extended', ['드론', '도시', '오프닝'], 'Aerial Seoul', 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1000&q=82', 3260],
  ['브랜드 쇼츠 배경', 'video', 39000, 'standard', ['쇼츠', '릴스', '배경'], 'Shorts Factory', 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1000&q=82', 3020],
  ['커피 추출 슬로모션', 'video', 42000, 'extended', ['카페', '슬로모션', '푸드'], 'Table Studio', 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=1000&q=82', 2860],
  ['패션 런웨이 루프', 'video', 54000, 'extended', ['패션', '런웨이', '루프'], 'Motion Lab', 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=1000&q=82', 2690],
  ['테크 제품 회전컷', 'video', 48000, 'extended', ['테크', '제품', '광고'], 'Pixel Motion', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1000&q=82', 2410],
  ['자연광 홈 루틴', 'video', 35000, 'standard', ['홈', '생활', '루틴'], 'Daily Film', 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=1000&q=82', 2190],
  ['핀테크 대시보드 그래픽', 'illustration', 28000, 'extended', ['핀테크', '대시보드', 'UI'], 'Data Visual', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1000&q=82', 2680],
  ['교육 플랫폼 캐릭터', 'illustration', 18000, 'standard', ['교육', '캐릭터', '앱'], 'Mina Park', 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1000&q=82', 2450],
  ['헬스케어 라인 그래픽', 'illustration', 22000, 'extended', ['헬스케어', '라인', '인포그래픽'], 'Care Visual', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1000&q=82', 2310],
  ['커머스 쿠폰 배너', 'illustration', 14000, 'standard', ['배너', '쿠폰', '프로모션'], 'Pixel Forge', 'https://images.unsplash.com/photo-1607082350899-7e105aa886ae?w=1000&q=82', 2240],
  ['모바일 온보딩 씬', 'illustration', 26000, 'extended', ['모바일', '온보딩', 'SaaS'], 'App Story', 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1000&q=82', 2080],
  ['부동산 지도 그래픽', 'illustration', 20000, 'standard', ['지도', '부동산', '로컬'], 'Map Studio', 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1000&q=82', 1940],
  ['푸드 패키지 패턴', 'illustration', 17000, 'standard', ['패턴', '푸드', '패키지'], 'Color House', 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=1000&q=82', 1820],
  ['블루 모노톤 캔버스', 'painting', 42000, 'extended', ['블루', '추상', '벽면'], 'Gallery One', 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=1000&q=82', 1640],
  ['한지 질감 추상', 'painting', 46000, 'exclusive', ['한지', '질감', '브랜드'], 'Han Studio', 'https://images.unsplash.com/photo-1578926288207-a90a5366759d?w=1000&q=82', 1510],
  ['그린 오가닉 페인팅', 'painting', 38000, 'extended', ['그린', '오가닉', '친환경'], 'Green Mood', 'https://images.unsplash.com/photo-1579541591970-e5f6d0d2cbca?w=1000&q=82', 1430],
  ['모던 갤러리 월아트', 'painting', 56000, 'exclusive', ['갤러리', '월아트', '프리미엄'], 'Gallery One', 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=1000&q=82', 1320],
  ['코랄 컬러 필드', 'painting', 34000, 'standard', ['코랄', '컬러필드', '배경'], 'Color House', 'https://images.unsplash.com/photo-1579783901586-d88db74b4fe4?w=1000&q=82', 1210],
  ['잉크 플로우 아트', 'painting', 39000, 'extended', ['잉크', '흐름', '패키지'], 'Ink Room', 'https://images.unsplash.com/photo-1604871000636-074fa5117945?w=1000&q=82', 1090],
  ['AI 뷰티 캠페인', 'ai_image', 29000, 'extended', ['AI', '뷰티', '광고'], 'ArtBus AI Lab', 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1000&q=82', 2420],
  ['AI 커머스 제품컷', 'ai_image', 26000, 'standard', ['AI', '제품', '커머스'], 'ArtBus AI Lab', 'https://images.unsplash.com/photo-1682685797365-41f45b562c0a?w=1000&q=82', 2210],
  ['AI 브랜드 키비주얼', 'ai_image', 38000, 'extended', ['AI', '브랜드', '키비주얼'], 'Prompt Studio', 'https://images.unsplash.com/photo-1675271591211-126ad94e495d?w=1000&q=82', 1980],
  ['AI 숏폼 모션 배경', 'ai_video', 43000, 'extended', ['AI', '쇼츠', '모션'], 'Prompt Studio', 'https://images.unsplash.com/photo-1639322537228-f710d846310a?w=1000&q=82', 1860],
  ['AI 제품 티저 루프', 'ai_video', 52000, 'exclusive', ['AI', '티저', '루프'], 'ArtBus AI Lab', 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1000&q=82', 1740],
  ['AI 시네마틱 무드', 'ai_video', 48000, 'extended', ['AI', '시네마틱', '배경'], 'Future Frame', 'https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=1000&q=82', 1630],
].map((item, index) => ({
  id: `extra-${index + 1}`,
  title: item[0],
  category: item[1],
  price: item[2],
  license: item[3],
  tags: item[4],
  author_name: item[5],
  author_id: null,
  media_url: item[6],
  media_type: 'image',
  downloads: item[7],
  description: `${item[0]} 콘텐츠입니다. 광고, 상세페이지, SNS 제작에 바로 적용할 수 있도록 라이선스 정보와 가격을 정리했습니다.`,
  created_at: new Date(Date.now() - (index + SAMPLE_ASSETS.length) * 86400000).toISOString(),
}));

const COLLECTIONS = [
  ['제품 상세페이지', '커머스와 브랜드 소개에 어울리는 이미지', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&q=82'],
  ['숏폼 영상 배경', '릴스와 쇼츠용 무드 영상', 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=900&q=82'],
  ['도시와 야경', '광고 캠페인용 도심 이미지', 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=900&q=82'],
  ['브랜드 그래픽', 'UI, 3D, 추상 그래픽 소스', 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=900&q=82'],
];

const state = {
  assets: [...SAMPLE_ASSETS, ...EXTRA_SAMPLE_ASSETS],
  source: 'sample',
  query: '',
  category: 'all',
  license: 'all',
  sort: 'newest',
  client: null,
  user: null,
  expandedGroups: new Set(),
  editingAssetId: null,
  likedAssetIds: new Set(),
  cartAssetIds: new Set(),
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const ALL_SAMPLE_ASSETS = [...SAMPLE_ASSETS, ...EXTRA_SAMPLE_ASSETS];
let revealObserver = null;

function setupRevealAnimations(root = document) {
  const motionReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const textTargets = root.querySelectorAll('h1, h2, h3, .lead, .eyebrow, .section-copy, .muted, .hero-kpis div, .metric-grid div, .license-grid article, .site-footer > *');
  const itemTargets = root.querySelectorAll('.collection-card, .asset-card, .market-category-head, .category-strip button');
  const itemSet = new Set([...itemTargets]);

  [...textTargets, ...itemTargets].forEach((el, index) => {
    if (el.classList.contains('reveal-text') || el.classList.contains('reveal-item')) return;
    el.classList.add(itemSet.has(el) ? 'reveal-item' : 'reveal-text');
    el.style.setProperty('--reveal-delay', `${Math.min(index % 8, 7) * 45}ms`);
    if (motionReduced) el.classList.add('is-visible');
  });

  if (motionReduced) return;
  if (!revealObserver) {
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  }

  root.querySelectorAll('.reveal-text:not(.is-visible), .reveal-item:not(.is-visible)').forEach((el) => {
    revealObserver.observe(el);
  });
}

function money(value) {
  return `${Number(value || 0).toLocaleString('ko-KR')}원`;
}

function toast(message) {
  const el = $('#toast');
  el.textContent = message;
  el.classList.add('show');
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => el.classList.remove('show'), 2800);
}

function closeDialog(selector) {
  const dialog = $(selector);
  if (dialog?.open) dialog.close();
}

function showDialog(selector) {
  const dialog = $(selector);
  if (!dialog) return;
  if (dialog.open) return;
  dialog.showModal();
}

function readSavedSet(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || '[]');
    return new Set(Array.isArray(value) ? value : []);
  } catch {
    return new Set();
  }
}

function saveSet(key, value) {
  localStorage.setItem(key, JSON.stringify([...value]));
}

function loadUserActions() {
  state.likedAssetIds = readSavedSet('artbus_liked_assets');
  state.cartAssetIds = readSavedSet('artbus_cart');
}

function assetLikeCount(asset) {
  const baseCount = Math.max(0, Math.round(Number(asset.downloads || 0) / 18));
  return baseCount + (state.likedAssetIds.has(asset.id) ? 1 : 0);
}

function toggleLike(assetId) {
  if (state.likedAssetIds.has(assetId)) {
    state.likedAssetIds.delete(assetId);
    toast('좋아요를 취소했습니다.');
  } else {
    state.likedAssetIds.add(assetId);
    toast('좋아요에 추가했습니다.');
  }
  saveSet('artbus_liked_assets', state.likedAssetIds);
  renderAssets();
}

function toggleCart(assetId) {
  if (state.cartAssetIds.has(assetId)) {
    state.cartAssetIds.delete(assetId);
    toast('장바구니에서 제외했습니다.');
  } else {
    state.cartAssetIds.add(assetId);
    toast('장바구니에 담았습니다.');
  }
  saveSet('artbus_cart', state.cartAssetIds);
  renderAssets();
  renderCartControls();
}

function cartAssets() {
  return state.assets.filter((asset) => state.cartAssetIds.has(asset.id));
}

function renderCartControls() {
  let button = $('#cartFloatingBtn');
  let dialog = $('#cartDialog');
  if (!button) {
    document.body.insertAdjacentHTML('beforeend', `
      <button class="cart-floating-btn" id="cartFloatingBtn" type="button" aria-label="장바구니 열기">
        <span>장바구니</span><strong id="cartFloatingCount">0</strong>
      </button>
      <dialog class="cart-dialog" id="cartDialog">
        <div class="cart-dialog-panel">
          <div class="cart-dialog-head">
            <div>
              <p class="eyebrow">Cart</p>
              <h2>장바구니</h2>
            </div>
            <button class="ghost-btn" id="closeCartBtn" type="button">닫기</button>
          </div>
          <div class="cart-list" id="cartList"></div>
          <div class="cart-total" id="cartTotal"></div>
        </div>
      </dialog>
    `);
    button = $('#cartFloatingBtn');
    dialog = $('#cartDialog');
    button.addEventListener('click', openCartDialog);
    $('#closeCartBtn').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) dialog.close();
    });
  }

  $('#cartFloatingCount').textContent = state.cartAssetIds.size.toLocaleString('ko-KR');
  button.classList.toggle('has-items', state.cartAssetIds.size > 0);
  renderCartDialog();
}

function renderCartDialog() {
  const items = cartAssets();
  const list = $('#cartList');
  const total = $('#cartTotal');
  if (!list || !total) return;
  if (!items.length) {
    list.innerHTML = '<p class="empty">장바구니에 담긴 콘텐츠가 없습니다.</p>';
    total.innerHTML = '';
    return;
  }
  list.innerHTML = items.map((asset) => `
    <article class="cart-line">
      ${assetMediaMarkup(asset, 'cart-line-media')}
      <div>
        <strong>${asset.title}</strong>
        <span>${asset.author_name} · ${LICENSE_LABELS[asset.license] || asset.license}</span>
        <b>${money(asset.price)}</b>
      </div>
      <button class="ghost-btn" type="button" data-remove-cart="${asset.id}">제외</button>
    </article>
  `).join('');
  const sum = items.reduce((totalPrice, asset) => totalPrice + Number(asset.price || 0), 0);
  total.innerHTML = `<span>총 ${items.length.toLocaleString('ko-KR')}개</span><strong>${money(sum)}</strong>`;
  $$('[data-remove-cart]').forEach((button) => {
    button.addEventListener('click', () => toggleCart(button.dataset.removeCart));
  });
}

function openCartDialog() {
  closeDialog('#uploadModal');
  closeDialog('#assetModal');
  renderCartDialog();
  showDialog('#cartDialog');
}

function hasSupabaseConfig() {
  return Boolean(CONFIG.SUPABASE_URL && CONFIG.SUPABASE_ANON_KEY);
}

function isSupabaseReady() {
  return Boolean(window.supabase && hasSupabaseConfig());
}

function getRedirectUrl() {
  return window.location.origin + window.location.pathname;
}

function getMypageUrl() {
  return 'mypage.html';
}

function redirectToPublicSiteIfNeeded() {
  return false;
}

function ensureSupabaseClient() {
  if (!isSupabaseReady()) return null;
  if (!state.client) {
    state.client = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);
  }
  return state.client;
}

function isAdminUser() {
  return ADMIN_EMAILS.includes((state.user?.email || '').toLowerCase());
}

function canManageAsset(asset) {
  return Boolean(state.user && (isAdminUser() || asset.author_id === state.user.id));
}

function enableSectionIndex() {
  if (new URLSearchParams(location.search).get('sections') === '1') {
    document.body.classList.add('show-section-index');
  }
}

function normalizeRow(row) {
  const mediaUrl = row.media_url && !row.media_url.startsWith('blob:') ? row.media_url : FALLBACK_UPLOAD_IMAGE;
  const category = row.category || (row.media_type === 'video' ? 'video' : 'photo');
  return {
    id: row.id,
    title: row.title || '제목 없는 콘텐츠',
    category,
    price: Number(row.price || 0),
    license: row.license || 'standard',
    tags: Array.isArray(row.tags) ? row.tags : [],
    author_name: row.author_name || 'ArtBus Creator',
    author_id: row.author_id || null,
    media_url: mediaUrl,
    media_type: row.media_type || 'image',
    downloads: Number(row.downloads || 0),
    description: row.description || '',
    created_at: row.created_at || new Date().toISOString(),
  };
}

async function refreshSession() {
  if (!state.client) return;
  const { data } = await state.client.auth.getSession();
  state.user = data.session?.user || null;
  renderAuthState();
}

async function connectSupabase() {
  if (!hasSupabaseConfig()) {
    setDbStatus('샘플 데이터', 'error');
    return false;
  }

  ensureSupabaseClient();
  if (state.client) {
    try {
      await refreshSession();
    } catch (error) {
      console.warn('Session refresh failed:', error.message);
    }
  }

  try {
    const response = await fetch(`${CONFIG.SUPABASE_URL}/rest/v1/works?select=*&order=created_at.desc`, {
      headers: {
        apikey: CONFIG.SUPABASE_ANON_KEY,
        Authorization: `Bearer ${CONFIG.SUPABASE_ANON_KEY}`,
      },
    });
    if (!response.ok) throw new Error(`REST ${response.status}`);
    const data = await response.json();
    state.assets = data.length ? [...data.map(normalizeRow), ...ALL_SAMPLE_ASSETS] : [...ALL_SAMPLE_ASSETS];
    state.source = 'supabase';
    setDbStatus(data.length ? '라이브 DB 연결' : 'DB 연결됨, 샘플 표시', data.length ? 'live' : 'warn');
    $('#uploadNote').textContent = state.client ? '이미지와 동영상은 Storage에 저장됩니다.' : '업로드는 Supabase SDK 로드 후 사용할 수 있습니다.';
    renderAuthState();
    return true;
  } catch (error) {
    state.assets = [...ALL_SAMPLE_ASSETS];
    state.source = 'sample';
    setDbStatus('샘플 데이터', 'error');
    $('#uploadNote').textContent = 'DB 연결 실패 시 샘플 데이터가 표시됩니다.';
    console.warn('Supabase not ready:', error.message);
    return false;
  }
}

function renderAuthState() {
  const button = $('#authBtn');
  if (!button) return;
  button.textContent = state.user ? (state.user.email || '내 계정') : '로그인';
  button.title = state.user ? '마이페이지로 이동' : '로그인';
}

function setDbStatus(text, tone) {
  const el = $('#dbStatus');
  if (!el) return;
  el.textContent = text;
  el.className = `status-pill ${tone || ''}`.trim();
}

function openAuth(tabName = 'login') {
  switchAuthTab(tabName);
  $('#authModal').showModal();
}

function switchAuthTab(tabName) {
  $$('.auth-tab').forEach((button) => button.classList.toggle('active', button.dataset.authTab === tabName));
  $('#loginForm').hidden = tabName !== 'login';
  $('#signupForm').hidden = tabName !== 'signup';
}

async function handleAuthButton() {
  ensureSupabaseClient();
  if (state.user) {
    window.location.href = getMypageUrl();
    return;
  }
  openAuth('login');
}

async function handleLogin(event) {
  event.preventDefault();
  if (!ensureSupabaseClient()) return toast('Supabase 설정이 필요합니다.');
  const { error } = await state.client.auth.signInWithPassword({
    email: $('#loginEmail').value.trim(),
    password: $('#loginPassword').value,
  });
  if (error) return toast(error.message);
  await refreshSession();
  $('#authModal').close();
  if (redirectToPublicSiteIfNeeded()) return;
  renderAssets();
  toast('로그인되었습니다.');
}

async function handleSignup(event) {
  event.preventDefault();
  if (!ensureSupabaseClient()) return toast('Supabase 설정이 필요합니다.');
  const { error } = await state.client.auth.signUp({
    email: $('#signupEmail').value.trim(),
    password: $('#signupPassword').value,
    options: { data: { name: $('#signupName').value.trim() } },
  });
  if (error) return toast(error.message);
  $('#authModal').close();
  toast('가입 요청이 완료되었습니다. 메일 확인이 필요할 수 있습니다.');
}

async function handleOAuth(provider) {
  if (provider === 'naver') return toast('네이버는 커스텀 OAuth 설정이 필요합니다.');
  if (!hasSupabaseConfig()) return toast('Supabase 설정이 필요합니다.');
  const redirectTo = getRedirectUrl();
  window.location.href = `${CONFIG.SUPABASE_URL}/auth/v1/authorize?provider=${provider}&redirect_to=${encodeURIComponent(redirectTo)}`;
}

function filteredAssets() {
  const q = state.query.trim().toLowerCase();
  let list = [...state.assets];
  if (state.category !== 'all') list = list.filter((item) => item.category === state.category);
  if (state.license !== 'all') list = list.filter((item) => item.license === state.license);
  if (q) {
    list = list.filter((item) => [
      item.title,
      item.author_name,
      item.description,
      item.category,
      item.license,
      ...(item.tags || []),
    ].some((value) => String(value).toLowerCase().includes(q)));
  }
  if (state.sort === 'popular') list.sort((a, b) => b.downloads - a.downloads);
  else if (state.sort === 'price-low') list.sort((a, b) => a.price - b.price);
  else if (state.sort === 'price-high') list.sort((a, b) => b.price - a.price);
  else list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  return list;
}

function renderTags() {
  $('#quickTags').innerHTML = QUICK_TAGS.map((tag) => `<button class="tag" type="button" data-query="${tag}">${tag}</button>`).join('');
  $$('#quickTags .tag').forEach((button) => {
    button.addEventListener('click', () => {
      state.query = button.dataset.query;
      $('#searchInput').value = state.query;
      $('#heroSearch').value = state.query;
      renderAssets();
      location.hash = '#market';
    });
  });
}

function renderCollections() {
  $('#collectionGrid').innerHTML = COLLECTIONS.map(([title, copy, image]) => `
    <article class="collection-card" style="background-image:url('${image}')">
      <div><h3>${title}</h3><p>${copy}</p></div>
    </article>
  `).join('');
}

function renderCategoryChips() {
  $('#categoryChips').innerHTML = Object.entries(CATEGORY_LABELS).map(([key, label]) => `
    <button class="chip ${state.category === key ? 'active' : ''}" type="button" data-category="${key}">${label}</button>
  `).join('');
  $$('#categoryChips .chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      state.category = chip.dataset.category;
      renderCategoryChips();
      renderAssets();
    });
  });
}

function assetMediaMarkup(asset, className = 'asset-media') {
  const badge = `<span class="asset-badge">${CATEGORY_LABELS[asset.category] || asset.category}</span>`;
  if (asset.media_type === 'video') {
    return `
      <div class="${className} video-media">
        <video src="${asset.media_url}" muted playsinline preload="metadata"></video>
        ${badge}
      </div>
    `;
  }
  return `<div class="${className}" style="background-image:url('${asset.media_url}')">${badge}</div>`;
}

function modalMediaMarkup(asset) {
  if (asset.media_type === 'video') {
    return `<div class="modal-img video-modal"><video src="${asset.media_url}" controls playsinline preload="metadata"></video></div>`;
  }
  return `<div class="modal-img" style="background-image:url('${asset.media_url}')"></div>`;
}

function storagePathFromPublicUrl(url) {
  if (!url || !url.includes(`/storage/v1/object/public/${STORAGE_BUCKET}/`)) return null;
  try {
    const parsed = new URL(url);
    const marker = `/storage/v1/object/public/${STORAGE_BUCKET}/`;
    return decodeURIComponent(parsed.pathname.split(marker)[1] || '');
  } catch {
    return null;
  }
}

function assetMeta(asset) {
  const type = asset.media_type === 'video' ? 'MP4/WEBM' : 'JPG/PNG';
  const license = LICENSE_LABELS[asset.license] || asset.license;
  return `${type} · ${license}`;
}

function assetCardMarkup(asset) {
  const canManage = canManageAsset(asset);
  const isLiked = state.likedAssetIds.has(asset.id);
  const isInCart = state.cartAssetIds.has(asset.id);
  return `
    <article class="asset-card" data-id="${asset.id}">
      ${canManage ? `
        <div class="card-menu">
          <button class="card-menu-btn" type="button" aria-label="콘텐츠 관리" data-menu-for="${asset.id}">⋯</button>
          <div class="card-menu-panel" id="menu-${asset.id}" hidden>
            <button type="button" data-edit-asset="${asset.id}">수정</button>
            <button type="button" data-delete-asset="${asset.id}">삭제</button>
          </div>
        </div>
      ` : ''}
      ${assetMediaMarkup(asset)}
      <div class="asset-body">
        <div class="asset-actions">
          <button class="like-btn ${isLiked ? 'active' : ''}" type="button" data-like-asset="${asset.id}" aria-pressed="${isLiked}">
            <span aria-hidden="true">♥</span>
            <strong>${assetLikeCount(asset).toLocaleString('ko-KR')}</strong>
          </button>
          <button class="cart-btn ${isInCart ? 'active' : ''}" type="button" data-cart-asset="${asset.id}" aria-pressed="${isInCart}">
            <span aria-hidden="true">＋</span>
            <strong>${isInCart ? '담김' : '담기'}</strong>
          </button>
        </div>
        <h3>${asset.title}</h3>
        <div class="asset-sub">${assetMeta(asset)}</div>
        <div class="asset-meta"><span>${asset.author_name}</span><span class="price">${money(asset.price)}</span></div>
        <div class="tag-list">${(asset.tags || []).slice(0, 3).map((tag) => `<span>#${tag}</span>`).join('')}</div>
      </div>
    </article>
  `;
}

function categoryGroupMarkup(group) {
  const isExpanded = state.expandedGroups.has(group.key);
  const visibleAssets = isExpanded ? group.assets : group.assets.slice(0, 12);
  const hasMore = group.assets.length > visibleAssets.length;
  return `
    <section class="market-category" data-group="${group.key}">
      <div class="market-category-head">
        <div>
          <p class="eyebrow">${group.kicker}</p>
          <h3>${group.title}</h3>
        </div>
        <span>${group.assets.length.toLocaleString('ko-KR')}개</span>
      </div>
      <div class="category-asset-grid">${visibleAssets.map(assetCardMarkup).join('')}</div>
      ${hasMore ? `<button class="text-more-btn" type="button" data-expand-group="${group.key}">더보기</button>` : ''}
    </section>
  `;
}

function renderAssets() {
  const list = filteredAssets();
  $('#resultSummary').textContent = `${list.length.toLocaleString('ko-KR')}개 콘텐츠`;
  $('#heroAssetCount').textContent = state.assets.length.toLocaleString('ko-KR');
  $('#emptyState').hidden = list.length > 0;

  const groups = [
    {
      key: 'photo',
      title: '사진/이미지',
      kicker: 'Category 01',
      assets: list.filter((asset) => asset.media_type !== 'video' && asset.category === 'photo'),
    },
    {
      key: 'video',
      title: '동영상',
      kicker: 'Category 02',
      assets: list.filter((asset) => asset.media_type === 'video' || asset.category === 'video'),
    },
    {
      key: 'illustration',
      title: '일러스트/그래픽',
      kicker: 'Category 03',
      assets: list.filter((asset) => asset.category === 'illustration'),
    },
    {
      key: 'painting',
      title: '파인아트/페인팅',
      kicker: 'Category 04',
      assets: list.filter((asset) => asset.category === 'painting'),
    },
    {
      key: 'ai_image',
      title: 'AI 이미지',
      kicker: 'Category 05',
      assets: list.filter((asset) => asset.category === 'ai_image'),
    },
    {
      key: 'ai_video',
      title: 'AI 영상',
      kicker: 'Category 06',
      assets: list.filter((asset) => asset.category === 'ai_video'),
    },
  ].filter((group) => group.assets.length > 0);

  $('#assetGrid').innerHTML = groups.map(categoryGroupMarkup).join('');
  setupRevealAnimations($('#assetGrid'));

  $$('[data-expand-group]').forEach((button) => {
    button.addEventListener('click', () => {
      state.expandedGroups.add(button.dataset.expandGroup);
      renderAssets();
    });
  });

  $$('.card-menu-btn').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      const panel = $(`#menu-${button.dataset.menuFor}`);
      if (panel) panel.hidden = !panel.hidden;
    });
  });

  $$('[data-edit-asset]').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      const asset = state.assets.find((item) => item.id === button.dataset.editAsset);
      if (asset) openEditAsset(asset);
    });
  });

  $$('[data-delete-asset]').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      const asset = state.assets.find((item) => item.id === button.dataset.deleteAsset);
      if (asset) deleteAsset(asset);
    });
  });

  $$('[data-like-asset]').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      toggleLike(button.dataset.likeAsset);
    });
  });

  $$('[data-cart-asset]').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      toggleCart(button.dataset.cartAsset);
    });
  });

  $$('#assetGrid .asset-card').forEach((card) => {
    card.addEventListener('click', (event) => {
      if (event.target.closest('.card-menu, .asset-actions')) return;
      openAsset(card.dataset.id);
    });
  });
  renderCartControls();
}

function openAsset(id) {
  const asset = state.assets.find((item) => item.id === id);
  if (!asset) return;
  const canDelete = canManageAsset(asset);
  closeDialog('#uploadModal');
  closeDialog('#cartDialog');
  $('#modalPanel').innerHTML = `
    <div class="modal-grid">
      ${modalMediaMarkup(asset)}
      <div class="modal-info">
        <p class="eyebrow">${CATEGORY_LABELS[asset.category] || asset.category} · ${(LICENSE_LABELS[asset.license] || asset.license).toUpperCase()}</p>
        <h2>${asset.title}</h2>
        <p class="muted">${asset.description || '등록된 설명이 없습니다.'}</p>
        <div class="detail-table">
          <div><span>파일 형식</span><strong>${asset.media_type === 'video' ? '동영상' : '이미지'}</strong></div>
          <div><span>라이선스</span><strong>${LICENSE_LABELS[asset.license] || asset.license}</strong></div>
          <div><span>작가</span><strong>${asset.author_name}</strong></div>
          <div><span>등록일</span><strong>${new Date(asset.created_at).toLocaleDateString('ko-KR')}</strong></div>
        </div>
        <p class="price">${money(asset.price)}</p>
        <div class="tag-list">${(asset.tags || []).map((tag) => `<span>#${tag}</span>`).join('')}</div>
        <button class="solid-btn full" type="button">라이선스 선택</button>
        ${canDelete ? '<button class="danger-btn full" id="deleteAssetBtn" type="button">콘텐츠 삭제</button>' : ''}
        <button class="ghost-btn full" id="closeModalBtn" type="button">닫기</button>
      </div>
    </div>
  `;
  showDialog('#assetModal');
  $('#closeModalBtn').addEventListener('click', () => $('#assetModal').close());
  const deleteButton = $('#deleteAssetBtn');
  if (deleteButton) deleteButton.addEventListener('click', () => deleteAsset(asset));
}

function setUploadMode(mode, asset = null) {
  const isEdit = mode === 'edit';
  state.editingAssetId = isEdit ? asset.id : null;
  $('#uploadModalTitle').textContent = isEdit ? '콘텐츠 수정' : '콘텐츠 등록';
  $('#uploadModalSubtitle').textContent = isEdit ? '콘텐츠 정보 수정' : '이미지·동영상 업로드';
  $('#uploadSubmitBtn').textContent = isEdit ? '수정 저장' : '등록하기';
  $('#workFile').required = false;
  $('#fileZone').hidden = isEdit;
  $('#fileLabel').textContent = '파일을 선택하거나 드래그하세요';
}

function resetUploadForm() {
  $('#uploadForm').reset();
  setUploadMode('create');
}

function openEditAsset(asset) {
  if (!canManageAsset(asset)) return toast('수정 권한이 없습니다.');
  if (!state.client) return toast('수정은 로그인 연결 후 사용할 수 있습니다.');

  closeDialog('#assetModal');
  closeDialog('#cartDialog');
  setUploadMode('edit', asset);
  $('#workTitle').value = asset.title || '';
  $('#workCategory').value = asset.category || 'photo';
  $('#workLicense').value = asset.license || 'standard';
  $('#workPrice').value = asset.price || 0;
  $('#workAuthor').value = asset.author_name || '';
  $('#workTags').value = (asset.tags || []).join(', ');
  $('#workDesc').value = asset.description || '';
  showDialog('#uploadModal');
}

async function deleteAsset(asset) {
  if (!canManageAsset(asset)) return toast('삭제 권한이 없습니다.');
  if (!state.client) return toast('삭제는 로그인 연결 후 사용할 수 있습니다.');
  if (!confirm('이 콘텐츠를 삭제할까요?')) return;

  const storagePath = storagePathFromPublicUrl(asset.media_url);
  let data = null;
  let error = null;

  if (isAdminUser()) {
    const result = await state.client.rpc('admin_delete_work', { work_id: asset.id });
    error = result.error;
    data = result.data ? [{ id: asset.id }] : [];
  } else {
    const result = await state.client.from('works').delete().eq('id', asset.id).eq('author_id', state.user.id).select('id');
    data = result.data;
    error = result.error;
  }

  if (error) return toast(`삭제 실패: ${error.message}`);
  if (!data || data.length === 0) return toast(`삭제 0건: ${state.user.email} 계정 권한을 확인하세요.`);

  if (storagePath) {
    const { error: storageError } = await state.client.storage.from(STORAGE_BUCKET).remove([storagePath]);
    if (storageError) console.warn('Storage delete failed:', storageError.message);
  }

  $('#assetModal').close();
  await connectSupabase();
  renderAssets();
  toast('콘텐츠가 삭제되었습니다.');
}

function safeFileName(name) {
  return name.toLowerCase().replace(/[^a-z0-9.]+/g, '-').replace(/^-+|-+$/g, '') || 'upload';
}

function extensionFromFile(file, mediaType) {
  const extensionByMime = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
    'video/mp4': 'mp4',
    'video/webm': 'webm',
    'video/quicktime': 'mov',
  };

  const fromMime = extensionByMime[file.type];
  if (fromMime) return fromMime;

  const safeName = safeFileName(file.name || '');
  const match = safeName.match(/\.([a-z0-9]+)$/);
  if (match) return match[1];

  return mediaType === 'video' ? 'mp4' : 'jpg';
}

function contentTypeFromFile(file, mediaType) {
  if (file.type) return file.type;
  return mediaType === 'video' ? 'video/mp4' : 'image/jpeg';
}

async function uploadMediaFile(file) {
  if (!file) return { url: FALLBACK_UPLOAD_IMAGE, type: 'image' };
  const mediaType = file.type?.startsWith('video/') ? 'video' : 'image';
  const ext = extensionFromFile(file, mediaType);
  const contentType = contentTypeFromFile(file, mediaType);
  const path = `${state.user.id}/${Date.now()}-${crypto.randomUUID()}.${ext}`;
  const { error } = await state.client.storage.from(STORAGE_BUCKET).upload(path, file, {
    cacheControl: '3600',
    contentType,
    upsert: false,
  });
  if (error) throw error;
  const { data } = state.client.storage.from(STORAGE_BUCKET).getPublicUrl(path);
  return { url: data.publicUrl, type: mediaType };
}

async function submitUpload(event) {
  event.preventDefault();
  if (!state.user) {
    openAuth('login');
    return toast('콘텐츠 등록은 로그인 후 사용할 수 있습니다.');
  }
  if (!state.client) return toast('업로드는 Supabase SDK 연결 후 사용할 수 있습니다.');

  if (state.editingAssetId) {
    await submitEdit();
    return;
  }

  let uploaded;
  try {
    uploaded = await uploadMediaFile($('#workFile').files[0]);
  } catch (error) {
    return toast(`파일 업로드 실패: ${error.message}`);
  }

  const payload = {
    title: $('#workTitle').value.trim(),
    category: $('#workCategory').value,
    license: $('#workLicense').value,
    price: Number($('#workPrice').value),
    author_id: state.user.id,
    author_name: $('#workAuthor').value.trim() || state.user.email || 'ArtBus Creator',
    tags: $('#workTags').value.split(',').map((tag) => tag.trim()).filter(Boolean),
    description: $('#workDesc').value.trim(),
    media_url: uploaded.url,
    media_type: uploaded.type,
    downloads: 0,
  };

  const { error } = await state.client.from('works').insert(payload);
  if (error) return toast(`DB 저장 실패: ${error.message}`);

  await connectSupabase();
  resetUploadForm();
  $('#uploadModal').close();
  renderAssets();
  toast('콘텐츠가 등록되었습니다.');
}

async function submitEdit() {
  const asset = state.assets.find((item) => item.id === state.editingAssetId);
  if (!asset || !canManageAsset(asset)) return toast('수정 권한이 없습니다.');

  const payload = {
    title: $('#workTitle').value.trim(),
    category: $('#workCategory').value,
    license: $('#workLicense').value,
    price: Number($('#workPrice').value),
    author_name: $('#workAuthor').value.trim() || state.user.email || 'ArtBus Creator',
    tags: $('#workTags').value.split(',').map((tag) => tag.trim()).filter(Boolean),
    description: $('#workDesc').value.trim(),
  };

  const { error } = await state.client
    .from('works')
    .update(payload)
    .eq('id', asset.id)
    .eq('author_id', state.user.id);

  if (error) return toast(`수정 실패: ${error.message}`);

  await connectSupabase();
  resetUploadForm();
  $('#uploadModal').close();
  renderAssets();
  toast('콘텐츠 정보가 수정되었습니다.');
}

function bindEvents() {
  $('#heroSearchForm').addEventListener('submit', (event) => {
    event.preventDefault();
    state.query = $('#heroSearch').value;
    state.category = $('#heroCategory').value;
    $('#searchInput').value = state.query;
    renderCategoryChips();
    renderAssets();
    location.hash = '#market';
  });

  $('#searchInput').addEventListener('input', (event) => {
    state.query = event.target.value;
    renderAssets();
  });

  $('#licenseFilter').addEventListener('change', (event) => {
    state.license = event.target.value;
    renderAssets();
  });

  $('#sortSelect').addEventListener('change', (event) => {
    state.sort = event.target.value;
    renderAssets();
  });

  $('#resetFiltersBtn').addEventListener('click', () => {
    state.query = '';
    state.category = 'all';
    state.license = 'all';
    state.sort = 'newest';
    state.expandedGroups.clear();
    $('#searchInput').value = '';
    $('#heroSearch').value = '';
    $('#heroCategory').value = 'all';
    $('#licenseFilter').value = 'all';
    $('#sortSelect').value = 'newest';
    renderCategoryChips();
    renderAssets();
  });

  $$('[data-jump-category]').forEach((button) => {
    button.addEventListener('click', () => {
      state.category = button.dataset.jumpCategory;
      $('#heroCategory').value = state.category;
      renderCategoryChips();
      renderAssets();
      location.hash = '#market';
    });
  });

  const openUploadModal = () => {
    if (!state.user) {
      openAuth('login');
      toast('콘텐츠 등록은 로그인 후 사용할 수 있습니다.');
      return;
    }
    closeDialog('#assetModal');
    closeDialog('#cartDialog');
    resetUploadForm();
    showDialog('#uploadModal');
  };
  $('#openUploadBtn').addEventListener('click', openUploadModal);
  const creatorUploadBtn = $('#creatorUploadBtn');
  if (creatorUploadBtn) creatorUploadBtn.addEventListener('click', openUploadModal);
  $('#closeUploadBtn').addEventListener('click', () => {
    resetUploadForm();
    $('#uploadModal').close();
  });
  const connectionBtn = $('#connectionBtn');
  if (connectionBtn) {
    connectionBtn.addEventListener('click', async () => {
      const ok = await connectSupabase();
      renderAssets();
      toast(ok ? 'Supabase 연결 확인 완료' : '샘플 모드로 실행 중입니다.');
    });
  }

  $('#authBtn').addEventListener('click', handleAuthButton);
  $('#closeAuthBtn').addEventListener('click', () => $('#authModal').close());
  $$('button.social-btn').forEach((button) => button.addEventListener('click', () => handleOAuth(button.dataset.provider)));
  $$('.auth-tab').forEach((button) => button.addEventListener('click', () => switchAuthTab(button.dataset.authTab)));
  $('#loginForm').addEventListener('submit', handleLogin);
  $('#signupForm').addEventListener('submit', handleSignup);
  $('#authModal').addEventListener('click', (event) => {
    if (event.target === $('#authModal')) $('#authModal').close();
  });

  const googleOAuthLink = $('#googleOAuthLink');
  if (googleOAuthLink && hasSupabaseConfig()) {
    const redirectTo = getRedirectUrl();
    googleOAuthLink.href = `${CONFIG.SUPABASE_URL}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(redirectTo)}`;
  }

  const mypageLink = $('#mypageLink');
  if (mypageLink) mypageLink.href = getMypageUrl();

  $('#workFile').addEventListener('change', (event) => {
    $('#fileLabel').textContent = event.target.files[0]?.name || '파일을 선택하거나 드래그하세요';
  });
  $('#uploadForm').addEventListener('submit', submitUpload);
  $('#uploadModal').addEventListener('click', (event) => {
    if (event.target === $('#uploadModal') && !state.editingAssetId) {
      resetUploadForm();
      $('#uploadModal').close();
    }
  });
  $('#assetModal').addEventListener('click', (event) => {
    if (event.target === $('#assetModal')) $('#assetModal').close();
  });
}

async function init() {
  enableSectionIndex();
  loadUserActions();
  renderTags();
  renderCollections();
  renderCategoryChips();
  bindEvents();
  renderAssets();
  setupRevealAnimations();
  await connectSupabase();
  renderAssets();
}

document.addEventListener('DOMContentLoaded', init);
