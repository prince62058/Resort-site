import {t} from './content.js';
import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Link, NavLink } from './SiteLink.jsx';
import { ArrowUpRight, ArrowRight, ArrowDown, Menu, X, MapPin, Phone, Leaf, Wifi, Wind, Waves, Coffee, ShieldCheck, ChevronLeft, ChevronRight, Plus, Minus, Check, Mail, Instagram } from 'lucide-react';
import { site, loadContent, redirects, submitEnquiry } from './content.js';
import { pagePath, resolveRoute } from '../shared/content.js';
import Seo from './Seo.jsx';
import imageSources from './imageSources.json';
import './styles.css';
import './premium.css';
import Hero from './Hero.jsx';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import ClosingBanner from './ClosingBanner.jsx';
import OurStory from './OurStory.jsx';
import PhotoSlideshow, { HomeSlideshow } from './PhotoSlideshow.jsx';
import { MotionProvider, useMotion } from './Motion.jsx';
import { Brand3D, Sculpture, Comforts3D } from './Brand3D.jsx';
import GalleryViewer from './GalleryViewer.jsx';
import RoomsPage from './RoomsPage.jsx';
import './responsive.css';
const A = '/assets/',
  hero = 'banner1/baneer2-transformed-min.jpeg';
const money = n => '₹' + n.toLocaleString('en-IN');
function Pic({
  src,
  alt,
  ...props
}) {
  return <img src={A + (imageSources[src] || src)} alt={alt} loading="lazy" {...props} />;
}
function Button({
  to,
  children,
  className = ''
}) {
  return <Link className={'button ' + className} to={to}>{children}<ArrowUpRight size={17} /></Link>;
}
function Eyebrow({
  children
}) {
  return <div className="eyebrow"><span />{children}</div>;
}
function App() {
  const [booking, setBooking] = useState(null),
    [menu, setMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (redirects[location.pathname]) navigate(redirects[location.pathname], {
      replace: true
    });
    window.scrollTo(0, 0);
    setMenu(false);
  }, [location.pathname]);
  useEffect(() => {
    document.body.style.overflow = booking || menu ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [booking, menu]);
  return <><Seo /><Header menu={menu} setMenu={setMenu} book={setBooking} /><main><Routes>{site.pages.map(p => <Route key={p.id} path={"/" + p.slug} element={p.template === "home" ? <Home book={setBooking} /> : p.template === "rooms" ? <Stays book={setBooking} /> : p.template === "services" ? <Experiences /> : p.template === "galleries" ? <Gallery /> : p.template === "about" ? <About /> : p.template === "contact" ? <Contact /> : p.template === "blog" ? <Journal /> : <CustomPage page={p} />} />)}<Route path={pagePath(site, "rooms") + "/:slug"} element={<Room book={setBooking} />} /><Route path={pagePath(site, "services") + "/:slug"} element={<Experiences />} /><Route path={pagePath(site, "galleries") + "/:slug"} element={<Gallery />} /><Route path={pagePath(site, "blog") + "/:slug"} element={<Journal article />} /><Route path="/" element={<Home book={setBooking} />} /><Route path="/index.html" element={<Home book={setBooking} />} /><Route path="/rooms" element={<Stays book={setBooking} />} /><Route path="/rooms.html" element={<Stays book={setBooking} />} /><Route path="/rooms/:slug" element={<Room book={setBooking} />} /><Route path="/services" element={<Experiences />} /><Route path="/services.html" element={<Experiences />} /><Route path="/services/:slug" element={<Experiences />} /><Route path="/galleries" element={<Gallery />} /><Route path="/galleries.html" element={<Gallery />} /><Route path="/galleries/:slug" element={<Gallery />} /><Route path="/about" element={<About />} /><Route path="/contact-us" element={<Contact />} /><Route path="/contact-us.html" element={<Contact />} /><Route path="/blog/:slug" element={<Journal article />} /><Route path="/blog" element={<Journal />} /><Route path="/news/:slug" element={<Journal />} /><Route path="/tag/:slug" element={<Journal />} /><Route path="/login.html" element={<Account />} /><Route path="/register.html" element={<Account />} /><Route path="/password/request.html" element={<Account />} /><Route path="*" element={<section className="section centered"><Eyebrow>{t("main.001", "A NEW PATH")}</Eyebrow><h1>{t("main.002", "Let's get you back to nature.")}</h1><Button to="/">{t("main.003", "Back home")}</Button></section>} /></Routes></main><Footer book={setBooking} />{booking && <Booking initial={booking} close={() => setBooking(null)} />}</>;
}
function Home({
  book
}) {
  const rooms = site.rooms,
    experiences = site.experiences;
  const featured = rooms.filter(r => r.featured);
  const {
    homeResortPhotos,
    homeGardenPhotos,
    homeLeisurePhotos,
    homeDiningPhotos,
    homeCottageViews,
    homeEveningPhotos
  } = site.homePhotos;
  return <div className="redesign"><Hero book={book} /><SearchStay book={book} /><Comforts3D /><section className="section story-section" id="welcome"><div className="story-title"><Eyebrow>{t("main.004", "THIS IS THE NATURE NEST")}</Eyebrow><h2>{t("main.005", "Not far away.")}<br /><em>{t("main.006", "A world apart.")}</em></h2><span className="story-index">{t("main.007", "01 — THE FEELING")}</span></div><div className="story-body"><p>{t("main.008", "Somewhere between the city and the silence, there’s a place that feels like a deep breath.")}</p><div className="story-small"><p>{t("main.009", "Welcome to The Nature Nest. Tucked into the greenery of Mhow, our cottages and private villas give you the space to reconnect—with nature, with your people, with yourself.")}</p><Link to="/about" className="circle-link" aria-label="Discover our story"><ArrowUpRight size={27} /></Link></div></div><div className="story-pictures"><div className="story-wide"><HomeSlideshow images={homeResortPhotos} alt="The Nature Nest resort" interval={5100} /><span>{t("main.010", "A place to call your own.")}</span></div><div className="story-portrait"><HomeSlideshow images={[homeGardenPhotos[1], homeGardenPhotos[2], homeGardenPhotos[0]]} alt="Nature Nest gardens" interval={5700} /></div><div className="story-caption"><Leaf size={36} /><p>{t("main.011", "Less rush.")}<br />{t("main.012", "More ")}<em>{t("main.013", "real life.")}</em></p><span>{t("main.014", "NATURE DOES THE REST.")}</span></div></div></section><section className="signature-stays"><div className="section"><div className="section-heading"><div><Eyebrow>{t("main.015", "STAY A LITTLE LONGER")}</Eyebrow><h2>{t("main.016", "Your kind of ")}<em>{t("main.017", "hideaway.")}</em></h2></div><Link className="text-link" to="/rooms">{t("main.018", "Discover all ")}{rooms.length}{t("main.019", " stays ")}<ArrowUpRight size={18} /></Link></div><div className="signature-grid">{featured.filter(Boolean).map((r, i) => <Link to={'/rooms/' + r.slug} className="signature-card" key={r.slug}><div className="signature-image"><HomeSlideshow images={r.homeImages} alt={r.name} interval={4800 + i * 350} /> <span className="signature-type">{r.type}</span><span className="signature-number">0{i + 1}</span><span className="signature-open"><ArrowUpRight /></span></div><div className="signature-info"><h3>{r.name}</h3><span>{t("main.020", "FROM ")}<strong>{money(r.price)}</strong>{t("main.021", " / NIGHT")}</span></div><p>{r.summary}</p></Link>)}</div><div className="stay-bottom"><span><ShieldCheck size={17} />{t("main.022", " Personal attention. Thoughtful comforts. Always.")}</span><span>{t("main.023", "COTTAGES & PRIVATE VILLAS")}</span></div></div></section><section className="section new-experiences"><div className="section-heading"><div><Eyebrow>{t("main.024", "HOW WILL YOU SPEND YOUR DAY?")}</Eyebrow><h2>{t("main.025", "Absolutely everything.")}<br />{t("main.026", "Or ")}<em>{t("main.027", "nothing at all.")}</em></h2></div><p>{t("main.028", "No packed itineraries. No keeping up.")}<br />{t("main.029", "Just the things that make you feel good.")}</p></div><div className="experience-editorial">{experiences.map((e, i) => <Link to={'/services/' + e.slug} key={e.slug}><div className="experience-photo"><HomeSlideshow images={e.images} alt={e.name} interval={5000 + i * 400} /><span>0{i + 1}</span></div><div className="experience-title"><Sculpture kind={i === 0 ? 'pool' : i === 1 ? 'dining' : 'stay'} delay={-i} /><div><span className="tiny">{e.tag}</span><h3>{e.name}</h3></div><ArrowUpRight size={24} /></div><p>{e.text}</p></Link>)}</div></section><section className="moment-section"><HomeSlideshow images={homeEveningPhotos} alt="Evenings at Nature Nest" interval={5900} indicators={false} /><div className="moment-content"><Eyebrow>{t("main.030", "SWITCH OFF. SETTLE IN.")}</Eyebrow><h2>{t("main.031", "Collect moments.")}<br /><em>{t("main.032", "Not notifications.")}</em></h2><button className="button cream" onClick={() => book({})}>{t("main.033", "Make time for you ")}<ArrowUpRight size={18} /></button></div><span className="moment-location"><MapPin size={15} />{t("main.034", " THE NATURE NEST · MHOW")}</span></section><section className="section guest-story"><div><Eyebrow>{t("main.035", "GOOD PLACES. HAPPY PEOPLE.")}</Eyebrow><h2>{t("main.036", "The feeling")}<br /><em>{t("main.037", "stays with you.")}</em></h2><span className="guest-label">{t("main.038", "FROM OUR GUEST BOOK")}</span></div><div><span className="quote-mark">“</span><blockquote>{t("main.039", "The room was spacious and elegantly decorated, with a comfortable bed and modern amenities. I enjoyed the private balcony with breathtaking views.")}</blockquote><div className="guest-person"><Pic src={site.homePhotos.guestPortrait?.[0]||"testimonials/unnamed-2.png"} alt="" /><div><strong>{t("main.040", "Mohit Seth")}</strong><span>{t("main.041", "A Nature Nest guest")}</span></div><div className="stars">★★★★★</div></div></div></section><section className="new-gallery"><div className="section-heading"><div><Eyebrow>{t("main.042", "POSTCARDS FROM THE NEST")}</Eyebrow><h2>{t("main.043", "Wish you were ")}<em>{t("main.044", "here.")}</em></h2></div><Link to="/galleries" className="text-link">{t("main.045", "See the whole picture ")}<ArrowUpRight size={18} /></Link></div><div className="postcards">{['banners/2024-08-24-1-1.jpg', 'cottage/1-850x460.png', 'banners/banner-pool-1.jpg', 'banner1/1l2a1574.jpg'].map((im, i) => <Link key={im} to="/galleries"><HomeSlideshow images={[homeGardenPhotos, homeCottageViews, homeLeisurePhotos, homeDiningPhotos][i]} alt={['Green garden pathways', 'Nature-inspired cottages', 'Pool and leisure', 'Warm resort dining'][i]} interval={4900 + i * 350} /><span>{['A walk on the quiet side', 'Your morning view', 'Pool days & garden afternoons', 'A table for your people'][i]} <ArrowUpRight size={17} /></span></Link>)}</div></section><ClosingBanner book={book} /></div>;
}
function SearchStay({
  book,
  initial = {}
}) {
  const [checkIn, setIn] = useState(initial.checkIn || ''),
    [checkOut, setOut] = useState(initial.checkOut || ''),
    [guests, setGuests] = useState(initial.guests || '2');
  const today = new Date().toLocaleDateString('en-CA');
  return <form className="search-stay" onSubmit={e => {
    e.preventDefault();
    book({
      checkIn,
      checkOut,
      guests
    });
  }}><div className="search-title"><Sculpture kind="leaf" /><span>{t("main.046", "Your escape")}<br /><strong>{t("main.047", "starts here.")}</strong></span></div><label>{t("main.048", "CHECK IN")}<input aria-label="Check in" type="date" required min={today} value={checkIn} onChange={e => {
        setIn(e.target.value);
        if (checkOut <= e.target.value) setOut('');
      }} /></label><label>{t("main.049", "CHECK OUT")}<input aria-label="Check out" type="date" required min={checkIn ? new Date(new Date(checkIn).getTime() + 86400000).toISOString().slice(0, 10) : today} value={checkOut} onChange={e => setOut(e.target.value)} /></label><label>{t("main.050", "GUESTS")}<select value={guests} onChange={e => setGuests(e.target.value)}>{Array.from({
          length: 10
        }, (_, i) => <option key={i} value={i + 1}>{i + 1} {i ? 'Guests' : 'Guest'}</option>)}</select></label><button className="button">{t("main.051", "Enquire about a stay ")}<ArrowUpRight size={16} /></button></form>;
}
function PageHero({
  title,
  italic,
  subtitle,
  image = hero,
  images
}) {
  const {
    pathname
  } = useLocation();
  const route = resolveRoute(site, pathname);
  const page = route?.item;
  if(route?.type==='galleries'){title=page.name;italic='';subtitle=page.description;images=page.images;}
  if (page?.template) {
    title = page.heading || title;
    italic = page.accent || italic;
    subtitle = page.subtitle || subtitle;
    images = page.images;
  }
  return <section className="page-hero"><PhotoSlideshow images={images || [image, ...site.photos.resortPhotos.filter(src => src !== image)]} alt="The Nature Nest resort" interval={7200} indicators={false} /><div className="page-hero-copy"><Eyebrow>{t("main.052", "THE NATURE NEST · MHOW")}</Eyebrow><h1>{title} <em>{italic}</em></h1><p>{subtitle}</p></div></section>;
}
function Stays({
  book
}) {
  return <RoomsPage book={book} search={<SearchStay book={book} />} />;
}
function Room({
  book
}) {
  const rooms = site.rooms,
    phone = site.settings.phoneDigits;
  let {
    slug
  } = useParams();
  slug = decodeURIComponent(slug).split('?')[0].replace('.html', '');
  const r = rooms.find(x => x.slug === slug);
  const [active, setActive] = useState(0);
  useEffect(() => setActive(0), [slug]);
  if (!r) return <MissingPage />;
  return <section className="section room-detail"><Link className="text-link" to="/rooms">{t("main.053", "← All stays")}</Link><div className="section-heading"><div><Eyebrow>{t("main.054", "YOUR OWN LITTLE SANCTUARY")}</Eyebrow><h1>{r.name}</h1></div><span>{t("main.055", "From ")}<strong>{money(r.price)}</strong>{t("main.056", " / night")}</span></div><div className="detail-image"><PhotoSlideshow key={r.slug} images={r.images} alt={r.name} index={active} onIndexChange={setActive} interval={6500} indicators={false} /><button className="photo-prev" aria-label="Previous room image" onClick={() => setActive((active + r.images.length - 1) % r.images.length)}><ChevronLeft /></button><button className="photo-next" aria-label="Next room image" onClick={() => setActive((active + 1) % r.images.length)}><ChevronRight /></button><span>{active + 1} / {r.images.length}</span></div><div className="thumbnails">{r.images.map((im, i) => <button key={im} aria-label={'Show room photo ' + (i + 1)} className={active === i ? 'selected' : ''} onClick={() => setActive(i)}><Pic src={im} alt="" /></button>)}</div><div className="detail-layout"><div><h2>{t("main.057", "Make yourself ")}<em>{t("main.058", "at home.")}</em></h2><p className="room-description">{r.description}</p><h3>{t("main.059", "The little comforts")}</h3><div className="sculpted-amenities"><div><Sculpture kind="leaf" /><span>{t("main.060", "Green surroundings")}</span></div><div><Sculpture kind="pool" delay={-2} /><span>{t("main.061", "Pool & leisure")}</span></div><div><Sculpture kind="dining" delay={-4} /><span>{t("main.062", "Resort dining")}</span></div></div><div className="amenities">{r.amenities.map(t => <span key={t}><Check size={20} />{t}</span>)}</div></div><aside className="booking-aside"><Eyebrow>{t("main.063", "A LITTLE TIME FOR YOU")}</Eyebrow><h3>{t("main.064", "Your escape awaits.")}</h3><p>{t("main.065", "Tell us your dates. Our team will help you plan the rest.")}</p><button className="button" onClick={() => book({
          room: r.slug
        })}>{t("main.066", "Enquire about this stay ")}<ArrowUpRight size={17} /></button><a href={'tel:+' + phone}><Phone size={16} /> {site.settings.phoneInternational}</a><small>{t("main.067", "Rates and availability confirmed by our team.")}</small></aside></div></section>;
}
function Experiences() {
  const experiences = site.experiences;
  const {
    slug
  } = useParams();
  const selected = experiences.find(e => e.slug === slug?.replace('.html', ''));
  if(slug&&!selected)return <MissingPage/>;
  return <><PageHero title={selected ? selected.name : 'Little moments.'} italic={selected ? '' : 'Lasting memories.'} image={selected?.image || 'banner1/1l2a1574.jpg'} images={selected ? selected.images : experiences.flatMap(e => e.images.slice(0, 1))} subtitle={t("main.068", "Thoughtful experiences, at nature’s pace.")} /><section className="section">{(selected ? [selected] : experiences).map((e, i) => <div className={'experience-detail ' + (i % 2 ? 'reverse' : '')} key={e.name}><PhotoSlideshow images={e.images} alt={e.name} interval={7500 + i * 500} /><div><Eyebrow>{e.tag}</Eyebrow><h2>{e.name}</h2><p>{e.text}{t("main.069", " Discover warm hospitality and a setting that brings you closer to the people you love.")}</p><Button to="/contact-us">{t("main.070", "Plan your visit")}</Button></div></div>)}</section></>;
}
function Gallery() {
  const data = site;
  const {
    slug
  } = useParams();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All moments'),
    [lightbox, setLightbox] = useState(null);
  const items = data.galleries.flatMap(g => g.images.map(src => ({
    src,
    category: g.name,
    slug: g.slug
  })));
  const matching = items.filter(x => slug ? x.slug === slug.replace('.html', '') : filter === 'All moments' || x.category === filter);
  const filtered = matching.filter((v, i, a) => a.findIndex(x => x.src === v.src) === i);
  return <><PageHero title={t("main.071", "A thousand little")} italic={t("main.072", "reasons to stay.")} subtitle={t("main.073", "Real places. Real moments. A glimpse into life at The Nature Nest.")} /><section className="section"><div className="filter-row wrap">{['All moments', ...new Set(items.map(x => x.category))].map(f => <button className={f === filter ? 'selected' : ''} onClick={() => {
          setFilter(f);
          if (slug) navigate('/galleries');
        }} key={f}>{f}</button>)}</div>{slug && <Link className="text-link" to="/galleries">{t("main.074", "View all galleries →")}</Link>}<div className="gallery-grid">{filtered.map((im, i) => <button key={im.src} onClick={() => setLightbox(i)} aria-label={'Enlarge ' + im.category + ' photo ' + (i + 1)}><Pic src={im.src} alt={im.category} /><span>{im.category}<Plus size={20} /></span></button>)}</div></section>{lightbox !== null && <GalleryViewer photos={filtered} initial={lightbox} close={() => setLightbox(null)} />}</>;
}
function About() {
  return <><PageHero title={t("main.075", "Rooted in nature.")} italic={t("main.076", "Made for you.")} subtitle={t("main.077", "A warm welcome, a quieter rhythm, and space to reconnect.")} images={site.storyChapters.map(c => c.image)} /><OurStory /></>;
}
function Contact() {
  const c = site.settings;
  const [notice, setNotice] = useState(''),
    [busy, setBusy] = useState(false);
  return <><PageHero title={t("main.078", "Let's plan something")} italic={t("main.079", "beautiful.")} subtitle={t("main.080", "A weekend away, a celebration, or simply a little time for you.")} /><section className="section contact-layout"><div><Eyebrow>{t("main.081", "WE’D LOVE TO HEAR FROM YOU")}</Eyebrow><h2>{t("main.082", "Your escape.")}<br /><em>{t("main.083", "Our pleasure.")}</em></h2><a className="contact-line" href={'tel:+' + c.phoneDigits}><Phone />{c.phoneInternational}</a><a className="contact-line" href={'mailto:' + c.email}><Mail />{c.email}</a><p className="contact-line"><MapPin />{c.address}</p><a className="text-link" href={c.maps} target="_blank" rel="noreferrer">{t("main.084", "Get directions ")}<ArrowUpRight size={16} /></a></div><form className="contact-form" onSubmit={async e => {
        e.preventDefault();
        const form = e.currentTarget;
        setBusy(true);
        setNotice('');
        try {
          await submitEnquiry({
            type: 'contact',
            ...Object.fromEntries(new FormData(form))
          });
          setNotice('Thank you. Your enquiry has been sent to our resort team.');
          form.reset();
        } catch (error) {
          setNotice(error.message);
        } finally {
          setBusy(false);
        }
      }}><h3>{t("main.085", "A little hello goes a long way.")}</h3><label>{t("main.086", "Your name")}<input name="name" required maxLength={120} placeholder="Full name" /></label><div className="form-row"><label>{t("main.087", "Email address")}<input type="email" name="email" required maxLength={254} placeholder="you@example.com" /></label><label>{t("main.088", "Phone number")}<input type="tel" name="phone" maxLength={50} placeholder="Your phone number" /></label></div><label>{t("main.089", "What do you have in mind?")}<textarea name="message" required maxLength={5000} rows="4" placeholder="Tell us about your visit…" /></label><input className="form-trap" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" /><button disabled={busy} className="button">{busy ? 'Sending…' : 'Send enquiry'} <ArrowUpRight size={17} /></button>{notice && <p className="form-notice" role="status">{notice}</p>}<small>{t("main.090", "Our resort team will reply using your contact details.")}</small></form></section></>;
}
function Journal({
  article = false
}) {
  const {
    slug
  } = useParams();
  const post = site.posts.find(p => p.slug === slug);
  if (article && !post) return <MissingPage />;
  return <><PageHero title={t("main.091", "Stories from")} italic={t("main.092", "the nest.")} subtitle={t("main.093", "Inspiration for your next unhurried escape.")} />{article ? <article className="section article"><Eyebrow>{t("main.094", "THE JOURNAL · ")}{post.date}</Eyebrow><h1>{post.name}</h1><PhotoSlideshow images={post.images} alt={post.name} interval={7800} />{post.body.split('\n\n').map((p, i) => <p key={i}>{p}</p>)}<Button to="/rooms">{t("main.095", "Explore your next stay")}</Button></article> : <section className="section">{site.posts.map(post => <Link key={post.id} className="journal-card" to={'/blog/' + post.slug}><PhotoSlideshow images={post.images} alt={post.name} interval={7800} /><div><Eyebrow>{post.date}{t("main.096", " · THE JOURNAL")}</Eyebrow><h2>{post.name}</h2><p>{post.summary}</p><span className="text-link">{t("main.097", "Read the story ")}<ArrowUpRight size={17} /></span></div></Link>)}</section>}</>;
}
function CustomPage({
  page
}) {
  return <><PageHero title={page.heading || page.name} italic={page.accent} subtitle={page.subtitle} /><article className="section article">{page.body.split('\n\n').map((p, i) => <p key={i}>{p}</p>)}</article></>;
}
function MissingPage() {
  return <section className="section centered"><h1>{t("main.098", "Page not found.")}</h1><Button to="/">{t("main.099", "Back home")}</Button></section>;
}
function Account() {
  return <section className="section centered"><Eyebrow>{t("main.100", "GUEST ASSISTANCE")}</Eyebrow><h1>{t("main.101", "We're here to ")}<em>{t("main.102", "help.")}</em></h1><p>{t("main.103", "Online account services require the resort’s booking system.")}<br />{t("main.104", "Please contact our team for reservations or help with an existing booking.")}</p><Button to="/contact-us">{t("main.105", "Contact the resort")}</Button></section>;
}
function Booking({
  initial,
  close
}) {
  const rooms = site.rooms,
    phone = site.settings.phoneDigits;
  const dialog = useRef(null),
    previous = useRef(document.activeElement);
  const [link, setLink] = useState(''),
    [notice, setNotice] = useState(''),
    [busy, setBusy] = useState(false);
  useEffect(() => {
    dialog.current.showModal();
    return () => previous.current?.focus();
  }, []);
  return <dialog ref={dialog} className="booking-modal" onCancel={close} onClick={e => {
    if (e.target === dialog.current) close();
  }}><button className="modal-close icon-button" onClick={close} aria-label="Close reservation"><X /></button><Sculpture kind="stay" className="booking-emblem" /><Eyebrow>{t("main.106", "LET’S MAKE TIME FOR YOU")}</Eyebrow><h2>{t("main.107", "Your next ")}<em>{t("main.108", "escape.")}</em></h2><p>{t("main.109", "Share your plans with our team. We’ll confirm availability and the best rate for your stay.")}</p><form onSubmit={async e => {
      e.preventDefault();
      const f = new FormData(e.currentTarget);
      if (f.get('out') <= f.get('in')) {
        e.currentTarget.elements.out.setCustomValidity('Check-out must be after check-in.');
        e.currentTarget.elements.out.reportValidity();
        return;
      }
      const text = `Hello Nature Nest! I'd like to enquire about a stay.\nName: ${f.get('name')}\nStay: ${f.get('room')}\nCheck-in: ${f.get('in')}\nCheck-out: ${f.get('out')}\nGuests: ${f.get('guests')}\nPlease confirm availability and pricing.`;
      setBusy(true);
      setNotice('');
      try {
        await submitEnquiry({
          type: 'reservation',
          name: f.get('name'),
          phone: f.get('phone'),
          room: f.get('room'),
          checkIn: f.get('in'),
          checkOut: f.get('out'),
          guests: Number(f.get('guests')),
          website: f.get('website')
        });
        setLink('https://wa.me/' + phone + '?text=' + encodeURIComponent(text));
        setNotice('Your enquiry has been sent. Our team will confirm availability.');
      } catch (error) {
        setNotice(error.message);
      } finally {
        setBusy(false);
      }
    }}><label>{t("main.110", "Your name")}<input name="name" required placeholder="Full name" /></label><label>{t("main.111", "Phone number")}<input name="phone" type="tel" required maxLength={50} placeholder="Your phone number" /></label><input className="form-trap" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" /><label>{t("main.112", "Your stay")}<select name="room" defaultValue={rooms.find(r => r.slug === initial.room)?.name || 'Help me choose'}><option>{t("main.113", "Help me choose")}</option>{rooms.map(r => <option key={r.slug}>{r.name}</option>)}</select></label><div className="form-row"><label>{t("main.114", "Check in")}<input type="date" name="in" min={new Date().toLocaleDateString('en-CA')} defaultValue={initial.checkIn} required /></label><label>{t("main.115", "Check out")}<input type="date" name="out" defaultValue={initial.checkOut} onChange={e => e.target.setCustomValidity('')} required /></label></div><label>{t("main.116", "Guests")}<select name="guests" defaultValue={initial.guests || 2}>{Array.from({
            length: 10
          }, (_, i) => <option key={i}>{i + 1}</option>)}</select></label><button className="button" disabled={busy}>{busy ? "Sending…" : "Send reservation enquiry"} <ArrowUpRight size={17} /></button>{notice && <p className="form-notice" role="status">{notice}</p>}{link && <div className="form-notice" role="status"><Check size={18} />{t("main.117", " You can also contact us directly.")}<a href={link} target="_blank" rel="noreferrer">{t("main.118", "Continue on WhatsApp →")}</a></div>}<small>{t("main.119", "This is an enquiry, not a confirmed reservation. No payment is collected.")}</small></form></dialog>;
}
await loadContent();
createRoot(document.getElementById('root')).render(<BrowserRouter><MotionProvider><App /></MotionProvider></BrowserRouter>);
