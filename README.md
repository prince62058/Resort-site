# The Nature Nest — React website

A responsive resort website built with React, Vite, React Router and Lucide icons. Resort assets, including the original photographs and enhanced versions, are included in `public/assets/`. The original HTML export remains in the local `thenaturenestresort.com/` backup and is excluded from this repository.

## Run locally

```sh
npm install
npm run dev
```

## Production

```sh
npm run build
npm run preview
```

Deploy the `dist` folder. Configure your host to serve `index.html` for unknown routes (React Router fallback). Netlify and Vercel configurations are included.

For Vercel, import `prince62058/Resort-site`, keep the root directory as the repository root and deploy the `main` branch. The repository sets the Vite framework, `npm run build` command and `dist` output directory. For Netlify, import the same repository; `netlify.toml` and `public/_redirects` provide the build settings and client-side routing fallback. No environment variables are required for the current enquiry-only site.

## Included

- Responsive home page, resort story, experiences, contact and journal.
- All 12 original accommodation listings, prices and photo galleries.
- Category filters, room image controls, gallery lightbox and mobile navigation.
- Automatic crossfades throughout banners, stay cards, experience photos, room details and the full-screen gallery viewer. Each section uses related original photos.
- Shared photo pause/play control, hover/focus pausing, off-screen suspension and reduced-motion support.
- Transparent navigation with a compact frosted-glass state on scroll.
- Original `.html` room/gallery URLs are supported.
- Date-validated reservation enquiries prepared for WhatsApp, and contact enquiries prepared for email.
- Original blog content, original resort images and original contact information.

## Service integrations

The supplied project was a static HTML export, without a booking, account, payment or email backend. Enquiries open WhatsApp or the visitor’s email app; they are not confirmed bookings. Account URLs lead to guest assistance. Rates are imported listing prices and require resort confirmation. Google Fonts requires an internet connection; local serif/sans-serif fallbacks are provided.

## Verification

```sh
npm test
```

Tests use installed Google Chrome and automatically start Vite. They cover routes, image integrity, stay filters, room galleries, enquiry preparation, mobile overflow/navigation, slideshow timers, hover pausing, global motion controls, gallery playback and reduced-motion preferences. No message is sent during tests.

For phone interaction checks in Chrome and WebKit (Safari's engine):

```sh
npx playwright install webkit
npm run test:mobile
```

These checks exercise narrow forms, reservation enquiries, menu scrolling, portrait/landscape rotation and gallery touch controls. Shared responsive rules are in `src/responsive.css`; phone layouts use readable 16px form fields and at least 44px primary touch targets.

## Generated 3D brand assets

The 3D-style emblem and three icons were generated with the built-in image generation tool. Transparent PNG originals and lossless WebP delivery files are saved in `public/assets/3d/`. The original resort logo remains intact. Exact generation prompts are saved in `public/assets/3d/generation-prompts.json`. The displayed wordmark is rendered as accessible text. Subtle CSS floating and perspective animations follow the shared motion toggle, viewport visibility and reduced-motion preferences.
