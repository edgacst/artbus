/**
 * Supabase 설정 — config.js 로 복사 후 anon key 입력
 *
 * 소셜 로그인: Dashboard → Authentication → Providers 에서
 * Google / Kakao / GitHub 활성화 후 Redirect URL 에 사이트 주소 등록
 * (예: http://localhost:8080/ 또는 배포 도메인)
 */
window.ARTBUS_CONFIG = {
  SUPABASE_URL: 'https://qwxtlyfharorqmemlsya.supabase.co',
  /** Settings → API → Publishable key (sb_publishable_...) 또는 legacy anon (eyJ...) */
  SUPABASE_ANON_KEY: 'sb_publishable_여기에-실제-키',
  /** 관리자 페이지 접근 허용 이메일 (로그인 계정과 일치) */
  ADMIN_EMAILS: ['admin@artbus.com'],
};
