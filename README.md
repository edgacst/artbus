# ArtBus

ArtBus는 사진, 영상, 일러스트, 페인팅 같은 비주얼 콘텐츠를 검색하고 라이선스 판매 흐름을 실험하는 정적 웹 마켓플레이스입니다.

Vanilla HTML/CSS/JavaScript로 동작하며, Supabase를 연결하면 `works` 테이블의 라이브 데이터를 사용합니다. 연결 전에는 샘플 데이터로 화면을 확인할 수 있습니다.

## 실행

```bash
npm start
```

브라우저에서 아래 주소를 엽니다.

```text
http://127.0.0.1:8080/
```

## 확인

```bash
npm run check
```

## 주요 페이지

- `index.html` - 메인 마켓플레이스
- `ai.html` - AI Studio 프롬프트/제작 브리프 페이지
- `mypage.html` - 로그인 사용자의 콘텐츠 관리 페이지
- `admin.html` - 관리자 페이지

## 주요 파일

- `css/main.css` - 공통 UI 스타일
- `css/ai.css` - AI Studio 전용 스타일
- `js/app.js` - 마켓 검색, 필터, 상세 모달, 업로드, Supabase 연결
- `js/ai.js` - AI Studio 프롬프트 생성 로직
- `js/mypage.js` - 마이페이지 계정/업로드 목록 관리
- `js/config.js` - Supabase 프로젝트 URL과 publishable key
- `supabase/RUN-THIS-FIRST.sql` - Supabase 초기 설치 SQL
- `static-server.js` - 로컬 정적 서버

## Supabase 연결

1. Supabase 프로젝트를 만듭니다.
2. `js/config.js`에 프로젝트 URL과 publishable key를 넣습니다.
3. Supabase SQL Editor에서 `supabase/PRODUCTION-SETUP.sql`을 실행합니다.
4. Supabase Auth redirect는 `supabase/AUTH-REDIRECT-CHECKLIST.md`를 보고 설정합니다.
5. 사이트에서 업로드, 로그인, 마이페이지 기능을 확인합니다.

## AI Studio 연결

AI Studio의 `AI로 브리프 생성` 버튼은 서버의 `/api/ai/brief` 엔드포인트를 호출합니다.

1. `.env.example`을 참고해 `.env` 파일을 만듭니다.
2. `.env`에 `OPENAI_API_KEY`를 넣습니다.
3. 필요하면 `OPENAI_MODEL` 값을 바꿉니다. 기본값은 `gpt-5.2`입니다.
4. 서버를 다시 시작합니다.

API 키가 없으면 AI Studio는 로컬 생성 결과를 사용합니다.

## 현재 범위

- 콘텐츠 검색과 필터
- 샘플 데이터 기반 마켓 화면
- Supabase `works` 테이블 연결
- Supabase Auth 로그인/회원가입/로그아웃
- 콘텐츠 등록과 삭제
- 콘텐츠 상세 모달
- 라이선스 섹션
- OpenAI Responses API 기반 AI Studio 브리프 생성
- 마이페이지 업로드 관리

결제, 정산, 고급 관리자 승인 흐름은 추후 확장 대상입니다.
