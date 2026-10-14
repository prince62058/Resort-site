import React, { useEffect, useRef, useState } from 'react';
import { ChevronRight, Leaf, Sparkles, X } from 'lucide-react';
import { site, t } from './content.js';
import { getawayOptions, whatsappLink } from '../shared/getaway.js';
import { getawayIcon, getawayImage } from './GetawayCards.jsx';
import './whatsapp-planner.css';

function WhatsAppIcon({ size = 24 }) {
  return <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" focusable="false"><path fill="currentColor" d="M16.04 3C9.4 3 4 8.38 4 15.02c0 2.12.55 4.19 1.6 6.01L4 29l8.14-1.56a12.03 12.03 0 0 0 3.9.65h.01C22.68 28.09 28 22.7 28 16.07 28 9.4 22.7 3 16.04 3Zm0 22.03h-.01a10 10 0 0 1-5.1-1.4l-.37-.22-4.83.93.98-4.7-.24-.38a9.97 9.97 0 0 1-1.54-5.3c0-5.52 4.5-10.01 10.04-10.01 5.52 0 10.01 4.5 10.01 10.04 0 5.52-4.5 10.04-10.01 10.04Zm5.5-7.5c-.3-.15-1.78-.88-2.06-.98-.28-.1-.48-.15-.68.15-.2.3-.78.98-.95 1.18-.18.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.5a9.1 9.1 0 0 1-1.67-2.08c-.18-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.68-1.64-.93-2.25-.24-.58-.5-.5-.68-.51h-.58c-.2 0-.53.08-.8.38-.28.3-1.06 1.03-1.06 2.52s1.08 2.93 1.23 3.13c.15.2 2.13 3.25 5.16 4.56.72.31 1.28.5 1.72.64.72.23 1.38.2 1.9.12.58-.09 1.78-.73 2.03-1.43.25-.7.25-1.3.18-1.43-.08-.12-.28-.2-.58-.35Z" /></svg>;
}

export default function WhatsAppPlanner({ hidden = false }) {
  const [open, setOpen] = useState(false);
  const panel = useRef(null);
  const launcher = useRef(null);
  const phone = site.settings.phoneDigits;
  const resort = site.settings.fullName || 'The Nature Nest';

  const generalLink = `https://wa.me/${phone}?text=${encodeURIComponent('Hi, I would like to know more about ' + resort + '.')}`;

  useEffect(() => {
    if (!open) return undefined;
    const onKey = event => {
      if (event.key === 'Escape') {
        setOpen(false);
        launcher.current?.focus();
      }
    };
    const onPointer = event => {
      if (panel.current && !panel.current.contains(event.target) && !launcher.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    panel.current?.querySelector('a')?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, [open]);

  if (!phone) return null;
  return <div className={'wa-planner' + (hidden ? ' is-hidden' : '')}>
    {open && <section className="wa-panel" id="wa-panel" ref={panel} role="dialog" aria-labelledby="wa-title">
      <div className="wa-panel-head">
        <span className="wa-panel-brand"><Leaf size={20} /><span><small>THE</small>Nature Nest<small>HOTEL &amp; RESORT</small></span></span>
        <button type="button" className="wa-close" onClick={() => { setOpen(false); launcher.current?.focus(); }} aria-label="Close enquiry options"><X size={22} /></button>
      </div>
      <div className="wa-panel-body">
        <h2 id="wa-title">{t('WhatsApp.title', 'Let’s Plan Your Experience')}</h2>
        <p>{t('WhatsApp.subtitle', 'Select an option below to enquire on WhatsApp')}</p>
        <ul className="wa-options">
          {getawayOptions.map((option, index) => {
            const Icon = getawayIcon(option.icon);
            return <li key={option.id}>
              <a href={whatsappLink(phone, option)} target="_blank" rel="noopener noreferrer">
                <span className="wa-thumb" aria-hidden="true"><img src={getawayImage(option.image)} alt="" loading="lazy" decoding="async" /><span className="wa-number">{String(index + 1).padStart(2, '0')}</span></span>
                <span className="wa-icon" aria-hidden="true"><Icon size={21} strokeWidth={1.6} /></span>
                <span className="wa-copy"><strong>{option.title}</strong><small>{option.blurb}</small></span>
                <ChevronRight size={20} aria-hidden="true" />
                <span className="wa-sr">(opens WhatsApp)</span>
              </a>
            </li>;
          })}
        </ul>
        <a className="wa-general" href={generalLink} target="_blank" rel="noopener noreferrer"><Sparkles size={15} /> Something else? Chat with us directly</a>
      </div>
    </section>}
    <button type="button" ref={launcher} className={'wa-launcher' + (open ? ' is-open' : '')} onClick={() => setOpen(value => !value)} aria-expanded={open} aria-controls="wa-panel" aria-label={t('WhatsApp.cta', 'Open WhatsApp booking options')}>
      {open ? <X size={28} aria-hidden="true" /> : <WhatsAppIcon size={34} />}
    </button>
  </div>;
}
