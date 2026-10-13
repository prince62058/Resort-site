import seed from '../../shared/seed.json' with { type: 'json' };
import { guestPageIds } from '../../shared/guest-pages.js';

export const guestMigration = 'guest-information-2026-10-14-v2';

// Add missing pages independently to draft and published snapshots. Existing
// text, unpublished edits and changed URLs must survive an application upgrade.
export function withGuestPages(content) {
  const next = structuredClone(content);
  for (const id of guestPageIds) {
    if (next.pages.some(p => p.id === id)) continue;
    const page = structuredClone(seed.pages.find(p => p.id === id));
    const base = page.slug;
    let suffix = 1;
    while (next.pages.some(p => p.slug === page.slug)) page.slug = base + '-' + ++suffix;
    next.pages.push(page);
  }
  for (const [key, value] of Object.entries(seed.copy)) {
    if (key.startsWith('guest.') && !(key in next.copy)) next.copy[key] = value;
  }
  return next;
}

export async function migrateGuestPages(database) {
  const collection = database.collection('cms_content');
  for (let attempt = 0; attempt < 5; attempt++) {
    const current = await collection.findOne({ _id: 'site' });
    if (!current || current.migrations?.includes(guestMigration)) return;
    const result = await collection.updateOne({ _id: 'site', version: current.version, migrations: { $ne: guestMigration } }, {
      $set: { draft: withGuestPages(current.draft), published: withGuestPages(current.published), updatedAt: new Date() },
      $inc: { version: 1 }, $addToSet: { migrations: guestMigration }
    });
    if (result.modifiedCount) {
      await database.collection('cms_revisions').insertOne({ version: current.version + 1, content: current.draft, published: true, at: new Date(), by: 'system:guest-information' });
      return;
    }
  }
  throw new Error('Content changed during the guest information upgrade. Please retry.');
}
