# Nature Nest — public website

Independent React/Vite website for The Nature Nest. This repository contains the public UI, images and a small Express server for SEO and forwarding public API/media requests to the separate backend. It contains no MongoDB connection or admin studio source.

- Backend: https://github.com/prince62058/Resort-backend
- Admin: https://github.com/prince62058/resort-admin
- Complete three-app setup: [DEPLOYMENT.md](DEPLOYMENT.md)

## Run

Use Node.js 22, `npm ci`, and copy `.env.example` to `.env` with local values. Run the backend separately, then `npm run dev` (port 5173). For production, run `npm run build` then `npm start`.

## Dokploy

Branch `main`, build path `/`, Nixpacks, container port `3000`. Configuration is in `nixpacks.toml`; Dockerfile deployment is also supported. Set `NODE_ENV=production`, `PORT=3000`, `BACKEND_URL` to the reachable backend origin, and `ADMIN_URL` to the public admin URL.

Deploy as a Node application, since its server provides dynamic SEO/slug redirects and the API gateway. MongoDB secrets belong only to the backend. Site settings → Live website URL in the admin controls canonical and sitemap URLs.

## Preserved features

Responsive pages and navigation, animated photo slideshows, original/generated images, stays and room details, blog/articles, guest policy pages, enquiries, gallery controls, reduced-motion preferences and server-rendered SEO all remain available. Public API requests and newly uploaded images are fetched through the backend. Bundled original images remain available as fallback copies.

## Tests

`npm run test:server` verifies the gateway's origin protection, streaming and failure handling. `npm test` checks the public UI with Chrome; `npm run test:mobile` includes mobile Chrome/WebKit. Full cross-repository integration tests run from the backend repo with the apps checked out as siblings and built first.

## Corner reels

Manage the floating reel cards in **Admin → Corner reels**. Add a public `https://www.instagram.com/reel/.../` link, title and a cover from the media library. Enable/disable individual reels or the entire widget, reorder up to six entries, then use **Save draft** or **Publish changes**. Two covers appear at a time in the bottom-left corner; visitors can minimize them for the current browsing session. The widget hides while the footer or booking/menu overlay is visible so guest controls stay reachable.

Instagram is loaded only after the visitor opens a reel. The full-size dialog has previous/next controls, an Instagram fallback link, keyboard dismissal and mobile sizing. Instagram controls its own embed playback and may require a second tap, login or opening Instagram. Public content must allow embedding. Cover photos are manually selected; they are not automatically fetched Instagram thumbnails.

For an actual moving miniature preview, enter the original video's **direct HTTPS MP4/WebM URL** in the optional field. This enables a muted looping preview and a native video player with controls. Preview motion pauses with the site's motion control, reduced-motion preference or hidden tab. An unavailable video falls back to Instagram. No Instagram downloading/scraping, API credentials or forced autoplay are used.

Deploy backend, admin and site together for this feature. The backend adds the two requested initial links only when the existing content has no reel configuration, preserving owner edits and drafts. Subsequent changes use the regular CMS publishing workflow.
