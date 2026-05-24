# -*- coding: utf-8 -*-
from pathlib import Path

HTML = '''<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="ArtBus - 프리미엄 크리에이티브 에셋 마켓플레이스">
  <title>ArtBus</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700&family=Syne:wght@500;600;700;800&family=Manrope:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/main.css">
</head>
<body>
  <motion class="ambient" aria-hidden="true"><span></span><span></span><span></span></div>

  <div class="top-bar">
    <div class="container top-bar-inner">
      <span class="top-pill">New</span>
      <span>크리에이터 첫 3개월 <strong>수수료 0%</strong></span>
      <a href="#sell">자세히</a>
    </div>
  </motion>

  <header class="site-header" id="siteHeader">
    <div class="container header-inner">
      <a href="index.html" class="logo">
        <span class="logo-icon" aria-hidden="true"></span>
        <span class="logo-text">ArtBus</span>
      </a>
      <nav class="main-nav">
        <a href="#discover" data-cat="photo">사진</a>
        <a href="#discover" data-cat="illustration">일러스트</a>
        <a href="#discover" data-cat="video">영상</a>
        <a href="#discover" data-cat="painting">그림</a>
        <a href="#collections">컬렉션</a>
        <a href="#creators">크리에이터</a>
        <a href="#sell" class="nav-cta">판매하기</a>
      </nav>
      <form class="header-search" id="headerSearchForm">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        <input type="search" id="headerSearchInput" placeholder="에셋 검색" autocomplete="off">
      </form>
      <div class="header-actions">
        <button type="button" class="btn-text" id="authBtn">로그인</button>
        <button type="button" class="btn-icon" id="cartBtn" title="장바구니">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          <span class="badge" id="cartCount">0</span>
        </button>
        <button type="button" class="btn-solid" id="uploadNavBtn">업로드</button>
        <button type="button" class="menu-toggle" id="mobileMenuBtn" aria-label="메뉴"><span></span><span></span></button>
      </motion>
    </motion>
  </header>

  <main>
    <section class="hero" id="home">
      <div class="container hero-wrap">
        <div class="hero-content">
          <div class="hero-badge">Creative Asset Marketplace</motion>
          <h1>작품을 올리고,<br><span class="gradient-text">세계에 팔다</span></h1>
          <p class="hero-lead">사진 · 일러스트 · 4K 영상 · 디지털 아트. 브랜드와 스튜디오가 찾는 프리미엄 에셋을 한곳에서.</p>
          <form class="search-hero" id="heroSearchForm">
            <div class="search-hero-inner">
              <select id="heroSearchCategory" aria-label="카테고리">
                <option value="all">전체</option>
                <option value="photo">사진</option>
                <option value="illustration">일러스트</option>
                <option value="video">영상</option>
                <option value="painting">그림</option>
              </select>
              <input type="search" id="heroSearchInput" placeholder="무엇을 찾고 계신가요?">
              <button type="submit" class="btn-solid">검색</button>
            </motion>
          </form>
          <div class="trending-tags" id="trendingTags"></motion>
          <motion class="hero-actions">
            <a href="#sell" class="btn-solid btn-lg">크리에이터로 시작</a>
            <a href="#discover" class="btn-line btn-lg">컬렉션 보기</a>
          </motion>
          <div class="hero-metrics">
            <div><strong id="statAssets">5.2M+</strong><span>에셋</span></div>
            <motion><strong id="statCreators">148K</strong><span>크리에이터</span></div>
            <div><strong id="statLocalWorks">—</strong><span>라이브</span></div>
          </motion>
        </motion>
        <div class="hero-visual">
          <div class="bento" id="heroCollage"></motion>
          <div class="hero-card-float">
            <span class="float-label">Live sale</span>
            <strong>+₩128,000</strong>
            <small>방금 전 · Studio Lumen</small>
          </motion>
        </motion>
      </motion>
    </section>

    <section class="marquee-strip">
      <div class="marquee">
        <span>Samsung</span><span>Netflix</span><span>Adobe</span><span>Hyundai</span><span>Nike</span><span>Spotify</span><span>Apple</span><span>Google</span>
        <span>Samsung</span><span>Netflix</span><span>Adobe</span><span>Hyundai</span>
      </motion>
    </section>

    <section class="section" id="categories">
      <div class="container">
        <header class="section-head">
          <p class="overline">Browse</p>
          <h2>카테고리</h2>
        </header>
        <div class="cat-showcase" id="categoryCards"></motion>
      </motion>
    </section>

    <section class="section section-alt" id="collections">
      <div class="container">
        <header class="section-head flex">
          <div><p class="overline">Curated</p><h2>에디토리얼 컬렉션</h2></div>
          <a href="#discover" class="text-link">전체 보기 →</a>
        </header>
        <div class="coll-scroll" id="collectionScroll"></motion>
      </motion>
    </section>

    <section class="section marketplace" id="discover">
      <div class="container-wide">
        <header class="section-head">
          <p class="overline">Marketplace</p>
          <h2>마켓플레이스</h2>
        </header>
        <div class="market-layout">
          <aside class="filters">
            <h3>필터</h3>
            <div class="filter-block">
              <h4>카테고리</h4>
              <div class="filter-chips" id="categoryFilters">
                <button type="button" class="filter-chip on" data-category="all">전체</button>
                <button type="button" class="filter-chip" data-category="photo">사진</button>
                <button type="button" class="filter-chip" data-category="illustration">일러스트</button>
                <button type="button" class="filter-chip" data-category="video">영상</button>
                <button type="button" class="filter-chip" data-category="painting">그림</button>
              </motion>
            </motion>
            <div class="filter-block">
              <h4>가격</h4>
              <div class="price-row">
                <input type="number" id="priceMin" placeholder="최소">
                <span>—</span>
                <input type="number" id="priceMax" placeholder="최대">
              </motion>
              <button type="button" class="btn-text-sm" id="applyPrice">적용</button>
            </motion>
            <div class="filter-block">
              <h4>라이선스</h4>
              <label class="check"><input type="checkbox" name="lic" value="standard" checked> Standard</label>
              <label class="check"><input type="checkbox" name="lic" value="extended"> Extended</label>
              <label class="check"><input type="checkbox" name="lic" value="exclusive"> Exclusive</label>
            </motion>
            <div class="filter-block">
              <label class="check"><input type="checkbox" id="filterFeatured"> 에디터 픽</label>
              <label class="check"><input type="checkbox" id="filterTrending"> 트렌딩</label>
            </motion>
          </aside>
          <div class="market-main">
            <div class="toolbar">
              <div class="tabs" id="marketTabs">
                <button type="button" class="tab on" data-tab="all">전체</button>
                <button type="button" class="tab" data-tab="trending">트렌딩</button>
                <button type="button" class="tab" data-tab="featured">픽</button>
                <button type="button" class="tab" data-tab="new">신규</button>
              </motion>
              <motion class="toolbar-end">
                <span id="resultCount" class="count">0</span>
                <select id="sortSelect" class="select">
                  <option value="newest">최신순</option>
                  <option value="popular">인기순</option>
                  <option value="price-asc">가격 낮은순</option>
                  <option value="price-desc">가격 높은순</option>
                </select>
              </motion>
            </motion>
            <motion class="gallery" id="gallery"></motion>
            <p class="empty" id="emptyGallery" hidden>조건에 맞는 작품이 없습니다.</p>
            <nav class="pager" id="pagination"></nav>
          </motion>
        </motion>
      </motion>
    </section>

    <section class="section" id="how">
      <div class="container">
        <header class="section-head center">
          <p class="overline">How it works</p>
          <h2>3단계로 시작</h2>
        </header>
        <div class="steps">
          <article class="step-card"><div class="step-num">01</motion><h3>가입</h3><p>무료 계정 생성</p></article>
          <article class="step-card"><div class="step-num">02</motion><h3>업로드</h3><p>에셋과 라이선스 설정</p></article>
          <article class="step-card"><motion class="step-num">03</motion><h3>수익</h3><p>판매 · 정산 · 출금</p></article>
        </motion>
      </motion>
    </section>

    <section class="section section-alt" id="pricing">
      <div class="container">
        <header class="section-head center">
          <p class="overline">Licensing</p>
          <h2>라이선스</h2>
        </header>
        <div class="pricing">
          <article><h3>Standard</h3><p class="pct">60%</p><ul><li>웹 · SNS</li></ul></article>
          <article class="featured"><span class="tag">Popular</span><h3>Extended</h3><p class="pct">70%</p><ul><li>광고 · 인쇄</li></ul></article>
          <article><h3>Exclusive</h3><p class="pct">85%</p><ul><li>단독 판매</li></ul></article>
        </motion>
      </motion>
    </section>

    <section class="section" id="sell">
      <div class="container sell-layout">
        <div class="sell-intro">
          <p class="overline">Contributor</p>
          <h2>크리에이터 허브</h2>
          <p>업로드부터 정산까지, 깔끔한 대시보드로 관리하세요.</p>
          <div class="dash-cards">
            <div><span>이번 달</span><strong>₩4,872,350</strong></div>
            <div><span>다운로드</span><strong>38,941</strong></motion>
            <div><span>조회</span><strong>124K</strong></div>
          </motion>
        </motion>
        <form class="upload-form" id="uploadForm">
          <h3>작품 등록</h3>
          <motion class="db-setup-alert" id="dbSetupAlert" hidden role="alert">
            <strong>Supabase 테이블이 없어 업로드할 수 없습니다.</strong>
            <p>대시보드 → <b>SQL Editor</b> → PC의 <code>supabase/RUN-THIS-FIRST.sql</code> 전체 붙여넣기 → <b>Run</b></p>
            <p>실행 후 Table Editor에서 <code>works</code>, <code>profiles</code>가 보이면 새로고침하세요.</p>
          </motion>
          <p class="hint" id="uploadAuthHint">로그인 후 등록</p>
          <label class="field"><span>제목</span><input type="text" id="workTitle" required></label>
          <div class="field-row">
            <label class="field"><span>카테고리</span><select id="workCategory"><option value="photo">사진</option><option value="illustration">일러스트</option><option value="video">영상</option><option value="painting">그림</option></select></label>
            <label class="field"><span>라이선스</span><select id="workLicense"><option value="standard">Standard</option><option value="extended">Extended</option><option value="exclusive">Exclusive</option></select></label>
          </motion>
          <div class="field-row">
            <label class="field"><span>가격</span><input type="number" id="workPrice" min="1000" step="500" required></label>
            <label class="field check-field"><input type="checkbox" id="workFeatured"> 피처드 신청</label>
          </motion>
          <label class="field"><span>키워드</span><input type="text" id="workTags" placeholder="쉼표로 구분"></label>
          <label class="field"><span>설명</span><textarea id="workDesc" rows="3"></textarea></label>
          <div class="dropzone" id="dropzone">
            <input type="file" id="workFile" accept="image/*,video/*" hidden>
            <div id="dropzoneInner">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              <p>드래그하거나 클릭하여 업로드</p>
            </motion>
            <div id="dropzonePreview" hidden></motion>
          </motion>
          <button type="submit" class="btn-solid btn-full" id="uploadSubmit" disabled>등록하기</button>
        </form>
      </motion>
    </section>

    <section class="section" id="creators">
      <div class="container">
        <header class="section-head flex">
          <div><p class="overline">Creators</p><h2>탑 크리에이터</h2></div>
          <a href="#discover" class="text-link">전체 →</a>
        </header>
        <div class="creator-grid" id="creatorGrid"></motion>
      </motion>
    </section>

    <section class="section quotes">
      <div class="container">
        <div class="quote-grid">
          <blockquote><p>\"캠페인 퀄리티가 확 올라갔어요.\"</p><cite>패션 디렉터</cite></blockquote>
          <blockquote><p>\"라이선스가 명확해서 팀이 바로 씁니다.\"</p><cite>프로덕션 스튜디오</cite></blockquote>
          <blockquote><p>\"업로드 UI가 정말 깔끔합니다.\"</p><cite>독립 작가</cite></blockquote>
        </motion>
      </motion>
    </section>

    <section class="cta-band">
      <div class="container cta-inner">
        <h2>다음 걸작을 기다리고 있어요</h2>
        <button type="button" class="btn-solid btn-lg" id="ctaSignup">무료로 시작</button>
      </motion>
    </section>
  </main>

  <footer class="footer">
    <div class="container foot-grid">
      <div class="foot-brand">
        <a href="index.html" class="logo"><span class="logo-icon"></span><span class="logo-text">ArtBus</span></a>
        <p>프리미엄 크리에이티브 마켓</p>
      </motion>
      <div><h4>마켓</h4><a href="#discover">전체</a><a href="#collections">컬렉션</a></div>
      <div><h4>크리에이터</h4><a href="#sell">판매</a><a href="#pricing">라이선스</a></div>
      <div><h4>지원</h4><a href="mailto:support@artbus.com">고객센터</a></motion>
    </motion>
    <div class="container foot-copy">© 2026 ArtBus</div>
  </footer>

  <dialog class="modal" id="authModal">
    <div class="modal-sheet">
      <button type="button" class="modal-close" data-close aria-label="닫기">×</button>
      <div class="modal-tabs">
        <button type="button" class="mtab on" data-tab="login">로그인</button>
        <button type="button" class="mtab" data-tab="signup">가입</button>
      </motion>
      <form id="loginForm" class="mform">
        <h3>다시 만나서 반가워요</h3>
        <label class="field"><span>이메일</span><input type="email" id="loginEmail" required></label>
        <label class="field"><span>비밀번호</span><input type="password" id="loginPassword" required minlength="6"></label>
        <button type="submit" class="btn-solid btn-full">로그인</button>
      </form>
      <form id="signupForm" class="mform" hidden>
        <h3>계정 만들기</h3>
        <label class="field"><span>이름</span><input type="text" id="signupName" required></label>
        <label class="field"><span>이메일</span><input type="email" id="signupEmail" required></label>
        <label class="field"><span>비밀번호</span><input type="password" id="signupPassword" required minlength="6"></label>
        <button type="submit" class="btn-solid btn-full">시작하기</button>
      </form>
    </motion>
  </dialog>

  <dialog class="modal modal-lg" id="workModal">
    <div class="modal-sheet modal-sheet-lg" id="workDetail"></motion>
  </dialog>

  <div class="toast" id="toast"></motion>
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
  <script src="js/config.js"></script>
  <script src="js/supabase-api.js"></script>
  <script src="js/common.js"></script>
  <script src="js/app.js"></script>
</body>
</html>
'''

HTML = HTML.replace('<motion', '<motion').replace('</motion>', '</motion>')
HTML = HTML.replace('<motion', '<div').replace('</motion>', '</div>')

Path(__file__).parent.joinpath('index.html').write_text(HTML, encoding='utf-8')
print('done', '크리에이터' in HTML)
