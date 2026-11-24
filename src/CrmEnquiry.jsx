import { useEffect, useId, useRef } from 'react';

const CRM = {
  siteKey: (import.meta.env.VITE_CRM_SITE_KEY || '86c995d3bfc077740485a13900d6ddf5').trim(),
  scriptUrl: (import.meta.env.VITE_CRM_EMBED_URL || '/crm/enquiry.js').trim(),
  apiUrl: (import.meta.env.VITE_CRM_ENQUIRY_URL || '/api/crm/enquiries').trim(),
  brandingUrl: (import.meta.env.VITE_CRM_BRANDING_URL || '/api/crm/branding').trim(),
  crmOrigin: (import.meta.env.VITE_CRM_ORIGIN || 'https://hotelcrm-backend-nsdu1l-7d5848-187-127-128-249.sslip.io').trim()
};

export default function CrmEnquiry({
  title = 'Enquire about a stay',
  subtitle = 'Share your dates and we will confirm availability.',
  button = 'Send enquiry',
  theme = 'glass',
  className = '',
  initial = {}
}) {
  const reactId = useId().replace(/:/g, '');
  const targetId = `crm-enquiry-${reactId}`;
  const shell = useRef(null);
  const arrival = initial.checkIn || initial.arrival || '';
  const departure = initial.checkOut || initial.departure || '';
  const guests = initial.guests || initial.adults || '';
  const room = initial.room || initial.roomPreference || '';

  useEffect(() => {
    const root = shell.current;
    if (!root || !CRM.siteKey) return undefined;
    const target = root.querySelector('#' + targetId);
    if (!target) return undefined;
    target.innerHTML = '';
    const existing = root.querySelector('script[data-nn-crm]');
    existing?.remove();
    const script = document.createElement('script');
    script.src = CRM.scriptUrl;
    script.async = false;
    script.dataset.nnCrm = '1';
    script.setAttribute('data-site-key', CRM.siteKey);
    script.setAttribute('data-api', CRM.apiUrl);
    script.setAttribute('data-branding', CRM.brandingUrl);
    script.setAttribute('data-crm-origin', CRM.crmOrigin);
    script.setAttribute('data-target', '#' + targetId);
    script.setAttribute('data-title', title);
    script.setAttribute('data-subtitle', subtitle);
    script.setAttribute('data-button', button);
    script.setAttribute('data-theme', theme);
    if (arrival) script.setAttribute('data-arrival', arrival);
    if (departure) script.setAttribute('data-departure', departure);
    if (guests) script.setAttribute('data-guests', String(guests));
    if (room) script.setAttribute('data-room', room);
    root.appendChild(script);
    return () => {
      target.innerHTML = '';
      script.remove();
    };
  }, [targetId, title, subtitle, button, theme, arrival, departure, guests, room]);

  if (!CRM.siteKey) return null;
  return <div className={'crm-enquiry-shell ' + className} ref={shell}><div id={targetId} /></div>;
}
