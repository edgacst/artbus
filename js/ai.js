const $ = (selector) => document.querySelector(selector);

function selectedStyle() {
  return document.querySelector('input[name="style"]:checked')?.value || '';
}

function money(value) {
  return `${value.toLocaleString('ko-KR')}원`;
}

function makePrompt() {
  const subject = $('#subjectInput').value.trim() || '상업용 비주얼 콘텐츠';
  const industry = $('#industrySelect').value;
  const format = $('#formatSelect').value;
  const style = selectedStyle();
  const keywords = $('#keywordInput').value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .join(', ');

  const prompt = `${subject}, ${industry}에 바로 사용할 수 있는 ${format}, ${style}, ${keywords}, 선명한 디테일, 상업용 라이선스에 적합한 원본성, 텍스트와 로고 없음, 고해상도`;
  const isVideo = format.includes('영상');
  const isCampaign = industry.includes('광고') || industry.includes('캠페인');

  $('#promptOutput').textContent = prompt;
  $('#categoryOutput').textContent = isVideo ? '영상 콘티' : '이미지';
  $('#licenseOutput').textContent = isCampaign ? 'Extended' : 'Standard';
  $('#priceOutput').textContent = money(isVideo ? 45000 : isCampaign ? 25000 : 15000);
  $('#sourceOutput').textContent = '로컬 생성';
  $('#descriptionOutput').textContent = `${industry}에 활용하기 좋은 ${format} 제작 브리프입니다.`;
}

function toast(message) {
  const el = $('#toast');
  el.textContent = message;
  el.classList.add('show');
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => el.classList.remove('show'), 2200);
}

function collectInput() {
  return {
    subject: $('#subjectInput').value.trim(),
    industry: $('#industrySelect').value,
    format: $('#formatSelect').value,
    style: selectedStyle(),
    keywords: $('#keywordInput').value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean),
  };
}

function renderBrief(brief) {
  $('#promptOutput').textContent = brief.prompt;
  $('#categoryOutput').textContent = brief.category;
  $('#licenseOutput').textContent = brief.license;
  $('#priceOutput').textContent = money(Number(brief.price || 0));
  $('#sourceOutput').textContent = brief.source === 'openai' ? 'AI 생성' : '로컬 생성';
  $('#descriptionOutput').textContent = brief.description || '';
}

async function generateAiBrief() {
  const button = $('#aiGenerateBtn');
  button.disabled = true;
  button.textContent = 'AI 생성 중';

  try {
    const response = await fetch('/api/ai/brief', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(collectInput()),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'AI 생성에 실패했습니다.');
    renderBrief(data.brief);
    toast(data.warning || 'AI 브리프를 생성했습니다.');
  } catch (error) {
    makePrompt();
    toast(error.message);
  } finally {
    button.disabled = false;
    button.textContent = 'AI로 브리프 생성';
  }
}

function bindEvents() {
  $('#promptForm').addEventListener('submit', (event) => {
    event.preventDefault();
    makePrompt();
  });

  $('#aiGenerateBtn').addEventListener('click', generateAiBrief);

  $('#copyPromptBtn').addEventListener('click', async () => {
    const text = $('#promptOutput').textContent;
    try {
      await navigator.clipboard.writeText(text);
      toast('프롬프트를 복사했습니다.');
    } catch {
      toast('복사 권한을 확인해 주세요.');
    }
  });

  document.querySelectorAll('#promptForm input, #promptForm select').forEach((field) => {
    field.addEventListener('change', makePrompt);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  bindEvents();
  makePrompt();
});
