# The Nature Nest — React website

A responsive resort website built with React, Vite, React Router and Lucide icons, with an Express backend and a MongoDB GridFS image library. Original photographs, enhanced versions, logos and 3D icons remain in `public/assets/` as a local fallback.

## Run locally

Requires Node.js 22 or newer.

```sh
npm install
cp .env.example .env
# Set your MongoDB credentials in .env before syncing images.
npm run media:sync
npm run dev
```

`npm run dev` starts Vite on port 5173 and the media backend on port 5174. Vite proxies `/api` and `/assets` to the backend. Existing image URLs, galleries, slideshows and CSS backgrounds automatically use MongoDB through these routes; no credentials are sent to React.

The local `.env` contains server credentials and is excluded from Git. `.env.example` contains placeholders. Never use a `VITE_` prefix for a MongoDB URI, and never upload the real `.env` to a public repository. If MongoDB is not configured, the backend serves local images; if it is unavailable, existing local images remain available and `/api/health` reports the failure.

## MongoDB image library

```sh
npm run media:sync
npm run media:verify
```

- All 524 image files are uploaded without resizing or changing their original bytes.
- All 14 existing folder groups are preserved, including the root-level logo files, `3d`, `banner1`, `banners`, `backgrounds`, and the nested enhanced-image folders.
- The database defaults to `nature_nest`.
- `media_assets` is the searchable catalog: relative path, folder, filename, MIME type, byte size, SHA-256 checksum and active GridFS file ID.
- `resort_media.files` and `resort_media.chunks` hold the actual image data. GridFS folders are represented by the filename and `metadata.folder`, not filesystem directories.
- The sync skips unchanged images and can safely resume after interruption. Changed images get a new version; existing files are not deleted.
- Verification compares every local file's checksum and size against the catalog and GridFS length, then downloads one image from each folder to check its stored bytes.
- JSON generation notes are retained locally/in Git, not uploaded as images.

The upload command is a server-side CLI; there is no public upload endpoint. Public endpoints expose only the site's public image library:

| Endpoint | Purpose |
| --- | --- |
| `GET /api/health` | Reports `mongodb`, `local` or `unavailable` media status. |
| `GET /api/media/folders` | Folder names, image counts and total bytes. |
| `GET /api/media?folder=3d&page=1&limit=100` | Exact-folder image catalog; omit `folder` for all images, or use `folder=` for root files. Maximum limit: 200. |
| `GET /assets/<folder>/<filename>` | Existing website image URL, served from MongoDB with ETag caching. |
| `GET /api/media/file/<folder>/<filename>` | Alternate URL for the same database-managed image. |

Responses include `X-Media-Source: mongodb` for database-managed images and `X-Media-Source: local` for an unverified local fallback. To avoid repeated cloud downloads, the backend checks bundled copies against the catalog's SHA-256 checksum and keeps up to 32 MiB in an LRU memory cache. `X-Media-Cache: verified-local` identifies these exact matching copies; `X-Media-Cache: gridfs` identifies direct database streams. The catalog cache expires after 60 seconds. A different database checksum bypasses an outdated bundled image. Database errors and credentials are not returned in API responses.

## Production on Hostinger

Use a **Node.js web app / Express deployment** for the connected backend, rather than publishing only the Vite `dist` folder. Import the GitHub repository `prince62058/Resort-site`, branch `main`, at the repository root.

- Node.js: 22 or newer.
- Install: `npm ci`.
- Build command: `npm run build`.
- Start command: `npm start` (entry point: `server/index.js`).
- Frontend build directory: `dist`. Keep the server source and production dependencies in the Node.js deployment.

Add these in Hostinger's server environment settings:

| Variable | Value |
| --- | --- |
| `MONGODB_URI` | Your private Atlas connection string; copy the value from the local `.env`. |
| `MONGODB_DB` | `nature_nest` |
| `MEDIA_BUCKET` | `resort_media` |
| `NODE_ENV` | `production` |
| `PORT` | Use the port assigned by the hosting platform. |

The server reads Hostinger's `PORT` and listens on `0.0.0.0`. Allow the deployed server's outbound IP in Atlas Network Access. Redeploy after changing environment settings, then check `/api/health` for `{"ready":true,"media":"mongodb"}` and an image's `X-Media-Source` response header.

Images already uploaded to Atlas do not need to be re-uploaded on every deployment. Run `npm run media:sync` locally when image files change, followed by `npm run media:verify`.

Hostinger reference: [Deploy a Node.js website](https://www.hostinger.com/support/how-to-deploy-a-nodejs-website-in-hostinger/).
MongoDB reference: [Store files with GridFS](https://www.mongodb.com/docs/drivers/node/current/crud/gridfs/).

For a local production preview including MongoDB:

```sh
npm run build
npm start
```

The Express server serves the built React app and supports direct links such as `/rooms` and `/about`. `npm run preview`, Netlify and Vercel's existing static configurations preview/deploy only the frontend and bundled local assets; they do not deploy this MongoDB backend.

## Included

- Responsive home page, resort story, experiences, contact and journal.
- All 12 original accommodation listings, prices and galleries.
- Automatic slideshows, large photo viewer, global pause/play, hover pausing and reduced-motion support.
- Transparent navigation, compact mobile menu and compact shared footer.
- Date-validated reservation enquiries prepared for WhatsApp, and contact enquiries prepared for email.
- Original blog content, resort photographs and contact information.

## Other service integrations

MongoDB currently stores the image library. Booking, payment, account and email systems are not added by this integration. Enquiries open WhatsApp or the visitor's email app; they are not confirmed bookings. Account URLs lead to guest assistance. Rates require confirmation by the resort.

## Verification

```sh
npm run test:server
npm test
npm run test:mobile
npm run media:verify
```

Server tests cover image streaming, cache validation, local fallback, credential-safe errors, path validation and production route handling. Browser tests use installed Chrome; the mobile suite also uses WebKit (`npx playwright install webkit`). Tests cover navigation, photos, forms, gallery interactions, responsive layouts and motion controls without sending enquiries.

## Generated assets

The 3D emblem and icons were generated with the built-in image generation tool. Transparent PNG originals and WebP delivery files are retained in `public/assets/3d/`. The original resort logo is also retained. Generation prompts remain in the corresponding JSON files. The original HTML export is a local backup excluded from Git.
