export default {
  async fetch(request, env, _ctx) {
    const url = new URL(request.url);

    if (url.pathname === '/api/admin/login' && request.method === 'POST') {
      return handleAdminLogin(request, env);
    }
    if (url.pathname === '/api/admin/verify' && request.method === 'POST') {
      return handleAdminVerify(request, env);
    }
    if (url.pathname === '/api/admin/submissions' && request.method === 'GET') {
      return handleAdminSubmissions(request, env);
    }
    if (url.pathname === '/api/admin/submissions/export' && request.method === 'GET') {
      return handleAdminExport(request, env);
    }
    if (url.pathname === '/api/admin/stats' && request.method === 'GET') {
      return handleAdminStats(request, env);
    }

    if (request.method !== 'POST') {
      return json({ success: false, error: 'Method not allowed' }, 405);
    }

    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';

    if (rateLimited(ip, env)) {
      return json({ success: false, error: 'Too many requests. Please try again later.' }, 429, { 'Retry-After': '600' });
    }

    let body;
    try { body = await request.json(); } catch (_e) {
      return json({ success: false, error: 'Invalid JSON body' }, 400);
    }

    const { formName, fields, honeyPot, utm } = body;

    if (!formName || !fields || typeof fields !== 'object') {
      return json({ success: false, error: 'Missing required fields: formName, fields' }, 400);
    }

    if (honeyPot && honeyPot.length > 0) {
      log({ formName, spam: true, ip });
      return json({ success: true });
    }

    const errors = validate(formName, fields);
    if (errors) {
      return json({ success: false, error: errors.join('; ') }, 422);
    }

    recordRequest(ip);

    let emailSent = true;
    try {
      const emailUrl = new URL('/api/email', request.url);
      const emailRes = await fetch(emailUrl.toString(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: formName, fields, utm: utm || {} }),
      });
      const emailBody = await emailRes.json();
      if (!emailBody.emailSent) emailSent = false;
    } catch (e) {
      emailSent = false;
      console.warn(`Email notification failed for ${formName}:`, e.message);
    }

    const hashedIp = await sha256(ip);
    const id = uuid();
    const timestamp = new Date().toISOString();
    const datePrefix = timestamp.slice(0, 10);

    const entry = { schema: 'submission.v1', id, timestamp, formName, fields, ip: hashedIp, utm: utm || {}, spam: false, emailSent };
    log({ timestamp, formName, fieldKeys: Object.keys(fields), ip, utm: utm || {}, spam: false, emailSent });

    const key = `sub:${datePrefix}:${id}`;
    try {
      if (env.SUBMISSIONS) await env.SUBMISSIONS.put(key, JSON.stringify(entry));
    } catch (e) {
      console.warn('KV submission storage failed:', e.message);
    }

    try {
      if (env.AUDIT) await env.AUDIT.put(`audit:${datePrefix}:${uuid()}`, JSON.stringify({
        schema: 'audit.v1', id: uuid(), timestamp, action: 'submission_write', actor: hashedIp, resource: key, detail: { formName },
      }));
    } catch (e) {
      console.warn('Audit log write failed:', e.message);
    }

    if (formName === 'newsletter' && fields.email) {
      const subKey = `subscriber:${await sha256(fields.email.toLowerCase().trim())}`;
      try {
        const existing = env.SUBMISSIONS ? await env.SUBMISSIONS.get(subKey) : null;
        const now = timestamp;
        const subscriber = existing
          ? { ...JSON.parse(existing), subscribedAt: now }
          : { email: fields.email.toLowerCase().trim(), subscribedAt: now, source: utm?.source || 'website', firstSeen: now };
        if (env.SUBMISSIONS) await env.SUBMISSIONS.put(subKey, JSON.stringify(subscriber));
      } catch (e) {
        console.warn('Subscriber storage failed:', e.message);
      }
    }

    return json({ success: true, message: 'Submission received', emailSent });
  }
};

function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...extraHeaders },
  });
}

function uuid() {
  return crypto.randomUUID();
}

async function sha256(text) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

/* ─── Field schemas ─── */
const SCHEMAS = {
  contact: {
    required: ['name', 'email', 'phone', 'company'],
    rules: {
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      phone: /^\+?\d{7,15}$/,
    },
  },
  'demo-booking': {
    required: ['name', 'email', 'phone', 'company'],
    rules: {
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      phone: /^\+?\d{7,15}$/,
    },
  },
  newsletter: {
    required: ['email'],
    rules: {
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
  },
};

function validate(formName, fields) {
  const schema = SCHEMAS[formName];
  if (!schema) return null;

  const errors = [];
  for (const key of schema.required) {
    if (!fields[key] || String(fields[key]).trim() === '') {
      errors.push(`${key} is required`);
    }
  }
  if (schema.rules) {
    for (const [key, regex] of Object.entries(schema.rules)) {
      if (fields[key] && !regex.test(String(fields[key]))) {
        errors.push(`${key} is invalid`);
      }
    }
  }
  return errors.length > 0 ? errors : null;
}

/* ─── Rate limiting ─── */
function recordRequest(ip) {
  const now = Date.now();
  globalThis._rateLimit = globalThis._rateLimit || {};
  globalThis._rateLimit[ip] = globalThis._rateLimit[ip] || [];
  globalThis._rateLimit[ip].push(now);
  globalThis._rateLimit[ip] = globalThis._rateLimit[ip].filter(t => now - t < 600000);
}

function rateLimited(ip) {
  const now = Date.now();
  globalThis._rateLimit = globalThis._rateLimit || {};
  const timestamps = (globalThis._rateLimit[ip] || []).filter(t => now - t < 600000);
  return timestamps.length >= 5;
}

/* ─── Logging ─── */
function log(entry) {
  console.log(JSON.stringify(entry));
}

/* ─── JWT utilities ─── */
async function signJWT(payload, secret, expiresInHours = 24) {
  const encoder = new TextEncoder();
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const full = { ...payload, iat: now, exp: now + expiresInHours * 3600 };
  const b64 = (s) => btoa(s).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const headerEnc = b64(JSON.stringify(header));
  const payloadEnc = b64(JSON.stringify(full));
  const signingInput = `${headerEnc}.${payloadEnc}`;
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(signingInput));
  const sigEnc = btoa(String.fromCharCode(...new Uint8Array(sig))).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  return `${signingInput}.${sigEnc}`;
}

async function verifyJWT(token, secret) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']);
    const sig = parts[2].replace(/-/g, '+').replace(/_/g, '/');
    const sigBytes = Uint8Array.from(atob(sig), c => c.charCodeAt(0));
    const valid = await crypto.subtle.verify('HMAC', key, sigBytes, encoder.encode(`${parts[0]}.${parts[1]}`));
    if (!valid) return null;
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch (_e) {
    return null;
  }
}

/* ─── Admin endpoints ─── */
async function handleAdminLogin(request, env) {
  let body;
  try { body = await request.json(); } catch (_e) {
    return json({ success: false, error: 'Invalid JSON' }, 400);
  }
  const { username, password } = body;
  if (!username || !password) {
    return json({ success: false, error: 'Missing credentials' }, 400);
  }
  if (username !== env.ADMIN_USERNAME || password !== env.ADMIN_PASSWORD) {
    await auditLog(env, request, 'admin_login_failed', `login:${username}`);
    return json({ success: false, error: 'Invalid credentials' }, 401);
  }
  const token = await signJWT({ username }, env.JWT_SECRET);
  await auditLog(env, request, 'admin_login', `login:${username}`);
  return json({ success: true, token });
}

async function handleAdminVerify(request, env) {
  let body;
  try { body = await request.json(); } catch (_e) {
    return json({ valid: false });
  }
  const payload = await verifyJWT(body.token || '', env.JWT_SECRET);
  return json({ valid: payload !== null });
}

const MAX_PER_PAGE = 100;
const DEFAULT_PER_PAGE = 20;

async function handleAdminSubmissions(request, env) {
  const authHeader = request.headers.get('Authorization') || '';
  const token = authHeader.replace('Bearer ', '');
  const payload = await verifyJWT(token, env.JWT_SECRET);
  if (!payload) return json({ success: false, error: 'Unauthorized' }, 401);

  const url = new URL(request.url);
  const page = Math.max(1, parseInt(url.searchParams.get('page')) || 1);
  const perPage = Math.min(MAX_PER_PAGE, Math.max(1, parseInt(url.searchParams.get('per_page')) || DEFAULT_PER_PAGE));
  const formNameFilter = url.searchParams.get('formName') || '';

  try {
    if (!env.SUBMISSIONS) return json({ success: true, submissions: [], pagination: { page, perPage, total: 0, pages: 0 } });

    const kvs = [];
    let cursor;
    do {
      const list = await env.SUBMISSIONS.list({ prefix: 'sub:', limit: 1000, cursor });
      for (const k of list.keys) {
        if (!k.name.startsWith('subscriber:')) kvs.push(k.name);
      }
      cursor = list.list_complete ? undefined : list.cursor;
    } while (cursor);

    kvs.sort().reverse();

    const filtered = formNameFilter ? [] : kvs;
    const allSubmissions = [];

    for (const key of kvs) {
      const val = await env.SUBMISSIONS.get(key);
      if (!val) continue;
      const s = JSON.parse(val);
      if (formNameFilter && s.formName !== formNameFilter) continue;
      if (formNameFilter) filtered.push(key);
      allSubmissions.push(s);
      if (!formNameFilter && allSubmissions.length >= page * perPage + perPage) break;
    }

    const total = formNameFilter ? filtered.length : kvs.length;
    const totalPages = Math.ceil(total / perPage);
    const start = (page - 1) * perPage;

    const submissions = formNameFilter
      ? allSubmissions.slice(start, start + perPage)
      : allSubmissions.slice(start, start + perPage);

    return json({ success: true, submissions, pagination: { page, perPage, total, pages: totalPages } });
  } catch (e) {
    console.warn('KV submissions fetch failed:', e.message);
    return json({ success: true, submissions: [], pagination: { page: 1, perPage, total: 0, pages: 0 } });
  }
}

async function handleAdminExport(request, env) {
  const authHeader = request.headers.get('Authorization') || '';
  const token = authHeader.replace('Bearer ', '');
  const payload = await verifyJWT(token, env.JWT_SECRET);
  if (!payload) return json({ success: false, error: 'Unauthorized' }, 401);

  const url = new URL(request.url);
  const format = url.searchParams.get('format') || 'csv';
  const formNameFilter = url.searchParams.get('formName') || '';

  const submissions = [];
  try {
    if (env.SUBMISSIONS) {
      let cursor;
      do {
        const list = await env.SUBMISSIONS.list({ prefix: 'sub:', limit: 1000, cursor });
        for (const k of list.keys) {
          if (k.name.startsWith('subscriber:')) continue;
          const val = await env.SUBMISSIONS.get(k.name);
          if (!val) continue;
          const s = JSON.parse(val);
          if (formNameFilter && s.formName !== formNameFilter) continue;
          submissions.push(s);
        }
        cursor = list.list_complete ? undefined : list.cursor;
      } while (cursor);
    }
  } catch (e) {
    console.warn('Export fetch failed:', e.message);
  }

  submissions.sort((a, b) => (b.timestamp || '').localeCompare(a.timestamp || ''));

  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const hashedIp = await sha256(ip);
  try {
    if (env.AUDIT) await env.AUDIT.put(`audit:${new Date().toISOString().slice(0, 10)}:${uuid()}`, JSON.stringify({
      schema: 'audit.v1', id: uuid(), timestamp: new Date().toISOString(), action: 'submission_export', actor: hashedIp, resource: `export:${format}`, detail: { count: submissions.length, formName: formNameFilter || 'all' },
    }));
  } catch (_e) { /* audit log failure is non-blocking */ }

  if (format === 'json') {
    return new Response(JSON.stringify(submissions), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Content-Disposition': 'attachment; filename="optiflow-submissions.json"' },
    });
  }

  const fieldKeys = new Set();
  for (const s of submissions) Object.keys(s.fields || {}).forEach(k => fieldKeys.add(k));
  const headers = ['timestamp', 'formName', ...Array.from(fieldKeys), 'utm_source', 'utm_medium', 'utm_campaign', 'emailSent'];
  const csvRows = [headers.map(escCSV).join(',')];
  for (const s of submissions) {
    const row = [
      s.timestamp || '', s.formName || '',
      ...Array.from(fieldKeys).map(k => escCSV(String(s.fields?.[k] ?? ''))),
      escCSV(s.utm?.source || ''), escCSV(s.utm?.medium || ''), escCSV(s.utm?.campaign || ''),
      s.emailSent ? 'true' : 'false',
    ];
    csvRows.push(row.join(','));
  }

  return new Response(csvRows.join('\n'), {
    status: 200,
    headers: { 'Content-Type': 'text/csv', 'Content-Disposition': 'attachment; filename="optiflow-submissions.csv"' },
  });
}

function escCSV(val) {
  if (val.includes(',') || val.includes('"') || val.includes('\n')) {
    return `"${val.replace(/"/g, '""')}"`;
  }
  return val;
}

async function auditLog(env, request, action, resource) {
  try {
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    const hashedIp = await sha256(ip);
    if (env.AUDIT) await env.AUDIT.put(`audit:${new Date().toISOString().slice(0, 10)}:${uuid()}`, JSON.stringify({
      schema: 'audit.v1', id: uuid(), timestamp: new Date().toISOString(), action, actor: hashedIp, resource, detail: {},
    }));
  } catch (_e) { /* audit failure is non-blocking */ }
}

async function handleAdminStats(request, env) {
  const authHeader = request.headers.get('Authorization') || '';
  const token = authHeader.replace('Bearer ', '');
  const payload = await verifyJWT(token, env.JWT_SECRET);
  if (!payload) return json({ success: false, error: 'Unauthorized' }, 401);

  const stats = { total: 0, today: 0, byForm: {}, subscribers: 0 };
  const today = new Date().toISOString().slice(0, 10);
  try {
    if (env.SUBMISSIONS) {
      let cursor;
      do {
        const list = await env.SUBMISSIONS.list({ prefix: 'sub:', limit: 1000, cursor });
        for (const k of list.keys) {
          if (k.name.startsWith('subscriber:')) { stats.subscribers++; continue; }
          const val = await env.SUBMISSIONS.get(k.name);
          if (!val) continue;
          const s = JSON.parse(val);
          stats.total++;
          if ((s.timestamp || '').startsWith(today)) stats.today++;
          const fn = s.formName || 'unknown';
          stats.byForm[fn] = (stats.byForm[fn] || 0) + 1;
        }
        cursor = list.list_complete ? undefined : list.cursor;
      } while (cursor);
    }
  } catch (e) {
    console.warn('KV stats fetch failed:', e.message);
  }
  return json({ success: true, stats });
}
