/**
 * ArtBus — 공통 유틸 (모든 페이지)
 */
let useSupabase = false;

const STORAGE = {
  users: 'artbus_users',
  session: 'artbus_session',
  works: 'artbus_works_v2',
  cart: 'artbus_cart',
};

const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

const CAT = { photo: '사진', illustration: '일러스트', video: '영상', painting: '그림' };

function cfg() {
  return window.ARTBUS_CONFIG || {};
}

function isAdmin() {
  const emails = (cfg().ADMIN_EMAILS || []).map((e) => String(e).toLowerCase());
  const u = getSession();
  return Boolean(u?.email && emails.includes(u.email.toLowerCase()));
}

function getUsers() {
  try { return JSON.parse(localStorage.getItem(STORAGE.users) || '[]'); } catch { return []; }
}
function saveUsers(u) { localStorage.setItem(STORAGE.users, JSON.stringify(u)); }

function getSessionLocal() {
  try { return JSON.parse(localStorage.getItem(STORAGE.session) || 'null'); } catch { return null; }
}
function setSessionLocal(u) {
  if (u) localStorage.setItem(STORAGE.session, JSON.stringify(u));
  else localStorage.removeItem(STORAGE.session);
}

function getSession() {
  if (useSupabase && typeof ArtBusDB !== 'undefined') return ArtBusDB.getUser();
  return getSessionLocal();
}

async function setSession(u) {
  if (useSupabase && typeof ArtBusDB !== 'undefined') {
    if (!u) await ArtBusDB.signOut();
    return;
  }
  setSessionLocal(u);
}

function getWorksLocal() {
  try {
    const s = JSON.parse(localStorage.getItem(STORAGE.works) || 'null');
    return s || [];
  } catch {
    return [];
  }
}

function getWorks() {
  if (useSupabase && typeof ArtBusDB !== 'undefined') return ArtBusDB.getCachedWorks();
  return getWorksLocal();
}

function formatPrice(n) { return '₩' + Number(n).toLocaleString('ko-KR'); }
function esc(s) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }
function initials(n) { return n.split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase(); }

function showToast(msg) {
  const el = $('#toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => el.classList.remove('show'), 3200);
}

function openModal(d) { if (d?.showModal) d.showModal(); else d?.setAttribute('open', ''); }
function closeModal(d) { if (d?.open) d.close(); d?.removeAttribute('open'); }

function updateNavLinks() {
  const admin = $('#adminNavLink');
  if (admin) admin.hidden = !isAdmin();
}

function updateAuthUI() {
  const user = getSession();
  const btn = $('#authBtn');
  const hint = $('#uploadAuthHint');
  const sub = $('#uploadSubmit');
  const socialReady = useSupabase && typeof ArtBusDB !== 'undefined' && ArtBusDB.isConfigured();
  $$('#authModal [data-oauth]').forEach((b) => {
    b.disabled = !socialReady;
    b.title = socialReady ? '' : 'js/config.js에 Supabase anon key를 설정하세요';
  });
  updateNavLinks();
  if (!btn) return;
  if (user) {
    btn.textContent = user.name;
    if (hint) hint.textContent = `${user.name}님으로 등록합니다.`;
    if (sub && typeof state !== 'undefined') sub.disabled = !state.previewDataUrl;
  } else {
    btn.textContent = '로그인';
    if (hint) hint.textContent = '로그인 후 등록';
    if (sub) sub.disabled = true;
  }
}

function showSupabaseSetupHint() {
  if (window.location.protocol === 'file:') {
    showToast('file:// 로는 Supabase가 동작하지 않습니다. 터미널에서 python -m http.server 8080 실행 후 http://localhost:8080 으로 접속하세요.');
    showConfigBanner('file:// 프로토콜 — 로컬 서버로 실행해야 Supabase가 동작합니다.');
    return;
  }
  const issue = typeof ArtBusDB !== 'undefined' && ArtBusDB.getConfigIssue
    ? ArtBusDB.getConfigIssue()
    : 'js/config.js 설정을 확인하세요.';
  showToast(issue);
  showConfigBanner(issue);
  console.warn('[ArtBus]', issue);
}

function showConfigBanner(message) {
  if (document.getElementById('supabaseConfigBanner')) return;
  const bar = document.createElement('div');
  bar.id = 'supabaseConfigBanner';
  bar.setAttribute('role', 'alert');
  bar.innerHTML = `<strong>Supabase 미연결</strong> — ${esc(message)} <a href="https://supabase.com/dashboard/project/qwxtlyfharorqmemlsya/settings/api" target="_blank" rel="noopener">API 키 받기</a>`;
  bar.style.cssText = 'position:fixed;bottom:0;left:0;right:0;z-index:10002;padding:0.75rem 1rem;background:#1a1918;color:#f8f7f4;font-size:0.85rem;text-align:center;box-shadow:0 -4px 20px rgba(0,0,0,.15);';
  document.body.appendChild(bar);
}

function hideConfigBanner() {
  document.getElementById('supabaseConfigBanner')?.remove();
}

async function initArtBus(onAuthChange) {
  if (typeof ArtBusDB === 'undefined') {
    showSupabaseSetupHint();
    updateNavLinks();
    return false;
  }
  if (!ArtBusDB.isConfigured()) {
    showSupabaseSetupHint();
    updateNavLinks();
    return false;
  }

  const result = await ArtBusDB.init(onAuthChange);
  if (result.ok) {
    useSupabase = true;
    const u = ArtBusDB.getUser();
    if (u && new URLSearchParams(window.location.search).get('code')) {
      closeModal($('#authModal'));
      showToast(`${u.name}님 환영합니다.`);
    }
    if (!result.worksLoaded && result.fetchError) {
      const msg = result.fetchError.message || '';
      showToast(msg.includes('schema.sql') ? msg : `작품 로드 실패: ${msg}`);
      showConfigBanner(msg.includes('schema.sql') ? msg : 'Supabase에 테이블이 없습니다. supabase/schema.sql 을 SQL Editor에서 실행하세요.');
    } else {
      console.info('ArtBus: Supabase 연결 완료');
      hideConfigBanner();
    }
  } else {
    showToast('Supabase 초기화에 실패했습니다. 콘솔(F12)을 확인하세요.');
  }

  updateNavLinks();
  return useSupabase;
}

function requireLogin(redirectTo) {
  const u = getSession();
  if (u) return u;
  const dest = redirectTo || 'index.html';
  showToast('로그인이 필요합니다.');
  setTimeout(() => { window.location.href = `${dest}${dest.includes('#') ? '' : '#auth'}`; }, 600);
  return null;
}

function requireAdmin() {
  if (!isAdmin()) {
    showToast('관리자 권한이 없습니다.');
    setTimeout(() => { window.location.href = 'index.html'; }, 800);
    return false;
  }
  return true;
}
