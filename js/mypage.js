const CONFIG = window.ARTBUS_CONFIG || {};
const STORAGE_BUCKET = 'artbus-media';

const state = {
  client: null,
  user: null,
  works: [],
};

const $ = (selector) => document.querySelector(selector);
let revealObserver = null;

function setupRevealAnimations(root = document) {
  const motionReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const targets = root.querySelectorAll('h1, h2, h3, .eyebrow, .mypage-hero p, .mypage-login, .profile-panel, .stats-grid article, .my-work-card, .site-footer > *');
  targets.forEach((el, index) => {
    if (el.classList.contains('reveal-text') || el.classList.contains('reveal-item')) return;
    el.classList.add(el.matches('.mypage-login, .profile-panel, .stats-grid article, .my-work-card') ? 'reveal-item' : 'reveal-text');
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
  $('#totalCount').textContent = state.works.length.toLocaleString('ko-KR');
  $('#imageCount').textContent = imageCount.toLocaleString('ko-KR');
  $('#videoCount').textContent = videoCount.toLocaleString('ko-KR');
  $('#totalPrice').textContent = money(totalPrice);
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
}

document.addEventListener('DOMContentLoaded', init);
