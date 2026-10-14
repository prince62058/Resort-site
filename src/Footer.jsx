import { t } from './content.js';
import { site, submitEnquiry } from './content.js';
import { useState } from 'react';
import { GuestLink } from './GuestInformation.jsx';
import { Link } from './SiteLink.jsx';
import { ArrowUp, ArrowUpRight, Facebook, Instagram, Linkedin, Youtube, Mail, MapPin, Phone } from 'lucide-react';
import { Brand3D, Sculpture } from './Brand3D.jsx';
import { useMotion } from './Motion.jsx';
import './footer.css';
function Newsletter() {
  const [email, setEmail] = useState(''),
    [notice, setNotice] = useState(''),
    [busy, setBusy] = useState(false);
  return <section className="nest-newsletter" aria-labelledby="newsletter-title"><Sculpture kind="leaf" /><span className="nest-kicker">{t("Footer.002", "STAY IN THE KNOW")}</span><h3 id="newsletter-title">{t("Footer.003", "A little note from ")}<em>{t("Footer.004", "the nest.")}</em></h3><p>{t("Footer.005", "Subscribe to our newsletter for resort news and inspiration for your next escape.")}</p><form onSubmit={async e => {
      e.preventDefault();
      setBusy(true);
      setNotice('');
      try {
        await submitEnquiry({
          type: 'newsletter',
          email
        });
        setNotice('Thank you. Your subscription request has been received.');
        setEmail('');
      } catch (error) {
        setNotice(error.message);
      } finally {
        setBusy(false);
      }
    }}><label htmlFor="nest-newsletter-email">{t("Footer.006", "Your email address")}</label><div className="nest-email-field"><Mail size={18} /><input id="nest-newsletter-email" type="email" required maxLength={254} value={email} onChange={e => {
          setEmail(e.target.value);
          setNotice('');
        }} placeholder="you@example.com" /><button disabled={busy} aria-label="Subscribe to newsletter"><ArrowUpRight size={23} /></button></div>{notice ? <p role="status">{notice}</p> : <small>{t("Footer.007", "By subscribing, you request resort news and updates.")}</small>}<div className="newsletter-privacy"><GuestLink id="privacy-policy">{t("guest.privacyLink", "Privacy policy")}</GuestLink><span> · </span><a href={"mailto:" + site.settings.email + "?subject=Unsubscribe"}>{t("guest.unsubscribe", "Unsubscribe by email")}</a></div></form></section>;
}
export default function Footer({
  book
}) {
  const contact = {
    ...site.settings,
    phoneLink: 'tel:+' + site.settings.phoneDigits
  };
  const explore = site.pages.filter(p => !p.footerGroup || p.footerGroup === 'main').map(p => [p.footerLabel || p.name, '/' + p.slug]);
  const socials = [['Instagram', Instagram, site.settings.instagram], ['Facebook', Facebook, site.settings.facebook], ['LinkedIn', Linkedin, site.settings.linkedin], ['YouTube', Youtube, site.settings.youtube]].filter(s => s[2]);
  const {
    enabled
  } = useMotion();
  return <>
    <footer className="nest-footer" aria-label="The Nature Nest footer">
      <div className="nest-footer-inner">
        <div className="nest-footer-welcome">
          <div><span className="nest-kicker"><span />{t("Footer.008", " YOUR LITTLE CORNER OF MHOW, INDORE")}</span><h2>{t("Footer.009", "Come for the quiet. Stay for ")}<em>{t("Footer.010", "the feeling.")}</em></h2></div>
          <div className="nest-footer-escape"><p>{t("Footer.011", "Green surroundings. Warm welcomes.")}<br />{t("Footer.012", "A little time that’s entirely yours.")}</p><button onClick={() => book({})}>{t("Footer.013", "Book your escape")}<span><ArrowUpRight size={24} /></span></button></div>
        </div>
        <div className="nest-footer-grid">
          <section className="nest-footer-contact" aria-label="Resort contact details">
            <Link to="/" className="nest-footer-brand" aria-label="The Nature Nest home"><Brand3D /></Link>
            <p className="nest-brand-note">{site.settings.tagline}</p>
            <address>
              <a href={contact.phoneLink} className="nest-contact-row"><span className="nest-contact-icon"><Phone size={16} /></span><span><small>{t("Footer.014", "GIVE US A CALL")}</small>{contact.phone}</span></a>
              <a href={`mailto:${site.settings.email}`} className="nest-contact-row"><span className="nest-contact-icon"><Mail size={16} /></span><span><small>{t("Footer.015", "DROP US A NOTE")}</small>{contact.email}</span></a>
              <a href={contact.maps} target="_blank" rel="noreferrer" className="nest-contact-row nest-address"><span className="nest-contact-icon"><MapPin size={17} /></span><span><small>{t("Footer.016", "FIND YOUR WAY HERE")}</small>{contact.address}<span className="nest-directions">{t("Footer.017", "Get directions ")}<ArrowUpRight size={14} /></span></span></a>
            </address>
          </section>
          <section className="nest-footer-links" aria-labelledby="nest-explore-title"><h3 id="nest-explore-title">{t("Footer.018", "Our links")}<span>01</span></h3><ul>{explore.map(([label, to]) => <li key={to}><Link to={to}>{label}<ArrowUpRight size={13} /></Link></li>)}</ul></section>
          <section className="nest-footer-links" aria-labelledby="nest-help-title"><h3 id="nest-help-title">{t("Footer.019", "Here to help")}<span>02</span></h3><ul>
            <li><GuestLink id="guest-information">{t("Footer.020", "FAQ")}<ArrowUpRight size={13} /></GuestLink></li>
            <li><Link to="/contact-us">{t("Footer.021", "Guest support")}<ArrowUpRight size={13} /></Link></li>
            {site.pages.filter(p => p.footerGroup === "help" && p.id !== "guest-information").map(p => <li key={p.id}><Link to={"/" + p.slug}>{p.footerLabel || p.name}<ArrowUpRight size={13} /></Link></li>)}
          </ul><div className="nest-footer-social"><span>{t("Footer.024", "FOLLOW THE LITTLE MOMENTS")}</span><div>{socials.map(([name, Icon, href]) => <a key={name} href={href} aria-label={`The Nature Nest on ${name}`} title={name} target="_blank" rel="noreferrer"><Icon size={17} /></a>)}</div></div></section>
          <Newsletter />
        </div>
        <div className="nest-footer-bottom"><span>© {new Date().getFullYear()} {site.settings.fullName}.<br className="nest-mobile-break" />{t("Footer.025", " All rights reserved.")}</span><span className="nest-footer-signoff">{t("Footer.026", "ROOTED IN NATURE. REMEMBERED WITH LOVE.")}</span><div className="nest-motion-dock" /><button onClick={() => {
            window.scrollTo({
              top: 0,
              behavior: enabled ? 'smooth' : 'instant'
            });
            document.querySelector('.site-header .nav-brand')?.focus({
              preventScroll: true
            });
          }} aria-label="Back to top">{t("Footer.027", "Back to top")}<ArrowUp size={16} /></button></div>
      </div>
    </footer>
  </>;
}
