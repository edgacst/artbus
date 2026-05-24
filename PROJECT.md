# Project Notes

## Product

ArtBus는 스톡 사진, 영상, 일러스트, 파인아트를 팀 단위로 검색하고 라이선스 조건을 확인하는 크리에이티브 에셋 마켓입니다.

## Technical Decisions

- 프론트엔드는 의존성 없이 Vanilla HTML/CSS/JavaScript로 구성했습니다.
- 로컬 서버는 Node.js 기본 모듈만 사용합니다.
- Supabase는 선택 연결입니다. DB가 준비되지 않아도 샘플 데이터로 서비스 화면을 유지합니다.
- `works` 테이블은 인증 없이 읽고 쓸 수 있는 MVP 정책입니다. 운영 전에는 인증 기반 RLS로 강화해야 합니다.

## Next Milestones

1. Storage 파일 업로드
2. 관리자 승인 플로우
3. 결제/라이선스 발급 테이블
4. 구매자 마이페이지와 크리에이터 대시보드
5. 인증 기반 RLS 강화
