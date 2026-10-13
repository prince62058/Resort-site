import {useEffect, useRef, useState} from 'react';
import {Link} from 'react-router-dom';
import {ArrowDown, ArrowUpRight, ChevronLeft, ChevronRight, Pause, Play} from 'lucide-react';
import './hero.css';
import {useMotion} from './Motion.jsx';
import imageSources from './imageSources.json';

const INTERVAL = 6000;
const slides = [
  {
    image: 'enhanced/story/story-belong-v1.webp',
    alt: 'Warmly illuminated garden walkway at The Nature Nest in the evening',
    eyebrow: 'THE NATURE NEST · MHOW, INDORE',
    title: 'Where life',
    accent: 'slows down.',
    description: 'A little wilderness. A little indulgence. A beautiful place to come back to yourself.',
    caption: 'Evenings you wish would last a little longer.',
  },
  {
    image: 'enhanced/story/story-arrival-v1.webp',
    alt: 'Lush garden path leading to The Nature Nest resort',
    eyebrow: 'PRIVATE VILLAS · PEACEFUL COTTAGES',
    title: 'A little luxury.',
    accent: 'A lot of nature.',
    description: 'Wake up to green views, quiet corners, and a day that is entirely your own.',
    caption: 'A quieter world, just outside the city.',
  },
  {
    image: 'banners/banner-pool-1.jpg',
    alt: 'Blue swimming pool surrounded by trees at the resort',
    eyebrow: 'SWITCH OFF · SLOW DOWN · SETTLE IN',
    title: 'Slow mornings.',
    accent: 'Lasting memories.',
    description: 'A dip in the pool. Time with your people. The simple pleasure of being here.',
    caption: 'A little sunshine. A lot of doing nothing.',
  },
];

export default function Hero({book}) {
  const {enabled, setEnabled} = useMotion();
  const [active, setActive] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(!document.hidden);
  const [inView, setInView] = useState(true);
  const heroRef = useRef(null);
  const gesture = useRef(null);
  const running = enabled && autoplay && !focused && visible && inView;
  const current = slides[active];
  const go = (offset) => setActive(index => (index + offset + slides.length) % slides.length);

  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(() => setActive(index => (index + 1) % slides.length), INTERVAL);
    return () => window.clearTimeout(timer);
  }, [active, running]);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {threshold: 0.2});
    observer.observe(heroRef.current);
    const updateVisibility = () => setVisible(!document.hidden);
    document.addEventListener('visibilitychange', updateVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', updateVisibility);
    };
  }, []);

  return (
    <section
      ref={heroRef}
      className="resort-carousel"
      aria-label="Welcome to The Nature Nest"
      aria-roledescription="carousel"
      tabIndex={0}
      data-slide={active}
      data-playing={running}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={event => {if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);}}
      onKeyDown={event => {
        if (event.key === 'ArrowRight') {event.preventDefault(); go(1);}
        if (event.key === 'ArrowLeft') {event.preventDefault(); go(-1);}
      }}
      onPointerDown={event => {
        if (event.pointerType === 'touch' && !event.target.closest('a, button')) {
          gesture.current = {x: event.clientX, y: event.clientY};
        }
      }}
      onPointerCancel={() => {gesture.current = null;}}
      onPointerUp={event => {
        if (!gesture.current) return;
        const dx = event.clientX - gesture.current.x;
        const dy = event.clientY - gesture.current.y;
        gesture.current = null;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) go(dx < 0 ? 1 : -1);
      }}
    >
      <div className="carousel-photographs" aria-hidden="true">
        {slides.map((slide, index) => (
          <div className={`carousel-photograph ${index === active ? 'is-active' : ''}`} key={slide.image}>
            <img src={'/assets/' + (imageSources[slide.image] || slide.image)} alt="" fetchPriority={index === 0 ? 'high' : 'auto'} draggable="false"/>
          </div>
        ))}
      </div>
      <div className="carousel-shade"/>
      <div className="carousel-content" key={active} role="group" aria-roledescription="slide" aria-label={`${active + 1} of ${slides.length}: ${current.alt}`}>
        <div className="carousel-eyebrow"><span/>{current.eyebrow}<span/></div>
        <h1>{current.title}<br/><em>{current.accent}</em></h1>
        <p>{current.description}</p>
      </div>
      <div className="carousel-actions">
        <button className="button cream" onClick={() => book({})}>Find your escape <ArrowUpRight size={19}/></button>
        <Link to="/galleries" className="carousel-gallery">Explore the resort <ArrowUpRight size={18}/></Link>
      </div>
      <button className="carousel-arrow carousel-prev" aria-label="Previous resort photo" onClick={() => go(-1)}><ChevronLeft size={27}/></button>
      <button className="carousel-arrow carousel-next" aria-label="Next resort photo" onClick={() => go(1)}><ChevronRight size={27}/></button>
      <div className="carousel-bottom">
        <a href="#welcome" className="carousel-scroll">SCROLL TO UNWIND <ArrowDown size={16}/></a>
        <div className="carousel-pagination" aria-label="Choose resort photo">
          {slides.map((slide, index) => (
            <button key={slide.image} aria-label={`Show resort photo ${index + 1}`} aria-current={active === index ? 'true' : undefined} onClick={() => setActive(index)}>
              <span className="carousel-page-number">0{index + 1}</span>
              <span className="carousel-page-track"><span key={`${active}-${running}`} className={active === index ? (running ? 'is-timing' : 'is-selected') : ''}/></span>
            </button>
          ))}
        </div>
        <button className="carousel-playback" aria-label={autoplay && enabled ? 'Pause slideshow' : 'Play slideshow'} onClick={() => {if(!enabled){setEnabled(true);setAutoplay(true);}else setAutoplay(value => !value);}}>
          {autoplay && enabled ? <Pause size={15}/> : <Play size={15}/>}<span>{autoplay && enabled ? 'PAUSE' : 'PLAY'}</span>
        </button>
      </div>
    </section>
  );
}
