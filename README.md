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
