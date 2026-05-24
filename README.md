# ArtBus

브랜드와 크리에이터를 위한 프리미엄 비주얼 라이선싱 마켓플레이스입니다.  
현재 버전은 별도 빌드 도구 없이 실행되는 Vanilla HTML/CSS/JavaScript 프로젝트이며, Supabase가 연결되면 `works` 테이블의 라이브 데이터를 사용하고, 연결 전에는 샘플 데이터로 동작합니다.

## 실행

```bash
npm start
```

브라우저에서 아래 주소를 엽니다.

```text
http://127.0.0.1:8080/
```

## 검증

```bash
npm run check
```

## 주요 파일

- `index.html` - 메인 앱 화면
- `css/main.css` - 전체 UI 스타일
- `js/app.js` - 마켓 검색, 필터, 상세 모달, 업로드, Supabase 연결
- `js/config.js` - Supabase 프로젝트 URL과 publishable key
- `supabase/RUN-THIS-FIRST.sql` - Supabase 최초 설치 SQL
- `static-server.js` - 로컬 정적 서버

## Supabase 연결

1. Supabase 프로젝트를 만듭니다.
2. `js/config.js`에 프로젝트 URL과 publishable key를 넣습니다.
3. Supabase SQL Editor에서 `supabase/RUN-THIS-FIRST.sql` 전체를 실행합니다.
4. 사이트에서 `연결 확인` 버튼을 누릅니다.

성공하면 상태 배지가 `Supabase 연결됨` 또는 `DB 연결됨 · 샘플 표시`로 바뀝니다.

## 현재 범위

이 프로젝트는 MVP 기준입니다.

- 에셋 검색과 필터
- 샘플 데이터 기반 마켓
- Supabase `works` 테이블 연결
- Supabase Auth 로그인/회원가입/로그아웃
- 작품 등록 폼
- 상세 모달
- 라이선스 섹션

결제, 관리자 승인, 정산, 파일 Storage 업로드는 다음 단계에서 확장하는 구조로 남겨두었습니다.
