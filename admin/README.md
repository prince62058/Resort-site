# Nature Nest content studio

The admin application lives in this separate `admin/` folder. Vite builds it as a separate entry at `/admin/`; Express serves it beside the React website. `admin/main.jsx` contains the dashboard and editors, `admin/api.js` handles authenticated requests, and `admin/styles.css` is isolated from the public website styles.

## First sign-in

1. Run `npm run admin:setup-token`. This creates a random `ADMIN_SETUP_TOKEN` in the ignored, private root `.env` file without printing it.
2. On Hostinger, keep the existing MongoDB settings and set `ADMIN_SETUP_TOKEN` to the same value. Set `NODE_ENV=production`; use HTTPS. Redeploy the latest `main` branch with `npm run build`, then `npm start` / entry `server/index.js`.
3. Open `https://YOUR-DOMAIN/admin/`. Enter your own email, a unique password of at least 12 characters, and the private setup token. Only the first owner account can be created. The token cannot reset or take over an existing owner account.
4. After setup, remove `ADMIN_SETUP_TOKEN` from Hostinger if desired. Future sign-ins use your email and password.
5. In **Site settings**, set **Live website URL** to your final HTTPS domain, then publish. This controls canonical links, the sitemap and share images.

Never commit `.env`, prefix credentials with `VITE_`, or place the setup token in a URL. There is no default username or password. The account is an owner account, not a public guest account or a multi-role staff system.

## Editing and publishing

- **Pages & SEO**: built-in pages and additional pages; page titles, text, hero photographs, navigation labels, URL slugs, SEO titles/descriptions, planning keywords, share images and noindex.
- **Stays**: add, edit or remove rooms/villas, starting rates, amenities, descriptions, cover/slideshow images and homepage features.
- **Experiences / Galleries / Journal**: manage content, images, publishing status, order and SEO. Journal content supports plain-text paragraphs separated by a blank line.
- **Banners & sections**: homepage, stays and story carousels, image sequences, comfort links and FAQs. Use **Website copy** for the text in the existing designed sections and guest notices. Some captions assembled from room types/counts remain derived from their data.
- **Media library**: browse the existing folder groups and upload raster images to `uploads/<folder>/`. Uploads are limited to 12 MB / 40 megapixels, re-encoded to WebP with a maximum edge of 2560 px and stripped of metadata. Existing resort originals are preserved. Unused new uploads can be deleted; referenced images cannot.
- **Guest enquiries**: contact, reservation and newsletter requests are saved in MongoDB. Track new/in-progress/closed status and private follow-up notes. This does not confirm bookings, send emails, deliver newsletters or collect payments. Guests can continue their reservation conversation on WhatsApp.
- **Version history**: restore a previous draft, review and save/publish it.
- **Account**: change the owner password; other sessions are revoked.

**Save draft** stores the complete editor state without changing the website. **Publish changes** updates the entire website from the current editor state; entries marked `draft` remain hidden. Both actions use a version check to reject stale concurrent edits. Navigation between admin sections keeps unsaved edits; closing/reloading the tab prompts if edits are unsaved. Visitors see published changes on their next page load; open tabs do not hot-reload content.

On slug changes, old published paths receive a 301 redirect to the new path. Parent page slug changes also redirect the collection's old item URLs. Draft/removed items are omitted from the public content response and sitemap. Built-in pages are retained; custom pages and collection items can be removed.

SEO metadata, Open Graph tags, JSON-LD and an initial content summary are included in the server HTML. Client navigation updates metadata as well. `/sitemap.xml` and `/robots.txt` are generated from published data. Focus keywords are editorial guidance, not a promise of rankings; Google does not use the meta keywords tag. Production SEO requires the Express server; a static-only `dist` upload does not provide these routes or admin APIs.

## Storage and security

MongoDB collections: `cms_content`, `cms_users`, `cms_sessions`, `cms_limits`, `cms_revisions`, `cms_enquiries`, plus the existing media catalog/GridFS bucket. The current website is seeded once using `$setOnInsert`. The guest-information upgrade adds only missing default pages and notice copy, preserves draft and published edits independently, and records a migration marker and revision. Later restarts do not restore pages an owner intentionally removes. Keep MongoDB backups enabled according to your hosting needs.

## Guest information and policies

**Pages & SEO** contains Privacy policy, Terms & conditions, Cancellation & refunds, Cookies & preferences and Guest information. All have editable slugs, SEO fields, text, update dates and footer placement. Keep them in **Here to help** to maintain the compact footer. Their content also appears in the server-rendered HTML and sitemap. Privacy links on forms follow the page's stable ID when its slug changes.

Use `## Heading`, `### Subheading`, blank lines between paragraphs and `- List item` in policy content. Raw HTML is rendered as text. `{{resortName}}`, `{{email}}`, `{{phone}}` and `{{address}}` insert current values from **Site settings**. FAQ answers on the guest guide come from **Banners & sections**. Form notice labels and descriptions appear under `guest.*` in **Website copy**.

No fixed check-in/out times, cancellation fees, refund deadlines or designated grievance officer have been supplied. The initial pages direct guests to their booking confirmation and resort team for those details. Add confirmed business rules when available and update the displayed date. The privacy/cookie text reflects the implemented enquiry forms, MongoDB storage, external fonts, outbound map/WhatsApp links and essential admin sessions; update it if tracking, payments, communication providers or data handling change. The public forms do not enrol contact or reservation enquirers into marketing. Newsletter requests are separate and include an email unsubscribe link.

Passwords use salted scrypt hashes. Sessions use random opaque tokens (only hashes in the database), expire after 8 hours and use HttpOnly, SameSite=Strict cookies, plus Secure cookies in production. Mutations require session-bound CSRF tokens and same-origin headers. Login/setup and enquiries have database-backed rate limits. Content is schema-validated and rendered as text; image uploads are authenticated and decoded/re-encoded. Admin pages are noindex. The production app trusts one reverse-proxy hop, matching a single managed hosting proxy; adjust that setting if deploying behind a different proxy topology.

If the owner password is lost, put `ADMIN_RESET_PASSWORD` in the private local `.env`, run `npm run admin:reset-password`, then remove that temporary variable. This requires access to the server's database credentials; it is not an HTTP reset endpoint. The existing email remains unchanged.

## Verification

```sh
npm run build
npm run test:server
npm test
npm run test:admin
```

`test:admin` is an integration test using the configured Atlas cluster in a uniquely named `nature_nest_cms_test_*` database. It verifies setup/authentication, CSRF, drafts/publishing, version conflicts, SEO, redirects, uploads, enquiries, responsive admin screens and password session revocation. It deletes only that temporary database afterward. Screenshots go to ignored `output/admin/`. Existing browser tests mock enquiry submissions to avoid adding test guests to the resort database.
