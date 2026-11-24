import {useEffect, useMemo, useRef, useState} from 'react';
import imageSources from './imageSources.json';
import {useMotion} from './Motion.jsx';
import './slideshow.css';

export function HomeSlideshow({className = '', ...props}) {
  return <PhotoSlideshow interval={5200} pauseOnHover={false} {...props} className={`home-slideshow ${className}`}/>;
}

export default function PhotoSlideshow({images, alt, className = '', interval = 6800, index, onIndexChange, onDisplayChange, paused = false, indicators = true, pauseOnHover = true}) {
  const sources = useMemo(() => [...new Set(images.filter(Boolean).map(src => imageSources[src] || src))], [images.join('|')]);
  // Reset photo state when the component is reused for a different room or category.
  return <PhotoSequence key={sources.join('|')} {...{sources, alt, className, interval, index, onIndexChange, onDisplayChange, paused, indicators, pauseOnHover}}/>;
}

function PhotoSequence({sources, alt, className, interval, index, onIndexChange, onDisplayChange, paused, indicators, pauseOnHover}) {
  const {enabled} = useMotion();
  const [internalIndex, setInternalIndex] = useState(0);
  const [loaded, setLoaded] = useState(new Set());
  const [requested, setRequested] = useState(new Set([0]));
  const [displayed, setDisplayed] = useState(0);
  const [inView, setInView] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const [visible, setVisible] = useState(!document.hidden);
  const frame = useRef(null);
  const active = (index ?? internalIndex) % Math.max(sources.length, 1);
  const next = (active + 1) % Math.max(sources.length, 1);
  const running = enabled && inView && visible && !interacting && !paused && sources.length > 1 && loaded.has(next);

  useEffect(() => {
    const element = frame.current;
    const interactionRoot = element.closest('a, .detail-image, .page-hero, .moment-section, .story-media, .closing-banner') || element;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting && entry.intersectionRatio >= 0.15), {threshold: [0, 0.15]});
    observer.observe(element);
    let hovered = false, focused = false;
    const update = () => setInteracting((pauseOnHover && hovered) || focused);
    const enter = () => {hovered = true; update();};
    const leave = () => {hovered = false; update();};
    const focus = () => {focused = true; update();};
    const blur = event => {if (!interactionRoot.contains(event.relatedTarget)) {focused = false; update();}};
    const visibility = () => setVisible(!document.hidden);
    interactionRoot.addEventListener('mouseenter', enter);
    interactionRoot.addEventListener('mouseleave', leave);
    interactionRoot.addEventListener('focusin', focus);
    interactionRoot.addEventListener('focusout', blur);
    document.addEventListener('visibilitychange', visibility);
    return () => {
      observer.disconnect();
      interactionRoot.removeEventListener('mouseenter', enter);
      interactionRoot.removeEventListener('mouseleave', leave);
      interactionRoot.removeEventListener('focusin', focus);
      interactionRoot.removeEventListener('focusout', blur);
      document.removeEventListener('visibilitychange', visibility);
    };
  }, [pauseOnHover]);

  useEffect(() => {
    setRequested(previous => {
      if (previous.has(active) && (!inView || previous.has(next))) return previous;
      return new Set([...previous, active, ...(inView ? [next] : [])]);
    });
  }, [active, next, inView]);

  useEffect(() => {if (loaded.has(active)) setDisplayed(active);}, [active, loaded]);
  useEffect(() => {onDisplayChange?.(displayed);}, [displayed, onDisplayChange]);

  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(() => {
      if (onIndexChange) onIndexChange(next);
      else setInternalIndex(next);
    }, interval);
    return () => window.clearTimeout(timer);
  }, [active, next, running, interval, onIndexChange]);

  return <div ref={frame} className={`photo-slideshow ${className}`} data-slide={displayed} data-playing={running} style={{'--photo-duration': `${interval + 1600}ms`}}>
    {sources.map((src, i) => requested.has(i) && <img key={src} className={`photo-frame ${displayed === i ? 'is-visible' : ''}`} src={'/assets/' + src} alt={displayed === i ? `${alt} — photo ${i + 1}` : ''} aria-hidden={displayed !== i} loading={inView ? 'eager' : 'lazy'} decoding="async" draggable="false" onLoad={() => setLoaded(previous => new Set([...previous, i]))}/>)}
    {indicators && sources.length > 1 && <div className="photo-indicators" aria-hidden="true">{sources.slice(0, 6).map((src, i) => <span key={src} className={displayed % Math.min(sources.length, 6) === i ? 'is-current' : ''}/>)}</div>}
  </div>;
}
