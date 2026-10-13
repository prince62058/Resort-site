import { t } from './content.js';
import { site } from './content.js';
import { useMemo, useState } from 'react';
import { Link } from './SiteLink.jsx';
import { ArrowDown, ArrowUpRight, ChevronLeft, ChevronRight, Coffee, Leaf, MapPin, Pause, Phone, Play, SlidersHorizontal, Sun, Wind } from 'lucide-react';
import PhotoSlideshow from './PhotoSlideshow.jsx';
import { Sculpture } from './Brand3D.jsx';
import { useMotion } from './Motion.jsx';
import './rooms-page.css';
const formatPrice = value => '₹' + value.toLocaleString('en-IN');
const categories = ['All stays', 'Cottages', 'Private villas'];
function RoomsHero() {
  const heroScenes = site.roomsHero,
    heroImages = heroScenes.map(s => s.image);
  const [index, setIndex] = useState(0);
  const [displayed, setDisplayed] = useState(0);
  const [paused, setPaused] = useState(false);
  const {
    enabled,
    setEnabled
  } = useMotion();
  const scene = heroScenes[displayed] || heroScenes[0];
  return <section className="stays-hero" aria-label="Discover our cottages and private villas">
    <PhotoSlideshow images={heroImages} alt="Cottages and private villas at The Nature Nest" index={index} onIndexChange={setIndex} onDisplayChange={setDisplayed} interval={6800} paused={paused} pauseOnHover={false} indicators={false} />
    <div className="stays-hero-shade" />
    <div className="stays-hero-inner">
      <div className="stays-eyebrow"><span />{t("RoomsPage.001", " STAY A LITTLE CLOSER TO NATURE")}</div>
      <h1>{t("RoomsPage.002", "Find your kind")}<br />{t("RoomsPage.003", "of ")}<em>{t("RoomsPage.004", "quiet.")}</em></h1>
      <p>{t("RoomsPage.005", "Cosy cottages. Private villas. A slower way to stay.")}<br />{' '}{t("RoomsPage.006", "Your little corner of Mhow is waiting.")}</p>
      <a href="#stay-collection" className="stays-browse">{t("RoomsPage.007", "Explore our stays ")}<ArrowDown size={18} /></a>
      <div className="stays-hero-bottom">
        <div className="stays-hero-location"><MapPin size={17} /><span>{t("RoomsPage.008", "MHOW, NEAR INDORE")}<small>{site.rooms.length}{t("RoomsPage.009", " stays. One beautiful escape.")}</small></span></div>
        <div className="stays-hero-scene">
          <Link to={scene.href}><small>0{displayed + 1} / {String(heroScenes.length).padStart(2, '0')} &nbsp; — &nbsp; {scene.note}</small><span>{scene.title} <ArrowUpRight size={19} /></span></Link>
          <div className="stays-hero-controls">
            <button aria-label="Previous stay inspiration" onClick={() => setIndex(i => (i + heroScenes.length - 1) % heroScenes.length)}><ChevronLeft size={20} /></button>
            <button aria-label={paused || !enabled ? 'Play stay inspiration' : 'Pause stay inspiration'} onClick={() => {
              if (!enabled) {
                setEnabled(true);
                setPaused(false);
              } else setPaused(value => !value);
            }}>{paused || !enabled ? <Play size={15} /> : <Pause size={15} />}</button>
            <button aria-label="Next stay inspiration" onClick={() => setIndex(i => (i + 1) % heroScenes.length)}><ChevronRight size={20} /></button>
          </div>
        </div>
      </div>
    </div>
  </section>;
}
function StayCard({
  room,
  position,
  book
}) {
  const [active, setActive] = useState(0);
  const [displayed, setDisplayed] = useState(0);
  const images = useMemo(() => room.images.slice(0, 4), [room]);
  const cottage = room.type === 'Cottages';
  return <article className="room-card stay-card" data-room={room.slug} data-price={room.price} aria-labelledby={`stay-${room.slug}`}>
    <div className="stay-card-media">
      <Link className="stay-card-photo" to={'/rooms/' + room.slug} aria-label={`Explore ${room.name}`}>
        <PhotoSlideshow images={images} alt={room.name} index={active} onIndexChange={setActive} onDisplayChange={setDisplayed} interval={6500 + position % 4 * 700} indicators={false} />
      </Link>
      <span className="stay-type"><Leaf size={13} />{cottage ? 'Nature-inspired cottage' : 'Your private villa'}</span>
      <span className="stay-photo-count" aria-label={`Photo ${displayed + 1} of ${images.length}`}>{String(displayed + 1).padStart(2, '0')} <i /> {String(images.length).padStart(2, '0')}</span>
      <div className="stay-photo-bottom">
        <div className="stay-photo-progress" aria-hidden="true">{images.map((src, i) => <span key={src} className={displayed === i ? 'active' : ''} />)}</div>
        <div className="stay-photo-arrows">
          <button aria-label={`Previous photo of ${room.name}`} onClick={() => setActive(i => (i + images.length - 1) % images.length)}><ChevronLeft size={20} /></button>
          <button aria-label={`Next photo of ${room.name}`} onClick={() => setActive(i => (i + 1) % images.length)}><ChevronRight size={20} /></button>
        </div>
      </div>
    </div>
    <div className="stay-card-copy">
      <div className="stay-card-category">{cottage ? 'THE COTTAGE COLLECTION' : 'THE VILLA COLLECTION'}<span>{String(position + 1).padStart(2, '0')}</span></div>
      <Link to={'/rooms/' + room.slug}><h3 id={`stay-${room.slug}`}>{room.name}</h3></Link>
      <p>{room.summary}</p>
      <div className="stay-features">
        <span><Sun size={16} />{cottage ? 'Veranda or balcony' : 'Private sit-out'}</span>
        <span><Leaf size={16} />{t("RoomsPage.010", "Green surroundings")}</span>
        <span>{cottage ? <Wind size={16} /> : <Coffee size={16} />} {cottage ? 'Air conditioning' : 'Resort dining'}</span>
      </div>
      <div className="stay-card-bottom">
        <div className="stay-rate"><small>{t("RoomsPage.011", "STAYS FROM")}</small><span>{formatPrice(room.price)} <small>{t("RoomsPage.012", "/ night")}</small></span></div>
        <div className="stay-card-actions">
          <Link to={'/rooms/' + room.slug}>{t("RoomsPage.013", "View stay ")}<ArrowUpRight size={17} /></Link>
          <button onClick={() => book({
            room: room.slug
          })} aria-label={`Enquire about ${room.name}`}>{t("RoomsPage.014", "Enquire ")}<ArrowUpRight size={17} /></button>
        </div>
      </div>
    </div>
  </article>;
}
export default function RoomsPage({
  book,
  search
}) {
  const stays = site.rooms;
  const [filter, setFilter] = useState('All stays');
  const [sort, setSort] = useState('collection');
  const filtered = useMemo(() => {
    const result = stays.filter(room => filter === 'All stays' || room.type === filter);
    if (sort === 'price-low') result.sort((a, b) => a.price - b.price);
    if (sort === 'price-high') result.sort((a, b) => b.price - a.price);
    return result;
  }, [filter, sort]);
  return <div className="stays-page">
    <RoomsHero />
    <div className="stays-search-wrap">{search}<div className="stays-search-note"><Leaf size={14} />{t("RoomsPage.015", " A few dates. A little daydreaming. Let’s find your stay.")}</div></div>
    <section className="stays-collection" id="stay-collection" aria-labelledby="collection-heading">
      <div className="stays-collection-intro">
        <div><div className="stays-eyebrow"><span />{t("RoomsPage.016", " SPACES TO CALL YOUR OWN")}</div><h2 id="collection-heading">{t("RoomsPage.017", "Check in.")}<br /><em>{t("RoomsPage.018", "Feel a world away.")}</em></h2></div>
        <div className="stays-collection-note"><Sculpture kind="stay" /><p>{stays.filter(r => r.type === 'Cottages').length}{t("RoomsPage.019", " cosy cottages. ")}{stays.filter(r => r.type === 'Private villas').length}{t("RoomsPage.020", " private villas.")}<br />{' '}{t("RoomsPage.021", "Each with its own character, all with that")}<br className="stays-desktop-break" />{t("RoomsPage.022", " unmistakable Nature Nest feeling.")}</p></div>
      </div>
      <div className="stays-toolbar">
        <div className="stays-filters" role="group" aria-label="Filter accommodation">
          {categories.map(category => <button key={category} aria-label={category} aria-pressed={filter === category} onClick={() => setFilter(category)}>{category}<span aria-hidden="true">{category === 'All stays' ? stays.length : stays.filter(room => room.type === category).length}</span></button>)}
        </div>
        <div className="stays-toolbar-tools"><label className="stays-sort"><SlidersHorizontal size={16} /><span className="stays-sr-only">{t("RoomsPage.023", "Sort stays")}</span><select value={sort} onChange={event => setSort(event.target.value)}><option value="collection">{t("RoomsPage.024", "Collection order")}</option><option value="price-low">{t("RoomsPage.025", "Price: low to high")}</option><option value="price-high">{t("RoomsPage.026", "Price: high to low")}</option></select></label><div className="stays-motion-dock" /></div>
      </div>
      <div className="stays-results"><span role="status" aria-live="polite">{String(filtered.length).padStart(2, '0')} {filter === 'All stays' ? 'beautiful places to unwind' : filter.toLowerCase() + ' to make your own'}</span><span>{t("RoomsPage.027", "YOUR STAY, YOUR PACE")}</span></div>
      <div className="room-grid stays-grid">{filtered.map(room => <StayCard key={room.slug} room={room} position={stays.indexOf(room)} book={book} />)}</div>
      <p className="stays-rate-note">{t("RoomsPage.028", "Prices shown are starting nightly rates. Our team will confirm the final rate and availability for your dates.")}</p>
    </section>
    <section className="stays-comforts" aria-labelledby="comforts-heading">
      <div className="stays-eyebrow"><span />{t("RoomsPage.029", " THE LITTLE THINGS, BEAUTIFULLY DONE")}</div>
      <h2 id="comforts-heading">{t("RoomsPage.030", "More than a room.")}<br className="stays-mobile-break" /> <em>{t("RoomsPage.031", "A feeling.")}</em></h2>
      <div className="stays-comfort-grid">{[['leaf', 'Nature at your door', 'Green views and a gentler pace.'], ['stay', 'Your own little space', 'Cottages and villas to settle into.'], ['pool', 'Poolside pauses', 'Make room for doing nothing.'], ['dining', 'Time around the table', 'Good food, better company.']].map(([kind, title, text], i) => <div key={kind}><Sculpture kind={kind} delay={-i * 2} /><h3>{title}</h3><p>{text}</p></div>)}</div>
    </section>
    <section className="stays-help" aria-labelledby="stays-help-heading">
      <div className="stays-help-photo"><PhotoSlideshow images={['enhanced/story/story-belong-v1.webp', 'enhanced/story/story-unwind-v1.webp', 'enhanced/story/story-arrival-v1.webp']} alt="A quieter escape at Nature Nest" interval={7400} /><span>{t("RoomsPage.032", "Good days start with a little escape.")}</span></div>
      <div className="stays-help-copy"><div className="stays-eyebrow"><span />{t("RoomsPage.033", " A LITTLE HELP FROM YOUR HOSTS")}</div><h2 id="stays-help-heading">{t("RoomsPage.034", "Your perfect stay?")}<br /><em>{t("RoomsPage.035", "Let’s find it together.")}</em></h2><p>{t("RoomsPage.036", "A quiet weekend for two or time with your favourite people. Tell us what you have in mind—we’ll help you choose your corner of the nest.")}</p><button className="button cream" onClick={() => book({})}>{t("RoomsPage.037", "Help me choose ")}<ArrowUpRight size={18} /></button><a href={'tel:+' + site.settings.phoneDigits}><Phone size={16} /> {site.settings.phoneInternational}</a></div>
    </section>
  </div>;
}
