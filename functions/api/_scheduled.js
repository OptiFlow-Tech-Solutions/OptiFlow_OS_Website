export default {
  async scheduled(event, env, ctx) {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

    let subsDeleted = 0;
    let notifsDeleted = 0;
    let auditsDeleted = 0;

    if (env.SUBMISSIONS) {
      let cursor;
      do {
        const list = await env.SUBMISSIONS.list({ prefix: 'sub:', limit: 1000, cursor });
        for (const k of list.keys) {
          if (k.name.startsWith('subscriber:')) continue;
          const datePart = k.name.slice(4, 14);
          if (datePart < thirtyDaysAgo.toISOString().slice(0, 10)) {
            await env.SUBMISSIONS.delete(k.name);
            subsDeleted++;
          }
        }
        cursor = list.list_complete ? undefined : list.cursor;
      } while (cursor);
    }

    if (env.NOTIFICATIONS) {
      let cursor;
      do {
        const list = await env.NOTIFICATIONS.list({ prefix: 'notif:', limit: 1000, cursor });
        for (const k of list.keys) {
          const datePart = k.name.slice(6, 16);
          if (datePart < sevenDaysAgo.toISOString().slice(0, 10)) {
            await env.NOTIFICATIONS.delete(k.name);
            notifsDeleted++;
          }
        }
        cursor = list.list_complete ? undefined : list.cursor;
      } while (cursor);
    }

    if (env.AUDIT) {
      let cursor;
      do {
        const list = await env.AUDIT.list({ prefix: 'audit:', limit: 1000, cursor });
        for (const k of list.keys) {
          const datePart = k.name.slice(6, 16);
          if (datePart < ninetyDaysAgo.toISOString().slice(0, 10)) {
            await env.AUDIT.delete(k.name);
            auditsDeleted++;
          }
        }
        cursor = list.list_complete ? undefined : list.cursor;
      } while (cursor);
    }

    const id = crypto.randomUUID();
    const timestamp = now.toISOString();
    try {
      if (env.AUDIT) await env.AUDIT.put(`audit:${timestamp.slice(0, 10)}:${id}`, JSON.stringify({
        schema: 'audit.v1', id, timestamp, action: 'data_cleanup',
        actor: 'scheduled-worker', resource: 'kv-cleanup',
        detail: { submissions_deleted: subsDeleted, notifications_deleted: notifsDeleted, audit_deleted: auditsDeleted },
      }));
    } catch (e) {
      console.warn('Cleanup audit log failed:', e.message);
    }

    console.log(`Cleanup: deleted ${subsDeleted} submissions, ${notifsDeleted} notifications, ${auditsDeleted} audit entries`);
  },
};
