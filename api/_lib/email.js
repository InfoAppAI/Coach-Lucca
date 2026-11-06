// Email marketing client: puts contacts into lists (Brevo) or groups (MailerLite).
// The tool's own automations do the sending; this file only decides who is on which list.
// Configuration comes only from Vercel environment variables (see .env.example).

const PROVIDERS = {
  brevo: {
    async add(apiKey, listId, contact) {
      const res = await fetch('https://api.brevo.com/v3/contacts', {
        method: 'POST',
        headers: brevoHeaders(apiKey),
        body: JSON.stringify({
          email: contact.email,
          attributes: brevoAttributes(contact),
          listIds: [Number(listId)],
          updateEnabled: true,
        }),
      });
      // 201 = created, 204 = updated an existing contact
      if (!res.ok) throw new Error(`Brevo add failed (${res.status}): ${(await res.text()).slice(0, 200)}`);
    },
    async remove(apiKey, listId, email) {
      const res = await fetch(`https://api.brevo.com/v3/contacts/lists/${Number(listId)}/contacts/remove`, {
        method: 'POST',
        headers: brevoHeaders(apiKey),
        body: JSON.stringify({ emails: [email] }),
      });
      // 400 here means the contact was not on the list, which is the state we want anyway
      if (!res.ok && res.status !== 400 && res.status !== 404) {
        throw new Error(`Brevo remove failed (${res.status}): ${(await res.text()).slice(0, 200)}`);
      }
    },
  },
  mailerlite: {
    async add(apiKey, groupId, contact) {
      // Upsert: adds the group without removing the subscriber from other groups
      const res = await fetch('https://connect.mailerlite.com/api/subscribers', {
        method: 'POST',
        headers: mailerliteHeaders(apiKey),
        body: JSON.stringify({
          email: contact.email,
          fields: { name: contact.firstName || undefined, country: contact.country || undefined },
          groups: [String(groupId)],
        }),
      });
      if (!res.ok) throw new Error(`MailerLite add failed (${res.status}): ${(await res.text()).slice(0, 200)}`);
    },
    async remove(apiKey, groupId, email) {
      const res = await fetch(
        `https://connect.mailerlite.com/api/subscribers/${encodeURIComponent(email)}/groups/${encodeURIComponent(groupId)}`,
        { method: 'DELETE', headers: mailerliteHeaders(apiKey) }
      );
      if (!res.ok && res.status !== 404) {
        throw new Error(`MailerLite remove failed (${res.status}): ${(await res.text()).slice(0, 200)}`);
      }
    },
  },
};

function brevoHeaders(apiKey) {
  return { 'api-key': apiKey, 'content-type': 'application/json', accept: 'application/json' };
}

function brevoAttributes(contact) {
  const attributes = {};
  if (contact.firstName) attributes.FIRSTNAME = contact.firstName;
  if (contact.country) attributes.COUNTRY = contact.country;
  return attributes;
}

function mailerliteHeaders(apiKey) {
  return { Authorization: `Bearer ${apiKey}`, 'content-type': 'application/json', accept: 'application/json' };
}

function provider() {
  const name = (process.env.EMAIL_PROVIDER || '').trim().toLowerCase();
  const impl = PROVIDERS[name];
  const apiKey = process.env.EMAIL_API_KEY;
  if (!impl || !apiKey) throw new Error('EMAIL_PROVIDER (brevo or mailerlite) and EMAIL_API_KEY must be set');
  return { impl, apiKey };
}

/** Adds the contact to the list named by the env variable; skipped when that list is not configured. */
export async function addToList(envName, contact) {
  const listId = process.env[envName];
  if (!listId) return 'skipped';
  const { impl, apiKey } = provider();
  await impl.add(apiKey, listId, contact);
  return 'added';
}

/** Removes the contact from the list named by the env variable; skipped when not configured. */
export async function removeFromList(envName, email) {
  const listId = process.env[envName];
  if (!listId) return 'skipped';
  const { impl, apiKey } = provider();
  await impl.remove(apiKey, listId, email);
  return 'removed';
}
