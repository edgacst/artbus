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
}

function toast(message) {
  const el = $('#toast');
  el.textContent = message;
  el.classList.add('show');
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => el.classList.remove('show'), 2200);
}

function bindEvents() {
  $('#promptForm').addEventListener('submit', (event) => {
    event.preventDefault();
    makePrompt();
  });

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
