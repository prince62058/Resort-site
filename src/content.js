import seed from '../shared/seed.json';
import { publicContent } from '../shared/content.js';
import { withGetawayPage } from '../shared/getaway.js';
export let site = withGetawayPage(publicContent(seed));
export let redirects = {};
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
export async function submitEnquiry(body) {
  const response = await fetch('/api/enquiries', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Your enquiry could not be sent. Please try again.');
  return data;
}
