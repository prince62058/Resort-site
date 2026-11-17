import seed from '../shared/seed.json';
import { publicContent } from '../shared/content.js';
import { withGetawayPage } from '../shared/getaway.js';
export let site = withGetawayPage(publicContent(seed));
export let redirects = {};

const CRM_SITE_KEY = import.meta.env.VITE_CRM_SITE_KEY || '6aafe9edb88351687a5d82a1103b43bb';
const CRM_ENQUIRY_URL = import.meta.env.VITE_CRM_ENQUIRY_URL || 'https://hotelcrm-backend-nsdu1l-7d5848-187-127-128-249.sslip.io/api/v1/public/enquiries';

export async function loadContent() {
  try {
    const embedded = document.getElementById('nest-content');
    const state = embedded ? JSON.parse(embedded.textContent) : await fetch('/api/content', {
      cache: 'no-cache'
    }).then(r => {
      if (!r.ok) throw new Error('Content unavailable');
      return r.json();
    });
    site = withGetawayPage(state.content);
    redirects = state.redirects || {};
  } catch {/* The bundled content keeps the resort readable during an outage. */}
}
export const t = (key, fallback) => site.copy[key] ?? fallback;

function crmPayload(body) {
  const guests = body.guests == null || body.guests === '' ? undefined : Number(body.guests);
  return {
    siteKey: CRM_SITE_KEY,
    name: String(body.name || '').trim(),
    email: body.email ? String(body.email).trim() : undefined,
    phone: body.phone ? String(body.phone).trim() : undefined,
    requirement: body.message || body.requirement || undefined,
    roomPreference: body.room || body.roomPreference || undefined,
    arrival: body.checkIn || body.arrival || undefined,
    departure: body.checkOut || body.departure || undefined,
    adults: Number.isFinite(guests) ? guests : undefined,
    source: body.type === 'reservation' ? 'Website booking' : 'Website contact'
  };
}

async function postJson(url, payload) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  let data = {};
  try { data = await response.json(); } catch { /* ignore non-json */ }
  if (!response.ok) {
    const message = data.message || data.error || 'Your enquiry could not be sent. Please try again.';
    throw new Error(message);
  }
  return data;
}

export async function submitEnquiry(body) {
  // Honeypot — bots fill "website"; treat as success without sending.
  if (String(body.website || '').trim()) return { ok: true, spam: true };

  const payload = crmPayload(body);
  const local = postJson('/api/enquiries', body).catch(() => null);
  try {
    const crm = await postJson(CRM_ENQUIRY_URL, payload);
    local.catch(() => {});
    return { ok: true, crm };
  } catch (crmError) {
    const fallback = await local;
    if (fallback) return { ok: true, local: fallback };
    throw crmError;
  }
}
