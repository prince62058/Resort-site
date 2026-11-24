import {useEffect, useRef, useState} from 'react';
import {ChevronLeft, ChevronRight, Pause, Play, X} from 'lucide-react';
import imageSources from './imageSources.json';
import {useMotion} from './Motion.jsx';

export default function GalleryViewer({photos, initial, close}) {
  const [index, setIndex] = useState(initial);
  const [playing, setPlaying] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(!document.hidden);
  const {enabled, setEnabled} = useMotion();
  const viewer = useRef(null);
  const touchStart = useRef(null);
  const previousFocus = useRef(document.activeElement);
  const navigate = offset => {setPlaying(false); setIndex(i => (i + offset + photos.length) % photos.length);};
  useEffect(() => {
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    viewer.current.querySelector('button').focus();
    const visibility = () => setVisible(!document.hidden);
    document.addEventListener('visibilitychange', visibility);
    return () => {document.body.style.overflow = overflow; previousFocus.current?.focus(); document.removeEventListener('visibilitychange', visibility);};
  }, []);
  useEffect(() => {
    if (!enabled || !playing || hovered || !visible || photos.length < 2) return;
    const timer = setTimeout(() => setIndex(i => (i + 1) % photos.length), 6500);
    return () => clearTimeout(timer);
  }, [index, enabled, playing, hovered, visible, photos.length]);
  const photo = photos[index];
  return <div ref={viewer} className="lightbox" role="dialog" aria-modal="true" aria-label="Photo viewer" data-slide={index} onClick={event=>{if(event.target===event.currentTarget)close();}} onKeyDown={event => {
    if (event.key === 'Escape') close();
    if (event.key === 'ArrowRight') {event.preventDefault(); navigate(1);}
    if (event.key === 'ArrowLeft') {event.preventDefault(); navigate(-1);}
    if (event.key === 'Tab') {
      const buttons = viewer.current.querySelectorAll('button');
      if (event.shiftKey && document.activeElement === buttons[0]) {event.preventDefault(); buttons[buttons.length - 1].focus();}
      if (!event.shiftKey && document.activeElement === buttons[buttons.length - 1]) {event.preventDefault(); buttons[0].focus();}
    }
  }}>
    <button className="lightbox-close" aria-label="Close photo viewer" onClick={close}><X/></button>
    <button className="lightbox-previous" aria-label="Previous photo" onClick={()=>navigate(-1)}><ChevronLeft/></button>
    <img key={photo.src} src={'/assets/'+(imageSources[photo.src]||photo.src)} alt={photo.category}
      onPointerEnter={event=>{if(event.pointerType==='mouse')setHovered(true);}}
      onPointerLeave={()=>setHovered(false)}
      onPointerDown={event=>{if(event.pointerType==='touch'&&event.isPrimary)touchStart.current={x:event.clientX,y:event.clientY};}}
      onPointerCancel={()=>{touchStart.current=null;}}
      onPointerUp={event=>{
        const start=touchStart.current; touchStart.current=null;
        if(!start)return;
        const dx=event.clientX-start.x, dy=event.clientY-start.y;
        if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy)*1.5)navigate(dx<0?1:-1);
      }}/>
    <button className="lightbox-next" aria-label="Next photo" onClick={()=>navigate(1)}><ChevronRight/></button>
    <div className="lightbox-status"><span>{index+1} / {photos.length}</span><button aria-label={playing&&enabled?'Pause gallery slideshow':'Play gallery slideshow'} onClick={()=>{if(!enabled){setEnabled(true);setPlaying(true);}else setPlaying(v=>!v);}}>{playing&&enabled?<Pause size={14}/>:<Play size={14}/>}<span>{playing&&enabled?'Pause':'Play'}</span></button></div>
  </div>;
}
