const http = require('http');
const fs = require('fs');
const path = require('path');

const root = __dirname;
const port = Number(process.env.PORT || 8080);
const envPath = path.join(root, '.env');

const types = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
};

function loadLocalEnv() {
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const eq = trimmed.indexOf('=');
    if (eq === -1) return;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
    if (key && !process.env[key]) process.env[key] = value;
  });
}

function sendJson(res, status, data) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  });
  res.end(JSON.stringify(data));
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 1024 * 1024) {
        req.destroy();
        reject(new Error('Request body is too large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error('Invalid JSON body'));
      }
    });
    req.on('error', reject);
  });
}

function fallbackBrief(input) {
  const subject = input.subject || '상업용 비주얼 콘텐츠';
  const industry = input.industry || '브랜드 광고';
  const format = input.format || '정사각형 이미지';
  const style = input.style || '미니멀하고 고급스러운 스튜디오 조명';
  const keywords = Array.isArray(input.keywords) ? input.keywords.join(', ') : String(input.keywords || '');
  const isVideo = format.includes('영상');
  const isCampaign = industry.includes('광고') || industry.includes('캠페인');

  return {
    prompt: `${subject}, ${industry}에 바로 사용할 수 있는 ${format}, ${style}, ${keywords}, 선명한 디테일, 상업용 라이선스에 적합한 원본성, 텍스트와 로고 없음, 고해상도`,
    category: isVideo ? '영상 콘티' : '이미지',
    license: isCampaign ? 'Extended' : 'Standard',
    price: isVideo ? 45000 : isCampaign ? 25000 : 15000,
    title: subject,
    tags: keywords ? keywords.split(',').map((tag) => tag.trim()).filter(Boolean).slice(0, 6) : [],
    description: `${industry}에 활용하기 좋은 ${format} 제작 브리프입니다.`,
    source: 'fallback',
  };
}

function extractResponseText(data) {
  if (typeof data.output_text === 'string') return data.output_text;
  const parts = [];
  (data.output || []).forEach((item) => {
    (item.content || []).forEach((content) => {
      if (content.type === 'output_text' && content.text) parts.push(content.text);
    });
  });
  return parts.join('\n');
}

function parseAiBrief(text, input) {
  try {
    const parsed = JSON.parse(text);
    return {
      ...fallbackBrief(input),
      ...parsed,
      price: Number(parsed.price || fallbackBrief(input).price),
      tags: Array.isArray(parsed.tags) ? parsed.tags : fallbackBrief(input).tags,
      source: 'openai',
    };
  } catch {
    return {
      ...fallbackBrief(input),
      prompt: text || fallbackBrief(input).prompt,
      source: 'openai',
    };
  }
}

async function generateAiBrief(input) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return { brief: fallbackBrief(input), warning: 'OPENAI_API_KEY가 없어 로컬 생성 결과를 사용했습니다.' };
  }

  const payload = {
    model: process.env.OPENAI_MODEL || 'gpt-5.2',
    instructions: [
      'You are an expert commercial visual marketplace producer.',
      'Return only valid compact JSON in Korean.',
      'Schema: {"title":string,"prompt":string,"category":string,"license":"Standard"|"Extended"|"Exclusive","price":number,"tags":string[],"description":string}.',
      'The prompt must be suitable for generating saleable visual assets and must avoid brand logos, existing copyrighted characters, and visible text.',
    ].join(' '),
    input: JSON.stringify({
      subject: input.subject,
      industry: input.industry,
      format: input.format,
      style: input.style,
      keywords: input.keywords,
    }),
    max_output_tokens: 700,
  };

  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data.error?.message || `OpenAI API error ${response.status}`;
    throw new Error(message);
  }

  return { brief: parseAiBrief(extractResponseText(data), input) };
}

async function handleAiBrief(req, res) {
  try {
    const input = await readJson(req);
    const result = await generateAiBrief(input);
    sendJson(res, 200, result);
  } catch (error) {
    sendJson(res, 500, {
      brief: fallbackBrief({}),
      error: error.message,
    });
  }
}

function resolveUrl(url) {
  const cleanPath = decodeURIComponent(new URL(url, `http://localhost:${port}`).pathname);
  const requested = cleanPath === '/' ? '/index.html' : cleanPath;
  const filePath = path.resolve(root, `.${requested}`);
  if (!filePath.startsWith(root)) return null;
  return filePath;
}

loadLocalEnv();

const server = http.createServer((req, res) => {
  const pathname = new URL(req.url, `http://localhost:${port}`).pathname;

  if (req.method === 'POST' && pathname === '/api/ai/brief') {
    handleAiBrief(req, res);
    return;
  }

  const filePath = resolveUrl(req.url);
  if (!filePath) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(err.code === 'ENOENT' ? 404 : 500);
      res.end(err.code === 'ENOENT' ? 'Not found' : 'Server error');
      return;
    }

    res.writeHead(200, {
      'Content-Type': types[path.extname(filePath).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-store',
    });
    res.end(data);
  });
});

server.listen(port, '127.0.0.1', () => {
  console.log(`ArtBus running at http://127.0.0.1:${port}/`);
});
