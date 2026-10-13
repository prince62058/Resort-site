import express from 'express';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createGateway} from './gateway.js';
import {verifiedImages} from './images.js';
import {remoteContent} from './remote-content.js';
import {installSeo} from './seo.js';
const project = fileURLToPath(new URL('../', import.meta.url));
export function createApp({backendUrl, adminUrl = '', root = project, production = process.env.NODE_ENV === 'production'} = {}) {
  const app = express();
  app.disable('x-powered-by');
  if (production) app.set('trust proxy', 1);
  app.use((req, res, next) => {res.set({'X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin','X-Frame-Options':'SAMEORIGIN'});next();});
  app.get('/healthz', (req, res) => res.json({ready:true, service:'nature-nest-site'}));
  app.get(/^\/admin(?:\/.*)?$/, (req, res) => adminUrl ? res.redirect(302, adminUrl) : res.status(404).send('The admin studio is hosted separately.'));
  app.use(verifiedImages({backendUrl,root:path.join(root,'dist/assets')}));
  app.use(createGateway({backendUrl}));
  const seo = installSeo(app, remoteContent(backendUrl), root);
  app.use(express.static(path.join(root, 'dist'), {dotfiles:'deny', index:false}));
  app.use('/assets', (req, res) => res.status(404).end());
  app.use('/_app', (req, res) => res.status(404).end());
  app.get(/.*/, seo);
  app.use((error, req, res, next) => {
    if (res.headersSent) return next(error);
    res.status(503).send('The website is temporarily unavailable. Please try again shortly.');
  });
  return app;
}
