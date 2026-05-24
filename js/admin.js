/**
 * ArtBus — 관리자 대시보드
 */
let allWorks = [];
let allProfiles = [];

async function loadAdminData() {
  if (useSupabase && ArtBusDB.isConfigured()) {
    await ArtBusDB.fetchWorks();
    allWorks = ArtBusDB.getCachedWorks();
    try {
      allProfiles = await ArtBusDB.fetchAllProfiles();
    } catch (e) {
      console.error(e);
      allProfiles = [];
    }
  } else {
    allWorks = getWorks();
    const users = getUsers();
    allProfiles = users.map((u) => ({
      id: u.id,
      display_name: u.name,
      created_at: new Date().toISOString(),
    }));
  }
}

function renderStats() {
  const el = $('#adminStats');
  if (!el) return;
  const featured = allWorks.filter((w) => w.featured).length;
  const trending = allWorks.filter((w) => w.trending).length;
  el.innerHTML = `
    <div class="dash-card"><span>전체 작품</span><strong>${allWorks.length}</strong></div>
    <div class="dash-card"><span>회원 수</span><strong>${allProfiles.length}</strong></div>
    <div class="dash-card"><span>피처드</span><strong>${featured}</strong></div>
    <div class="dash-card"><span>트렌딩</span><strong>${trending}</strong></div>
  `;
}

function thumbStyle(w) {
  const url = w.mediaType === 'video' ? w.posterUrl || w.mediaUrl : w.mediaUrl;
  return `background-image:url('${url}')`;
}

function renderWorksTable() {
  const tbody = $('#worksTableBody');
  if (!tbody) return;
  tbody.innerHTML = allWorks
    .map(
      (w) => `<tr data-id="${w.id}">
        <td><div class="table-thumb" style="${thumbStyle(w)}"></div></td>
        <td>${esc(w.title)}</td>
        <td>${CAT[w.category] || w.category}</td>
        <td>${esc(w.authorName)}</td>
        <td>${formatPrice(w.price)}</td>
        <td><input type="checkbox" class="toggle-featured" data-id="${w.id}" ${w.featured ? 'checked' : ''}></td>
        <td><input type="checkbox" class="toggle-trending" data-id="${w.id}" ${w.trending ? 'checked' : ''}></td>
        <td class="table-actions">
          <button type="button" class="btn-xs danger btn-delete" data-id="${w.id}">삭제</button>
        </td>
      </tr>`
    )
    .join('');

  tbody.querySelectorAll('.toggle-featured').forEach((cb) => {
    cb.addEventListener('change', () => patchWork(cb.dataset.id, { featured: cb.checked }));
  });
  tbody.querySelectorAll('.toggle-trending').forEach((cb) => {
    cb.addEventListener('change', () => patchWork(cb.dataset.id, { trending: cb.checked }));
  });
  tbody.querySelectorAll('.btn-delete').forEach((btn) => {
    btn.addEventListener('click', () => deleteWork(btn.dataset.id));
  });
}

function renderUsersTable() {
  const tbody = $('#usersTableBody');
  if (!tbody) return;
  tbody.innerHTML = allProfiles
    .map(
      (p) => `<tr>
        <td>${esc(p.display_name || '—')}</td>
        <td><code style="font-size:0.75rem">${esc(String(p.id).slice(0, 8))}…</code></td>
        <td>${p.created_at ? new Date(p.created_at).toLocaleDateString('ko-KR') : '—'}</td>
      </tr>`
    )
    .join('');
}

async function patchWork(id, patch) {
  try {
    if (useSupabase) {
      await ArtBusDB.adminUpdateWork(id, patch);
    } else {
      const works = getWorks();
      const i = works.findIndex((w) => w.id === id);
      if (i >= 0) {
        works[i] = { ...works[i], ...patch };
        localStorage.setItem(STORAGE.works, JSON.stringify(works));
      }
    }
    const w = allWorks.find((x) => x.id === id);
    if (w) Object.assign(w, patch);
    renderStats();
    showToast('저장되었습니다.');
  } catch (e) {
    showToast(e.message || '저장 실패');
    await refreshAll();
  }
}

async function deleteWork(id) {
  if (!confirm('이 작품을 삭제할까요?')) return;
  try {
    if (useSupabase) {
      await ArtBusDB.adminDeleteWork(id);
    } else {
      const works = getWorks().filter((w) => w.id !== id);
      localStorage.setItem(STORAGE.works, JSON.stringify(works));
    }
    allWorks = allWorks.filter((w) => w.id !== id);
    renderWorksTable();
    renderStats();
    showToast('삭제되었습니다.');
  } catch (e) {
    showToast(e.message || '삭제 실패');
  }
}

async function refreshAll() {
  await loadAdminData();
  renderStats();
  renderWorksTable();
  renderUsersTable();
}

async function bootstrap() {
  await initArtBus();
  updateAuthUI();

  const user = getSession();
  if (!user) {
    requireLogin('index.html');
    return;
  }

  const allowed = useSupabase && ArtBusDB.isConfigured()
    ? await ArtBusDB.isCurrentUserAdmin()
    : isAdmin();

  if (!allowed) {
    $('#adminDenied').hidden = false;
    document.querySelectorAll('.panel, #adminStats').forEach((el) => { el.style.display = 'none'; });
    return;
  }

  $('#authBtn')?.addEventListener('click', async () => {
    if (confirm('로그아웃할까요?')) {
      await setSession(null);
      window.location.href = 'index.html';
    }
  });

  $('#refreshWorks')?.addEventListener('click', refreshAll);

  await refreshAll();
}

document.addEventListener('DOMContentLoaded', bootstrap);
