import { ArrowUpRight, ChevronDown, Mail, MapPin, Phone, ShieldCheck } from 'lucide-react';
import { Link } from './SiteLink.jsx';
import { site, t } from './content.js';
import { documentBlocks, guestPath } from '../shared/guest-pages.js';
import './guest-information.css';

export function GuestLink({ id, children, ...props }) {
  const path = guestPath(site, id);
  return path ? <Link to={path} {...props}>{children}</Link> : null;
}

export function FormPrivacy({ booking = false }) {
  return <div className="guest-form-privacy">
    <p>{t('guest.formPrivacy', 'We use your details to respond to this enquiry. Please avoid sharing sensitive personal or payment information.')}</p>
    <div><GuestLink id="privacy-policy">{t('guest.privacyLink', 'Privacy policy')}</GuestLink>{booking && <><GuestLink id="terms-and-conditions">{t('guest.termsLink', 'Booking terms')}</GuestLink><GuestLink id="cancellation-refund-policy">{t('guest.cancellationLink', 'Cancellation & refunds')}</GuestLink></>}</div>
  </div>;
}

export function GuestContact({ compact = false }) {
  const s = site.settings;
  return <section className={'guest-contact-card' + (compact ? ' compact' : '')} aria-label="Guest assistance">
    <span className="guest-kicker">{t('guest.contactEyebrow', 'A PERSONAL ANSWER')}</span>
    <h2>{t('guest.contactHeading', 'We’re here to help.')}</h2>
    <p>{t('guest.contactIntro', 'A new escape, a change of plans or a question about your information. Talk to our resort team.')}</p>
    <div className="guest-contact-actions"><a href={'tel:+' + s.phoneDigits}><Phone size={17} /><span>{s.phoneInternational}</span><ArrowUpRight size={17} /></a><a href={'mailto:' + s.email}><Mail size={17} /><span>{s.email}</span><ArrowUpRight size={17} /></a></div>
    {!compact && <><address><MapPin size={18} /><span>{s.address}</span></address><a className="text-link" href={s.maps} target="_blank" rel="noreferrer">{t('guest.directions', 'Get directions')} <ArrowUpRight size={16} /></a></>}
  </section>;
}

export function ContactHelp() {
  return <section className="guest-contact-help" aria-label="More ways to plan your stay">
    <div><span className="guest-kicker">{t('guest.helpEyebrow', 'GOOD TO KNOW')}</span><h2>{t('guest.helpHeading', 'A little help with the details.')}</h2><p>{t('guest.helpIntro', 'For an existing booking, include your visit dates and booking reference. Our team will help you with the next step.')}</p><a className="button" href={'https://wa.me/' + site.settings.phoneDigits} target="_blank" rel="noreferrer">{t('guest.whatsapp', 'Chat on WhatsApp')} <ArrowUpRight size={17} /></a></div>
    <div className="guest-help-links">{site.pages.filter(p => p.footerGroup === 'help').map(p => <Link to={'/' + p.slug} key={p.id}><span>{p.footerLabel || p.name}</span><ArrowUpRight size={20} /></Link>)}</div>
  </section>;
}

export default function GuestInformation({ page }) {
  const blocks = documentBlocks(page.body, site.settings);
  const headings = blocks.filter(b => b.type === 'h2');
  const support = page.template === 'support';
  const date = page.updated && new Date(page.updated + 'T00:00:00Z');
  const related = site.pages.filter(p => p.footerGroup === 'help' && p.id !== page.id);
  return <div className="guest-page">
    <div className="guest-page-header"><div className="guest-breadcrumb"><Link to="/">{t('guest.home', 'Home')}</Link><span>/</span><span>{page.name}</span></div><div className="guest-heading-row"><div><span className="guest-kicker">{t('guest.pageEyebrow', 'THE NATURE NEST · GUEST INFORMATION')}</span><h1>{page.heading || page.name}<br />{page.accent && <em>{page.accent}</em>}</h1><p>{page.subtitle}</p></div><div className="guest-seal" aria-hidden="true"><ShieldCheck strokeWidth={1} /></div></div><div className="guest-page-meta"><span>{page.name}</span>{date && !Number.isNaN(date.getTime()) && <span>{t('guest.updated', 'Updated')} <time dateTime={page.updated}>{date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })}</time></span>}</div></div>
    <div className="guest-document-layout"><aside className="guest-document-index"><span className="guest-kicker">{t('guest.onPage', 'ON THIS PAGE')}</span><nav aria-label="On this page">{headings.map((h, i) => <a key={h.id} href={'#' + h.id}><span>{String(i + 1).padStart(2, '0')}</span>{h.text}</a>)}{support && <a href="#guest-faq">{t('guest.faq', 'Frequently asked questions')}</a>}</nav><Link className="guest-contact-link" to="/contact-us">{t('guest.contactLink', 'Contact our team')} <ArrowUpRight size={16} /></Link></aside>
      <article className="guest-document" aria-label={page.name}>{blocks.map((b, i) => b.type === 'ul' ? <ul key={i}>{b.items.map((item, j) => <li key={j}>{item}</li>)}</ul> : b.type === 'p' ? <p key={i}>{b.text}</p> : <b.type key={i} id={b.id}>{b.text}</b.type>)}
        {support && <section id="guest-faq" className="guest-faq"><h2>{t('guest.faq', 'Frequently asked questions')}</h2>{site.faqs.map((f, i) => <details key={i}><summary>{f.question}<ChevronDown size={18} /></summary><p>{f.answer}</p></details>)}</section>}
        <GuestContact />
      </article>
    </div>
    <section className="guest-related" aria-label="Related guest information"><span className="guest-kicker">{t('guest.related', 'A LITTLE MORE CLARITY')}</span><div>{related.map(p => <Link key={p.id} to={'/' + p.slug}>{p.footerLabel || p.name}<ArrowUpRight size={18} /></Link>)}</div></section>
  </div>;
}
