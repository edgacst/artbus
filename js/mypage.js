const CONFIG = window.ARTBUS_CONFIG || {};
const STORAGE_BUCKET = 'artbus-media';

const state = {
  client: null,
  user: null,
  works: [],
  cartCatalogIds: new Set(),
  cartCatalog: [],
};

const $ = (selector) => document.querySelector(selector);
let revealObserver = null;
const CATEGORY_LABELS = {
  photo: '사진',
  video: '영상',
  illustration: '일러스트',
  painting: '파인아트',
  ai_image: 'AI 이미지',
  ai_video: 'AI 영상',
};

function setupRevealAnimations(root = document) {
  const motionReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const targets = root.querySelectorAll('h1, h2, h3, .eyebrow, .mypage-hero p, .mypage-login, .profile-panel, .stats-grid article, .dashboard-insights article, .mypage-cart-panel, .my-work-card, .site-footer > *');
  targets.forEach((el, index) => {
    if (el.classList.contains('reveal-text') || el.classList.contains('reveal-item')) return;
    el.classList.add(el.matches('.mypage-login, .profile-panel, .stats-grid article, .dashboard-insights article, .mypage-cart-panel, .my-work-card') ? 'reveal-item' : 'reveal-text');
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

  root.querySelectorAll('.reveal-text:not(.is-visible), .reveal-item:not(.is-visible)').forEach((el) => revealObserver.observe(el));
}

function money(value) {
  return `${Number(value || 0).toLocaleString('ko-KR')}원`;
}

function toast(message) {
  const el = $('#toast');
  el.textContent = message;
  el.classList.add('show');
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => el.classList.remove('show'), 2600);
}

function ensureClient() {
  if (!window.supabase || !CONFIG.SUPABASE_URL || !CONFIG.SUPABASE_ANON_KEY) return null;
  if (!state.client) state.client = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);
  return state.client;
}

function getRedirectUrl() {
  return window.location.origin + window.location.pathname;
}

function redirectToPublicSiteIfNeeded() {
  return false;
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

function mediaMarkup(work) {
  if (work.media_type === 'video') {
    return `<video src="${work.media_url}" muted playsinline preload="metadata"></video>`;
  }
  return `<div style="background-image:url('${work.media_url}')"></div>`;
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

function readCartSnapshots() {
  try {
    const value = JSON.parse(localStorage.getItem('artbus_cart_items') || '{}');
    return value && typeof value === 'object' ? value : {};
  } catch {
    return {};
  }
}

function validCartIds(cartIds = readSavedSet('artbus_cart')) {
  const snapshots = readCartSnapshots();
  const validIds = new Set([...Object.keys(snapshots), ...state.cartCatalogIds]);
  if (!validIds.size) return cartIds;
  const nextIds = new Set([...cartIds].filter((id) => validIds.has(id)));
  if (nextIds.size !== cartIds.size) saveSet('artbus_cart', nextIds);
  return nextIds;
}

function cartSnapshotItems(cartIds = validCartIds()) {
  const snapshots = readCartSnapshots();
  const catalogById = new Map(state.cartCatalog.map((work) => [work.id, work]));
  return [...cartIds].map((id) => catalogById.get(id) || snapshots[id]).filter(Boolean);
}

function formatDate(value) {
  if (!value) return '-';
  return new Date(value).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
}

function renderAccount() {
  const loggedIn = Boolean(state.user);
  $('#loginPrompt').hidden = loggedIn;
  $('#mypageContent').hidden = !loggedIn;
  $('#authBtn').textContent = loggedIn ? state.user.email : '로그인';

  if (!loggedIn) return;

  const name = state.user.user_metadata?.full_name || state.user.user_metadata?.name || state.user.email;
  $('#profileName').textContent = name;
  $('#profileEmail').textContent = state.user.email;
  $('#profileAvatar').textContent = (name || 'A').slice(0, 1).toUpperCase();
}

function renderStats() {
  const imageCount = state.works.filter((work) => work.media_type !== 'video').length;
  const videoCount = state.works.filter((work) => work.media_type === 'video').length;
  const totalPrice = state.works.reduce((sum, work) => sum + Number(work.price || 0), 0);
  const averagePrice = state.works.length ? Math.round(totalPrice / state.works.length) : 0;
  const latest = state.works[0];
  const likedIds = readSavedSet('artbus_liked_assets');
  const cartIds = validCartIds();
  const likedOwnCount = state.works.filter((work) => likedIds.has(work.id)).length;
  const cartOwnCount = state.works.filter((work) => cartIds.has(work.id)).length;
  const categoryCounts = state.works.reduce((counts, work) => {
    const key = work.category || (work.media_type === 'video' ? 'video' : 'photo');
    counts[key] = (counts[key] || 0) + 1;
    return counts;
  }, {});
  const topCategoryEntry = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0];

  $('#totalCount').textContent = state.works.length.toLocaleString('ko-KR');
  $('#imageCount').textContent = imageCount.toLocaleString('ko-KR');
  $('#videoCount').textContent = videoCount.toLocaleString('ko-KR');
  $('#totalPrice').textContent = money(totalPrice);
  $('#latestUploadDate').textContent = formatDate(latest?.created_at);
  $('#latestUploadTitle').textContent = latest?.title || '등록된 콘텐츠가 없습니다.';
  $('#topCategory').textContent = topCategoryEntry ? (CATEGORY_LABELS[topCategoryEntry[0]] || topCategoryEntry[0]) : '-';
  $('#topCategoryMeta').textContent = topCategoryEntry ? `${topCategoryEntry[1].toLocaleString('ko-KR')}개 콘텐츠` : '콘텐츠를 올리면 자동 집계됩니다.';
  $('#averagePrice').textContent = money(averagePrice);
  $('#savedActionCount').textContent = (likedOwnCount + cartOwnCount).toLocaleString('ko-KR');
  $('#savedActionMeta').textContent = `좋아요 ${likedOwnCount.toLocaleString('ko-KR')}개 · 장바구니 ${cartOwnCount.toLocaleString('ko-KR')}개`;
  renderCartSummary(cartIds);
}

function renderCartSummary(cartIds = validCartIds()) {
  const el = $('#mypageCartSummary');
  if (!el) return;
  const count = cartIds.size;
  el.textContent = count
    ? `현재 ${count.toLocaleString('ko-KR')}개 콘텐츠가 장바구니에 담겨 있습니다.`
    : '담긴 콘텐츠가 없습니다.';
}

function cartItemMedia(work) {
  if (!work?.media_url) return '<div class="mypage-cart-thumb placeholder">A</div>';
  if (work.media_type === 'video') {
    return `<div class="mypage-cart-thumb"><video src="${work.media_url}" muted playsinline preload="metadata"></video></div>`;
  }
  return `<div class="mypage-cart-thumb" style="background-image:url('${work.media_url}')"></div>`;
}

function renderMypageCartDialog() {
  const cartIds = validCartIds();
  const list = $('#mypageCartList');
  const total = $('#mypageCartTotal');
  const actions = $('#mypageCartActions');
  if (!list || !total || !actions) return;

  const snapshots = readCartSnapshots();
  const items = cartSnapshotItems(cartIds);
  if (!items.length) {
    list.innerHTML = '<p class="empty">장바구니에 담긴 콘텐츠가 없습니다.</p>';
    total.innerHTML = '';
    actions.innerHTML = '';
    return;
  }

  list.innerHTML = items.map((item) => `
    <article class="mypage-cart-line">
      ${cartItemMedia(item)}
      <div>
        <strong>${item.title}</strong>
        <span>${item.author_name || 'ArtBus'} · ${item.license || 'standard'}</span>
        <b>${money(item.price)}</b>
      </div>
    </article>
  `).join('');

  const sum = items.reduce((acc, item) => acc + Number(item.price || 0), 0);
  total.innerHTML = `<span>총 ${items.length.toLocaleString('ko-KR')}개</span><strong>${money(sum)}</strong>`;
  actions.innerHTML = `
    <button class="ghost-btn" id="clearMypageCartBtn" type="button">전체 비우기</button>
    <button class="solid-btn" id="buyMypageCartBtn" type="button">전체 구매</button>
  `;
  $('#clearMypageCartBtn').addEventListener('click', clearMypageCart);
  $('#buyMypageCartBtn').addEventListener('click', () => toast('결제창 연결은 준비 중입니다. 현재는 구매 UI만 제공됩니다.'));
}

function openMypageCartDialog() {
  renderMypageCartDialog();
  $('#mypageCartDialog').showModal();
}

function clearMypageCart() {
  saveSet('artbus_cart', new Set());
  localStorage.setItem('artbus_cart_items', '{}');
  renderCartSummary(new Set());
  renderMypageCartDialog();
  toast('장바구니를 비웠습니다.');
}

async function loadCartCatalog() {
  if (!state.client) return;
  const { data, error } = await state.client
    .from('works')
    .select('id,title,author_name,license,price,media_url,media_type');

  if (error) {
    console.warn('Cart catalog load failed:', error.message);
    return;
  }

  state.cartCatalog = data || [];
  state.cartCatalogIds = new Set(state.cartCatalog.map((work) => work.id));
}

function renderWorks() {
  $('#emptyWorks').hidden = state.works.length > 0;
  $('#myWorksGrid').innerHTML = state.works.map((work) => `
    <article class="my-work-card" data-id="${work.id}">
      <div class="my-work-media">${mediaMarkup(work)}</div>
      <div class="my-work-info">
        <strong>${work.title}</strong>
        <span>${work.media_type === 'video' ? '영상' : '이미지'} · ${work.license || 'standard'}</span>
        <span>${money(work.price)}</span>
      </div>
      <button class="danger-btn full" type="button" data-delete="${work.id}">삭제</button>
    </article>
  `).join('');

  document.querySelectorAll('[data-delete]').forEach((button) => {
    button.addEventListener('click', () => deleteWork(button.dataset.delete));
  });
  setupRevealAnimations($('#myWorksGrid'));
}

async function loadWorks() {
  if (!state.user || !state.client) return;
  await loadCartCatalog();
  const { data, error } = await state.client
    .from('works')
    .select('*')
    .eq('author_id', state.user.id)
    .order('created_at', { ascending: false });

  if (error) {
    toast(`불러오기 실패: ${error.message}`);
    return;
  }

  state.works = data || [];
  renderStats();
  renderWorks();
}

async function deleteWork(id) {
  const work = state.works.find((item) => item.id === id);
  if (!work || !confirm('이 콘텐츠를 삭제할까요?')) return;

  const { error } = await state.client
    .from('works')
    .delete()
    .eq('id', id)
    .eq('author_id', state.user.id);

  if (error) {
    toast(`삭제 실패: ${error.message}`);
    return;
  }

  const path = storagePathFromPublicUrl(work.media_url);
  if (path) {
    const { error: storageError } = await state.client.storage.from(STORAGE_BUCKET).remove([path]);
    if (storageError) console.warn('Storage delete failed:', storageError.message);
  }

  toast('삭제되었습니다.');
  await loadWorks();
}

async function init() {
  const client = ensureClient();
  const redirectTo = getRedirectUrl();
  $('#googleLoginLink').href = `${CONFIG.SUPABASE_URL}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(redirectTo)}`;

  if (!client) {
    toast('Supabase 설정이 필요합니다.');
    return;
  }

  const { data } = await client.auth.getSession();
  state.user = data.session?.user || null;
  if (state.user && redirectToPublicSiteIfNeeded()) return;
  renderAccount();
  if (state.user) await loadWorks();
  setupRevealAnimations();

  $('#authBtn').addEventListener('click', () => {
    if (state.user) return;
    location.href = $('#googleLoginLink').href;
  });

  $('#logoutBtn').addEventListener('click', async () => {
    await client.auth.signOut();
    location.reload();
  });

  $('#refreshBtn').addEventListener('click', loadWorks);
  $('#openMypageCartBtn').addEventListener('click', openMypageCartDialog);
  $('#closeMypageCartBtn').addEventListener('click', () => $('#mypageCartDialog').close());
  $('#mypageCartDialog').addEventListener('click', (event) => {
    if (event.target === $('#mypageCartDialog')) $('#mypageCartDialog').close();
  });
}

document.addEventListener('DOMContentLoaded', init);
