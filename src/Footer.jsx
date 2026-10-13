import {useEffect, useRef, useState} from 'react';
import {Link} from 'react-router-dom';
import {ArrowUp, ArrowUpRight, Check, ChevronDown, Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Send, X} from 'lucide-react';
import {Brand3D, Sculpture} from './Brand3D.jsx';
import {useMotion} from './Motion.jsx';
import './footer.css';

const contact = {
  phone: '077778 78822',
  phoneLink: 'tel:+917777878822',
  email: 'info@thenaturenestresort.com',
  address: '736,738, Gram Badgonda, near Badgonda Balaji Temple, Dr. Ambedkar Nagar (Mhow), Indore, India 453441',
  maps: 'https://www.google.com/maps/search/?api=1&query=The+Nature+Nest+Resort+Mhow',
};
const explore = [
  ['Home', '/'], ['About us', '/about'], ['Cottages & private villas', '/rooms'],
  ['Services & experiences', '/services'], ['Our gallery', '/galleries'],
  ['The journal', '/blog'], ['Contact us', '/contact-us'],
];
const socials = [
  ['Instagram', Instagram, 'https://www.instagram.com/thenaturenestresort?igsh=anhodThibzBrZzZ5'],
  ['Facebook', Facebook, 'https://www.facebook.com/thenaturenestresort?mibextid=ZbWKwL'],
  ['LinkedIn', Linkedin, 'https://www.linkedin.com/company/the-natures-nest-hotel-resorts/'],
];
const questions = [
  ['Where is The Nature Nest?', contact.address],
  ['What kind of stays can I choose from?', 'Explore our cottages and private villas on the stays page. Each listing includes photos, amenities and an indicative nightly rate.'],
  ['How do I book a stay?', 'Choose “Book your escape” and share your dates and guest details. You can then send your enquiry to the resort on WhatsApp. Our team will confirm availability and the final rate.'],
  ['Can I plan a celebration or a group visit?', 'Yes, contact our team with your preferred date and group size to discuss a celebration or gathering at the resort.'],
  ['Where can I check cancellation and check-in details?', 'Please ask our team for the current booking terms, check-in times and cancellation conditions before confirming your stay.'],
];
const mailRequest = (subject, body) => `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

function GuestInformation({topic, close}) {
  const dialog = useRef(null);
  const previousFocus = useRef(document.activeElement);
  const title = topic === 'faq' ? 'A few helpful answers.' : topic === 'privacy' ? 'Your privacy matters.' : 'Before your stay.';
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.current.showModal();
    return () => {document.body.style.overflow = previousOverflow; previousFocus.current?.focus();};
  }, []);
  return <dialog ref={dialog} className="nest-info-dialog" aria-labelledby="guest-info-title" onCancel={close} onClick={event => {
    if (event.target === dialog.current) {
      const rect = dialog.current.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) close();
    }
  }}>
    <button className="nest-info-close" onClick={close} aria-label="Close guest information"><X size={21}/></button>
    <span className="nest-kicker">{topic === 'faq' ? 'FREQUENTLY ASKED QUESTIONS' : topic === 'privacy' ? 'PRIVACY' : 'TERMS & CONDITIONS'}</span>
    <h2 id="guest-info-title">{title}</h2>
    {topic === 'faq' ? <div className="nest-faq-list">{questions.map(([question, answer], index) => <details key={question} open={index === 0}>
      <summary>{question}<ChevronDown size={18}/></summary><p>{answer}</p>
    </details>)}</div> : <>
      <p>{topic === 'privacy' ? 'For the resort’s current privacy policy or questions about your personal information, please contact our team.' : 'Please request the current booking and stay terms directly from the resort before confirming your visit. Our team can explain payment, cancellation and check-in arrangements for your booking.'}</p>
      <a className="nest-info-request" href={mailRequest(topic === 'privacy' ? 'Request for privacy policy' : 'Request for booking terms and conditions', topic === 'privacy' ? 'Hello Nature Nest, please share your current privacy policy. Thank you.' : 'Hello Nature Nest, please share your current booking terms, including payment, cancellation and check-in conditions. Thank you.')}>
        {topic === 'privacy' ? 'Request privacy policy' : 'Request booking terms'}<ArrowUpRight size={17}/>
      </a>
    </>}
    <div className="nest-info-contact"><span>A personal answer is always a call away.</span><a href={contact.phoneLink}><Phone size={16}/>{contact.phone}</a></div>
  </dialog>;
}

function Newsletter() {
  const [email, setEmail] = useState('');
  const [draft, setDraft] = useState('');
  return <section className="nest-newsletter" aria-labelledby="newsletter-title">
    <Sculpture kind="leaf"/>
    <span className="nest-kicker">STAY IN THE KNOW</span>
    <h3 id="newsletter-title">A little note from <em>the nest.</em></h3>
    <p>Subscribe to our newsletter for resort news and inspiration for your next escape.</p>
    <form onSubmit={event => {
      event.preventDefault();
      const address = email.trim();
      setDraft(mailRequest('Newsletter subscription request', `Hello Nature Nest,\n\nI would like to receive your newsletter and resort updates at ${address}. Please let me know how to subscribe.\n\nThank you.`));
    }}>
      <label htmlFor="nest-newsletter-email">Your email address</label>
      <div className="nest-email-field"><Mail size={18} aria-hidden="true"/><input id="nest-newsletter-email" name="email" type="email" required autoComplete="email" maxLength={254} placeholder="you@example.com" value={email} onChange={event => {setEmail(event.target.value); setDraft('');}}/><button type="submit" aria-label="Prepare newsletter request" title="Prepare newsletter request"><ArrowUpRight size={23}/></button></div>
      {draft ? <div className="nest-newsletter-ready" role="status"><span><Check size={15}/> Your email request is ready.</span><a href={draft}>Open email app to send <Send size={14}/></a></div> : <small>Send your subscription request through your email app.</small>}
    </form>
  </section>;
}

export default function Footer({book}) {
  const [information, setInformation] = useState(null);
  const {enabled} = useMotion();
  return <>
    <footer className="nest-footer" aria-label="The Nature Nest footer">
      <div className="nest-footer-inner">
        <div className="nest-footer-welcome">
          <div><span className="nest-kicker"><span/> YOUR LITTLE CORNER OF MHOW, INDORE</span><h2>Come for the quiet. Stay for <em>the feeling.</em></h2></div>
          <div className="nest-footer-escape"><p>Green surroundings. Warm welcomes.<br/>A little time that’s entirely yours.</p><button onClick={() => book({})}>Book your escape<span><ArrowUpRight size={24}/></span></button></div>
        </div>
        <div className="nest-footer-grid">
          <section className="nest-footer-contact" aria-label="Resort contact details">
            <Link to="/" className="nest-footer-brand" aria-label="The Nature Nest home"><Brand3D/></Link>
            <p className="nest-brand-note">A little closer to nature. A little closer to you.</p>
            <address>
              <a href={contact.phoneLink} className="nest-contact-row"><span className="nest-contact-icon"><Phone size={16}/></span><span><small>GIVE US A CALL</small>{contact.phone}</span></a>
              <a href={`mailto:${contact.email}`} className="nest-contact-row"><span className="nest-contact-icon"><Mail size={16}/></span><span><small>DROP US A NOTE</small>{contact.email}</span></a>
              <a href={contact.maps} target="_blank" rel="noreferrer" className="nest-contact-row nest-address"><span className="nest-contact-icon"><MapPin size={17}/></span><span><small>FIND YOUR WAY HERE</small>{contact.address}<span className="nest-directions">Get directions <ArrowUpRight size={14}/></span></span></a>
            </address>
          </section>
          <section className="nest-footer-links" aria-labelledby="nest-explore-title"><h3 id="nest-explore-title">Our links<span>01</span></h3><ul>{explore.map(([label, to]) => <li key={to}><Link to={to}>{label}<ArrowUpRight size={13}/></Link></li>)}</ul></section>
          <section className="nest-footer-links" aria-labelledby="nest-help-title"><h3 id="nest-help-title">Here to help<span>02</span></h3><ul>
            <li><button onClick={() => setInformation('faq')}>FAQ<ArrowUpRight size={13}/></button></li>
            <li><Link to="/contact-us">Guest support<ArrowUpRight size={13}/></Link></li>
            <li><button onClick={() => setInformation('privacy')}>Privacy<ArrowUpRight size={13}/></button></li>
            <li><button onClick={() => setInformation('terms')}>Terms & conditions<ArrowUpRight size={13}/></button></li>
          </ul><div className="nest-footer-social"><span>FOLLOW THE LITTLE MOMENTS</span><div>{socials.map(([name, Icon, href]) => <a key={name} href={href} aria-label={`The Nature Nest on ${name}`} title={name} target="_blank" rel="noreferrer"><Icon size={17}/></a>)}</div></div></section>
          <Newsletter/>
        </div>
        <div className="nest-footer-bottom"><span>© {new Date().getFullYear()} The Nature Nest Hotel & Resort.<br className="nest-mobile-break"/> All rights reserved.</span><span className="nest-footer-signoff">ROOTED IN NATURE. REMEMBERED WITH LOVE.</span><div className="nest-motion-dock"/><button onClick={() => {window.scrollTo({top: 0, behavior: enabled ? 'smooth' : 'instant'}); document.querySelector('.site-header .nav-brand')?.focus({preventScroll:true});}} aria-label="Back to top">Back to top<ArrowUp size={16}/></button></div>
      </div>
    </footer>
    {information && <GuestInformation topic={information} close={() => setInformation(null)}/>}
  </>;
}
