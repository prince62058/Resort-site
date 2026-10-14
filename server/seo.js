import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { routesFor, resolveRoute } from '../shared/content.js';
import { faviconFor } from '../shared/brand.js';
import { seoFor, seoHead, safeJson, escapeHtml, initialMarkup } from '../shared/seo.js';
export function installSeo(app, cms, root) {
  app.get('/robots.txt', async (req, res) => {
    const {
      content
    } = await cms.published();
    const base = (content.settings.siteUrl || req.protocol + '://' + req.get('host')).replace(/\/$/, '');
    res.type('text/plain').send('User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\nSitemap: ' + base + '/sitemap.xml\n');
  });
  app.get('/sitemap.xml', async (req, res) => {
    const {
      content
    } = await cms.published();
    const base = (content.settings.siteUrl || req.protocol + '://' + req.get('host')).replace(/\/$/, '');
    res.type('application/xml').send('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + routesFor(content).filter(r => !r.item.seo.noindex).map(r => '<url><loc>' + escapeHtml(base + r.path) + '</loc></url>').join('') + '</urlset>');
  });
  return async (req, res, next) => {
    try {
      const state = await cms.published();
      const legacy = req.path === '/index.html' ? '/' : req.path.replace(/\.html$/, '');
      const target = state.redirects[req.path] || state.redirects[legacy];
      if (target) return res.redirect(301, target);
      if (legacy !== req.path && resolveRoute(state.content, legacy)) return res.redirect(301, legacy);
      if (req.path.length > 1 && req.path.endsWith('/')) return res.redirect(301, req.path.slice(0, -1));
      let html = await readFile(path.join(root, 'dist/index.html'), 'utf8');
      const seo = seoFor(state.content, req.path, req.protocol + '://' + req.get('host'));
      html = html.replace(/<title>[\s\S]*?<\/title>/, '').replace(/<meta\s+name="description"[^>]*>/, '');
      html = html.replace(/<link[^>]*rel="icon"[^>]*>/g, '');
      html = html.replace('</head>', seoHead(seo) + '<link rel="icon" href="/assets/' + escapeHtml(faviconFor(state.content.settings)) + '"></head>');
      html = html.replace('<div id="root"></div>', '<div id="root">' + initialMarkup(state.content, seo.route) + '</div>');
      html = html.replace('</body>', '<script id="nest-content" type="application/json">' + safeJson(state) + '</script></body>');
      res.status(seo.route ? 200 : 404).set('Cache-Control', 'no-cache').type('html').send(html);
    } catch (error) {
      next(error);
    }
  };
}
