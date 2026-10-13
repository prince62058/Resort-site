import {useMemo, useState} from 'react';
import {Link} from 'react-router-dom';
import {ArrowDown, ArrowUpRight, ChevronLeft, ChevronRight, Coffee, Leaf, MapPin, Pause, Phone, Play, SlidersHorizontal, Sun, Wind} from 'lucide-react';
import data from './data.json';
import PhotoSlideshow from './PhotoSlideshow.jsx';
import {Sculpture} from './Brand3D.jsx';
import {useMotion} from './Motion.jsx';
import './rooms-page.css';

const order = ['luxury-left-cottage', 'luxury-middle-cottage', 'luxury-right-cottage', 'private-villa-1', 'villa-9', 'villa-16'];
const stays = [...data.rooms].sort((a, b) => {
  const rank = room => order.includes(room.slug) ? order.indexOf(room.slug) : order.length;
  return rank(a) - rank(b);
});
const formatPrice = value => '₹' + value.toLocaleString('en-IN');
const categories = ['All stays', 'Cottages', 'Private villas'];
const summaries = {
  'luxury-left-cottage': 'A cosy retreat, green views and a veranda made for your morning coffee.',
  'luxury-middle-cottage': 'Earthy interiors, everyday comforts and a little more time to unwind.',
  'luxury-right-cottage': 'Your quiet corner of the resort, with nature just beyond the door.',
  'private-villa-1': 'Thoughtful interiors and your own sit-out. Settle into a slower rhythm.',
  'villa-9': 'Space to reconnect, a private sit-out and the simple pleasure of being together.',
  'villa-16': 'Elegant interiors and peaceful green surroundings for an unhurried escape.',
  'private-villa-6': 'An intimate retreat with a private sit-out and nature all around.',
  'private-villa-10': 'A peaceful setting, warm interiors and a little space to call your own.',
  'villa-4': 'Morning tea outside. Cosy evenings in. A stay at your own pace.',
  'villa-15': 'Make yourself at home in a quiet villa surrounded by the resort’s greenery.',
  'villa-3': 'Leave the everyday behind and enjoy a little comfort, close to nature.',
  'villa-2': 'A private place to pause, put your feet up and enjoy your time together.',
};
const heroScenes = [
  {image: 'enhanced/cottages-regenerated-v1.webp', title: 'The cottage collection', note: 'Cosy spaces. Green mornings.', href: '/rooms/luxury-left-cottage'},
  {image: 'places/farm-1-new-pdf-page-0003.jpg', title: 'Your own private retreat', note: 'A little space, entirely yours.', href: '/rooms/private-villa-1'},
  {image: 'cottage/1l2a1491-1.JPG', title: 'Room to make memories', note: 'Slow down. Stay a little longer.', href: '/rooms/villa-9'},
];
const heroImages = heroScenes.map(scene => scene.image);

function RoomsHero() {
  const [index, setIndex] = useState(0);
  const [displayed, setDisplayed] = useState(0);
  const [paused, setPaused] = useState(false);
  const {enabled, setEnabled} = useMotion();
  const scene = heroScenes[displayed];
  return <section className="stays-hero" aria-label="Discover our cottages and private villas">
    <PhotoSlideshow images={heroImages} alt="Cottages and private villas at The Nature Nest" index={index} onIndexChange={setIndex} onDisplayChange={setDisplayed} interval={6800} paused={paused} pauseOnHover={false} indicators={false}/>
    <div className="stays-hero-shade"/>
    <div className="stays-hero-inner">
      <div className="stays-eyebrow"><span/> STAY A LITTLE CLOSER TO NATURE</div>
      <h1>Find your kind<br/>of <em>quiet.</em></h1>
      <p>Cosy cottages. Private villas. A slower way to stay.<br/>{' '}Your little corner of Mhow is waiting.</p>
      <a href="#stay-collection" className="stays-browse">Explore our stays <ArrowDown size={18}/></a>
      <div className="stays-hero-bottom">
        <div className="stays-hero-location"><MapPin size={17}/><span>MHOW, NEAR INDORE<small>12 stays. One beautiful escape.</small></span></div>
        <div className="stays-hero-scene">
          <Link to={scene.href}><small>0{displayed + 1} / 03 &nbsp; — &nbsp; {scene.note}</small><span>{scene.title} <ArrowUpRight size={19}/></span></Link>
          <div className="stays-hero-controls">
            <button aria-label="Previous stay inspiration" onClick={() => setIndex(i => (i + 2) % 3)}><ChevronLeft size={20}/></button>
            <button aria-label={paused || !enabled ? 'Play stay inspiration' : 'Pause stay inspiration'} onClick={() => {if(!enabled){setEnabled(true);setPaused(false);}else setPaused(value=>!value);}}>{paused || !enabled ? <Play size={15}/> : <Pause size={15}/>}</button>
            <button aria-label="Next stay inspiration" onClick={() => setIndex(i => (i + 1) % 3)}><ChevronRight size={20}/></button>
          </div>
        </div>
      </div>
    </div>
  </section>;
}

function StayCard({room, position, book}) {
  const [active, setActive] = useState(0);
  const [displayed, setDisplayed] = useState(0);
  const images = useMemo(() => room.images.slice(0, 4), [room]);
  const cottage = room.type === 'Cottages';
  return <article className="room-card stay-card" data-room={room.slug} data-price={room.price} aria-labelledby={`stay-${room.slug}`}>
    <div className="stay-card-media">
      <Link className="stay-card-photo" to={'/rooms/' + room.slug} aria-label={`Explore ${room.name}`}>
        <PhotoSlideshow images={images} alt={room.name} index={active} onIndexChange={setActive} onDisplayChange={setDisplayed} interval={6500 + position % 4 * 700} indicators={false}/>
      </Link>
      <span className="stay-type"><Leaf size={13}/>{cottage ? 'Nature-inspired cottage' : 'Your private villa'}</span>
      <span className="stay-photo-count" aria-label={`Photo ${displayed + 1} of ${images.length}`}>{String(displayed + 1).padStart(2, '0')} <i/> {String(images.length).padStart(2, '0')}</span>
      <div className="stay-photo-bottom">
        <div className="stay-photo-progress" aria-hidden="true">{images.map((src, i) => <span key={src} className={displayed === i ? 'active' : ''}/>)}</div>
        <div className="stay-photo-arrows">
          <button aria-label={`Previous photo of ${room.name}`} onClick={() => setActive(i => (i + images.length - 1) % images.length)}><ChevronLeft size={20}/></button>
          <button aria-label={`Next photo of ${room.name}`} onClick={() => setActive(i => (i + 1) % images.length)}><ChevronRight size={20}/></button>
        </div>
      </div>
    </div>
    <div className="stay-card-copy">
      <div className="stay-card-category">{cottage ? 'THE COTTAGE COLLECTION' : 'THE VILLA COLLECTION'}<span>{String(position + 1).padStart(2, '0')}</span></div>
      <Link to={'/rooms/' + room.slug}><h3 id={`stay-${room.slug}`}>{room.name}</h3></Link>
      <p>{summaries[room.slug]}</p>
      <div className="stay-features">
        <span><Sun size={16}/>{cottage ? 'Veranda or balcony' : 'Private sit-out'}</span>
        <span><Leaf size={16}/>Green surroundings</span>
        <span>{cottage ? <Wind size={16}/> : <Coffee size={16}/>} {cottage ? 'Air conditioning' : 'Resort dining'}</span>
      </div>
      <div className="stay-card-bottom">
        <div className="stay-rate"><small>STAYS FROM</small><span>{formatPrice(room.price)} <small>/ night</small></span></div>
        <div className="stay-card-actions">
          <Link to={'/rooms/' + room.slug}>View stay <ArrowUpRight size={17}/></Link>
          <button onClick={() => book({room: room.slug})} aria-label={`Enquire about ${room.name}`}>Enquire <ArrowUpRight size={17}/></button>
        </div>
      </div>
    </div>
  </article>;
}

export default function RoomsPage({book, search}) {
  const [filter, setFilter] = useState('All stays');
  const [sort, setSort] = useState('collection');
  const filtered = useMemo(() => {
    const result = stays.filter(room => filter === 'All stays' || room.type === filter);
    if (sort === 'price-low') result.sort((a, b) => a.price - b.price);
    if (sort === 'price-high') result.sort((a, b) => b.price - a.price);
    return result;
  }, [filter, sort]);
  return <div className="stays-page">
    <RoomsHero/>
    <div className="stays-search-wrap">{search}<div className="stays-search-note"><Leaf size={14}/> A few dates. A little daydreaming. Let’s find your stay.</div></div>
    <section className="stays-collection" id="stay-collection" aria-labelledby="collection-heading">
      <div className="stays-collection-intro">
        <div><div className="stays-eyebrow"><span/> SPACES TO CALL YOUR OWN</div><h2 id="collection-heading">Check in.<br/><em>Feel a world away.</em></h2></div>
        <div className="stays-collection-note"><Sculpture kind="stay"/><p>Three cosy cottages. Nine private villas.<br/>{' '}Each with its own character, all with that<br className="stays-desktop-break"/> unmistakable Nature Nest feeling.</p></div>
      </div>
      <div className="stays-toolbar">
        <div className="stays-filters" role="group" aria-label="Filter accommodation">
          {categories.map(category => <button key={category} aria-label={category} aria-pressed={filter === category} onClick={() => setFilter(category)}>{category}<span aria-hidden="true">{category === 'All stays' ? stays.length : stays.filter(room => room.type === category).length}</span></button>)}
        </div>
        <div className="stays-toolbar-tools"><label className="stays-sort"><SlidersHorizontal size={16}/><span className="stays-sr-only">Sort stays</span><select value={sort} onChange={event => setSort(event.target.value)}><option value="collection">Collection order</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option></select></label><div className="stays-motion-dock"/></div>
      </div>
      <div className="stays-results"><span role="status" aria-live="polite">{String(filtered.length).padStart(2, '0')} {filter === 'All stays' ? 'beautiful places to unwind' : filter.toLowerCase() + ' to make your own'}</span><span>YOUR STAY, YOUR PACE</span></div>
      <div className="room-grid stays-grid">{filtered.map(room => <StayCard key={room.slug} room={room} position={stays.indexOf(room)} book={book}/>)}</div>
      <p className="stays-rate-note">Prices shown are starting nightly rates. Our team will confirm the final rate and availability for your dates.</p>
    </section>
    <section className="stays-comforts" aria-labelledby="comforts-heading">
      <div className="stays-eyebrow"><span/> THE LITTLE THINGS, BEAUTIFULLY DONE</div>
      <h2 id="comforts-heading">More than a room.<br className="stays-mobile-break"/> <em>A feeling.</em></h2>
      <div className="stays-comfort-grid">{[
        ['leaf', 'Nature at your door', 'Green views and a gentler pace.'],
        ['stay', 'Your own little space', 'Cottages and villas to settle into.'],
        ['pool', 'Poolside pauses', 'Make room for doing nothing.'],
        ['dining', 'Time around the table', 'Good food, better company.'],
      ].map(([kind, title, text], i) => <div key={kind}><Sculpture kind={kind} delay={-i * 2}/><h3>{title}</h3><p>{text}</p></div>)}</div>
    </section>
    <section className="stays-help" aria-labelledby="stays-help-heading">
      <div className="stays-help-photo"><PhotoSlideshow images={['enhanced/story/story-belong-v1.webp', 'enhanced/story/story-unwind-v1.webp', 'enhanced/story/story-arrival-v1.webp']} alt="A quieter escape at Nature Nest" interval={7400}/><span>Good days start with a little escape.</span></div>
      <div className="stays-help-copy"><div className="stays-eyebrow"><span/> A LITTLE HELP FROM YOUR HOSTS</div><h2 id="stays-help-heading">Your perfect stay?<br/><em>Let’s find it together.</em></h2><p>A quiet weekend for two or time with your favourite people. Tell us what you have in mind—we’ll help you choose your corner of the nest.</p><button className="button cream" onClick={() => book({})}>Help me choose <ArrowUpRight size={18}/></button><a href="tel:+917777878822"><Phone size={16}/> +91 77778 78822</a></div>
    </section>
  </div>;
}
