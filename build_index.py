# -*- coding: utf-8 -*-
"""index.html UTF-8 재생성 — 한글 깨짐 시: python build_index.py"""
from pathlib import Path
import runpy

ROOT = Path(__file__).parent
runpy.run_path(str(ROOT / "redesign.py"))

text = (ROOT / "index.html").read_text(encoding="utf-8")
text = text.replace("<motion", "<motion").replace("</motion>", "</motion>")
text = text.replace("<motion", "<div").replace("</motion>", "</div>")

if 'id="mypageLink"' not in text:
    text = text.replace(
        '<div class="header-actions">\n        <button type="button" class="btn-text" id="authBtn">로그인</button>',
        '<div class="header-actions">\n        <a href="mypage.html" class="btn-text" id="mypageLink">마이페이지</a>\n        <a href="admin.html" class="btn-text nav-admin" id="adminNavLink" hidden>관리자</a>\n        <button type="button" class="btn-text" id="authBtn">로그인</button>',
    )

if 'id="dbSetupAlert"' not in text:
    text = text.replace(
        '<h3>작품 등록</h3>\n          <p class="hint" id="uploadAuthHint">로그인 후 등록</p>',
        '<h3>작품 등록</h3>\n          <div class="db-setup-alert" id="dbSetupAlert" hidden role="alert">\n'
        '            <strong>Supabase 테이블이 없어 업로드할 수 없습니다.</strong>\n'
        '            <p>대시보드 → <b>SQL Editor</b> → PC의 <code>supabase/RUN-THIS-FIRST.sql</code> 전체 붙여넣기 → <b>Run</b></p>\n'
        '            <p>실행 후 Table Editor에서 <code>works</code>, <code>profiles</code>가 보이면 새로고침하세요.</p>\n'
        '          </div>\n'
        '          <p class="hint" id="uploadAuthHint">로그인 후 등록</p>',
    )

if 'auth-social' not in text:
    text = text.replace(
        '<dialog class="modal" id="authModal">\n    <motion class="modal-sheet">\n'
        '      <button type="button" class="modal-close" data-close aria-label="닫기">×</button>\n'
        '      <div class="modal-tabs">\n'
        '        <button type="button" class="mtab on" data-tab="login">로그인</button>\n'
        '        <button type="button" class="mtab" data-tab="signup">가입</button>\n'
        '      </div>\n'
        '      <form id="loginForm" class="mform">',
        '<dialog class="modal" id="authModal">\n    <div class="modal-sheet modal-auth">\n'
        '      <button type="button" class="modal-close" data-close aria-label="닫기">&times;</button>\n'
        '      <div class="modal-tabs">\n'
        '        <button type="button" class="mtab on" data-tab="login">로그인</button>\n'
        '        <button type="button" class="mtab" data-tab="signup">가입</button>\n'
        '      </div>\n'
        '      <div class="auth-social">\n'
        '        <button type="button" class="btn-social btn-google" data-oauth="google">Google로 계속</button>\n'
        '        <button type="button" class="btn-social btn-kakao" data-oauth="kakao">카카오로 계속</button>\n'
        '        <button type="button" class="btn-social btn-github" data-oauth="github">GitHub로 계속</button>\n'
        '      </div>\n'
        '      <p class="auth-divider">또는 이메일로</p>\n'
        '      <form id="loginForm" class="mform">',
    )
    text = text.replace("<motion", "<div").replace("</motion>", "</div>")

# Shutterstock 스타일 테마 + 히어로
if 'theme-shutterstock.css' not in text:
    text = text.replace(
        '<link rel="stylesheet" href="css/main.css">',
        '<link rel="stylesheet" href="css/main.css">\n  <link rel="stylesheet" href="css/theme-shutterstock.css">',
    )
if 'fonts.googleapis.com' in text and 'Syne' in text:
    text = text.replace(
        "family=Noto+Sans+KR:wght@400;500;600;700&family=Syne:wght@500;600;700;800&family=Manrope:wght@400;500;600;700",
        "family=Noto+Sans+KR:wght@400;500;600;700;800",
    )

import re
hero_new = '''    <section class="hero hero-stock" id="home">
      <div class="container hero-stock-inner">
        <h1 class="hero-stock-title">로열티 프리 <span>스톡 콘텐츠</span>를 검색하세요</h1>
        <div class="search-type-tabs" id="searchTypeTabs">
          <button type="button" class="search-type on" data-cat="all">전체</button>
          <button type="button" class="search-type" data-cat="photo">이미지</button>
          <button type="button" class="search-type" data-cat="illustration">일러스트</button>
          <button type="button" class="search-type" data-cat="video">영상</button>
          <button type="button" class="search-type" data-cat="painting">음악·아트</button>
        </div>
        <form class="search-hero search-hero-stock" id="heroSearchForm">
          <div class="search-hero-inner">
            <select id="heroSearchCategory" aria-label="카테고리" hidden>
              <option value="all">전체</option>
              <option value="photo">사진</option>
              <option value="illustration">일러스트</option>
              <option value="video">영상</option>
              <option value="painting">그림</option>
            </select>
            <input type="search" id="heroSearchInput" placeholder="로열티 프리 이미지, 영상, 일러스트 검색">
            <button type="submit" class="btn-solid btn-search-red">검색</button>
          </div>
        </form>
        <div class="trending-tags" id="trendingTags"></div>
      </div>
      <div class="hero-strip-wrap">
        <div class="container-wide">
          <div class="hero-strip" id="heroCollage"></div>
        </div>
      </div>
    </section>

    '''
if 'hero-stock' not in text:
    text = re.sub(
        r'<section class="hero" id="home">.*?</section>\s*\n\s*<section class="marquee-strip">',
        hero_new + '<section class="marquee-strip">',
        text,
        count=1,
        flags=re.DOTALL,
    )

(ROOT / "index.html").write_text(text, encoding="utf-8")
print("OK" if "크리에이터" in text and text.count("???") == 0 else "CHECK", "| ???", text.count("???"), "| SS", "hero-stock" in text)
