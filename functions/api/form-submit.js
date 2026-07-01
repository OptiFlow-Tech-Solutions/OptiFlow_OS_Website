export default {
  async fetch(request, env, ctx) {
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
    try { body = await request.json(); } catch (e) {
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
      await sendNotification(formName, fields, utm, env);
    } catch (e) {
      emailSent = false;
      console.warn(`Email notification failed for ${formName}:`, e.message);
    }

    const entry = { timestamp: new Date().toISOString(), formName, fields, ip, utm: utm || {}, spam: false, emailSent };
    log({ timestamp: entry.timestamp, formName, fieldKeys: Object.keys(fields), ip, utm: utm || {}, spam: false, emailSent });

    const key = `sub:${entry.timestamp}-${Math.random().toString(36).substring(2, 8)}`;
    try {
      if (env.SUBMISSIONS) await env.SUBMISSIONS.put(key, JSON.stringify(entry));
    } catch (e) {
      console.warn('KV submission storage failed:', e.message);
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

/* ─── Email notification ─── */
async function sendNotification(formName, fields, utm, env) {
  const to = 'hello@optiflow.in';
  const subjects = {
    contact: 'New Contact Form Submission — OptiFlow OS',
    'demo-booking': 'New Demo Booking — OptiFlow OS',
    newsletter: 'New Newsletter Signup — OptiFlow OS',
  };
  const subject = subjects[formName] || `New ${formName} Submission — OptiFlow OS`;

  let body = '';
  for (const [key, value] of Object.entries(fields)) {
    body += `${key}: ${value}\n`;
  }
  if (utm && Object.keys(utm).length > 0) {
    body += '\n--- UTM ---\n';
    for (const [key, value] of Object.entries(utm)) {
      body += `${key}: ${value}\n`;
    }
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: 'OptiFlow OS <noreply@optiflow.in>',
      to,
      subject,
      text: body,
    }),
  });

  if (!res.ok) throw new Error(`Resend API error: ${res.status}`);
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
  } catch (e) {
    return null;
  }
}

/* ─── Admin endpoints ─── */
async function handleAdminLogin(request, env) {
  let body;
  try { body = await request.json(); } catch (e) {
    return json({ success: false, error: 'Invalid JSON' }, 400);
  }
  const { username, password } = body;
  if (!username || !password) {
    return json({ success: false, error: 'Missing credentials' }, 400);
  }
  if (username !== env.ADMIN_USERNAME || password !== env.ADMIN_PASSWORD) {
    return json({ success: false, error: 'Invalid credentials' }, 401);
  }
  const token = await signJWT({ username }, env.JWT_SECRET);
  return json({ success: true, token });
}

async function handleAdminVerify(request, env) {
  let body;
  try { body = await request.json(); } catch (e) {
    return json({ valid: false });
  }
  const payload = await verifyJWT(body.token || '', env.JWT_SECRET);
  return json({ valid: payload !== null });
}

async function handleAdminSubmissions(request, env) {
  const authHeader = request.headers.get('Authorization') || '';
  const token = authHeader.replace('Bearer ', '');
  const payload = await verifyJWT(token, env.JWT_SECRET);
  if (!payload) return json({ success: false, error: 'Unauthorized' }, 401);

  const limit = 50;
  const submissions = [];
  try {
    if (env.SUBMISSIONS) {
      const list = await env.SUBMISSIONS.list({ prefix: 'sub:', limit });
      for (const k of list.keys) {
        const val = await env.SUBMISSIONS.get(k.name);
        if (val) submissions.push(JSON.parse(val));
      }
      submissions.sort((a, b) => (b.timestamp || '').localeCompare(a.timestamp || ''));
    }
  } catch (e) {
    console.warn('KV submissions fetch failed:', e.message);
  }
  return json({ success: true, submissions: submissions.slice(0, limit) });
}

async function handleAdminStats(request, env) {
  const authHeader = request.headers.get('Authorization') || '';
  const token = authHeader.replace('Bearer ', '');
  const payload = await verifyJWT(token, env.JWT_SECRET);
  if (!payload) return json({ success: false, error: 'Unauthorized' }, 401);

  const stats = { total: 0, today: 0, byForm: {} };
  const today = new Date().toISOString().slice(0, 10);
  try {
    if (env.SUBMISSIONS) {
      const list = await env.SUBMISSIONS.list({ prefix: 'sub:', limit: 500 });
      for (const k of list.keys) {
        const val = await env.SUBMISSIONS.get(k.name);
        if (!val) continue;
        const s = JSON.parse(val);
        stats.total++;
        if ((s.timestamp || '').startsWith(today)) stats.today++;
        const fn = s.formName || 'unknown';
        stats.byForm[fn] = (stats.byForm[fn] || 0) + 1;
      }
    }
  } catch (e) {
    console.warn('KV stats fetch failed:', e.message);
  }
  return json({ success: true, stats });
}
