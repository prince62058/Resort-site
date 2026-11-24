import {defineConfig, loadEnv} from 'vite';
import react from '@vitejs/plugin-react';
import express from 'express';
import {createGateway} from './server/gateway.js';
import {createCrmProxy} from './server/crm.js';
import {verifiedImages} from './server/images.js';
import path from 'node:path';
export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd(), '');
  Object.assign(process.env, {
    CRM_ORIGIN: env.CRM_ORIGIN || env.VITE_CRM_ORIGIN || process.env.CRM_ORIGIN,
    CRM_SITE_KEY: env.CRM_SITE_KEY || env.VITE_CRM_SITE_KEY || process.env.CRM_SITE_KEY,
    VITE_CRM_SITE_KEY: env.VITE_CRM_SITE_KEY || process.env.VITE_CRM_SITE_KEY,
    VITE_CRM_ORIGIN: env.VITE_CRM_ORIGIN || process.env.VITE_CRM_ORIGIN
  });
  return {
    plugins: [react(), {name:'nature-nest-backend-gateway', configureServer(server) {
      const app = express();
      app.disable('x-powered-by');
      app.get(/^\/admin(?:\/.*)?$/, (req,res) => res.redirect(302,env.ADMIN_URL || 'http://localhost:5175'));
      app.use(createCrmProxy());
      app.use(verifiedImages({backendUrl:env.BACKEND_URL || 'http://127.0.0.1:5174',root:path.join(process.cwd(),'public/assets')}));
      app.use(createGateway({backendUrl:env.BACKEND_URL || 'http://127.0.0.1:5174', admin:false}));
      server.middlewares.use(app);
    }}],
    build: {target:'es2022', assetsDir:'_app'},
    server: {host:'0.0.0.0', port:5173},
  };
});
