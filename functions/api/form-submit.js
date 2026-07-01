export default {
  async fetch(request, env, ctx) {
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

    log({ timestamp: new Date().toISOString(), formName, fieldKeys: Object.keys(fields), ip, utm: utm || {}, spam: false, emailSent });

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
