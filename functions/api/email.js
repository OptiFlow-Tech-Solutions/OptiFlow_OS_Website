export default {
  async fetch(request, env) {
    if (request.method !== 'POST') {
      return json({ success: false, error: 'Method not allowed' }, 405);
    }

    let body;
    try { body = await request.json(); } catch (e) {
      return json({ success: false, error: 'Invalid JSON body' }, 400);
    }

    const { type, fields, utm } = body;

    if (!type) {
      return json({ success: false, error: 'Missing required field: type' }, 400);
    }

    if (!SUPPORTED_TYPES.includes(type)) {
      return json({ success: false, error: `Unknown notification type: ${type}` }, 400);
    }

    let emailSent = true;
    try {
      await sendTeamNotification(type, fields, utm || {}, env);
      if (type === 'newsletter' && fields && fields.email) {
        try {
          await sendWelcomeEmail(fields.email, env);
        } catch (e) {
          console.warn('Welcome email failed, continuing:', e.message);
        }
      }
    } catch (e) {
      emailSent = false;
      console.warn(`Email notification failed for ${type}:`, e.message);
    }

    return json({ success: true, type, emailSent });
  }
};

const SUPPORTED_TYPES = ['contact', 'demo-booking', 'newsletter'];

const TEAM_EMAIL = 'info@optiflow.co.in';

const SUBJECTS = {
  contact: 'New Contact Form Submission — OptiFlow OS',
  'demo-booking': 'New Demo Booking — OptiFlow OS',
  newsletter: 'New Newsletter Signup — OptiFlow OS',
};

const BRAND = {
  accent: '#1B4D81',
  logo: 'https://optiflow.in/assets/img/logo.png',
  company: 'OptiFlow Tech Solutions',
  location: 'Surat, India',
  domain: 'https://optiflow.in',
};

function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...extraHeaders },
  });
}

async function sendTeamNotification(type, fields, utm, env) {
  const subject = SUBJECTS[type] || `New ${type} Submission — OptiFlow OS`;
  const html = buildTeamTemplate(type, fields, utm);
  const text = buildTeamText(type, fields, utm);

  const to = TEAM_EMAIL;
  await sendEmail({ to, subject, html, text }, env);
  await logEmail({ type, to, subject, success: true }, env);
}

async function sendWelcomeEmail(toEmail, env) {
  const subject = 'Welcome to OptiFlow OS';
  const html = buildWelcomeTemplate(toEmail);
  const text = buildWelcomeText(toEmail);

  try {
    await sendEmail({ to: toEmail, subject, html, text }, env);
    await logEmail({ type: 'welcome', to: toEmail, subject, success: true }, env);
  } catch (e) {
    await logEmail({ type: 'welcome', to: toEmail, subject, success: false, error: e.message }, env);
    throw e;
  }
}

async function sendEmail({ to, subject, html, text }, env) {
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
      html,
      text,
    }),
  });

  if (!res.ok) throw new Error(`Resend API error: ${res.status}`);
}

async function logEmail(entry, env) {
  const data = { timestamp: new Date().toISOString(), ...entry };
  const key = `notif:${data.timestamp}-${Math.random().toString(36).substring(2, 8)}`;
  try {
    if (env.SUBMISSIONS) await env.SUBMISSIONS.put(key, JSON.stringify(data));
  } catch (e) {
    console.warn('KV email log failed:', e.message);
  }
}

/* ─── Team notification templates ─── */

function buildTeamTemplate(type, fields, utm) {
  let fieldRows = '';
  for (const [key, value] of Object.entries(fields)) {
    fieldRows += `<tr><td style="padding:8px 12px;border-bottom:1px solid #E2E8F0;font-weight:500;color:#0F172A;width:140px">${esc(key)}</td><td style="padding:8px 12px;border-bottom:1px solid #E2E8F0;color:#475569">${esc(String(value))}</td></tr>`;
  }

  let utmSection = '';
  if (utm && Object.keys(utm).length > 0) {
    let utmRows = '';
    for (const [key, value] of Object.entries(utm)) {
      utmRows += `<tr><td style="padding:4px 8px;border-bottom:1px solid #F1F5F9;font-weight:500;color:#0F172A">${esc(key)}</td><td style="padding:4px 8px;border-bottom:1px solid #F1F5F9;color:#64748B">${esc(String(value))}</td></tr>`;
    }
    utmSection = `<h3 style="color:#0F172A;margin:24px 0 12px;font-size:14px">UTM Parameters</h3><table cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse">${utmRows}</table>`;
  }

  const typeLabel = type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ');

  return `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="margin:0;padding:0;background:#F8FAFC;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
<table cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;margin:0 auto;background:#FFFFFF">
  <tr><td style="padding:24px 32px;background:${BRAND.accent}"><img src="${BRAND.logo}" alt="OptiFlow OS" style="height:32px;display:block"></td></tr>
  <tr><td style="padding:32px"><h2 style="color:#0F172A;margin:0 0 8px;font-size:20px">${typeLabel} Submission</h2><p style="color:#64748B;margin:0 0 24px;font-size:14px">A new ${typeLabel.toLowerCase()} submission was received on your website.</p>
<table cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;border:1px solid #E2E8F0;border-radius:8px">${fieldRows}</table>${utmSection}</td></tr>
  <tr><td style="padding:24px 32px;background:#F8FAFC;border-top:1px solid #E2E8F0"><p style="color:#94A3B8;font-size:12px;margin:0">${BRAND.company} — ${BRAND.location}<br>This is an automated notification from ${BRAND.domain}</p></td></tr>
</table></body></html>`;
}

function buildTeamText(type, fields, utm) {
  let text = 'New Form Submission\n\n';
  for (const [key, value] of Object.entries(fields)) {
    text += `${key}: ${value}\n`;
  }
  if (utm && Object.keys(utm).length > 0) {
    text += '\n--- UTM ---\n';
    for (const [key, value] of Object.entries(utm)) {
      text += `${key}: ${value}\n`;
    }
  }
  text += `\n---\n${BRAND.company} — ${BRAND.location}\nAutomated notification from ${BRAND.domain}`;
  return text;
}

/* ─── Welcome email templates ─── */

function buildWelcomeTemplate(toEmail) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="margin:0;padding:0;background:#F8FAFC;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
<table cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;margin:0 auto;background:#FFFFFF">
  <tr><td style="padding:32px 32px 24px;text-align:center"><img src="${BRAND.logo}" alt="OptiFlow OS" style="height:40px;display:block;margin:0 auto"></td></tr>
  <tr><td style="padding:0 32px 32px"><h1 style="color:#0F172A;margin:0 0 12px;font-size:24px;text-align:center">Welcome to OptiFlow OS</h1><p style="color:#475569;margin:0 0 16px;font-size:16px;line-height:1.6">Thank you for subscribing to the OptiFlow OS newsletter. You'll receive insights on business execution, operational excellence, and strategies purpose-built for Indian MSMEs.</p>
<table cellpadding="0" cellspacing="0" style="margin:24px auto 0"><tr><td style="background:${BRAND.accent};border-radius:8px;text-align:center"><a href="${BRAND.domain}" style="display:inline-block;padding:12px 32px;color:#FFFFFF;text-decoration:none;font-weight:600;font-size:15px">Visit Our Website</a></td></tr></table></td></tr>
  <tr><td style="padding:24px 32px;background:#F8FAFC;border-top:1px solid #E2E8F0"><p style="color:#94A3B8;font-size:12px;margin:0">${BRAND.company} — ${BRAND.location}<br>You received this email because you subscribed on ${BRAND.domain}.<br>To unsubscribe, reply to this email or contact us at info@optiflow.co.in.</p></td></tr>
</table></body></html>`;
}

function buildWelcomeText(toEmail) {
  return `Welcome to OptiFlow OS\n\nThank you for subscribing to the OptiFlow OS newsletter.\nYou'll receive insights on business execution, operational excellence, and strategies for Indian MSMEs.\n\nVisit our website: ${BRAND.domain}\n\n---\n${BRAND.company} — ${BRAND.location}\nYou received this email because you subscribed on ${BRAND.domain}.\nTo unsubscribe, reply to this email or contact us at info@optiflow.co.in.`;
}

function esc(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
