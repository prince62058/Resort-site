import React from 'react';
import { ArrowRight, Briefcase, Cake, Gem, Heart, Home, PartyPopper, Sparkles, Trees, Users, Leaf } from 'lucide-react';
import { Link } from './SiteLink.jsx';
import { site, t } from './content.js';
import imageSources from './imageSources.json';
import { getawayOptions, getawayPath, whatsappLink } from '../shared/getaway.js';
import './getaway.css';

export const getawayIcons = { home: Home, party: PartyPopper, wedding: Gem, group: Users, heart: Heart, briefcase: Briefcase, trees: Trees, cake: Cake };
export const getawayIcon = name => getawayIcons[name] || Sparkles;
export const getawayImage = src => '/assets/' + (imageSources[src] || src);

export function GetawayHeading({ as: Heading = 'h2', id }) {
  return <div className="getaway-heading">
    <div className="getaway-eyebrow"><span />{t('Getaway.eyebrow', 'EXPERIENCES AT')}<Leaf size={20} aria-hidden="true" />{t('Getaway.eyebrow2', 'THE NATURE NEST')}<span /></div>
    <Heading id={id}>{t('Getaway.title', 'Plan Your')} <em>{t('Getaway.accent', 'Perfect Getaway')}</em></Heading>
    <p>{t('Getaway.intro', 'Whether it’s a peaceful stay, a grand celebration, or a fun-filled outing, The Nature Nest has the perfect space for every occasion.')}</p>
  </div>;
}

// limit: show only the first N options (the home page); the page shows all of them.
export function GetawayGrid({ limit }) {
  const phone = site.settings.phoneDigits;
  const options = limit ? getawayOptions.slice(0, limit) : getawayOptions;
  return <ul className="getaway-grid">
    {options.map(option => {
      const Icon = getawayIcon(option.icon);
      return <li key={option.id} className="getaway-card">
        <div className="getaway-photo"><img src={getawayImage(option.image)} alt="" loading="lazy" decoding="async" /></div>
        <span className="getaway-badge" aria-hidden="true"><Icon size={26} strokeWidth={1.5} /></span>
        <div className="getaway-body">
          <h3>{option.title}</h3>
          <p>{option.blurb}</p>
          <a className="getaway-cta" href={whatsappLink(phone, option)} target="_blank" rel="noopener noreferrer" aria-label={t('Getaway.cta', 'Check Availability') + ': ' + option.title + ' (opens WhatsApp)'}>
            <span>{t('Getaway.cta', 'Check Availability')}</span><span className="getaway-cta-arrow"><ArrowRight size={19} aria-hidden="true" /></span>
          </a>
        </div>
      </li>;
    })}
  </ul>;
}

// Home page block, placed right under "Not far away. A world apart."
export function GetawaySection({ limit = 8 }) {
  return <section className="getaway-section" aria-labelledby="getaway-home-title">
    <GetawayHeading id="getaway-home-title" />
    <GetawayGrid limit={limit} />
    {getawayOptions.length > limit && <div className="getaway-more"><Link className="text-link" to={getawayPath}>{t('Getaway.more', 'See all getaway options')} <ArrowRight size={17} /></Link></div>}
  </section>;
}

// Full page opened from the header button.
export function GetawayPage() {
  return <div className="getaway-page">
    <GetawayHeading as="h1" id="getaway-page-title" />
    <GetawayGrid />
    <p className="getaway-note">{t('Getaway.note', 'Each button opens WhatsApp with your enquiry ready to send. Our team replies with availability, packages and pricing.')}</p>
  </div>;
}
