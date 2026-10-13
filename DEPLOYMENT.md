# Nature Nest — three independent Dokploy apps

The workspace has three Git repositories. The root is a local launcher, not a fourth deployed application.

| Folder | GitHub repository | What runs | Container port |
| --- | --- | --- | --- |
| `backend/` | https://github.com/prince62058/Resort-backend | Express API, MongoDB/GridFS, admin authentication and publishing | `5174` |
| `site/` | https://github.com/prince62058/Resort-site | Public React website, server-rendered SEO and API/image gateway | `3000` |
| `admin/` | https://github.com/prince62058/resort-admin | React admin studio and authenticated API/image gateway | `3000` |

## Local development

Node.js 22 is the deployment target. From the workspace root:

```sh
npm run install:all
npm run dev
```

- Website: http://localhost:5173
- Admin studio: http://localhost:5175
- Backend health: http://localhost:5174/api/health

Only `backend/.env` contains MongoDB credentials. The existing owner account and images remain in the same Atlas database. `site/.env` points to the backend and admin; `admin/.env` points to the backend and website. Environment files are ignored in all three repositories.

To recreate this workspace on another computer, clone the repositories into sibling `site`, `admin`, and `backend` folders, copy `site/workspace/package.json` and `site/workspace/scripts/` into the parent workspace, then set each `.env` from its `.env.example`.

## Dokploy: deploy the backend first

Create a project and three **Application** services. For each service, connect its repository, branch `main`, **Build Path `/` (repository root)** and **Build Type Nixpacks**. The root `nixpacks.toml` selects the Node provider, installs the locked dependencies, runs `npm run build`, then starts `npm start`. Do not select `.git`, `site`, `backend`, `admin` or `dist` as the build path: each repository already contains exactly one app at its root.

All apps include a Dockerfile as an alternative build type. If you select Dockerfile, use root context and Dockerfile path `Dockerfile`. Do not configure a static-site/Caddy deployment: both frontends include a small Node server for their same-origin API gateway, and the website also renders SEO.

### Backend environment

```dotenv
NODE_ENV=production
PORT=5174
MONGODB_URI=<your private Atlas connection string>
MONGODB_DB=nature_nest
MEDIA_BUCKET=resort_media
```

`ADMIN_SETUP_TOKEN` is only needed to create the first account in a new database. The existing `nature_nest` database already has its owner account, so do not reset it or create a new database. Allow the Dokploy server's outbound IP in MongoDB Atlas Network Access. Database configuration is needed at runtime, not during the image build.

Deploy, then check `/api/health`: expect `{"ready":true,"media":"mongodb"}`. `/` returns the API service name; it intentionally does not render the public website or admin UI.

### Website environment

```dotenv
NODE_ENV=production
PORT=3000
BACKEND_URL=http://<backend-service-name>:5174
ADMIN_URL=https://<public-admin-host>
```

### Admin environment

```dotenv
NODE_ENV=production
PORT=3000
BACKEND_URL=http://<backend-service-name>:5174
SITE_URL=https://<public-website-host>
```

Replace placeholders with actual addresses. `BACKEND_URL` is a server-side origin with no path, query or credentials. On the same Dokploy network it can use the backend's reachable service name, keeping the API connection internal. Otherwise use the backend's reachable HTTPS URL. `localhost` inside a container points to that container, not to another application. `/api/health` on either frontend tests its connection to the backend; `/healthz` checks just the frontend process.

Set Domains → Container Port to `5174` for the API and `3000` for each frontend. Do not directly expose internal application ports via Advanced → Ports just to make domain routing work.

## HTTPS and temporary domains

Dokploy's generated `traefik.me` domain is suitable for HTTP previews. The public admin MUST use HTTPS with `NODE_ENV=production`, because its session cookie is Secure/HttpOnly/SameSite=Strict. Configure a valid HTTPS hostname/certificate before using real admin credentials. Do not disable production cookie security to make an HTTP preview login work. The backend can still use private HTTP between containers when website/admin HTTPS terminates at Dokploy's proxy.

The public site can be previewed over HTTP without admin login. A purchased domain is not required to prepare/build/deploy the three services, but the final admin endpoint needs working HTTPS.

## How the three apps connect

The browser calls `/api` and `/assets` on the website or admin origin. Each app's Node server forwards those requests to `BACKEND_URL`. The browser never needs third-party cookies or the internal backend hostname. The gateway checks the browser Origin before forwarding it, and keeps the backend's session/CSRF protections. The website does not forward `/api/admin` requests; its `/admin` link redirects to `ADMIN_URL`.

Images remain in MongoDB GridFS with their existing paths. The website retains bundled image fallbacks; new admin uploads are read from the backend. The admin's preview/back links use `SITE_URL`. After deployment, set **Site settings → Live website URL** to the public website origin and publish; canonical URLs and sitemap links will then point there.

## Verification and updates

```sh
npm run build
npm --prefix backend test
npm --prefix site run test:server
npm --prefix admin test
npm run test:integration
```

The integration test starts all three built apps and an isolated MongoDB test database, then checks login, CSRF/origin rejection, save/publish, media upload, enquiries, website SEO/redirects, responsive admin screens, password/session revocation and logout. It drops only its own `nature_nest_cms_test_*` database. It requires installed Chrome. The website also has `npm --prefix site test` for public desktop/mobile flows.

Push each folder to its own remote and redeploy only that app. API schema/shared content helpers are versioned copies; changes to their contract should be coordinated across all three repos. Environment secrets are stored in Dokploy, never in GitHub.

References: [Dokploy applications](https://docs.dokploy.com/docs/core/applications), [generated domains](https://docs.dokploy.com/docs/core/domains/generated), [Nixpacks Node provider](https://nixpacks.com/docs/providers/node).
