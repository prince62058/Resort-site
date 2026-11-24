import http from 'node:http';
import https from 'node:https';

function crmConfig() {
  const origin = (process.env.CRM_ORIGIN || process.env.VITE_CRM_ORIGIN || 'https://hotelcrm-backend-nsdu1l-7d5848-187-127-128-249.sslip.io').trim().replace(/\/$/, '');
  const siteKey = (process.env.CRM_SITE_KEY || process.env.VITE_CRM_SITE_KEY || '86c995d3bfc077740485a13900d6ddf5').trim();
  const enquiryPath = (process.env.CRM_ENQUIRY_PATH || '/api/v1/public/enquiries').trim();
  return { origin, siteKey, enquiryPath };
}

function forward(req, res, { origin, path, method = req.method }) {
  const target = new URL(origin);
  const transport = target.protocol === 'https:' ? https : http;
  const headers = {
    accept: req.headers.accept || 'application/json',
    'content-type': req.headers['content-type'] || 'application/json',
    'user-agent': 'NatureNest-Site-CRM-Proxy'
  };
  const upstream = transport.request({
    protocol: target.protocol,
    hostname: target.hostname,
    port: target.port || undefined,
    method,
    path,
    headers
  }, response => {
    res.statusCode = response.statusCode || 502;
    const type = response.headers['content-type'];
    if (type) res.setHeader('Content-Type', type);
    res.setHeader('Cache-Control', 'no-store');
    response.pipe(res);
  });
  upstream.setTimeout(15000, () => upstream.destroy(new Error('CRM timed out.')));
  upstream.on('error', () => {
    if (!res.headersSent) res.status(502).json({ error: 'CRM unavailable. Please try again shortly.' });
  });
  req.on('aborted', () => upstream.destroy());
  if (method === 'GET' || method === 'HEAD') upstream.end();
  else req.pipe(upstream);
}

// Same-origin CRM bridge so production never depends on HotelCRM CORS/CORP.
export function createCrmProxy() {
  const { origin, siteKey, enquiryPath } = crmConfig();
  return (req, res, next) => {
    const path = (req.originalUrl || req.url || '').split('?')[0];
    if (path === '/api/crm/enquiries' && req.method === 'POST') {
      const chunks = [];
      req.on('data', chunk => chunks.push(chunk));
      req.on('end', () => {
        let body = Buffer.concat(chunks).toString('utf8') || '{}';
        try {
          const json = JSON.parse(body);
          if (!json.siteKey) json.siteKey = siteKey;
          json.source = json.source || 'Website';
          body = JSON.stringify(json);
        } catch {
          /* forward raw body */
        }
        const target = new URL(origin);
        const transport = target.protocol === 'https:' ? https : http;
        const upstream = transport.request({
          protocol: target.protocol,
          hostname: target.hostname,
          port: target.port || undefined,
          method: 'POST',
          path: enquiryPath,
          headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            'content-length': Buffer.byteLength(body),
            'user-agent': 'NatureNest-Site-CRM-Proxy'
          }
        }, response => {
          res.statusCode = response.statusCode || 502;
          const type = response.headers['content-type'];
          if (type) res.setHeader('Content-Type', type);
          res.setHeader('Cache-Control', 'no-store');
          response.pipe(res);
        });
        upstream.setTimeout(15000, () => upstream.destroy(new Error('CRM timed out.')));
        upstream.on('error', () => {
          if (!res.headersSent) res.status(502).json({ error: 'CRM unavailable. Please try again shortly.' });
        });
        upstream.end(body);
      });
      return;
    }
    if (path === '/api/crm/branding' && req.method === 'GET') {
      const key = new URL(req.originalUrl || req.url, 'http://local').searchParams.get('siteKey') || siteKey;
      return forward(req, res, {
        origin,
        path: '/api/v1/public/branding?siteKey=' + encodeURIComponent(key),
        method: 'GET'
      });
    }
    return next();
  };
}

export function crmPublicConfig() {
  const { origin, siteKey } = crmConfig();
  return {
    siteKey,
    scriptUrl: '/crm/enquiry.js',
    apiUrl: '/api/crm/enquiries',
    brandingUrl: '/api/crm/branding?siteKey=' + encodeURIComponent(siteKey),
    crmOrigin: origin
  };
}
