import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { seoFor, safeJson } from '../shared/seo.js';
import { site } from './content.js';
export default function Seo() {
  const {
    pathname
  } = useLocation();
  useEffect(() => {
    const seo = seoFor(site, pathname, location.origin);
    document.title = seo.title;
    const set = (selector, tag, attrs) => {
      let el = document.head.querySelector(selector);
      if (!el) {
        el = document.createElement(tag);
        document.head.append(el);
      }
      for (const [key, value] of Object.entries(attrs)) el.setAttribute(key, value);
    };
    set('meta[name="description"]', 'meta', {
      name: 'description',
      content: seo.description
    });
    set('meta[name="robots"]', 'meta', {
      name: 'robots',
      content: seo.noindex ? 'noindex, follow' : 'index, follow'
    });
    set('link[rel="canonical"]', 'link', {
      rel: 'canonical',
      href: seo.canonical
    });
    for (const [property, content] of Object.entries({
      'og:title': seo.title,
      'og:description': seo.description,
      'og:url': seo.canonical,
      'og:image': seo.image,
      'og:type': seo.route?.type === 'posts' ? 'article' : 'website'
    })) set(`meta[property="${property}"]`, 'meta', {
      property,
      content
    });
    set('meta[name="twitter:card"]', 'meta', {
      name: 'twitter:card',
      content: 'summary_large_image'
    });
    let schema = document.getElementById('site-schema');
    if (!schema) {
      schema = document.createElement('script');
      schema.id = 'site-schema';
      schema.type = 'application/ld+json';
      document.head.append(schema);
    }
    schema.textContent = safeJson(seo.schemas);
    document.head.querySelectorAll('link[rel="icon"]').forEach(el => el.remove());
    set('link[rel="icon"]', 'link', {
      rel: 'icon',
      href: '/assets/' + site.settings.favicon
    });
  }, [pathname]);
  return null;
}
