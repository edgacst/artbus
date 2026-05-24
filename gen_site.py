# -*- coding: utf-8 -*-
"""Generate index.html with UTF-8 Korean content."""
from pathlib import Path

OUT = Path(__file__).parent / "index.html"

HTML = r'''<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="ArtBus - 500만+ 프리미엄 크리에이티브 에셋 마켓플레이스">
  <title>ArtBus | Global Creative Asset Marketplace</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/main.css">
</head>
<body>
  <motion class="grain" aria-hidden="true"></motion>
  <div class="top-bar">
    <div class="container top-bar-inner">
      <span>신규 크리에이터 <strong>첫 3개월 수수료 0%</strong></span>
      <a href="#sell">혜택 보기</a>
    </div>
  </div>
  <header class="site-header" id="siteHeader">
    <motion class="container header-inner">
      <a href="#home" class="logo"><span class="logo-mark">AB</span><span class="logo-text">ArtBus</span></a>
      <nav class="main-nav">
        <a href="#discover" data-cat="photo">사진</a>
        <a href="#discover" data-cat="illustration">일러스트</a>
        <a href="#discover" data-cat="video">영상</a>
        <a href="#discover" data-cat="painting">그림</a>
        <a href="#collections">컬렉션</a>
        <a href="#creators">크리에이터</a>
        <a href="#pricing">라이선스</a>
        <a href="#sell" class="nav-sell">판매하기</a>
      </nav>
      <form class="header-search" id="headerSearchForm">
        <input type="search" id="headerSearchInput" placeholder="5,000,000+ 에셋 검색" autocomplete="off">
        <button type="submit" class="btn-primary btn-sm">검색</button>
      </form>
      <div class="header-actions">
        <button type="button" class="btn-ghost" id="authBtn">로그인</button>
        <button type="button" class="btn-outline btn-sm" id="cartBtn">장바구니 <span id="cartCount">0</span></button>
        <button type="button" class="btn-primary" id="uploadNavBtn">업로드</button>
        <button type="button" class="mobile-menu-btn" id="mobileMenuBtn" aria-label="메뉴"><span></span><span></span><span></span></button>
      </div>
    </div>
  </header>
  <main>
    <section class="hero-market" id="home">
      <div class="container hero-grid">
        <div class="hero-copy">
          <p class="eyebrow">Shutterstock x ArtStation Class Marketplace</p>
          <h1>세계가 다운로드하는<br><em>프리미엄 크리에이티브</em></h1>
          <p class="lede">스톡 사진, 벡터 일러스트, 4K 영상, 디지털 회화. 브랜드와 스튜디오가 신뢰하는 에셋 허브.</p>
          <form class="hero-search" id="heroSearchForm">
            <select id="heroSearchCategory">
              <option value="all">전체 에셋</option>
              <option value="photo">사진</option>
              <option value="illustration">일러스트</option>
              <option value="video">영상</option>
              <option value="painting">그림</option>
            </select>
            <input type="search" id="heroSearchInput" placeholder="비즈니스, 4K 드론, UI 키트, 추상 회화…">
            <button type="submit" class="btn-primary">검색</button>
          </form>
          <div class="trending-tags" id="trendingTags"></div>
          <div class="hero-btns">
            <a href="#sell" class="btn-primary btn-lg">크리에이터 시작</a>
            <a href="#discover" class="btn-outline btn-lg">마켓 탐색</a>
          </div>
        </div>
        <div class="hero-collage" id="heroCollage"></div>
      </div>
    </section>
    <section class="trust-strip">
      <div class="container">
        <p>12,000+ 팀이 ArtBus를 사용합니다</p>
        <div class="trust-logos"><span>Samsung</span><span>Netflix</span><span>Adobe</span><span>Hyundai</span><span>Nike</span><span>Spotify</span></motion>
      </motion>
    </section>
    <section class="platform-stats">
      <div class="container stats-row">
        <div class="stat-box"><strong id="statAssets">5.2M+</strong><span>에셋</span></div>
        <div class="stat-box"><strong id="statCreators">148K+</strong><span>크리에이터</span></div>
        <div class="stat-box"><strong>98</strong><span>개국</span></div>
        <div class="stat-box"><strong id="statLocalWorks">—</strong><span>라이브 작품</span></div>
      </motion>
    </section>
    <section class="section" id="categories">
      <div class="container">
        <header class="sec-head"><span class="label">Categories</span><h2>카테고리별 탐색</h2></header>
        <div class="cat-showcase" id="categoryCards"></div>
      </motion>
    </section>
    <section class="section" id="collections">
      <div class="container">
        <header class="sec-head row"><div><span class="label">Collections</span><h2>에디토리얼 컬렉션</h2></div><a href="#discover" class="more-link">전체 보기</a></header>
        <div class="coll-scroll" id="collectionScroll"></div>
      </motion>
    </section>
    <section class="section marketplace-sec" id="discover">
      <div class="container-wide">
        <header class="sec-head"><span class="label">Marketplace</span><h2>마켓플레이스</h2></header>
        <div class="market-layout">
          <aside class="market-side">
            <h3>필터</h3>
            <div class="side-block">
              <h4>카테고리</h4>
              <div class="filter-chips" id="categoryFilters">
                <button type="button" class="filter-chip on" data-category="all">전체</button>
                <button type="button" class="filter-chip" data-category="photo">사진</button>
                <button type="button" class="filter-chip" data-category="illustration">일러스트</button>
                <button type="button" class="filter-chip" data-category="video">영상</button>
                <button type="button" class="filter-chip" data-category="painting">그림</button>
              </motion>
            </motion>
            <div class="side-block">
              <h4>가격 (원)</h4>
              <div class="price-inputs">
                <input type="number" id="priceMin" placeholder="최소">
                <span>–</span>
                <input type="number" id="priceMax" placeholder="최대">
              </motion>
              <button type="button" class="btn-ghost btn-sm" id="applyPrice">적용</button>
            </motion>
            <div class="side-block">
              <h4>라이선스</h4>
              <label><input type="checkbox" name="lic" value="standard" checked> Standard</label>
              <label><input type="checkbox" name="lic" value="extended"> Extended</label>
              <label><input type="checkbox" name="lic" value="exclusive"> Exclusive</label>
            </motion>
            <div class="side-block">
              <label><input type="checkbox" id="filterFeatured"> 에디터 픽</label>
              <label><input type="checkbox" id="filterTrending"> 트렌딩</label>
            </motion>
          </aside>
          <div class="market-body">
            <div class="market-bar">
              <div class="market-tabs" id="marketTabs">
                <button type="button" class="tab on" data-tab="all">전체</button>
                <button type="button" class="tab" data-tab="trending">트렌딩</button>
                <button type="button" class="tab" data-tab="featured">에디터 픽</button>
                <button type="button" class="tab" data-tab="new">신규</button>
              </motion>
              <div class="market-bar-right">
                <span id="resultCount">0개</span>
                <select id="sortSelect">
                  <option value="newest">최신순</option>
                  <option value="popular">인기순</option>
                  <option value="price-asc">가격↑</option>
                  <option value="price-desc">가격↓</option>
                </select>
              </motion>
            </motion>
            <div class="gallery" id="gallery"></div>
            <p class="empty" id="emptyGallery" hidden>조건에 맞는 작품이 없습니다.</p>
            <nav class="pager" id="pagination"></nav>
          </motion>
        </motion>
      </motion>
    </section>
    <section class="section" id="how">
      <div class="container steps">
        <header class="sec-head center"><span class="label">How it works</span><h2>3단계로 판매 시작</h2></header>
        <div class="steps-grid">
          <article><span>01</span><h3>가입</h3><p>무료 크리에이터 계정</p></article>
          <article><span>02</span><h3>업로드</h3><p>에셋·가격·라이선스</p></article>
          <article><span>03</span><h3>정산</h3><p>실시간 수익·출금</p></article>
        </motion>
      </motion>
    </section>
    <section class="section" id="pricing">
      <div class="container">
        <header class="sec-head center"><span class="label">Licensing</span><h2>라이선스 & 수익</h2></header>
        <div class="price-cards">
          <article><h3>Standard</h3><p class="rate">수익 <strong>60%</strong></p><ul><li>웹·SNS</li><li>5천~5만원</li></ul></article>
          <article class="hot"><b>인기</b><h3>Extended</h3><p class="rate">수익 <strong>70%</strong></p><ul><li>광고·인쇄</li><li>3만~20만원</li></ul></article>
          <article><h3>Exclusive</h3><p class="rate">수익 <strong>85%</strong></p><ul><li>단독 판매</li><li>10만원+</li></ul></article>
        </motion>
      </motion>
    </section>
    <section class="section seller-sec" id="sell">
      <div class="container seller-grid">
        <div class="seller-info">
          <span class="label">Contributor Hub</span>
          <h2>크리에이터 허브</h2>
          <p>Shutterstock Submit · ArtStation 벤치마킹 대시보드 (데모)</p>
          <ul><li>일괄 업로드</li><li>AI 키워드 추천</li><li>글로벌 정산</li></ul>
          <div class="dash">
            <div><span>이번 달</span><strong>₩4,872,350</strong></div>
            <div><span>다운로드</span><strong>38,941</strong></motion>
            <div><span>조회</span><strong>124K</strong></div>
          </motion>
        </motion>
        <form class="upload-panel" id="uploadForm">
          <h3>에셋 등록</h3>
          <p id="uploadAuthHint">로그인 후 등록</p>
          <label>제목<input type="text" id="workTitle" required></label>
          <div class="row2">
            <label>카테고리<select id="workCategory"><option value="photo">사진</option><option value="illustration">일러스트</option><option value="video">영상</option><option value="painting">그림</option></select></label>
            <label>라이선스<select id="workLicense"><option value="standard">Standard</option><option value="extended">Extended</option><option value="exclusive">Exclusive</option></select></label>
          </motion>
          <div class="row2">
            <label>가격<input type="number" id="workPrice" min="1000" step="500" required></label>
            <label class="chk"><input type="checkbox" id="workFeatured"> 피처드 신청</label>
          </motion>
          <label>키워드<input type="text" id="workTags"></label>
          <label>설명<textarea id="workDesc" rows="3"></textarea></label>
          <div class="dropzone" id="dropzone">
            <input type="file" id="workFile" accept="image/*,video/*" hidden>
            <div id="dropzoneInner"><p>파일을 끌어다 놓거나 클릭</p></div>
            <div id="dropzonePreview" hidden></div>
          </motion>
          <button type="submit" class="btn-primary btn-full" id="uploadSubmit" disabled>등록</button>
        </form>
      </motion>
    </section>
    <section class="section" id="creators">
      <div class="container">
        <header class="sec-head row"><div><span class="label">Creators</span><h2>탑 크리에이터</h2></div><a href="#discover" class="more-link">전체</a></header>
        <div class="creator-grid" id="creatorGrid"></div>
      </motion>
    </section>
    <section class="section quotes-sec">
      <div class="container">
        <header class="sec-head center"><span class="label">Reviews</span><h2>후기</h2></header>
        <motion class="quotes">
          <blockquote><p>캠페인 톤이 한 단계 올라갔습니다.</p><cite>글로벌 패션 디렉터</cite></blockquote>
          <blockquote><p>라이선스 검수가 매우 간단했습니다.</p><cite>프로덕션 스튜디오</cite></blockquote>
          <blockquote><p>주말 업로드만으로도 꾸준한 수익.</p><cite>독립 사진작가</cite></blockquote>
        </motion>
      </motion>
    </section>
    <section class="enterprise">
      <div class="container ent-inner">
        <div><span class="label">Enterprise</span><h2>팀·기업 무제한 라이선스</h2><p>API · 전담 PM · 맞춤 견적</p></div>
        <button type="button" class="btn-primary btn-lg" id="ctaSignup">크리에이터 가입</button>
      </motion>
    </section>
  </main>
  <footer class="footer">
    <div class="container foot-cols">
      <div><a href="#home" class="logo"><span class="logo-mark">AB</span><span class="logo-text">ArtBus</span></a><p>프리미엄 크리에이티브 마켓</p></div>
      <motion><h4>마켓</h4><a href="#discover">전체</a><a href="#collections">컬렉션</a></motion>
      <div><h4>크리에이터</h4><a href="#sell">판매</a><a href="#pricing">라이선스</a></div>
      <div><h4>지원</h4><a href="mailto:support@artbus.com">고객센터</a><a href="#">약관</a></div>
    </motion>
    <div class="container foot-copy">© 2026 ArtBus Inc.</div>
  </footer>
  <dialog class="modal" id="authModal">
    <div class="modal-box">
      <button type="button" class="modal-x" data-close>&times;</button>
      <div class="modal-tabs">
        <button type="button" class="mtab on" data-tab="login">로그인</button>
        <button type="button" class="mtab" data-tab="signup">가입</button>
      </motion>
      <form id="loginForm" class="mform">
        <h3>로그인</h3>
        <label>이메일<input type="email" id="loginEmail" required></label>
        <label>비밀번호<input type="password" id="loginPassword" required minlength="6"></label>
        <button type="submit" class="btn-primary btn-full">로그인</button>
      </form>
      <form id="signupForm" class="mform" hidden>
        <h3>회원가입</h3>
        <label>이름<input type="text" id="signupName" required></label>
        <label>이메일<input type="email" id="signupEmail" required></label>
        <label>비밀번호<input type="password" id="signupPassword" required minlength="6"></label>
        <button type="submit" class="btn-primary btn-full">시작하기</button>
      </form>
    </motion>
  </dialog>
  <dialog class="modal modal-lg" id="workModal">
    <div class="modal-box" id="workDetail"></div>
  </dialog>
  <div class="toast" id="toast"></motion>
  <script src="js/app.js"></script>
</body>
</html>
'''

# Fix accidental motion tags
HTML = HTML.replace('<motion', '<div').replace('</motion>', '</div>')

OUT.write_text(HTML, encoding='utf-8')
print('Wrote', OUT, 'hangul:', '크리에이터' in HTML)
