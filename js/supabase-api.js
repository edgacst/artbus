/**
 * ArtBus — Supabase data layer
 */
const ArtBusDB = (() => {
  const BUCKET = 'works';
  let client = null;
  let user = null;
  let worksCache = [];

  function cfg() {
    return window.ARTBUS_CONFIG || {};
  }

  function isValidApiKey(key) {
    return key.startsWith('eyJ') || key.startsWith('sb_publishable_');
  }

  function isConfigured() {
    const c = cfg();
    const key = (c.SUPABASE_ANON_KEY || '').trim();
    const url = (c.SUPABASE_URL || '').trim();
    return Boolean(
      url
      && key
      && key !== 'your-anon-key-from-supabase-dashboard'
      && isValidApiKey(key)
    );
  }

  function getConfigIssue() {
    if (!window.ARTBUS_CONFIG) {
      return 'config.js 로드 실패 — 파일 문법 오류를 확인하세요 (F12 → Console).';
    }
    const c = cfg();
    const key = (c.SUPABASE_ANON_KEY || '').trim();
    const url = (c.SUPABASE_URL || '').trim();
    if (!url) return 'SUPABASE_URL이 없습니다. config.js에 https://프로젝트ID.supabase.co 를 넣으세요.';
    if (!key) return 'SUPABASE_ANON_KEY가 비어 있습니다. Supabase → Settings → API 에서 Publishable key 또는 anon public 키를 넣으세요.';
    if (key === 'your-anon-key-from-supabase-dashboard') return 'config.example.js 예시 키입니다. 실제 키로 교체하세요.';
    if (key.startsWith('sb_secret_')) return 'Secret key는 프론트엔드에 넣으면 안 됩니다. Publishable(sb_publishable_) 또는 anon(eyJ) 키를 사용하세요.';
    if (!isValidApiKey(key)) return 'API 키 형식이 맞지 않습니다. sb_publishable_... 또는 eyJ... 키를 사용하세요.';
    return null;
  }

  function redirectUrl() {
    return window.location.origin + window.location.pathname;
  }

  function getClient() {
    if (!isConfigured()) return null;
    if (!client && window.supabase) {
      const c = cfg();
      client = window.supabase.createClient(
        c.SUPABASE_URL.trim(),
        (c.SUPABASE_ANON_KEY || '').trim(),
        {
          auth: {
            flowType: 'pkce',
            detectSessionInUrl: true,
            persistSession: true,
          },
        },
      );
    }
    return client;
  }

  function mapWork(row) {
    const name = row.profiles?.display_name || row.author_name || '크리에이터';
    return {
      id: row.id,
      title: row.title,
      category: row.category,
      price: row.price,
      tags: row.tags || [],
      description: row.description || '',
      authorId: row.author_id,
      authorName: name,
      mediaType: row.media_type,
      mediaUrl: row.media_url,
      posterUrl: row.poster_url || undefined,
      license: row.license || 'standard',
      featured: !!row.featured,
      trending: !!row.trending,
      downloads: row.downloads || 0,
      createdAt: row.created_at ? new Date(row.created_at).getTime() : Date.now(),
    };
  }

  async function attachAuthorProfiles(rows) {
    const sb = getClient();
    const ids = [...new Set((rows || []).map((row) => row.author_id).filter(Boolean))];
    if (!sb || !ids.length) return rows || [];

    const { data, error } = await sb
      .from('profiles')
      .select('id, display_name')
      .in('id', ids);
    if (error) {
      console.warn('profiles lookup', error);
      return rows || [];
    }

    const names = new Map((data || []).map((profile) => [profile.id, profile.display_name]));
    return (rows || []).map((row) => ({
      ...row,
      author_name: names.get(row.author_id) || row.author_name,
    }));
  }

  async function refreshUser() {
    const sb = getClient();
    if (!sb) {
      user = null;
      return null;
    }
    const { data: { session } } = await sb.auth.getSession();
    if (!session?.user) {
      user = null;
      return null;
    }
    let profile = null;
    const profRes = await sb.from('profiles').select('display_name').eq('id', session.user.id).maybeSingle();
    if (!profRes.error) profile = profRes.data;
    else if (profRes.error.code !== 'PGRST205') console.warn('profiles', profRes.error);
    user = {
      id: session.user.id,
      email: session.user.email,
      name: profile?.display_name || session.user.user_metadata?.display_name || session.user.email?.split('@')[0] || 'User',
    };
    return user;
  }

  function getUser() {
    return user;
  }

  function explainDbError(error) {
    if (!error) return null;
    const code = error.code || '';
    const msg = error.message || '';
    if (code === 'PGRST205' || msg.includes("Could not find the table")) {
      return 'DB 테이블이 없습니다. Supabase SQL Editor에서 supabase/schema.sql 파일 내용을 실행하세요.';
    }
    if (code === 'PGRST200' || msg.includes('relationship')) {
      return 'DB 관계 설정 오류입니다. schema.sql을 다시 실행하세요.';
    }
    return msg;
  }

  async function fetchWorks() {
    const sb = getClient();
    if (!sb) return null;
    const { data, error } = await sb
      .from('works')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      const hint = explainDbError(error);
      const err = new Error(hint || error.message);
      err.code = error.code;
      throw err;
    }
    worksCache = (await attachAuthorProfiles(data || [])).map(mapWork);
    return worksCache;
  }

  function getCachedWorks() {
    return worksCache;
  }

  function setCachedWorks(list) {
    worksCache = list;
  }

  async function signUp(name, email, password) {
    const sb = getClient();
    const { data, error } = await sb.auth.signUp({
      email,
      password,
      options: { data: { display_name: name } },
    });
    if (error) throw error;
    await refreshUser();
    if (user) {
      await sb.from('profiles').upsert({ id: user.id, display_name: name });
      user.name = name;
    }
    return data;
  }

  async function signIn(email, password) {
    const sb = getClient();
    const { error } = await sb.auth.signInWithPassword({ email, password });
    if (error) throw error;
    await refreshUser();
    return user;
  }

  async function signOut() {
    const sb = getClient();
    if (sb) await sb.auth.signOut();
    user = null;
  }

  async function signInWithOAuth(provider) {
    const sb = getClient();
    if (!sb) throw new Error('Supabase가 설정되지 않았습니다.');
    const { error } = await sb.auth.signInWithOAuth({
      provider,
      options: { redirectTo: redirectUrl() },
    });
    if (error) throw error;
  }

  async function fetchWorksByAuthor(authorId) {
    const sb = getClient();
    if (!sb) return [];
    const { data, error } = await sb
      .from('works')
      .select('*')
      .eq('author_id', authorId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (await attachAuthorProfiles(data || [])).map(mapWork);
  }

  async function fetchAllProfiles() {
    const sb = getClient();
    if (!sb) return [];
    const { data, error } = await sb.from('profiles').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  }

  async function adminUpdateWork(id, patch) {
    const sb = getClient();
    const { data, error } = await sb.from('works').update(patch).eq('id', id).select('*').single();
    if (error) throw error;
    const mapped = mapWork(data);
    worksCache = worksCache.map((w) => (w.id === id ? mapped : w));
    return mapped;
  }

  async function adminDeleteWork(id) {
    const sb = getClient();
    const { error } = await sb.from('works').delete().eq('id', id);
    if (error) throw error;
    worksCache = worksCache.filter((w) => w.id !== id);
  }

  async function isCurrentUserAdmin() {
    const sb = getClient();
    if (!sb || !user) return false;
    const { data, error } = await sb.rpc('is_admin');
    if (error) {
      console.warn('admin check', error);
      return false;
    }
    return data === true;
  }

  async function updateProfileName(displayName) {
    const sb = getClient();
    if (!user) throw new Error('로그인이 필요합니다.');
    const { error } = await sb.from('profiles').update({ display_name: displayName }).eq('id', user.id);
    if (error) throw error;
    user.name = displayName;
    return user;
  }

  async function checkDatabaseReady() {
    const sb = getClient();
    if (!sb) return { ok: false, reason: 'config', message: 'Supabase 설정을 확인하세요.' };
    const works = await sb.from('works').select('id').limit(1);
    if (works.error) {
      return {
        ok: false,
        works: false,
        message: explainDbError(works.error) || works.error.message,
      };
    }
    const { error: stErr } = await sb.storage.from(BUCKET).list('', { limit: 1 });
    if (stErr) {
      return {
        ok: false,
        works: true,
        storage: false,
        message: 'Storage 버킷 "works"가 없습니다. supabase/RUN-THIS-FIRST.sql 을 SQL Editor에서 실행하세요.',
      };
    }
    return { ok: true, works: true, storage: true };
  }

  async function uploadWork(payload, file) {
    const sb = getClient();
    if (!user) throw new Error('로그인이 필요합니다.');

    const ready = await checkDatabaseReady();
    if (!ready.ok) throw new Error(ready.message);

    let mediaUrl = payload.mediaUrl;
    let posterUrl = payload.posterUrl;

    if (file) {
      const ext = (file.name.split('.').pop() || 'bin').toLowerCase();
      const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await sb.storage.from(BUCKET).upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      });
      if (upErr) {
        const msg = upErr.message || '';
        if (msg.includes('Bucket not found') || msg.includes('bucket')) {
          throw new Error('Storage 버킷이 없습니다. supabase/RUN-THIS-FIRST.sql 을 실행하세요.');
        }
        throw upErr;
      }
      const { data: pub } = sb.storage.from(BUCKET).getPublicUrl(path);
      mediaUrl = pub.publicUrl;
    }

    if (!mediaUrl) throw new Error('미디어 URL이 없습니다. 파일을 다시 선택하세요.');

    const row = {
      author_id: user.id,
      title: payload.title,
      category: payload.category,
      price: payload.price,
      license: payload.license || 'standard',
      tags: payload.tags || [],
      description: payload.description || '',
      media_type: payload.mediaType,
      media_url: mediaUrl,
      poster_url: posterUrl || null,
      featured: !!payload.featured,
      trending: false,
      downloads: 0,
    };

    const { data, error } = await sb.from('works').insert(row).select('*').single();
    if (error) {
      const hint = explainDbError(error);
      throw new Error(hint || error.message);
    }
    const mapped = mapWork(data);
    worksCache.unshift(mapped);
    return mapped;
  }

  async function handleAuthCallback() {
    const sb = getClient();
    if (!sb) return false;
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (!code) return false;
    const { error } = await sb.auth.exchangeCodeForSession(code);
    if (error) throw error;
    window.history.replaceState({}, document.title, redirectUrl());
    await refreshUser();
    return true;
  }

  async function init(onAuthChange) {
    if (!isConfigured()) return { ok: false, reason: 'config' };
    const sb = getClient();
    if (!sb) return { ok: false, reason: 'client' };

    try {
      await handleAuthCallback();
    } catch (e) {
      console.error('OAuth callback', e);
    }
    await refreshUser();
    sb.auth.onAuthStateChange(async () => {
      await refreshUser();
      if (onAuthChange) onAuthChange(user);
    });

    let worksLoaded = false;
    let fetchError = null;
    try {
      await fetchWorks();
      worksLoaded = true;
    } catch (e) {
      fetchError = e;
      console.error('ArtBus fetchWorks:', e);
    }
    return { ok: true, worksLoaded, fetchError };
  }

  return {
    isConfigured,
    getConfigIssue,
    init,
    getUser,
    refreshUser,
    fetchWorks,
    getCachedWorks,
    setCachedWorks,
    signUp,
    signIn,
    signInWithOAuth,
    signOut,
    fetchWorksByAuthor,
    fetchAllProfiles,
    isCurrentUserAdmin,
    adminUpdateWork,
    adminDeleteWork,
    updateProfileName,
    checkDatabaseReady,
    explainDbError,
    uploadWork,
    mapWork,
  };
})();
