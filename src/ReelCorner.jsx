import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Instagram, Play, X, ChevronLeft, ChevronRight, ArrowUpRight, Maximize2 } from 'lucide-react';
import { site } from './content.js';
import { useMotion } from './Motion.jsx';
import { instagramReelUrl, directVideoUrl } from '../shared/reels.js';
import './reel-corner.css';

const asset = path => path ? '/assets/' + path.split('/').map(encodeURIComponent).join('/') : '';
const minimizedKey = 'nest-reels-minimized';

function ReelCover({ reel, animate }) {
  const video = useRef(null);
  const [failed, setFailed] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pageVisible, setPageVisible] = useState(!document.hidden);
  const source = directVideoUrl(reel.videoUrl || '');
  useEffect(() => {
    const change = () => setPageVisible(!document.hidden);
    document.addEventListener('visibilitychange', change);
    return () => document.removeEventListener('visibilitychange', change);
  }, []);
  useEffect(() => {
    if (!video.current) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    observer.observe(video.current);
    return () => observer.disconnect();
  }, [source, failed]);
  useEffect(() => {
    const player = video.current;
    if (!player) return;
    if (animate && visible && pageVisible) player.play().catch(() => {});
    else player.pause();
  }, [animate, visible, pageVisible, source, failed]);
  return <>
    {reel.poster && <img src={asset(reel.poster)} alt="" loading="lazy" onError={e => { e.currentTarget.hidden = true; }} />}
    {source && !failed && <video ref={video} src={source} poster={asset(reel.poster)} muted loop playsInline preload="none" aria-hidden="true" onError={() => setFailed(true)} />}
  </>;
}

function ReelPlayer({ items, index, select, close }) {
  const dialog = useRef(null);
  const [videoFailed, setVideoFailed] = useState(false);
  const [embedWait, setEmbedWait] = useState(false);
  const reel = items[index];
  const url = instagramReelUrl(reel.url);
  const videoUrl = directVideoUrl(reel.videoUrl || '');
  useEffect(() => {
    const element = dialog.current;
    const focused = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    element.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      element.close();
      document.body.style.overflow = previousOverflow;
      if (focused?.isConnected) focused.focus({ preventScroll: true });
    };
  }, []);
  useEffect(() => {
    setVideoFailed(false);
    setEmbedWait(false);
    const timer = setTimeout(() => setEmbedWait(true), 10000);
    return () => clearTimeout(timer);
  }, [reel.id]);
  return <dialog ref={dialog} className="reel-dialog" aria-labelledby="reel-player-title" onCancel={e => { e.preventDefault(); close(); }} onClick={e => { if (e.target === e.currentTarget) close(); }}>
    <div className="reel-player-shell">
      <div className="reel-player-heading"><div><span><Instagram size={13} /> FROM THE NEST</span><h2 id="reel-player-title">{reel.title}</h2></div><button className="reel-icon-button" autoFocus onClick={close} aria-label="Close reel player"><X size={20} /></button></div>
      <div className="reel-player-stage" key={reel.id}>
        {videoUrl && !videoFailed ? <video src={videoUrl} poster={asset(reel.poster)} controls autoPlay muted playsInline onError={() => setVideoFailed(true)} /> : <iframe title={'Instagram reel: ' + reel.title} src={url + 'embed/'} allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />}
      </div>
      <div className="reel-player-bottom"><div className="reel-player-paging"><button className="reel-icon-button" disabled={items.length < 2} aria-label="Previous reel" onClick={() => select((index + items.length - 1) % items.length)}><ChevronLeft size={19} /></button><span>{String(index + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}</span><button className="reel-icon-button" disabled={items.length < 2} aria-label="Next reel" onClick={() => select((index + 1) % items.length)}><ChevronRight size={19} /></button></div><a href={url} target="_blank" rel="noopener noreferrer">Open Instagram <ArrowUpRight size={16} /></a></div>
      {(!videoUrl || videoFailed) && <p className="reel-player-note" role="status">{embedWait ? 'If the reel is unavailable here, use Open Instagram to watch it.' : 'Tap play inside the reel. Instagram may ask you to open its app or sign in.'}</p>}
    </div>
  </dialog>;
}

export default function ReelCorner({ hidden = false }) {
  const { enabled: motion } = useMotion();
  const { pathname } = useLocation();
  const [minimized, setMinimized] = useState(() => {
    try { return sessionStorage.getItem(minimizedKey) === '1'; } catch { return false; }
  });
  const [active, setActive] = useState(null);
  const [offset, setOffset] = useState(0);
  const [footerVisible, setFooterVisible] = useState(false);
  const close = useCallback(() => setActive(null), []);
  useEffect(close, [pathname, close]);
  useEffect(() => {
    const footer = document.querySelector('.nest-footer');
    if (!footer) return;
    const observer = new IntersectionObserver(([entry]) => setFooterVisible(entry.isIntersecting));
    observer.observe(footer);
    return () => observer.disconnect();
  }, [pathname]);
  const config = site.reels;
  const items = (config?.items || []).filter(item => item.enabled && instagramReelUrl(item.url));
  if (!config?.enabled || !items.length || hidden || footerVisible) return null;
  function minimize(value) {
    setMinimized(value);
    try { sessionStorage.setItem(minimizedKey, value ? '1' : '0'); } catch { /* Storage can be unavailable in private browsing. */ }
  }
  return <>
    <aside className={'reel-dock' + (minimized ? ' is-minimized' : '')} aria-label="Resort reels">
      {minimized ? <button className="reel-reopen" onClick={() => minimize(false)}><Instagram size={17} /><span>Watch our reels</span><span className="reel-count">{items.length}</span></button> : <>
        <div className="reel-dock-heading"><span><Instagram size={13} /> {config.label}</span><button className="reel-icon-button" aria-label="Minimize reels" onClick={() => minimize(true)}><X size={14} /></button></div>
        <div className="reel-cards">{items.slice(offset, offset + 2).map(reel => <button className="reel-preview" key={reel.id + reel.videoUrl} onClick={() => setActive(items.indexOf(reel))} aria-label={'Watch reel: ' + reel.title} aria-haspopup="dialog">
          <ReelCover reel={reel} animate={motion && active === null} />
          <span className="reel-preview-shade" /><span className="reel-preview-expand"><Maximize2 size={13} /></span><span className="reel-preview-play"><Play size={17} fill="currentColor" /></span><span className="reel-preview-title">{reel.title}</span>
        </button>)}</div>
        {items.length > 2 && <div className="reel-dock-paging"><button className="reel-icon-button" aria-label="Previous reel previews" disabled={offset === 0} onClick={() => setOffset(Math.max(0, offset - 2))}><ChevronLeft size={16} /></button><span>{offset + 1}–{Math.min(offset + 2, items.length)} of {items.length}</span><button className="reel-icon-button" aria-label="More reel previews" disabled={offset + 2 >= items.length} onClick={() => setOffset(offset + 2)}><ChevronRight size={16} /></button></div>}
      </>}
    </aside>
    {active !== null && items[active] && <ReelPlayer items={items} index={active} select={setActive} close={close} />}
  </>;
}
